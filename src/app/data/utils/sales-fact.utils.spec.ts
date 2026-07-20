import type { Period } from '../models/period.model';
import type { SalesFact } from '../models/sales-fact.model';
import { TASA_CONVERSION_ACTUAL, TASA_CONVERSION_ANTERIOR, TASA_CONVERSION_TREND } from '../mock/conversion.mock';
import {
  buildDailySeries,
  buildHeatmapMatrix,
  buildKpiTrendPoints,
  filterFacts,
  mockTasaConversionKpiValue,
  pickDescuentoPct,
} from './sales-fact.utils';

function fact(overrides: Partial<SalesFact>): SalesFact {
  return {
    transactionId: 'tx-1',
    date: '2026-07-01',
    storeId: 'tienda-a',
    productId: 'prod-1',
    hour: 10,
    amount: 1000,
    quantity: 1,
    ...overrides,
  };
}

function period(overrides: Partial<Period>): Period {
  return {
    id: 'p-1',
    label: 'p',
    granularity: 'mes',
    year: 2026,
    month: 7,
    order: 1,
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    ...overrides,
  };
}

describe('filterFacts', () => {
  it('keeps a fact whose store matches and whose date falls inside a selected period range', () => {
    const facts = [fact({ storeId: 'tienda-a', date: '2026-07-15' })];
    const result = filterFacts(facts, { storeIds: ['tienda-a'], periods: [period({})] });
    expect(result.length).toBe(1);
  });

  it('drops a fact whose date falls outside every selected period range', () => {
    const facts = [fact({ storeId: 'tienda-a', date: '2026-08-01' })];
    const result = filterFacts(facts, { storeIds: ['tienda-a'], periods: [period({})] });
    expect(result.length).toBe(0);
  });

  it('drops a fact whose store is not in scope even if the date matches', () => {
    const facts = [fact({ storeId: 'tienda-b', date: '2026-07-15' })];
    const result = filterFacts(facts, { storeIds: ['tienda-a'], periods: [period({})] });
    expect(result.length).toBe(0);
  });

  it('keeps a fact matching any one of multiple selected period ranges', () => {
    const facts = [fact({ storeId: 'tienda-a', date: '2026-01-05' })];
    const periods = [period({ startDate: '2026-07-01', endDate: '2026-07-31' }), period({ startDate: '2026-01-01', endDate: '2026-01-31' })];
    const result = filterFacts(facts, { storeIds: ['tienda-a'], periods });
    expect(result.length).toBe(1);
  });
});

describe('buildHeatmapMatrix', () => {
  it('buckets a fact into the day-of-week row derived from its date, not a stored field', () => {
    const facts = [fact({ date: '2026-07-19', hour: 6, amount: 500 })]; // domingo
    const matrix = buildHeatmapMatrix(facts);
    expect(matrix[0][0]).toBe(500); // fila domingo (0), primera hora operacional (6)
  });
});

describe('buildKpiTrendPoints', () => {
  const sumPick = (facts: SalesFact[]) => facts.reduce((s, f) => s + f.amount, 0);

  // Five consecutive months, order 1..5, each with its own non-overlapping date range.
  const p1 = period({ id: 'p-1', order: 1, startDate: '2026-01-01', endDate: '2026-01-31' });
  const p2 = period({ id: 'p-2', order: 2, startDate: '2026-02-01', endDate: '2026-02-28' });
  const p3 = period({ id: 'p-3', order: 3, startDate: '2026-03-01', endDate: '2026-03-31' });
  const p4 = period({ id: 'p-4', order: 4, startDate: '2026-04-01', endDate: '2026-04-30' });
  const p5 = period({ id: 'p-5', order: 5, startDate: '2026-05-01', endDate: '2026-05-31' });
  const allPeriods = [p1, p2, p3, p4, p5];

  it('single selected period: walks backward by order and stops at the first period with no data, not skipping past the gap', () => {
    // p1 has data but is unreachable because p2 (the immediate predecessor's predecessor) has none.
    const facts = [
      fact({ date: '2026-01-15', amount: 999 }), // p1 -- has data but behind the gap
      fact({ date: '2026-03-15', amount: 300 }), // p3
      fact({ date: '2026-04-15', amount: 400 }), // p4
    ];

    const result = buildKpiTrendPoints(facts, allPeriods, [p5.id], sumPick);

    expect(result.map((r) => r.periodId)).toEqual(['p-3', 'p-4']);
    expect(result.map((r) => r.value)).toEqual([300, 400]);
  });

  it('multiple selected periods: only the ones with real data are included, in chronological order', () => {
    const facts = [
      // p2 deliberately has no facts.
      fact({ date: '2026-03-10', amount: 100 }), // p3
      fact({ date: '2026-04-10', amount: 200 }), // p4
    ];

    const result = buildKpiTrendPoints(facts, allPeriods, [p4.id, p2.id, p3.id], sumPick);

    expect(result.map((r) => r.periodId)).toEqual(['p-3', 'p-4']);
  });

  it("attributes each fact to the period whose date range contains it, not an adjacent selected period", () => {
    const facts = [
      fact({ date: '2026-01-05', amount: 100 }), // p1
      fact({ date: '2026-01-20', amount: 200 }), // p1
      fact({ date: '2026-02-01', amount: 50 }), // p2
    ];

    const result = buildKpiTrendPoints(facts, allPeriods, [p1.id, p2.id], sumPick);

    expect(result).toEqual([
      { periodId: 'p-1', value: 300 },
      { periodId: 'p-2', value: 50 },
    ]);
  });
});

describe('pickDescuentoPct', () => {
  it('returns 0 when there are no negative-amount facts', () => {
    expect(pickDescuentoPct([fact({ amount: 1000 }), fact({ amount: 2000 })])).toBe(0);
  });

  it('returns the discount percentage relative to positive sales', () => {
    const facts = [fact({ amount: 1000 }), fact({ amount: -200 })];
    expect(pickDescuentoPct(facts)).toBeCloseTo(20, 5);
  });

  it('returns 0 when there are no positive-amount facts (avoids division by zero)', () => {
    expect(pickDescuentoPct([fact({ amount: -200 })])).toBe(0);
  });
});

describe('mockTasaConversionKpiValue', () => {
  it('returns the fixed mock current/previous/trend values, not derived from any facts', () => {
    const kpi = mockTasaConversionKpiValue();
    expect(kpi.current).toBe(TASA_CONVERSION_ACTUAL);
    expect(kpi.previous).toBe(TASA_CONVERSION_ANTERIOR);
    expect(kpi.deltaPct).toBeCloseTo(
      ((TASA_CONVERSION_ACTUAL - TASA_CONVERSION_ANTERIOR) / TASA_CONVERSION_ANTERIOR) * 100,
      5,
    );
    expect(kpi.trend.map((p) => p.value)).toEqual(TASA_CONVERSION_TREND);
  });
});

describe('buildDailySeries', () => {
  it('sums amounts per calendar date and sorts chronologically', () => {
    const facts = [
      fact({ date: '2026-07-02', amount: 500 }),
      fact({ date: '2026-07-01', amount: 1000 }),
      fact({ date: '2026-07-01', amount: 200 }),
    ];
    expect(buildDailySeries(facts)).toEqual([
      { date: '2026-07-01', amount: 1200 },
      { date: '2026-07-02', amount: 500 },
    ]);
  });

  it('returns an empty array when there are no facts', () => {
    expect(buildDailySeries([])).toEqual([]);
  });
});
