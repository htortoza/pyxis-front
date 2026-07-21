import type { Period } from '../models/period.model';
import type { SalesFact } from '../models/sales-fact.model';
import { TASA_CONVERSION_ACTUAL, TASA_CONVERSION_ANTERIOR, TASA_CONVERSION_TREND } from '../mock/conversion.mock';
import {
  applyIvaMode,
  buildDailySeries,
  buildHeatmapMatrix,
  buildKpiTrendPoints,
  computeKpisAgainstMeta,
  filterFacts,
  mockTasaConversionKpiValue,
  pickDescuentoPct,
  scaleMeta,
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

  it('multiple selected periods: still walks backward from the LAST (most recent) one, not just the selected periods themselves', () => {
    // Regression guard for the "sparkline shows only 2-3 points" bug: selecting p3+p4 must not
    // limit the trend to those 2 periods -- it should walk back from p4 (the most recent
    // selection) exactly like the single-period case does, surfacing p1/p2/p3 as real history.
    const facts = [
      fact({ date: '2026-01-10', amount: 100 }), // p1
      fact({ date: '2026-02-10', amount: 150 }), // p2
      fact({ date: '2026-03-10', amount: 200 }), // p3
      fact({ date: '2026-04-10', amount: 999 }), // p4 -- the anchor itself, excluded from the result
    ];

    const result = buildKpiTrendPoints(facts, allPeriods, [p3.id, p4.id], sumPick);

    expect(result).toEqual([
      { periodId: 'p-1', value: 100 },
      { periodId: 'p-2', value: 150 },
      { periodId: 'p-3', value: 200 },
    ]);
  });

  it('multiple selected periods: still stops at the first gap when walking backward from the last selection', () => {
    const facts = [
      // p2 deliberately has no facts.
      fact({ date: '2026-03-10', amount: 100 }), // p3
      fact({ date: '2026-04-10', amount: 200 }), // p4
    ];

    const result = buildKpiTrendPoints(facts, allPeriods, [p4.id, p2.id, p3.id], sumPick);

    expect(result.map((r) => r.periodId)).toEqual(['p-3']);
  });

  it("attributes each fact to the period whose date range contains it, not an adjacent selected period", () => {
    const facts = [
      fact({ date: '2026-01-05', amount: 100 }), // p1
      fact({ date: '2026-01-20', amount: 200 }), // p1
      fact({ date: '2026-02-01', amount: 50 }), // p2 -- the anchor, excluded from the result
    ];

    const result = buildKpiTrendPoints(facts, allPeriods, [p1.id, p2.id], sumPick);

    expect(result).toEqual([{ periodId: 'p-1', value: 300 }]);
  });

  it('a short selection (e.g. 3 months) still surfaces up to MAX_TRAILING_TREND_POINTS of real history, not just the selected periods', () => {
    const longHistory: Period[] = [];
    for (let order = 1; order <= 15; order++) {
      longHistory.push(
        period({
          id: `p-${order}`,
          order,
          startDate: `2026-01-${String(order).padStart(2, '0')}`,
          endDate: `2026-01-${String(order).padStart(2, '0')}`,
        }),
      );
    }
    const facts = longHistory.map((p) => fact({ date: p.startDate, amount: p.order * 10 }));
    // Select only the last 3 periods (order 13, 14, 15) -- mirrors a real "3 meses seleccionados" default.
    const selectedIds = ['p-13', 'p-14', 'p-15'];

    const result = buildKpiTrendPoints(facts, longHistory, selectedIds, sumPick);

    expect(result.length).toBe(12); // capped at MAX_TRAILING_TREND_POINTS, not 3
    // Anchor is p-15 (the most recent selection), excluded; walks back 12 slots to p-3.
    expect(result.map((r) => r.periodId)).toEqual([
      'p-3', 'p-4', 'p-5', 'p-6', 'p-7', 'p-8', 'p-9', 'p-10', 'p-11', 'p-12', 'p-13', 'p-14',
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

describe('scaleMeta', () => {
  it('scales a monthly meta by the number of selected months for Mes granularity', () => {
    expect(scaleMeta(150_000_000, 'mes', 3)).toBe(450_000_000);
  });

  it('scales a monthly meta down proportionally for Semana granularity', () => {
    expect(scaleMeta(150_000_000, 'semana', 1)).toBeCloseTo(150_000_000 / 4.35, 0);
  });

  it('scales a monthly meta down proportionally for Dia granularity', () => {
    expect(scaleMeta(150_000_000, 'dia', 1)).toBeCloseTo(150_000_000 / 30.44, 0);
  });
});

describe('computeKpisAgainstMeta', () => {
  const emptyKpiValue = { current: 0, previous: 0, deltaPct: null, trend: [] };
  const fallback = {
    ventasTotales: emptyKpiValue,
    transacciones: emptyKpiValue,
    unidadesPorTransaccion: emptyKpiValue,
    ticketPromedio: emptyKpiValue,
    descuentos: { current: 5, previous: 4, deltaPct: 25, trend: [] },
    tasaConversion: mockTasaConversionKpiValue(),
  };

  it('computes deltaPct as % distance from the scaled meta, not from a previous period', () => {
    const facts = [fact({ amount: 200_000_000, date: '2026-07-15' })];
    const kpis = computeKpisAgainstMeta(
      facts,
      facts,
      [period({ id: '2026-07', order: 2026 * 12 + 7 })],
      ['2026-07'],
      { ventasTotales: 150_000_000, transacciones: 1, unidadesPorTransaccion: 1, ticketPromedio: 1 },
      'mes',
      fallback,
    );
    expect(kpis.ventasTotales.current).toBe(200_000_000);
    expect(kpis.ventasTotales.previous).toBe(150_000_000);
    expect(kpis.ventasTotales.deltaPct).toBeCloseTo(((200_000_000 - 150_000_000) / 150_000_000) * 100, 5);
  });

  it('passes Descuentos and Tasa de Conversion through unchanged from the fallback', () => {
    const kpis = computeKpisAgainstMeta(
      [],
      [],
      [],
      [],
      { ventasTotales: 1, transacciones: 1, unidadesPorTransaccion: 1, ticketPromedio: 1 },
      'mes',
      fallback,
    );
    expect(kpis.descuentos).toBe(fallback.descuentos);
    expect(kpis.tasaConversion).toBe(fallback.tasaConversion);
  });
});

describe('applyIvaMode', () => {
  it('returns the facts unchanged for con_iva', () => {
    const facts = [fact({ amount: 1190 })];
    expect(applyIvaMode(facts, 'con_iva')).toBe(facts);
  });

  it('divides amount by 1.19 for sin_iva, leaving quantity untouched', () => {
    const facts = [fact({ amount: 1190, quantity: 3 })];
    const result = applyIvaMode(facts, 'sin_iva');
    expect(result[0].amount).toBeCloseTo(1000, 5);
    expect(result[0].quantity).toBe(3);
  });
});
