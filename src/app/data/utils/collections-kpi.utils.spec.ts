import { COLLECTION_TARGETS, PERIOD_SALES_TOTAL_CLP, RECEIVABLE_DOCUMENTS, TODAY_ISO } from '../mock/collections.mock';
import { DEFAULT_SELECTED_PERIOD_IDS, PERIODS_BY_GRANULARITY } from '../mock/periods.mock';
import { documentStateAsOf } from './collections-history.utils';
import { MIN_TREND_POINTS, ceiBand, computeCollectionsKpis } from './collections-kpi.utils';

const DEFAULT_PERIODS = PERIODS_BY_GRANULARITY['mes'];

function computeDefault() {
  return computeCollectionsKpis({
    allDocuments: RECEIVABLE_DOCUMENTS,
    cutoffIso: TODAY_ISO,
    selectedPeriodIds: DEFAULT_SELECTED_PERIOD_IDS,
    periods: DEFAULT_PERIODS,
    allPeriodsForGranularity: DEFAULT_PERIODS,
    periodSalesTotal: PERIOD_SALES_TOTAL_CLP,
    collectionTargets: COLLECTION_TARGETS,
  });
}

describe('computeCollectionsKpis', () => {
  it('saldoPorCobrar.current coincide con la suma reconstruida a mano vía documentStateAsOf', () => {
    const expected = RECEIVABLE_DOCUMENTS.reduce((sum, doc) => {
      const state = documentStateAsOf(doc, TODAY_ISO);
      return state ? sum + state.balance : sum;
    }, 0);
    const kpis = computeDefault();
    expect(kpis.saldoPorCobrar.current).toBe(expected);
    expect(kpis.saldoPorCobrar.current).toBeGreaterThan(0);
  });

  it('porcentajeVencido.current está entre 0 y 100 y coincide con suma-vencido/suma-total a mano', () => {
    let overdue = 0;
    let total = 0;
    for (const doc of RECEIVABLE_DOCUMENTS) {
      const state = documentStateAsOf(doc, TODAY_ISO);
      if (!state) continue;
      total += state.balance;
      if (state.status === 'VENCIDO') overdue += state.balance;
    }
    const expected = (overdue / total) * 100;
    const kpis = computeDefault();
    expect(kpis.porcentajeVencido.current).toBeCloseTo(expected, 6);
    expect(kpis.porcentajeVencido.current).toBeGreaterThanOrEqual(0);
    expect(kpis.porcentajeVencido.current).toBeLessThanOrEqual(100);
  });

  it('recuperado.current > 0 bajo el rango de periodos default (docs PAGADO con paidDate en rango)', () => {
    const kpis = computeDefault();
    expect(kpis.recuperado.current).toBeGreaterThan(0);
  });

  it('recuperado.current coincide con la suma a mano de appliedAmount por paidDate en rango', () => {
    const start = DEFAULT_PERIODS.find((p) => p.id === DEFAULT_SELECTED_PERIOD_IDS[0])!.startDate;
    const end = DEFAULT_PERIODS.find((p) => p.id === DEFAULT_SELECTED_PERIOD_IDS[DEFAULT_SELECTED_PERIOD_IDS.length - 1])!
      .endDate;
    const expected = RECEIVABLE_DOCUMENTS.reduce((sum, doc) => {
      if (doc.paidDate !== null && doc.paidDate >= start && doc.paidDate <= end) {
        return sum + doc.appliedAmount;
      }
      return sum;
    }, 0);
    expect(computeDefault().recuperado.current).toBe(expected);
  });

  it('documentos parcialmente pagados pero abiertos (paidDate null) no aportan a recuperado', () => {
    const partiallyPaidOpenDoc = RECEIVABLE_DOCUMENTS.find(
      (doc) => doc.paidDate === null && doc.appliedAmount > 0,
    );
    expect(partiallyPaidOpenDoc).toBeDefined();
    // Si el cálculo estuviera mal (contando appliedAmount de docs abiertos), este test de
    // reconciliación de arriba ("coincide con la suma a mano") ya lo detectaría -- acá solo
    // confirmamos que el caso de borde existe en el mock (SP1 lo garantiza).
  });

  it('dso produce un número finito y no-negativo bajo el alcance default', () => {
    const kpis = computeDefault();
    expect(Number.isFinite(kpis.dso.current)).toBe(true);
    expect(kpis.dso.current).toBeGreaterThanOrEqual(0);
  });

  it('dso.current = saldoPorCobrar.current * (dias_del_periodo / ventas_a_credito_del_periodo)', () => {
    const kpis = computeDefault();
    const ventasCredito = DEFAULT_SELECTED_PERIOD_IDS.reduce(
      (sum, id) => sum + (PERIOD_SALES_TOTAL_CLP[id] ?? 0),
      0,
    );
    const dias = DEFAULT_SELECTED_PERIOD_IDS.reduce((sum, id) => {
      const period = DEFAULT_PERIODS.find((p) => p.id === id)!;
      const ms = new Date(`${period.endDate}T00:00:00Z`).getTime() - new Date(`${period.startDate}T00:00:00Z`).getTime();
      return sum + Math.round(ms / 86_400_000) + 1;
    }, 0);
    const expected = kpis.saldoPorCobrar.current * (dias / ventasCredito);
    expect(kpis.dso.current).toBeCloseTo(expected, 6);
  });

  it('cei.current es un número finito (no NaN/Infinity) bajo el alcance default', () => {
    const kpis = computeDefault();
    expect(Number.isFinite(kpis.cei.current)).toBe(true);
  });

  it('cei con ventana vacía (ningún periodo seleccionado) no produce NaN/Infinity', () => {
    const kpis = computeCollectionsKpis({
      allDocuments: RECEIVABLE_DOCUMENTS,
      cutoffIso: TODAY_ISO,
      selectedPeriodIds: [],
      periods: DEFAULT_PERIODS,
      allPeriodsForGranularity: DEFAULT_PERIODS,
      periodSalesTotal: PERIOD_SALES_TOTAL_CLP,
      collectionTargets: COLLECTION_TARGETS,
    });
    expect(Number.isFinite(kpis.cei.current)).toBe(true);
    expect(kpis.cei.deltaPct).toBeNull();
    expect(Number.isFinite(kpis.dso.current)).toBe(true);
    expect(kpis.dso.deltaPct).toBeNull();
  });

  it('ceiBand clasifica correctamente en los cortes 90/80 (spec §4.1)', () => {
    expect(ceiBand(95)).toBe('good');
    expect(ceiBand(90)).toBe('good');
    expect(ceiBand(85)).toBe('medium');
    expect(ceiBand(80)).toBe('medium');
    expect(ceiBand(70)).toBe('bad');
  });

  it('cada trend candidato tiene largo entre 0 y 12 (MAX_TRAILING_TREND_POINTS)', () => {
    const kpis = computeDefault();
    for (const kpi of [kpis.saldoPorCobrar, kpis.porcentajeVencido, kpis.dso, kpis.cei, kpis.recuperado]) {
      expect(kpi.trend.length).toBeGreaterThanOrEqual(0);
      expect(kpi.trend.length).toBeLessThanOrEqual(12);
    }
  });

  it('el trend de saldoPorCobrar alcanza al menos MIN_TREND_POINTS bajo el corte default (multi-año de historia)', () => {
    const kpis = computeDefault();
    expect(kpis.saldoPorCobrar.trend.length).toBeGreaterThanOrEqual(MIN_TREND_POINTS);
  });

  it('el trend excluye el propio corte activo (ancla) -- ningún punto usa cutoffIso como periodId', () => {
    const kpis = computeDefault();
    expect(kpis.saldoPorCobrar.trend.some((point) => point.periodId === TODAY_ISO)).toBe(false);
  });

  it('el trend de saldoPorCobrar y %Vencido comparten los mismos cortes (mismo caminado hacia atrás)', () => {
    const kpis = computeDefault();
    const saldoCortes = kpis.saldoPorCobrar.trend.map((p) => p.periodId);
    const vencidoCortes = kpis.porcentajeVencido.trend.map((p) => p.periodId);
    expect(vencidoCortes).toEqual(saldoCortes);
  });

  it('devuelve trend con largo < MIN_TREND_POINTS sin filtrar (el caller decide visibilidad)', () => {
    // Un solo periodo muy antiguo, sin corte previo conocido en la granularidad -- fuerza pocos o
    // ningún punto trailing sin que la función deba ocultarlos.
    const kpis = computeCollectionsKpis({
      allDocuments: RECEIVABLE_DOCUMENTS,
      cutoffIso: DEFAULT_PERIODS[0].startDate,
      selectedPeriodIds: [DEFAULT_PERIODS[0].id],
      periods: DEFAULT_PERIODS,
      allPeriodsForGranularity: DEFAULT_PERIODS,
      periodSalesTotal: PERIOD_SALES_TOTAL_CLP,
      collectionTargets: COLLECTION_TARGETS,
    });
    expect(kpis.saldoPorCobrar.trend.length).toBeLessThan(MIN_TREND_POINTS);
  });

  it('saldoPorCobrar.previous usa el corte anterior equivalente (mismo día calendario del mes anterior)', () => {
    const kpis = computeDefault();
    const expectedPreviousCutoff = '2026-06-25'; // TODAY_ISO=2026-07-25 -> mismo día, mes anterior
    const expectedPrevious = RECEIVABLE_DOCUMENTS.reduce((sum, doc) => {
      const state = documentStateAsOf(doc, expectedPreviousCutoff);
      return state ? sum + state.balance : sum;
    }, 0);
    expect(kpis.saldoPorCobrar.previous).toBe(expectedPrevious);
  });

  it('saldoPorCobrar.deltaPct es null solo cuando previous es 0, no cuando previous existe', () => {
    const kpis = computeDefault();
    expect(kpis.saldoPorCobrar.previous).toBeGreaterThan(0);
    expect(kpis.saldoPorCobrar.deltaPct).not.toBeNull();
  });
});
