import { getDayOfWeek } from './date.utils';
import type { SalesFact } from '../models/sales-fact.model';
import type { KpiMetaMensual } from '../models/comparison.model';
import type { IvaMode } from '../models/iva.model';
import type { KpiSet, KpiValue, TrendPoint } from '../models/kpi.model';
import type { Period, PeriodGranularity } from '../models/period.model';
import type { RankingItem } from '../models/ranking.model';
import { TASA_CONVERSION_ACTUAL, TASA_CONVERSION_ANTERIOR, TASA_CONVERSION_TREND } from '../mock/conversion.mock';

export const OPERATIONAL_HOURS: number[] = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5,
];

export function filterFacts(
  facts: SalesFact[],
  opts: { storeIds: string[]; periods: Period[] },
): SalesFact[] {
  const storeIdSet = new Set(opts.storeIds);
  const ranges = opts.periods.map((period) => ({ start: period.startDate, end: period.endDate }));
  return facts.filter(
    (f) =>
      storeIdSet.has(f.storeId) &&
      ranges.some((range) => f.date >= range.start && f.date <= range.end),
  );
}

export function computeKpiValue(
  currentFacts: SalesFact[],
  previousFacts: SalesFact[],
  pick: (facts: SalesFact[]) => number,
): Omit<KpiValue, 'trend'> {
  const current = pick(currentFacts);
  const previous = pick(previousFacts);
  const deltaPct = previous === 0 ? null : ((current - previous) / Math.abs(previous)) * 100;
  return { current, previous, deltaPct };
}

export function sumAmount(facts: SalesFact[]): number {
  return facts.reduce((sum, f) => sum + f.amount, 0);
}

export function countDistinctTransactions(facts: SalesFact[]): number {
  return new Set(facts.map((f) => f.transactionId)).size;
}

export function sumQuantity(facts: SalesFact[]): number {
  return facts.reduce((sum, f) => sum + f.quantity, 0);
}

export function pickUnidadesPorTransaccion(facts: SalesFact[]): number {
  const tx = countDistinctTransactions(facts);
  return tx === 0 ? 0 : sumQuantity(facts) / tx;
}

export function pickTicketPromedio(facts: SalesFact[]): number {
  const tx = countDistinctTransactions(facts);
  return tx === 0 ? 0 : sumAmount(facts) / tx;
}

export function pickDescuentoPct(facts: SalesFact[]): number {
  const positive = sumAmount(facts.filter((f) => f.amount > 0));
  const negative = Math.abs(sumAmount(facts.filter((f) => f.amount < 0)));
  return positive === 0 ? 0 : (negative / positive) * 100;
}

/** No hay datos de visitantes/tráfico en este mock -- valor de prueba fijo, no derivado de facts. */
export function mockTasaConversionKpiValue(): KpiValue {
  const current = TASA_CONVERSION_ACTUAL;
  const previous = TASA_CONVERSION_ANTERIOR;
  return {
    current,
    previous,
    deltaPct: ((current - previous) / Math.abs(previous)) * 100,
    trend: TASA_CONVERSION_TREND.map((value, index) => ({ periodId: `mock-${index}`, value })),
  };
}

/** Minimum candidate points for a sparkline to be considered representative of a real trend. */
export const MIN_TREND_POINTS = 3;
/** How far back to walk when only a single period is selected. */
const MAX_TRAILING_TREND_POINTS = 12;

/**
 * Candidate sparkline points for one KPI metric. Never fabricates a point for a period with no
 * real loaded facts (Read-Only principle -- no zero-fill, no repeat-current, no projection):
 *
 * - Exactly one period selected: walks backward from it by Period.order collecting periods that
 *   have at least one fact for this scope, stopping at the first gap (an entity's real history
 *   starts somewhere; a gap isn't skipped over), capped at MAX_TRAILING_TREND_POINTS.
 * - Multiple periods selected: the selected periods themselves, chronological order, filtered to
 *   only those that actually have fact data (so a wide range on a young entity doesn't render
 *   fabricated points for periods before it existed).
 *
 * `trendSourceFacts` must be scoped by store/context (and any producto cross-filter) but NOT by
 * period -- the whole point is looking at periods outside the currently selected range.
 */
export function buildKpiTrendPoints(
  trendSourceFacts: SalesFact[],
  allPeriods: Period[],
  selectedPeriodIds: string[],
  pick: (facts: SalesFact[]) => number,
): TrendPoint[] {
  const periodById = new Map(allPeriods.map((period) => [period.id, period]));
  // Facts only carry a real date now (no periodId) -- bucket by date-range membership, cached
  // per period id since the same period can be checked by both hasData() and the final pick().
  const factsByPeriodId = new Map<string, SalesFact[]>();
  const factsForPeriod = (period: Period): SalesFact[] => {
    let cached = factsByPeriodId.get(period.id);
    if (!cached) {
      cached = trendSourceFacts.filter((f) => f.date >= period.startDate && f.date <= period.endDate);
      factsByPeriodId.set(period.id, cached);
    }
    return cached;
  };
  const hasData = (period: Period) => factsForPeriod(period).length > 0;

  const selectedPeriods = selectedPeriodIds
    .map((id) => periodById.get(id))
    .filter((period): period is Period => !!period)
    .sort((a, b) => a.order - b.order);

  let candidatePeriods: Period[];

  if (selectedPeriods.length === 1) {
    const targetOrder = selectedPeriods[0].order;
    const orderToPeriod = new Map(allPeriods.map((period) => [period.order, period]));
    const trailing: Period[] = [];
    for (let offset = 1; offset <= MAX_TRAILING_TREND_POINTS; offset++) {
      const candidate = orderToPeriod.get(targetOrder - offset);
      if (!candidate || !hasData(candidate)) {
        break;
      }
      trailing.push(candidate);
    }
    candidatePeriods = trailing.reverse();
  } else {
    candidatePeriods = selectedPeriods.filter((period) => hasData(period));
  }

  return candidatePeriods.map((period) => ({
    periodId: period.id,
    value: pick(factsForPeriod(period)),
  }));
}

export function computeKpis(
  currentFacts: SalesFact[],
  previousFacts: SalesFact[],
  trendSourceFacts: SalesFact[],
  allPeriods: Period[],
  selectedPeriodIds: string[],
): KpiSet {
  const build = (pick: (facts: SalesFact[]) => number): KpiValue => ({
    ...computeKpiValue(currentFacts, previousFacts, pick),
    trend: buildKpiTrendPoints(trendSourceFacts, allPeriods, selectedPeriodIds, pick),
  });

  return {
    ventasTotales: build(sumAmount),
    transacciones: build(countDistinctTransactions),
    unidadesPorTransaccion: build(pickUnidadesPorTransaccion),
    ticketPromedio: build(pickTicketPromedio),
    descuentos: build(pickDescuentoPct),
    tasaConversion: mockTasaConversionKpiValue(),
  };
}

export function buildHourlySeries(facts: SalesFact[]): number[] {
  const series = new Array<number>(OPERATIONAL_HOURS.length).fill(0);
  const hourToIndex = new Map<number, number>();
  OPERATIONAL_HOURS.forEach((hour, index) => hourToIndex.set(hour, index));

  for (const fact of facts) {
    const index = hourToIndex.get(fact.hour);
    if (index !== undefined) {
      series[index] += fact.amount;
    }
  }

  return series;
}

export function buildHeatmapMatrix(facts: SalesFact[]): number[][] {
  const matrix: number[][] = Array.from({ length: 7 }, () =>
    new Array<number>(OPERATIONAL_HOURS.length).fill(0),
  );
  const hourToIndex = new Map<number, number>();
  OPERATIONAL_HOURS.forEach((hour, index) => hourToIndex.set(hour, index));

  for (const fact of facts) {
    const hourIndex = hourToIndex.get(fact.hour);
    if (hourIndex === undefined) {
      continue;
    }
    matrix[getDayOfWeek(fact.date)][hourIndex] += fact.amount;
  }

  return matrix;
}

export interface DailyPoint {
  date: string;
  amount: number;
}

/** Agrega ventas por fecha calendario real -- una barra por día en la vista "Por Día" del gráfico de distribución. */
export function buildDailySeries(facts: SalesFact[]): DailyPoint[] {
  const totals = new Map<string, number>();
  for (const fact of facts) {
    totals.set(fact.date, (totals.get(fact.date) ?? 0) + fact.amount);
  }
  return Array.from(totals.entries())
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([date, amount]) => ({ date, amount }));
}

export function aggregateRanking(
  facts: SalesFact[],
  keyOf: (fact: SalesFact) => string,
  labelOf: (key: string) => string,
): RankingItem[] {
  const groups = new Map<string, { amount: number; quantity: number }>();

  for (const fact of facts) {
    const key = keyOf(fact);
    const group = groups.get(key) ?? { amount: 0, quantity: 0 };
    group.amount += fact.amount;
    group.quantity += fact.quantity;
    groups.set(key, group);
  }

  return Array.from(groups.entries())
    .map(([key, { amount, quantity }]) => ({
      id: key,
      label: labelOf(key),
      amount,
      quantity,
    }))
    .sort((a, b) => b.amount - a.amount);
}

/** Promedios de calendario usados para prorratear una meta mensual a Día/Semana. */
const AVG_DAYS_PER_MONTH = 30.44;
const AVG_WEEKS_PER_MONTH = 4.35;

export function scaleMeta(monthlyMeta: number, granularity: PeriodGranularity, selectedPeriodCount: number): number {
  if (granularity === 'mes') return monthlyMeta * selectedPeriodCount;
  if (granularity === 'semana') return (monthlyMeta / AVG_WEEKS_PER_MONTH) * selectedPeriodCount;
  return (monthlyMeta / AVG_DAYS_PER_MONTH) * selectedPeriodCount;
}

/**
 * Descuentos y Tasa de Conversión no participan del modo Meta (ver comentario en
 * KpiMetaMensual) -- `fallback` provee sus KpiValue tal cual (ya calculados vs. periodo
 * anterior) para que el KpiSet resultante siga completo.
 */
export function computeKpisAgainstMeta(
  currentFacts: SalesFact[],
  trendSourceFacts: SalesFact[],
  allPeriods: Period[],
  selectedPeriodIds: string[],
  metas: KpiMetaMensual,
  granularity: PeriodGranularity,
  fallback: KpiSet,
): KpiSet {
  const selectedCount = selectedPeriodIds.length;

  const build = (pick: (facts: SalesFact[]) => number, monthlyMeta: number): KpiValue => {
    const current = pick(currentFacts);
    const target = scaleMeta(monthlyMeta, granularity, selectedCount);
    const deltaPct = target === 0 ? null : ((current - target) / Math.abs(target)) * 100;
    return {
      current,
      previous: target,
      deltaPct,
      trend: buildKpiTrendPoints(trendSourceFacts, allPeriods, selectedPeriodIds, pick),
    };
  };

  return {
    ventasTotales: build(sumAmount, metas.ventasTotales),
    transacciones: build(countDistinctTransactions, metas.transacciones),
    unidadesPorTransaccion: build(pickUnidadesPorTransaccion, metas.unidadesPorTransaccion),
    ticketPromedio: build(pickTicketPromedio, metas.ticketPromedio),
    descuentos: fallback.descuentos,
    tasaConversion: fallback.tasaConversion,
  };
}

const IVA_FACTOR = 1.19;

/**
 * Los montos mock hoy representan el precio final (Con IVA). Sin IVA divide por 1.19; quantity
 * no se toca -- el impuesto no aplica a unidades. Se aplica sobre los facts crudos, antes de
 * cualquier agregación, para que KPIs, gráficos, rankings y la tabla de Detalle de Ventas
 * reflejen el toggle de forma transversal sin tener que tocar cada función de agregación.
 */
export function applyIvaMode(facts: SalesFact[], mode: IvaMode): SalesFact[] {
  if (mode === 'con_iva') return facts;
  return facts.map((fact) => ({ ...fact, amount: fact.amount / IVA_FACTOR }));
}
