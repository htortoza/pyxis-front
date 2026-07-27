import type { ReceivableDocument } from '../models/collections.model';
import type { Period } from '../models/period.model';
import { PERIOD_SALES_TOTAL_CLP, RECEIVABLE_DOCUMENTS, TODAY_ISO } from '../mock/collections.mock';
import { DEFAULT_SELECTED_PERIOD_IDS, PERIODS_BY_GRANULARITY } from '../mock/periods.mock';
import { previousPeriodWindow, resolvePeriods } from './collections-kpi.utils';
import { buildVentaCajaBridge, collectedRatioForWindow } from './venta-caja-bridge.utils';

const DEFAULT_PERIODS = PERIODS_BY_GRANULARITY['mes'];

function buildDefault() {
  return buildVentaCajaBridge(RECEIVABLE_DOCUMENTS, TODAY_ISO, DEFAULT_SELECTED_PERIOD_IDS, DEFAULT_PERIODS, PERIOD_SALES_TOTAL_CLP);
}

describe('buildVentaCajaBridge', () => {
  // ---- Test obligatorio 1: cuadre exacto bajo el scope default con datos mock reales ----------
  it('segments.reduce(sum) === totalSales bajo el scope default (tolerancia 0)', () => {
    const bridge = buildDefault();
    const sum = bridge.segments.reduce((acc, s) => acc + s.amount, 0);
    expect(sum).toBe(bridge.totalSales);
  });

  // ---- Test obligatorio 2: totalSales cierra el círculo con PERIOD_SALES_TOTAL_CLP -------------
  it('totalSales bajo el periodo default coincide exactamente con PERIOD_SALES_TOTAL_CLP sumado', () => {
    const expected = DEFAULT_SELECTED_PERIOD_IDS.reduce((sum, id) => sum + (PERIOD_SALES_TOTAL_CLP[id] ?? 0), 0);
    expect(buildDefault().totalSales).toBe(expected);
  });

  it('ventana de periodos vacía devuelve 4 segmentos en 0 y totalSales 0', () => {
    const bridge = buildVentaCajaBridge(RECEIVABLE_DOCUMENTS, TODAY_ISO, [], DEFAULT_PERIODS, PERIOD_SALES_TOTAL_CLP);
    expect(bridge.totalSales).toBe(0);
    expect(bridge.segments).toEqual([
      { key: 'COLLECTED', label: 'Cobrado', amount: 0, ratio: 0 },
      { key: 'UPCOMING', label: 'Por vencer', amount: 0, ratio: 0 },
      { key: 'OVERDUE', label: 'Vencido', amount: 0, ratio: 0 },
      { key: 'CREDIT_NOTE', label: 'Notas de crédito', amount: 0, ratio: 0 },
    ]);
  });

  it('el orden de los segmentos es siempre COLLECTED, UPCOMING, OVERDUE, CREDIT_NOTE', () => {
    const bridge = buildDefault();
    expect(bridge.segments.map((s) => s.key)).toEqual(['COLLECTED', 'UPCOMING', 'OVERDUE', 'CREDIT_NOTE']);
  });

  it('las 4 magnitudes son siempre >= 0, incluida CREDIT_NOTE (el signo negativo es solo de presentación, en el componente)', () => {
    const bridge = buildDefault();
    for (const segment of bridge.segments) {
      expect(segment.amount).toBeGreaterThanOrEqual(0);
      expect(segment.ratio).toBeGreaterThanOrEqual(0);
    }
  });

  it('COLLECTED pliega la venta no-crédito (efectivo/tarjeta) del periodo: bajo el scope default, totalSales > suma de grossAmount de los documentos del rango', () => {
    // Fold-in de Causa raíz #1: los documentos (ReceivableDocument) son SOLO venta a crédito, así
    // que su suma de grossAmount en el rango default es estructuralmente menor a totalSales
    // (PERIOD_SALES_TOTAL_CLP, todos los canales) -- evidencia de que hay un remanente no-crédito
    // real para plegar en COLLECTED en este mock.
    const selectedPeriods = resolvePeriods(DEFAULT_SELECTED_PERIOD_IDS, DEFAULT_PERIODS);
    const rangeStart = selectedPeriods[0].startDate;
    const rangeEnd = selectedPeriods[selectedPeriods.length - 1].endDate;
    const documentGrossTotal = RECEIVABLE_DOCUMENTS.filter(
      (doc) => doc.issueDate >= rangeStart && doc.issueDate <= rangeEnd,
    ).reduce((sum, doc) => sum + doc.grossAmount, 0);

    const bridge = buildDefault();
    expect(bridge.totalSales).toBeGreaterThan(documentGrossTotal);
  });

  // ---- Test obligatorio 3: escenario armado a mano (más fácil de depurar que el real) -----------
  describe('escenario armado a mano (2 abiertos + 1 cerrado, incluye pago parcial y nota de crédito)', () => {
    const period: Period = {
      id: 'test-2026-01',
      label: 'Enero (test)',
      granularity: 'mes',
      year: 2026,
      month: 1,
      order: 1,
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    };
    const cutoffIso = '2026-02-15';

    // Cerrado, sin sobrepago: pagado antes del corte -- balance 0 por construcción.
    const closedDoc: ReceivableDocument = {
      id: 'doc-test-closed',
      externalRef: 'F-TEST-1',
      counterpartyId: 'cp-test',
      issueDate: '2026-01-05',
      dueDate: '2026-01-20',
      grossAmount: 100_000,
      netAmount: 84_034,
      appliedAmount: 100_000,
      creditNoteAmount: 0,
      balance: 0,
      status: 'PAGADO',
      daysOverdue: 0,
      currency: 'CLP',
      paidDate: '2026-01-25',
    };

    // Abierto con pago parcial, vencido al corte (dueDate < cutoffIso).
    const openPartiallyPaidDoc: ReceivableDocument = {
      id: 'doc-test-open-partial',
      externalRef: 'F-TEST-2',
      counterpartyId: 'cp-test',
      issueDate: '2026-01-10',
      dueDate: '2026-01-12',
      grossAmount: 200_000,
      netAmount: 168_067,
      appliedAmount: 50_000,
      creditNoteAmount: 0,
      balance: 150_000,
      status: 'VENCIDO',
      daysOverdue: 34,
      currency: 'CLP',
      paidDate: null,
    };

    // Abierto con nota de crédito, todavía por vencer al corte (dueDate >= cutoffIso).
    const openWithCreditNoteDoc: ReceivableDocument = {
      id: 'doc-test-open-credit-note',
      externalRef: 'F-TEST-3',
      counterpartyId: 'cp-test',
      issueDate: '2026-01-15',
      dueDate: '2026-03-01',
      grossAmount: 100_000,
      netAmount: 84_034,
      appliedAmount: 0,
      creditNoteAmount: 20_000,
      balance: 80_000,
      status: 'POR_VENCER',
      daysOverdue: 0,
      currency: 'CLP',
      paidDate: null,
    };

    const docs = [closedDoc, openPartiallyPaidDoc, openWithCreditNoteDoc];

    it('identidad por documento: appliedAmount + balance(si abierto) + creditNoteAmount === grossAmount', () => {
      for (const doc of docs) {
        const isOpenAtCutoff = doc.paidDate === null || doc.paidDate > cutoffIso;
        const balanceIfOpen = isOpenAtCutoff ? doc.balance : 0;
        expect(doc.appliedAmount + balanceIfOpen + doc.creditNoteAmount).toBe(doc.grossAmount);
      }
    });

    it('produce los montos esperados por segmento cuando totalSales === grossSum (sin venta no-crédito que plegar)', () => {
      const grossSum = docs.reduce((sum, doc) => sum + doc.grossAmount, 0); // 400_000
      const periodSalesTotal = { [period.id]: grossSum };
      const bridge = buildVentaCajaBridge(docs, cutoffIso, [period.id], [period], periodSalesTotal);

      const collected = bridge.segments.find((s) => s.key === 'COLLECTED')!;
      const upcoming = bridge.segments.find((s) => s.key === 'UPCOMING')!;
      const overdue = bridge.segments.find((s) => s.key === 'OVERDUE')!;
      const creditNote = bridge.segments.find((s) => s.key === 'CREDIT_NOTE')!;

      // cashOrCardSales = max(0, 400_000 - 400_000) = 0 -- COLLECTED = solo appliedAmount:
      // 100k (cerrado) + 50k (parcial abierto).
      expect(collected.amount).toBe(150_000);
      // UPCOMING = balance del documento con nota de crédito, todavía por vencer (80k).
      expect(upcoming.amount).toBe(80_000);
      // OVERDUE = balance del documento con pago parcial, ya vencido (150k).
      expect(overdue.amount).toBe(150_000);
      // CREDIT_NOTE = creditNoteAmount total emitido en el rango, en POSITIVO (20k).
      expect(creditNote.amount).toBe(20_000);

      // Invariante de cuadre: las 4 magnitudes (todas >= 0) suman exactamente totalSales, sin
      // ningún caso especial de resta.
      const segmentsSum = bridge.segments.reduce((sum, s) => sum + s.amount, 0);
      expect(segmentsSum).toBe(grossSum);
      expect(segmentsSum).toBe(400_000);
    });

    it('fold-in de venta no-crédito: cuando totalSales > grossSum, el remanente se pliega en COLLECTED y el cuadre se mantiene exacto', () => {
      const grossSum = docs.reduce((sum, doc) => sum + doc.grossAmount, 0); // 400_000
      const cashOrCardSales = 150_000; // venta en efectivo/tarjeta del periodo, sin ReceivableDocument
      const totalSales = grossSum + cashOrCardSales; // 550_000
      const periodSalesTotal = { [period.id]: totalSales };
      const bridge = buildVentaCajaBridge(docs, cutoffIso, [period.id], [period], periodSalesTotal);

      const appliedOnly = docs.reduce((sum, doc) => sum + doc.appliedAmount, 0); // 150_000
      const collected = bridge.segments.find((s) => s.key === 'COLLECTED')!;

      // El remanente no-crédito (150k) se plegó sobre el appliedAmount puro (150k) -> 300k.
      expect(collected.amount).toBe(appliedOnly + cashOrCardSales);
      expect(collected.amount).toBeGreaterThan(appliedOnly);

      const segmentsSum = bridge.segments.reduce((sum, s) => sum + s.amount, 0);
      expect(segmentsSum).toBe(totalSales);
      expect(bridge.totalSales).toBe(totalSales);
    });
  });
});

describe('collectedRatioForWindow', () => {
  it('devuelve null cuando la ventana de periodos está vacía', () => {
    expect(collectedRatioForWindow(RECEIVABLE_DOCUMENTS, TODAY_ISO, [], PERIOD_SALES_TOTAL_CLP)).toBeNull();
  });

  it('devuelve null cuando totalSales de la ventana es 0', () => {
    const period: Period = {
      id: 'test-no-sales',
      label: 'Sin ventas (test)',
      granularity: 'mes',
      year: 2020,
      month: 1,
      order: -1,
      startDate: '2020-01-01',
      endDate: '2020-01-31',
    };
    expect(collectedRatioForWindow(RECEIVABLE_DOCUMENTS, TODAY_ISO, [period], {})).toBeNull();
  });

  it('coincide con collected/totalSales calculado a mano para la ventana default', () => {
    const selectedPeriods = resolvePeriods(DEFAULT_SELECTED_PERIOD_IDS, DEFAULT_PERIODS);
    const bridge = buildDefault();
    const collectedSegment = bridge.segments.find((s) => s.key === 'COLLECTED')!;
    const ratio = collectedRatioForWindow(RECEIVABLE_DOCUMENTS, TODAY_ISO, selectedPeriods, PERIOD_SALES_TOTAL_CLP);
    expect(ratio).not.toBeNull();
    expect(ratio!).toBeCloseTo(collectedSegment.amount / bridge.totalSales, 9);
  });

  it('usa la ventana anterior resuelta vía previousPeriodWindow sin lanzar y devuelve un número finito', () => {
    const selectedPeriods = resolvePeriods(DEFAULT_SELECTED_PERIOD_IDS, DEFAULT_PERIODS);
    const previousWindow = previousPeriodWindow(selectedPeriods, DEFAULT_PERIODS);
    const ratio = collectedRatioForWindow(RECEIVABLE_DOCUMENTS, TODAY_ISO, previousWindow, PERIOD_SALES_TOTAL_CLP);
    expect(ratio === null || Number.isFinite(ratio)).toBe(true);
  });
});
