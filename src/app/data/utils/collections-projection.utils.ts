import type { CounterpartyBehavior, ReceivableDocument } from '../models/collections.model';
import { addDaysIso, daysInMonth } from './date.utils';

export type ProjectionGranularity = 'semana' | 'mes';

export interface ProjectionBucket {
  /** ISO, primer día del bucket (inclusive). */
  startDate: string;
  /** ISO, último día del bucket (inclusive). */
  endDate: string;
  /** "S1".."S13" para semanas; "Agosto"/"Septiembre"/... para meses. */
  label: string;
  contractual: number;
  adjusted: number;
}

export interface RecaudacionProjection {
  cutoffIso: string;
  granularity: ProjectionGranularity;
  /** Monto bruto de documentos VENCIDO al corte -- no se proyecta, columna separada. */
  backlogOverdue: number;
  /** Monto bruto de documentos POR_VENCER sin `dueDate` -- excluidos, declarado visible. */
  excludedNoDueDate: number;
  /** Proporción del monto proyectado cuya contraparte tiene historial suficiente
   * (`closedDocumentCount >= MIN_CLOSED_DOCS_FOR_ADJUSTED`) para el ajuste por comportamiento.
   * Ver `adjustedSeriesAvailable`. */
  adjustedCoverageRatio: number;
  /** `false` cuando `adjustedCoverageRatio < ADJUSTED_COVERAGE_RATIO_THRESHOLD` -- el caller
   * NUNCA dibuja `bucket.adjusted` en ese caso (aunque el número siga viniendo calculado acá
   * adentro con lo poco que hay, por eso `adjusted` no es null en `ProjectionBucket` -- la
   * decisión de mostrarlo u ocultarlo es pura responsabilidad del componente, leyendo este
   * flag; el util nunca "miente" ocultando el número él mismo, pero tampoco lo recomienda). */
  adjustedSeriesAvailable: boolean;
  buckets: ProjectionBucket[];
}

/** Mínimo de documentos cerrados para que `avgDaysLate` de una contraparte sea estadísticamente
 * publicable -- mismo umbral (~6) que ya usa el generador del mock (`closedDocCountFor`,
 * `collections.mock.ts`) para decidir qué contrapartes caen "naturalmente" bajo el mínimo. */
export const MIN_CLOSED_DOCS_FOR_ADJUSTED = 6;

/** Umbral de `adjustedCoverageRatio` bajo el cual se suprime la serie ajustada COMPLETA (spec
 * §4.4: "si la cobertura ... cae bajo un umbral configurable"). Sin UI de configuración por
 * tenant en SP3 -- constante, mismo patrón de "gancho parametrizable" que `AgingBucketConfig`
 * en SP2 Task 6. */
export const ADJUSTED_COVERAGE_RATIO_THRESHOLD = 0.7;

export const HORIZON_WEEKS = 13;
export const HORIZON_MONTHS = 6;

/** Nombres de mes en español, copiados de `MONTH_LABELS_ES` (`data/mock/periods.mock.ts`) como
 * constante local -- este util NO importa `periods.mock.ts`: se mantiene 100% autocontenido, sin
 * depender del calendario compartido con Ventas (ver Task 1 del plan de SP3). */
const MONTH_LABELS_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

interface BucketShell {
  startDate: string;
  endDate: string;
  label: string;
}

function buildWeekBuckets(cutoffIso: string, count: number): BucketShell[] {
  const buckets: BucketShell[] = [];
  let cursor = addDaysIso(cutoffIso, 1); // el bucket 1 arranca el día siguiente al corte
  for (let i = 1; i <= count; i++) {
    const endDate = addDaysIso(cursor, 6);
    buckets.push({ startDate: cursor, endDate, label: `S${i}` });
    cursor = addDaysIso(cursor, 7);
  }
  return buckets;
}

function isoYearMonth(iso: string): { year: number; month: number } {
  const [year, month] = iso.split('-').map(Number);
  return { year, month };
}

/**
 * 6 buckets, cada uno un mes calendario COMPLETO, empezando por el mes calendario INMEDIATAMENTE
 * siguiente al mes de `cutoffIso` (nunca un mes parcial). P.ej. corte 25 de julio -> bucket 1 =
 * Agosto completo (01-08 al 31-08), bucket 2 = Septiembre, ..., bucket 6 = Enero. Aritmética
 * manual de año/mes (sin `Date` nativo salvo lo ya encapsulado en `daysInMonth`, util genérico de
 * calendario reusado de `date.utils.ts`, no específico de `periods.mock.ts`).
 */
function buildMonthBuckets(cutoffIso: string, count: number): BucketShell[] {
  const { year, month } = isoYearMonth(cutoffIso);
  let cursorYear = year;
  let cursorMonth = month + 1;
  if (cursorMonth > 12) {
    cursorMonth = 1;
    cursorYear++;
  }

  const buckets: BucketShell[] = [];
  for (let i = 0; i < count; i++) {
    const mm = String(cursorMonth).padStart(2, '0');
    const lastDay = daysInMonth(cursorYear, cursorMonth);
    buckets.push({
      startDate: `${cursorYear}-${mm}-01`,
      endDate: `${cursorYear}-${mm}-${String(lastDay).padStart(2, '0')}`,
      label: MONTH_LABELS_ES[cursorMonth - 1],
    });
    cursorMonth++;
    if (cursorMonth > 12) {
      cursorMonth = 1;
      cursorYear++;
    }
  }
  return buckets;
}

/**
 * Índice del bucket cuyo `[startDate, endDate]` contiene `targetIso`. Si ninguno lo contiene
 * (fuera de horizonte -- p.ej. una fecha muy lejana), clampea al ÚLTIMO bucket (simplificación
 * deliberada: "fuera del horizonte visible, se agrupa en el último tramo en vez de desaparecer
 * silenciosamente"). Si `targetIso` cae ANTES del primer bucket (p.ej. un `dueDate === cutoffIso`
 * exacto, que cae un día antes de que arranque el bucket 1, o un `adjustedDueIso` muy anticipado),
 * clampea al PRIMER bucket en su lugar -- un cliente que paga muy anticipado igual debe verse en
 * la primera barra visible, no desaparecer.
 */
function findBucketIndex(buckets: BucketShell[], targetIso: string): number {
  const index = buckets.findIndex((bucket) => targetIso >= bucket.startDate && targetIso <= bucket.endDate);
  if (index !== -1) {
    return index;
  }
  return targetIso < buckets[0].startDate ? 0 : buckets.length - 1;
}

/**
 * Construye la Proyección de Recaudación (spec §4.4) a partir de los documentos YA cutoff-filtrados
 * y dimension-scoped (`scopedDocumentsGross` del servicio -- SIEMPRE bruto, trampa del IVA).
 */
export function buildRecaudacionProjection(
  documentsGross: ReceivableDocument[],
  cutoffIso: string,
  granularity: ProjectionGranularity,
  behaviors: CounterpartyBehavior[],
): RecaudacionProjection {
  const behaviorByCounterparty = new Map(behaviors.map((behavior) => [behavior.counterpartyId, behavior]));

  const shells =
    granularity === 'semana' ? buildWeekBuckets(cutoffIso, HORIZON_WEEKS) : buildMonthBuckets(cutoffIso, HORIZON_MONTHS);
  const buckets: ProjectionBucket[] = shells.map((shell) => ({ ...shell, contractual: 0, adjusted: 0 }));

  let backlogOverdue = 0;
  let excludedNoDueDate = 0;
  let projectedGrossTotal = 0;
  let coveredGrossTotal = 0;

  for (const doc of documentsGross) {
    // Sobrepago (spec §8.A): no entra en la proyección -- ni backlog, ni excluido, ni buckets.
    if (doc.balance <= 0) {
      continue;
    }
    // Backlog vencido no se proyecta: columna separada, antes del eje temporal.
    if (doc.status === 'VENCIDO') {
      backlogOverdue += doc.balance;
      continue;
    }
    // De acá en más, doc.status === 'POR_VENCER' por construcción de scopedDocumentsGross (solo
    // contiene documentos abiertos al corte -- documentStateAsOf nunca devuelve 'PAGADO').
    if (doc.dueDate === null) {
      excludedNoDueDate += doc.balance;
      continue;
    }

    projectedGrossTotal += doc.balance;

    const contractualIndex = findBucketIndex(buckets, doc.dueDate);
    buckets[contractualIndex].contractual += doc.balance;

    const behavior = behaviorByCounterparty.get(doc.counterpartyId);
    if (behavior !== undefined && behavior.closedDocumentCount >= MIN_CLOSED_DOCS_FOR_ADJUSTED) {
      coveredGrossTotal += doc.balance;
      // avgDaysLate puede ser negativo (mora negativa, spec §8.F) -- Math.round preserva el signo,
      // nunca se trunca a 0.
      const adjustedDueIso = addDaysIso(doc.dueDate, Math.round(behavior.avgDaysLate));
      const adjustedIndex = findBucketIndex(buckets, adjustedDueIso);
      buckets[adjustedIndex].adjusted += doc.balance;
    }
    // Si no hay behavior o el historial es insuficiente: este documento NO aporta a ningún
    // bucket.adjusted (degradación por-documento), pero ya aportó a contractual arriba.
  }

  const adjustedCoverageRatio = projectedGrossTotal === 0 ? 1 : coveredGrossTotal / projectedGrossTotal;
  const adjustedSeriesAvailable = adjustedCoverageRatio >= ADJUSTED_COVERAGE_RATIO_THRESHOLD;

  return {
    cutoffIso,
    granularity,
    backlogOverdue,
    excludedNoDueDate,
    adjustedCoverageRatio,
    adjustedSeriesAvailable,
    buckets,
  };
}
