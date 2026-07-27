import { TestBed } from '@angular/core/testing';

import type { CounterpartyBehavior, ReceivableDocument } from '../models/collections.model';
import { COUNTERPARTY_BEHAVIORS } from '../mock/collections.mock';
import { CollectionsDataService } from '../../services/collections-data.service';
import { addDaysIso } from './date.utils';
import { buildRecaudacionProjection } from './collections-projection.utils';

/** Documento mínimo válido para armar casos de borde a mano -- mismo patrón que
 * `collections-aging.utils.spec.ts`: solo los campos que `buildRecaudacionProjection` efectivamente
 * lee importan; el resto se completa con valores neutros. */
function makeDoc(overrides: Partial<ReceivableDocument>): ReceivableDocument {
  return {
    id: 'doc-1',
    externalRef: 'F-1',
    counterpartyId: 'cp-1',
    issueDate: '2026-01-01',
    dueDate: '2026-08-01',
    grossAmount: 1000,
    netAmount: 840,
    appliedAmount: 0,
    creditNoteAmount: 0,
    balance: 1000,
    status: 'POR_VENCER',
    daysOverdue: 0,
    currency: 'CLP',
    paidDate: null,
    ...overrides,
  };
}

describe('buildRecaudacionProjection', () => {
  let service: CollectionsDataService;

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionsDataService);
  });

  it('cuadra exactamente bajo el scope default, sin activarse el clamp fuera-de-horizonte', () => {
    const documents = service.scopedDocumentsGross();
    const cutoffIso = service.cutoffDate();

    const projection = buildRecaudacionProjection(documents, cutoffIso, 'semana', COUNTERPARTY_BEHAVIORS);

    const expectedTotal = documents.filter((doc) => doc.balance > 0).reduce((sum, doc) => sum + doc.balance, 0);
    const bucketsContractualSum = projection.buckets.reduce((sum, b) => sum + b.contractual, 0);
    const actualTotal = projection.backlogOverdue + projection.excludedNoDueDate + bucketsContractualSum;

    expect(actualTotal).toBeCloseTo(expectedTotal, 6);

    // Confirma que el clamp fuera-de-horizonte NO se activó bajo los datos default: todo dueDate
    // que efectivamente se proyecta cae dentro del rango cubierto por los 13 buckets semanales.
    const firstBucket = projection.buckets[0];
    const lastBucket = projection.buckets[projection.buckets.length - 1];
    const projectedDueDates = documents
      .filter((doc) => doc.balance > 0 && doc.status === 'POR_VENCER' && doc.dueDate !== null)
      .map((doc) => doc.dueDate as string);
    expect(projectedDueDates.every((due) => due >= firstBucket.startDate && due <= lastBucket.endDate)).toBe(true);
  });

  it('degradación por-documento: sin historial suficiente aporta a contractual pero no a adjusted', () => {
    const cutoffIso = '2026-07-25';
    const docNoBehavior = makeDoc({ id: 'd1', counterpartyId: 'cp-no-behavior', balance: 1000, dueDate: '2026-08-01' });
    const docLowHistory = makeDoc({ id: 'd2', counterpartyId: 'cp-low-history', balance: 500, dueDate: '2026-08-05' });
    const docGoodHistory = makeDoc({ id: 'd3', counterpartyId: 'cp-good-history', balance: 2000, dueDate: '2026-08-10' });
    const behaviors: CounterpartyBehavior[] = [
      { counterpartyId: 'cp-low-history', avgDaysLate: 5, closedDocumentCount: 3 }, // < MIN (6)
      { counterpartyId: 'cp-good-history', avgDaysLate: 5, closedDocumentCount: 10 }, // >= MIN
    ];

    const projection = buildRecaudacionProjection([docNoBehavior, docLowHistory, docGoodHistory], cutoffIso, 'semana', behaviors);

    const totalContractual = projection.buckets.reduce((sum, b) => sum + b.contractual, 0);
    const totalAdjusted = projection.buckets.reduce((sum, b) => sum + b.adjusted, 0);
    expect(totalContractual).toBe(1000 + 500 + 2000);
    expect(totalAdjusted).toBe(2000); // solo docGoodHistory aporta a adjusted
    expect(projection.adjustedCoverageRatio).toBeCloseTo(2000 / 3500, 6);
  });

  it('adjustedSeriesAvailable: false bajo el umbral, true por encima', () => {
    const cutoffIso = '2026-07-25';
    const behaviorGood = { counterpartyId: 'cp-good', avgDaysLate: 3, closedDocumentCount: 10 };

    const lowCoverageDocs = [
      makeDoc({ id: 'lc1', counterpartyId: 'cp-good', balance: 100, dueDate: '2026-08-01' }),
      makeDoc({ id: 'lc2', counterpartyId: 'cp-no-history', balance: 900, dueDate: '2026-08-01' }),
    ];
    const lowCoverage = buildRecaudacionProjection(lowCoverageDocs, cutoffIso, 'semana', [behaviorGood]);
    expect(lowCoverage.adjustedCoverageRatio).toBeCloseTo(0.1, 6);
    expect(lowCoverage.adjustedSeriesAvailable).toBe(false);

    const highCoverageDocs = [
      makeDoc({ id: 'hc1', counterpartyId: 'cp-good', balance: 900, dueDate: '2026-08-01' }),
      makeDoc({ id: 'hc2', counterpartyId: 'cp-no-history', balance: 100, dueDate: '2026-08-01' }),
    ];
    const highCoverage = buildRecaudacionProjection(highCoverageDocs, cutoffIso, 'semana', [behaviorGood]);
    expect(highCoverage.adjustedCoverageRatio).toBeCloseTo(0.9, 6);
    expect(highCoverage.adjustedSeriesAvailable).toBe(true);
  });

  it('mora negativa (§8.F): el bucket ajustado es anterior o igual al contractual, sin truncar el monto', () => {
    const cutoffIso = '2026-07-25';
    const behaviors: CounterpartyBehavior[] = [{ counterpartyId: 'cp-adelantado', avgDaysLate: -10, closedDocumentCount: 8 }];
    const doc = makeDoc({ id: 'd-neg', counterpartyId: 'cp-adelantado', balance: 1234, dueDate: '2026-08-20' });

    const projection = buildRecaudacionProjection([doc], cutoffIso, 'semana', behaviors);

    const contractualIndex = projection.buckets.findIndex((b) => b.contractual > 0);
    const adjustedIndex = projection.buckets.findIndex((b) => b.adjusted > 0);

    expect(contractualIndex).toBeGreaterThanOrEqual(0);
    expect(adjustedIndex).toBeGreaterThanOrEqual(0);
    expect(adjustedIndex).toBeLessThanOrEqual(contractualIndex);
    expect(projection.buckets[adjustedIndex].adjusted).toBe(1234); // no se trunca a 0
    expect(projection.buckets[contractualIndex].contractual).toBe(1234);
  });

  it('genera 13 buckets semanales S1..S13 consecutivos sin huecos', () => {
    const cutoffIso = '2026-07-25';
    const projection = buildRecaudacionProjection([], cutoffIso, 'semana', []);

    expect(projection.buckets.length).toBe(13);
    expect(projection.buckets.map((b) => b.label)).toEqual(Array.from({ length: 13 }, (_, i) => `S${i + 1}`));
    expect(projection.buckets[0].startDate).toBe(addDaysIso(cutoffIso, 1));
    for (let i = 0; i < projection.buckets.length - 1; i++) {
      expect(addDaysIso(projection.buckets[i].endDate, 1)).toBe(projection.buckets[i + 1].startDate);
    }
  });

  it('genera 6 buckets mensuales con nombres correctos, consecutivos, desde el mes calendario siguiente', () => {
    const cutoffIso = '2026-07-25';
    const projection = buildRecaudacionProjection([], cutoffIso, 'mes', []);

    expect(projection.buckets.length).toBe(6);
    expect(projection.buckets.map((b) => b.label)).toEqual([
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
      'Enero',
    ]);
    expect(projection.buckets[0].startDate).toBe('2026-08-01');
    expect(projection.buckets[0].endDate).toBe('2026-08-31');
    expect(projection.buckets[5].startDate).toBe('2027-01-01');
    expect(projection.buckets[5].endDate).toBe('2027-01-31');
    for (let i = 0; i < projection.buckets.length - 1; i++) {
      expect(addDaysIso(projection.buckets[i].endDate, 1)).toBe(projection.buckets[i + 1].startDate);
    }
  });

  it('sobrepago (§8.A): balance < 0 no aporta a backlog, excluido ni buckets', () => {
    const cutoffIso = '2026-07-25';
    const overpaidVencido = makeDoc({ id: 'd-over-1', status: 'VENCIDO', balance: -500, dueDate: '2026-06-01' });
    const overpaidNoDue = makeDoc({ id: 'd-over-2', status: 'POR_VENCER', balance: -200, dueDate: null });
    const overpaidPorVencer = makeDoc({ id: 'd-over-3', status: 'POR_VENCER', balance: -50, dueDate: '2026-08-01' });

    const projection = buildRecaudacionProjection([overpaidVencido, overpaidNoDue, overpaidPorVencer], cutoffIso, 'semana', []);

    expect(projection.backlogOverdue).toBe(0);
    expect(projection.excludedNoDueDate).toBe(0);
    expect(projection.buckets.every((b) => b.contractual === 0 && b.adjusted === 0)).toBe(true);
  });
});
