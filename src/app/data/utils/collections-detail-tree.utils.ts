import type { Counterparty, ReceivableDocument } from '../models/collections.model';
import { buildAgingBuckets, type AgingBucketKey } from './collections-aging.utils';

/** Etiqueta para documentos cuyo `counterpartyId` no calza con ninguna `Counterparty` conocida
 * (spec §8.C, mismo caso de borde que `UNMAPPED_COUNTERPARTY_ID` en `collections.mock.ts`) --
 * redeclarada localmente (no importada de `collections-concentration.utils.ts`): cada util de
 * Cobranzas se mantiene independiente, sin acoplarse a otro archivo que puede cambiar por
 * separado. */
const UNMAPPED_LABEL = 'Contraparte no mapeada';

/** Los 4 tramos que cuentan como "vencido" para el orden default de filas (spec §5.3) --
 * deliberadamente NO incluye `NO_DUE_DATE` (sin vencimiento no es lo mismo que vencido). */
const OVERDUE_BUCKET_KEYS: AgingBucketKey[] = [
  'VENCIDO_1_30',
  'VENCIDO_31_60',
  'VENCIDO_61_90',
  'VENCIDO_90_PLUS',
];

export interface CollectionsDetailDocumentRow {
  key: string; // `doc-${document.id}`
  externalRef: string;
  issueDate: string;
  dueDate: string | null;
  grossAmount: number;
  appliedAmount: number;
  creditNoteAmount: number;
  balance: number;
  daysOverdue: number;
  status: 'POR_VENCER' | 'VENCIDO' | 'PAGADO'; // scopedDocuments nunca trae PAGADO, pero el tipo se hereda tal cual de ReceivableDocument
}

export interface CollectionsDetailCounterpartyRow {
  key: string; // `contraparte-${counterpartyId}`
  counterpartyId: string;
  label: string;
  /** Los 7 tramos de `buildAgingBuckets` (SP2), montos por bucket -- incluye `NO_DUE_DATE`
   * (spec §5.2 no lo dibuja en la maqueta ASCII, pero SÍ exige que "sin vencimiento" tenga su
   * propio tramo explícito en Antigüedad, §8.B -- extender la tabla con esa misma columna es la
   * única forma de que SALDO de la fila cuadre exactamente con la suma de los 6 tramos + esto,
   * sin ocultar plata en silencio; documentado como decisión de este plan). */
  bucketAmounts: Record<AgingBucketKey, number>;
  saldo: number; // suma balance de sus documentos -- === suma de bucketAmounts
  creditLimit: number | null;
  creditTermDays: number | null; // "plazo pactado" (columna adicional, spec §5.2)
  utilizacionPct: number | null; // saldo / creditLimit; null si creditLimit es null
  /** Promedio de `daysOverdue` ponderado por `balance`, sobre TODOS los documentos abiertos de
   * esta contraparte (POR_VENCER aporta 0 días, diluyendo la mora hacia abajo si hay saldo
   * corriente -- es la misma convención "promedio ponderado por saldo" que pide la fila de
   * totales, spec §5.5, aplicada acá a nivel de fila individual también). */
  avgDaysOverdueWeighted: number;
  documents: CollectionsDetailDocumentRow[]; // hijos de esta fila al expandir
}

export interface CollectionsDetailTotalsRow {
  saldo: number;
  bucketAmounts: Record<AgingBucketKey, number>;
  /** Mismo promedio ponderado por saldo que cada fila, pero sobre TODA la cartera en scope. */
  avgDaysOverdueWeighted: number;
  // límite/%util/plazo pactado NO se totalizan (spec §5.5) -- el caller muestra "—" para esas 3.
}

export interface CollectionsDetailTree {
  rows: CollectionsDetailCounterpartyRow[]; // orden default: descendente por saldoVencido (spec §5.3)
  totals: CollectionsDetailTotalsRow;
}

function toDocumentRow(doc: ReceivableDocument): CollectionsDetailDocumentRow {
  return {
    key: `doc-${doc.id}`,
    externalRef: doc.externalRef,
    issueDate: doc.issueDate,
    dueDate: doc.dueDate,
    grossAmount: doc.grossAmount,
    appliedAmount: doc.appliedAmount,
    creditNoteAmount: doc.creditNoteAmount,
    balance: doc.balance,
    daysOverdue: doc.daysOverdue,
    status: doc.status,
  };
}

function overdueTotal(bucketAmounts: Record<AgingBucketKey, number>): number {
  return OVERDUE_BUCKET_KEYS.reduce((sum, key) => sum + bucketAmounts[key], 0);
}

/**
 * Construye la tabla de reconciliación Contraparte→Documentos (spec §5.2-§5.5) a partir de
 * `documents` YA escopeados/cutoff-reconstruidos (`CollectionsDataService.scopedDocuments()`).
 * `includeZeroBalance`: si `false` (default de pantalla), contrapartes con `saldo === 0` en TODOS
 * los tramos se excluyen (spec §5.6 -- toggle visible en el componente, no acá: esta función solo
 * aplica el filtro que el caller le pida, no decide el default).
 *
 * Cuadre (spec §5.5): con `includeZeroBalance: true`, la suma de `saldo` de todas las filas (y de
 * `totals.saldo`) es exactamente la suma de `balance` de `documents` -- cada documento cae en
 * EXACTAMENTE 1 fila, sin excluir ninguno.
 */
export function buildCollectionsDetailTree(
  documents: ReceivableDocument[],
  counterparties: Counterparty[],
  cutoffIso: string,
  includeZeroBalance: boolean,
): CollectionsDetailTree {
  const counterpartyById = new Map(counterparties.map((c) => [c.id, c]));

  const grouped = new Map<string, ReceivableDocument[]>();
  for (const doc of documents) {
    const group = grouped.get(doc.counterpartyId);
    if (group) {
      group.push(doc);
    } else {
      grouped.set(doc.counterpartyId, [doc]);
    }
  }

  const allRows: CollectionsDetailCounterpartyRow[] = Array.from(grouped.entries()).map(
    ([counterpartyId, groupDocs]) => {
      const counterparty = counterpartyById.get(counterpartyId);

      const { buckets } = buildAgingBuckets(groupDocs, cutoffIso);
      const bucketAmounts = {} as Record<AgingBucketKey, number>;
      for (const bucket of buckets) {
        bucketAmounts[bucket.key] = bucket.amount;
      }
      const saldo = buckets.reduce((sum, bucket) => sum + bucket.amount, 0);

      const creditLimit = counterparty?.creditLimit ?? null;
      const weightedDaysSum = groupDocs.reduce((sum, doc) => sum + doc.daysOverdue * doc.balance, 0);

      return {
        key: `contraparte-${counterpartyId}`,
        counterpartyId,
        label: counterparty?.label ?? UNMAPPED_LABEL,
        bucketAmounts,
        saldo,
        creditLimit,
        creditTermDays: counterparty?.creditTermDays ?? null,
        utilizacionPct: creditLimit === null ? null : saldo / creditLimit,
        avgDaysOverdueWeighted: saldo === 0 ? 0 : weightedDaysSum / saldo,
        documents: groupDocs.map(toDocumentRow),
      };
    },
  );

  const filteredRows = includeZeroBalance ? allRows : allRows.filter((row) => row.saldo !== 0);

  filteredRows.sort((a, b) => overdueTotal(b.bucketAmounts) - overdueTotal(a.bucketAmounts));

  const totalsBucketAmounts = {} as Record<AgingBucketKey, number>;
  for (const key of Object.keys(DEFAULT_BUCKET_TOTALS) as AgingBucketKey[]) {
    totalsBucketAmounts[key] = filteredRows.reduce((sum, row) => sum + row.bucketAmounts[key], 0);
  }
  const totalsSaldo = filteredRows.reduce((sum, row) => sum + row.saldo, 0);
  const totalsWeightedDaysSum = filteredRows.reduce(
    (sum, row) => sum + row.avgDaysOverdueWeighted * row.saldo,
    0,
  );

  return {
    rows: filteredRows,
    totals: {
      saldo: totalsSaldo,
      bucketAmounts: totalsBucketAmounts,
      avgDaysOverdueWeighted: totalsSaldo === 0 ? 0 : totalsWeightedDaysSum / totalsSaldo,
    },
  };
}

/** Plantilla de las 7 keys en 0 -- usada solo para iterar `AgingBucketKey` sin repetir el array
 * literal de `collections-aging.utils.ts` (que no lo exporta). */
const DEFAULT_BUCKET_TOTALS: Record<AgingBucketKey, number> = {
  POR_VENCER_0_30: 0,
  POR_VENCER_30_PLUS: 0,
  VENCIDO_1_30: 0,
  VENCIDO_31_60: 0,
  VENCIDO_61_90: 0,
  VENCIDO_90_PLUS: 0,
  NO_DUE_DATE: 0,
};
