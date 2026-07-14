import type { SalesFact } from '../models/sales-fact.model';
import type { KpiSet, KpiValue } from '../models/kpi.model';
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
): KpiValue {
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

export function computeKpis(currentFacts: SalesFact[], previousFacts: SalesFact[]): KpiSet {
  const unidadesPorTransaccion = (facts: SalesFact[]): number => {
    const tx = countDistinctTransactions(facts);
    return tx === 0 ? 0 : sumQuantity(facts) / tx;
  };

  const ticketPromedio = (facts: SalesFact[]): number => {
    const tx = countDistinctTransactions(facts);
    return tx === 0 ? 0 : sumAmount(facts) / tx;
  };

  return {
    ventasTotales: computeKpiValue(currentFacts, previousFacts, sumAmount),
    transacciones: computeKpiValue(currentFacts, previousFacts, countDistinctTransactions),
    unidadesPorTransaccion: computeKpiValue(currentFacts, previousFacts, unidadesPorTransaccion),
    ticketPromedio: computeKpiValue(currentFacts, previousFacts, ticketPromedio),
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
