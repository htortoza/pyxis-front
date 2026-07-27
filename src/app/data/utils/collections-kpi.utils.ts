import type { CollectionTarget, ReceivableDocument } from '../models/collections.model';
import type { KpiValue, TrendPoint } from '../models/kpi.model';
import type { Period } from '../models/period.model';
import type { ComparisonBand } from '../../pipes/signed-amount';
import { addDaysIso, daysBetweenIso } from './date.utils';
import { documentStateAsOf, type DocumentStateAsOf } from './collections-history.utils';

/** Set de las 5 KPI cards de Cobranzas General (spec §4.1). Todas reusan `KpiValue`/`TrendPoint`
 * de Ventas -- ningún tipo nuevo de "valor de KPI", solo un agregado distinto por métrica. */
export interface CollectionsKpiSet {
  /** Monto, deltaUnit 'pct', higher-good, sin meta asociada (spec §4.1). */
  saldoPorCobrar: KpiValue;
  /** %, deltaUnit 'pp', lower-good. */
  porcentajeVencido: KpiValue;
  /** Días, deltaUnit 'dias', lower-good, sensibilidad alta (ver kpi-card.deltaSensitivityPct). */
  dso: KpiValue;
  /** %, deltaUnit 'pp', higher-good. Semáforo propio vía `ceiBand`, NO `cumplimientoBand`. */
  cei: KpiValue;
  /** Monto, deltaUnit 'pct', higher-good, sin meta asociada. */
  recuperado: KpiValue;
}

/** Mismo criterio que sales-fact.utils.ts (MIN_TREND_POINTS/MAX_TRAILING_TREND_POINTS), redeclarado
 * acá a propósito -- Cobranzas es un universo mock independiente de Ventas, ver plan Task 2. */
export const MIN_TREND_POINTS = 3;
const MAX_TRAILING_TREND_POINTS = 12;

// -----------------------------------------------------------------------------------------------
// Reconstrucción de estado a un corte arbitrario (envoltorio de documentStateAsOf de Task 1)
// -----------------------------------------------------------------------------------------------

function documentsAsOf(documents: ReceivableDocument[], cutoffIso: string): DocumentStateAsOf[] {
  const result: DocumentStateAsOf[] = [];
  for (const doc of documents) {
    const state = documentStateAsOf(doc, cutoffIso);
    if (state !== null) {
      result.push(state);
    }
  }
  return result;
}

function sumBalance(states: DocumentStateAsOf[]): number {
  return states.reduce((sum, state) => sum + state.balance, 0);
}

function sumOverdueBalance(states: DocumentStateAsOf[]): number {
  return states.filter((state) => state.status === 'VENCIDO').reduce((sum, state) => sum + state.balance, 0);
}

function sumNonOverdueBalance(states: DocumentStateAsOf[]): number {
  return states.filter((state) => state.status !== 'VENCIDO').reduce((sum, state) => sum + state.balance, 0);
}

/** true si al menos un documento ya existía (`issueDate <= iso`) -- gate para no caminar el trend
 * hacia atrás de un punto donde la reconstrucción sería sin sentido (ningún documento emitido
 * todavía), análogo al gate `hasData` de `buildKpiTrendPoints` en sales-fact.utils.ts. */
function anyDocumentIssuedBy(documents: ReceivableDocument[], iso: string): boolean {
  return documents.some((doc) => doc.issueDate <= iso);
}

// -----------------------------------------------------------------------------------------------
// "Corte anterior equivalente" -- Decisión de diseño (documentada, ver plan Task 2 y reporte)
// -----------------------------------------------------------------------------------------------

function findPeriodContaining(periods: Period[], iso: string): Period | undefined {
  return periods.find((period) => period.startDate <= iso && iso <= period.endDate);
}

/**
 * "Corte anterior equivalente" (spec: "mismo día calendario del periodo anterior de la
 * granularidad activa"). En vez de restar 1 mes/semana/día a mano (lo que obligaría a esta función
 * a saber en cuál de las 3 granularidades está, dato que el input de `computeCollectionsKpis` no
 * trae explícito), se resuelve vía los límites reales de `Period`: ubica el periodo que contiene
 * `cutoffIso`, calcula el offset en días desde el inicio de ESE periodo, y aplica el mismo offset
 * al inicio del periodo INMEDIATAMENTE anterior (por `order`) -- funciona igual para dia/semana/mes
 * sin ninguna rama por granularidad. Si el offset desborda el periodo anterior (p. ej. corte el día
 * 31 de un mes de 31 días comparado contra un febrero de 28), se recorta a su `endDate` -- nunca se
 * desborda al periodo siguiente.
 *
 * Devuelve `null` si el corte no cae dentro de ningún periodo conocido, o si no existe un periodo
 * anterior (principio de la serie histórica) -- el caller trata ese caso como "sin dato anterior"
 * (mismo convenio que `KpiValue.deltaPct === null` cuando `previous` es 0).
 */
function previousCutoffIso(cutoffIso: string, allPeriodsForGranularity: Period[]): string | null {
  const cutoffPeriod = findPeriodContaining(allPeriodsForGranularity, cutoffIso);
  if (!cutoffPeriod) {
    return null;
  }
  const offsetDays = daysBetweenIso(cutoffPeriod.startDate, cutoffIso);
  const prevPeriod = allPeriodsForGranularity.find((period) => period.order === cutoffPeriod.order - 1);
  if (!prevPeriod) {
    return null;
  }
  const candidate = addDaysIso(prevPeriod.startDate, offsetDays);
  return candidate > prevPeriod.endDate ? prevPeriod.endDate : candidate;
}

/** Cortes trailing (más antiguo primero) para las sparklines de Saldo/%Vencido, caminando
 * `previousCutoffIso` repetidas veces desde el corte activo, tope `MAX_TRAILING_TREND_POINTS`,
 * deteniéndose en el primer corte donde ningún documento existía todavía (`anyDocumentIssuedBy`)
 * -- mismo criterio de "detenerse en el primer hueco" que `buildKpiTrendPoints`. El corte activo
 * (ancla) queda excluido, igual que el periodo ancla en Ventas: ya se muestra como el número grande
 * de la card. */
function trailingCutoffs(
  cutoffIso: string,
  allDocuments: ReceivableDocument[],
  allPeriodsForGranularity: Period[],
): string[] {
  const cutoffs: string[] = [];
  let cursor = cutoffIso;
  for (let i = 0; i < MAX_TRAILING_TREND_POINTS; i++) {
    const prev = previousCutoffIso(cursor, allPeriodsForGranularity);
    if (prev === null || !anyDocumentIssuedBy(allDocuments, prev)) {
      break;
    }
    cutoffs.push(prev);
    cursor = prev;
  }
  return cutoffs.reverse();
}

// -----------------------------------------------------------------------------------------------
// Ventanas de periodo (para DSO/CEI/Recuperado, que son de flujo, no de stock)
// -----------------------------------------------------------------------------------------------

export function resolvePeriods(ids: string[], periods: Period[]): Period[] {
  const byId = new Map(periods.map((period) => [period.id, period]));
  return ids
    .map((id) => byId.get(id))
    .filter((period): period is Period => !!period)
    .sort((a, b) => a.order - b.order);
}

/**
 * Ventana de periodos INMEDIATAMENTE anterior, mismo largo (span) que `selectedPeriods`, contigua
 * (sin huecos) -- análogo a cómo Ventas resuelve su "periodo anterior" para comparación, pero acá
 * aplicado a un conjunto de N periodos en vez de una sola fecha. Usada para el `previous` de CEI y
 * Recuperado (KPIs de flujo, no de stock -- no tiene sentido comparalos contra "el mismo día del
 * mes anterior" como Saldo/%Vencido, sino contra el rango de periodos equivalente inmediatamente
 * anterior). Si algún periodo de la ventana anterior no existe en `allPeriodsForGranularity`
 * (borde del dataset), esa ventana queda parcial -- se documenta, no se rellena.
 */
export function previousPeriodWindow(selectedPeriods: Period[], allPeriodsForGranularity: Period[]): Period[] {
  if (selectedPeriods.length === 0) {
    return [];
  }
  const orderToPeriod = new Map(allPeriodsForGranularity.map((period) => [period.order, period]));
  const minOrder = selectedPeriods[0].order;
  const span = selectedPeriods.length;
  const result: Period[] = [];
  for (let offset = span; offset >= 1; offset--) {
    const period = orderToPeriod.get(minOrder - offset);
    if (period) {
      result.push(period);
    }
  }
  return result;
}

function sumSalesForPeriods(periodsInWindow: Period[], periodSalesTotal: Record<string, number>): number {
  return periodsInWindow.reduce((sum, period) => sum + (periodSalesTotal[period.id] ?? 0), 0);
}

// -----------------------------------------------------------------------------------------------
// DSO
// -----------------------------------------------------------------------------------------------

/**
 * `DSO = (saldoPorCobrar / ventas_a_credito_del_periodo) × dias_del_periodo`. `ventas_a_credito`
 * usa `PERIOD_SALES_TOTAL_CLP` como proxy (el mock no distingue venta a crédito de venta al
 * contado por separado -- misma simplificación que usa el Puente Venta→Caja, spec §4.2).
 * `previous`/`trend` reutilizan la MISMA razón `dias_del_periodo / ventas_a_credito_del_periodo`
 * del periodo ACTIVO aplicada al saldo reconstruido en cada corte histórico -- no se recalcula
 * "ventas a crédito de aquel entonces" para cada punto de la serie (simplificación explícita del
 * plan: "usar el total de venta del periodo, igual que hace el puente"). `deltaPct` es una
 * diferencia absoluta de días (no % relativo) -- consistente con cómo `kpi-card` formatea
 * `deltaUnit: 'dias'` (`${abs} d`, ver kpi-card.ts `deltaText`); siempre definida (una resta nunca
 * divide por 0), a diferencia de las métricas 'pct'.
 */
function computeDso(saldoPorCobrar: KpiValue, ventasCreditoPeriodo: number, diasDelPeriodo: number): KpiValue {
  if (ventasCreditoPeriodo <= 0 || diasDelPeriodo <= 0) {
    // Sin ventas a crédito en el rango de periodos seleccionado (o rango vacío) -- el ratio no es
    // calculable (división por cero). Se devuelve 0 con deltaPct null en vez de NaN/Infinity,
    // mismo convenio que el resto de los KPIs cuando no hay dato anterior real.
    return { current: 0, previous: 0, deltaPct: null, trend: [] };
  }
  const ratio = diasDelPeriodo / ventasCreditoPeriodo;
  const current = saldoPorCobrar.current * ratio;
  const previous = saldoPorCobrar.previous * ratio;
  const trend: TrendPoint[] = saldoPorCobrar.trend.map((point) => ({
    periodId: point.periodId,
    value: point.value * ratio,
  }));
  return { current, previous, deltaPct: current - previous, trend };
}

// -----------------------------------------------------------------------------------------------
// CEI
// -----------------------------------------------------------------------------------------------

/**
 * CEI (Cash Efficiency Index) sobre una ventana de periodos, spec §4.1 Card 4:
 *
 *   CEI = [(cartera_inicial + ventas_credito_periodo) - cartera_final_total]
 *       / [(cartera_inicial + ventas_credito_periodo) - cartera_final_corriente] × 100
 *
 * donde:
 * - `cartera_inicial` = saldo reconstruido el día INMEDIATAMENTE ANTERIOR al inicio de la ventana
 *   (no el propio `startDate`, para no contar como "inicial" un documento emitido ESE día).
 * - `ventas_credito_periodo` = suma de `PERIOD_SALES_TOTAL_CLP` sobre los periodos de la ventana.
 * - `cartera_final_total` = saldo reconstruido al `endDate` del ÚLTIMO periodo de la ventana (no al
 *   `cutoffIso` activo -- CEI es de flujo del periodo, no de stock al corte; ver plan Task 2).
 * - `cartera_final_corriente` = igual que `cartera_final_total` pero solo el saldo NO vencido
 *   (`POR_VENCER`) a esa misma fecha.
 *
 * Devuelve `null` si la ventana está vacía o si el denominador es 0 (no hay saldo inicial ni ventas
 * a crédito, o toda la cartera final es corriente igual a inicial+ventas) -- el caller lo trata
 * como "no calculable", nunca produce NaN/Infinity.
 */
function ceiForWindow(
  periodsInWindow: Period[],
  allDocuments: ReceivableDocument[],
  periodSalesTotal: Record<string, number>,
): number | null {
  if (periodsInWindow.length === 0) {
    return null;
  }
  const sorted = [...periodsInWindow].sort((a, b) => a.order - b.order);
  const rangeStart = sorted[0].startDate;
  const rangeEnd = sorted[sorted.length - 1].endDate;

  const carteraInicial = sumBalance(documentsAsOf(allDocuments, addDaysIso(rangeStart, -1)));
  const ventasCreditoPeriodo = sumSalesForPeriods(sorted, periodSalesTotal);
  const finalStates = documentsAsOf(allDocuments, rangeEnd);
  const carteraFinalTotal = sumBalance(finalStates);
  const carteraFinalCorriente = sumNonOverdueBalance(finalStates);

  const denom = carteraInicial + ventasCreditoPeriodo - carteraFinalCorriente;
  if (denom === 0) {
    return null;
  }
  const numer = carteraInicial + ventasCreditoPeriodo - carteraFinalTotal;
  return (numer / denom) * 100;
}

/** Trend de CEI: camina periodos individuales (ventana de largo 1) hacia atrás desde el periodo
 * inmediatamente anterior al inicio de la selección, tope `MAX_TRAILING_TREND_POINTS`. Se detiene
 * en el primer periodo sin venta registrada (`PERIOD_SALES_TOTAL_CLP[id]` 0/ausente -- mismo gate
 * `hasData` que `buildKpiTrendPoints`) o donde CEI no sea calculable (denominador 0) -- ambos se
 * tratan como el primer "hueco" de la serie, igual criterio que el resto de los trends acá. */
function ceiTrend(
  selectedPeriods: Period[],
  allDocuments: ReceivableDocument[],
  allPeriodsForGranularity: Period[],
  periodSalesTotal: Record<string, number>,
): TrendPoint[] {
  if (selectedPeriods.length === 0) {
    return [];
  }
  const orderToPeriod = new Map(allPeriodsForGranularity.map((period) => [period.order, period]));
  const minOrder = selectedPeriods[0].order;
  const points: TrendPoint[] = [];
  for (let offset = 1; offset <= MAX_TRAILING_TREND_POINTS; offset++) {
    const period = orderToPeriod.get(minOrder - offset);
    if (!period || (periodSalesTotal[period.id] ?? 0) <= 0) {
      break;
    }
    const value = ceiForWindow([period], allDocuments, periodSalesTotal);
    if (value === null) {
      break;
    }
    points.push({ periodId: period.id, value });
  }
  return points.reverse();
}

/** Semáforo propio de CEI (spec §4.1): cortes fijos 90/80, independientes de cualquier meta
 * configurable por tenant -- por eso vive separado de `comparisonBand`/`cumplimientoBand`
 * (genéricos de Ventas/metas) en `signed-amount.ts`, que este archivo no debe tocar. */
export function ceiBand(cei: number): ComparisonBand {
  if (cei >= 90) return 'good';
  if (cei >= 80) return 'medium';
  return 'bad';
}

// -----------------------------------------------------------------------------------------------
// Recuperado en el Periodo
// -----------------------------------------------------------------------------------------------

/**
 * Suma de `appliedAmount` de documentos cuyo `paidDate` cae dentro del rango de la ventana de
 * periodos (spec §8.D). Documentos parcialmente pagados pero todavía abiertos (`paidDate === null`)
 * NO aportan: el mock no modela una fecha de pago parcial individual, así que no hay forma de
 * atribuir ese pago parcial a un periodo concreto sin inventar el dato -- se excluyen, no se
 * fuerzan a 0 ni se reparten.
 */
function recuperadoForWindow(periodsInWindow: Period[], allDocuments: ReceivableDocument[]): number {
  if (periodsInWindow.length === 0) {
    return 0;
  }
  const sorted = [...periodsInWindow].sort((a, b) => a.order - b.order);
  const rangeStart = sorted[0].startDate;
  const rangeEnd = sorted[sorted.length - 1].endDate;
  return allDocuments.reduce((sum, doc) => {
    if (doc.paidDate !== null && doc.paidDate >= rangeStart && doc.paidDate <= rangeEnd) {
      return sum + doc.appliedAmount;
    }
    return sum;
  }, 0);
}

/** Trend de Recuperado: mismo patrón de periodos individuales trailing que `ceiTrend`, pero el
 * gate de "hueco" es `anyDocumentIssuedBy` (no venta registrada) -- un periodo sin cobros pero con
 * documentos ya emitidos es un 0 legítimo (mala cobranza ese mes), no un hueco de datos. */
function recuperadoTrend(
  selectedPeriods: Period[],
  allDocuments: ReceivableDocument[],
  allPeriodsForGranularity: Period[],
): TrendPoint[] {
  if (selectedPeriods.length === 0) {
    return [];
  }
  const orderToPeriod = new Map(allPeriodsForGranularity.map((period) => [period.order, period]));
  const minOrder = selectedPeriods[0].order;
  const points: TrendPoint[] = [];
  for (let offset = 1; offset <= MAX_TRAILING_TREND_POINTS; offset++) {
    const period = orderToPeriod.get(minOrder - offset);
    if (!period || !anyDocumentIssuedBy(allDocuments, period.endDate)) {
      break;
    }
    points.push({ periodId: period.id, value: recuperadoForWindow([period], allDocuments) });
  }
  return points.reverse();
}

// -----------------------------------------------------------------------------------------------
// Agregado público
// -----------------------------------------------------------------------------------------------

export function computeCollectionsKpis(input: {
  /** Documentos ya escopeados por dimensión (contraparte/sector-marca-local/cross-filter) pero SIN
   * filtrar por `cutoffIso` -- el trend necesita reconstruir cortes PASADOS, así que filtrar por
   * corte acá adentro (vía `documentStateAsOf`) en vez de recibirlos ya filtrados por el caller. */
  allDocuments: ReceivableDocument[];
  cutoffIso: string;
  selectedPeriodIds: string[];
  /** Periodos de la granularidad activa (`PERIODS_BY_GRANULARITY[granularidad]`) -- usados para
   * resolver `selectedPeriodIds` a objetos `Period` completos. */
  periods: Period[];
  /** Superset de periodos de la misma granularidad, usado para caminar el trend hacia atrás y para
   * resolver el "corte anterior equivalente" -- típicamente la misma lista que `periods`. */
  allPeriodsForGranularity: Period[];
  periodSalesTotal: Record<string, number>;
  /** No consumido por esta agregación -- Task 4 (kpi-cards-grid) lee `COLLECTION_TARGETS`
   * directamente contra los `KpiValue.current` que este util produce, para el semáforo de meta de
   * %Vencido/DSO/CEI. Se recibe acá solo para que la firma completa quede documentada junto al
   * resto de los inputs que sí participan del cálculo. */
  collectionTargets: CollectionTarget[];
}): CollectionsKpiSet {
  const { allDocuments, cutoffIso, selectedPeriodIds, periods, allPeriodsForGranularity, periodSalesTotal } = input;

  const selectedPeriods = resolvePeriods(selectedPeriodIds, periods);

  // ---- Saldo por Cobrar -------------------------------------------------------------------
  const currentStates = documentsAsOf(allDocuments, cutoffIso);
  const saldoCurrent = sumBalance(currentStates);
  const prevCutoffIso = previousCutoffIso(cutoffIso, allPeriodsForGranularity);
  const saldoPrevious = prevCutoffIso === null ? 0 : sumBalance(documentsAsOf(allDocuments, prevCutoffIso));
  const saldoDeltaPct = saldoPrevious === 0 ? null : ((saldoCurrent - saldoPrevious) / Math.abs(saldoPrevious)) * 100;

  const cutoffTrend = trailingCutoffs(cutoffIso, allDocuments, allPeriodsForGranularity);
  const saldoTrend: TrendPoint[] = cutoffTrend.map((iso) => ({
    periodId: iso,
    value: sumBalance(documentsAsOf(allDocuments, iso)),
  }));

  const saldoPorCobrar: KpiValue = {
    current: saldoCurrent,
    previous: saldoPrevious,
    deltaPct: saldoDeltaPct,
    trend: saldoTrend,
  };

  // ---- % Vencido ---------------------------------------------------------------------------
  const overduePctAt = (states: DocumentStateAsOf[]): number => {
    const total = sumBalance(states);
    return total === 0 ? 0 : (sumOverdueBalance(states) / total) * 100;
  };
  const overdueCurrent = overduePctAt(currentStates);
  const overduePrevious = prevCutoffIso === null ? 0 : overduePctAt(documentsAsOf(allDocuments, prevCutoffIso));
  // Métrica 'pp': ya es %, la variación es diferencia de puntos porcentuales (current - previous),
  // no % relativo (spec §6 "pp vs %"; deltaUnit='pp' del kpi-card solo formatea el sufijo, nunca
  // convierte -- ver kpi-card.ts). Nunca null: una resta no tiene división por 0.
  const overdueDeltaPct = overdueCurrent - overduePrevious;
  const overdueTrend: TrendPoint[] = cutoffTrend.map((iso) => ({
    periodId: iso,
    value: overduePctAt(documentsAsOf(allDocuments, iso)),
  }));

  const porcentajeVencido: KpiValue = {
    current: overdueCurrent,
    previous: overduePrevious,
    deltaPct: overdueDeltaPct,
    trend: overdueTrend,
  };

  // ---- DSO -----------------------------------------------------------------------------------
  const ventasCreditoPeriodo = sumSalesForPeriods(selectedPeriods, periodSalesTotal);
  const diasDelPeriodo = selectedPeriods.reduce(
    (sum, period) => sum + (daysBetweenIso(period.startDate, period.endDate) + 1),
    0,
  );
  const dso = computeDso(saldoPorCobrar, ventasCreditoPeriodo, diasDelPeriodo);

  // ---- CEI -----------------------------------------------------------------------------------
  const previousWindow = previousPeriodWindow(selectedPeriods, allPeriodsForGranularity);
  const ceiCurrentRaw = ceiForWindow(selectedPeriods, allDocuments, periodSalesTotal);
  const ceiPreviousRaw = ceiForWindow(previousWindow, allDocuments, periodSalesTotal);
  // Métrica 'pp', igual convención que %Vencido -- diferencia de puntos, no % relativo. null
  // cuando cualquiera de los dos lados no es calculable (denominador 0 o ventana vacía).
  const ceiDeltaPct = ceiCurrentRaw === null || ceiPreviousRaw === null ? null : ceiCurrentRaw - ceiPreviousRaw;

  const cei: KpiValue = {
    current: ceiCurrentRaw ?? 0,
    previous: ceiPreviousRaw ?? 0,
    deltaPct: ceiDeltaPct,
    trend: ceiTrend(selectedPeriods, allDocuments, allPeriodsForGranularity, periodSalesTotal),
  };

  // ---- Recuperado en el Periodo ----------------------------------------------------------------
  const recuperadoCurrent = recuperadoForWindow(selectedPeriods, allDocuments);
  const recuperadoPrevious = recuperadoForWindow(previousWindow, allDocuments);
  const recuperadoDeltaPct =
    recuperadoPrevious === 0 ? null : ((recuperadoCurrent - recuperadoPrevious) / Math.abs(recuperadoPrevious)) * 100;

  const recuperado: KpiValue = {
    current: recuperadoCurrent,
    previous: recuperadoPrevious,
    deltaPct: recuperadoDeltaPct,
    trend: recuperadoTrend(selectedPeriods, allDocuments, allPeriodsForGranularity),
  };

  return { saldoPorCobrar, porcentajeVencido, dso, cei, recuperado };
}
