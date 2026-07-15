import type { SalesFact } from '../models/sales-fact.model';
import type { KpiSet, KpiValue, TrendPoint } from '../models/kpi.model';
import type { Period } from '../models/period.model';
import type { RankingItem } from '../models/ranking.model';

export const OPERATIONAL_HOURS: number[] = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5,
];

export function filterFacts(
  facts: SalesFact[],
  opts: { storeIds: string[]; periodIds: string[] },
): SalesFact[] {
  const storeIdSet = new Set(opts.storeIds);
  const periodIdSet = new Set(opts.periodIds);
  return facts.filter((f) => storeIdSet.has(f.storeId) && periodIdSet.has(f.periodId));
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
  const factsByPeriod = new Map<string, SalesFact[]>();
  for (const fact of trendSourceFacts) {
    const list = factsByPeriod.get(fact.periodId) ?? [];
    list.push(fact);
    factsByPeriod.set(fact.periodId, list);
  }
  const hasData = (periodId: string) => (factsByPeriod.get(periodId)?.length ?? 0) > 0;

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
      if (!candidate || !hasData(candidate.id)) {
        break;
      }
      trailing.push(candidate);
    }
    candidatePeriods = trailing.reverse();
  } else {
    candidatePeriods = selectedPeriods.filter((period) => hasData(period.id));
  }

  return candidatePeriods.map((period) => ({
    periodId: period.id,
    value: pick(factsByPeriod.get(period.id) ?? []),
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
    matrix[fact.dayOfWeek][hourIndex] += fact.amount;
  }

  return matrix;
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
