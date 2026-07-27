import { TestBed } from '@angular/core/testing';

import type { Counterparty, ReceivableDocument } from '../models/collections.model';
import { COUNTERPARTIES, UNMAPPED_COUNTERPARTY_ID } from '../mock/collections.mock';
import { CollectionsDataService } from '../../services/collections-data.service';
import { buildCollectionsDetailTree } from './collections-detail-tree.utils';

/** Documento mínimo válido para armar casos de borde a mano -- solo los campos que
 * `buildCollectionsDetailTree` efectivamente lee importan; el resto se completa con valores
 * neutros. */
function makeDoc(overrides: Partial<ReceivableDocument>): ReceivableDocument {
  return {
    id: 'doc-1',
    externalRef: 'F-1',
    counterpartyId: 'cp-1',
    issueDate: '2026-01-01',
    dueDate: '2026-02-01',
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

function makeCounterparty(overrides: Partial<Counterparty>): Counterparty {
  return {
    id: 'cp-1',
    label: 'Contraparte 1',
    type: 'CLIENTE_CREDITO',
    societaryNodeId: 'node-1',
    commercialNodeIds: [],
    creditLimit: 1000,
    creditTermDays: 30,
    currency: 'CLP',
    ...overrides,
  };
}

const CUTOFF_ISO = '2026-06-01';

describe('buildCollectionsDetailTree', () => {
  let service: CollectionsDataService;

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionsDataService);
  });

  it('cuadra exactamente: suma de saldo de todas las filas === saldoTotalFromScope() (scope default, includeZeroBalance: true)', () => {
    const documents = service.scopedDocuments();
    const { rows } = buildCollectionsDetailTree(documents, COUNTERPARTIES, service.cutoffDate(), true);

    const rowsSum = rows.reduce((sum, r) => sum + r.saldo, 0);
    expect(rowsSum).toBeCloseTo(service.saldoTotalFromScope(), 6);
  });

  it('totals.saldo cuadra con la misma suma', () => {
    const documents = service.scopedDocuments();
    const { totals } = buildCollectionsDetailTree(documents, COUNTERPARTIES, service.cutoffDate(), true);

    expect(totals.saldo).toBeCloseTo(service.saldoTotalFromScope(), 6);
  });

  it('cada documento aparece en exactamente 1 fila (includeZeroBalance: true)', () => {
    const documents = service.scopedDocuments();
    const { rows } = buildCollectionsDetailTree(documents, COUNTERPARTIES, service.cutoffDate(), true);

    const totalDocumentRows = rows.reduce((sum, r) => sum + r.documents.length, 0);
    expect(totalDocumentRows).toBe(documents.length);
  });

  describe('orden default: descendente por saldo vencido', () => {
    it('monotonía sobre datos reales (scope default)', () => {
      const documents = service.scopedDocuments();
      const { rows } = buildCollectionsDetailTree(documents, COUNTERPARTIES, service.cutoffDate(), true);

      const overdueTotal = (row: (typeof rows)[number]) =>
        row.bucketAmounts.VENCIDO_1_30 +
        row.bucketAmounts.VENCIDO_31_60 +
        row.bucketAmounts.VENCIDO_61_90 +
        row.bucketAmounts.VENCIDO_90_PLUS;

      for (let i = 1; i < rows.length; i++) {
        expect(overdueTotal(rows[i - 1])).toBeGreaterThanOrEqual(overdueTotal(rows[i]));
      }
    });

    it('caso a mano: saldo total mayor pero saldo vencido menor queda DESPUÉS de una con saldo total menor pero más vencido', () => {
      const counterpartyHighTotalLowOverdue = makeCounterparty({ id: 'cp-high-total', label: 'Alto total' });
      const counterpartyLowTotalHighOverdue = makeCounterparty({ id: 'cp-high-overdue', label: 'Alto vencido' });

      const documents = [
        // Saldo total 5000, todo por vencer -- nada vencido.
        makeDoc({
          id: 'd-high-total',
          counterpartyId: 'cp-high-total',
          status: 'POR_VENCER',
          balance: 5000,
          dueDate: '2026-07-01',
        }),
        // Saldo total 1000, todo vencido 1-30 días.
        makeDoc({
          id: 'd-high-overdue',
          counterpartyId: 'cp-high-overdue',
          status: 'VENCIDO',
          balance: 1000,
          daysOverdue: 10,
          dueDate: '2026-05-01',
        }),
      ];

      const { rows } = buildCollectionsDetailTree(
        documents,
        [counterpartyHighTotalLowOverdue, counterpartyLowTotalHighOverdue],
        CUTOFF_ISO,
        true,
      );

      expect(rows.map((r) => r.counterpartyId)).toEqual(['cp-high-overdue', 'cp-high-total']);
    });
  });

  it('includeZeroBalance: false excluye filas con saldo === 0 en todos los tramos', () => {
    const counterpartyZero = makeCounterparty({ id: 'cp-zero', label: 'Saldo cero' });
    const counterpartyNonZero = makeCounterparty({ id: 'cp-nonzero', label: 'Con saldo' });

    const documents = [
      // appliedAmount === grossAmount exacto -- balance queda en 0.
      makeDoc({
        id: 'd-zero',
        counterpartyId: 'cp-zero',
        grossAmount: 1000,
        appliedAmount: 1000,
        creditNoteAmount: 0,
        balance: 0,
      }),
      makeDoc({ id: 'd-nonzero', counterpartyId: 'cp-nonzero', balance: 500 }),
    ];

    const { rows: rowsWithZero } = buildCollectionsDetailTree(
      documents,
      [counterpartyZero, counterpartyNonZero],
      CUTOFF_ISO,
      true,
    );
    expect(rowsWithZero.map((r) => r.counterpartyId).sort()).toEqual(['cp-nonzero', 'cp-zero']);

    const { rows: rowsWithoutZero } = buildCollectionsDetailTree(
      documents,
      [counterpartyZero, counterpartyNonZero],
      CUTOFF_ISO,
      false,
    );
    expect(rowsWithoutZero.map((r) => r.counterpartyId)).toEqual(['cp-nonzero']);
  });

  it('documento con counterpartyId no mapeado (§8.C) genera una fila con label "Contraparte no mapeada", no se descarta', () => {
    const documents = [makeDoc({ id: 'd-unmapped', counterpartyId: UNMAPPED_COUNTERPARTY_ID, balance: 300 })];

    const { rows } = buildCollectionsDetailTree(documents, COUNTERPARTIES, CUTOFF_ISO, true);

    expect(rows.length).toBe(1);
    expect(rows[0].counterpartyId).toBe(UNMAPPED_COUNTERPARTY_ID);
    expect(rows[0].label).toBe('Contraparte no mapeada');
  });

  it('creditLimit/creditTermDays/utilizacionPct son null cuando el maestro no los define', () => {
    const counterparty = makeCounterparty({
      id: 'cp-no-limit',
      label: 'Sin límite',
      creditLimit: null,
      creditTermDays: null,
    });
    const documents = [makeDoc({ id: 'd-1', counterpartyId: 'cp-no-limit', balance: 700 })];

    const { rows } = buildCollectionsDetailTree(documents, [counterparty], CUTOFF_ISO, true);

    expect(rows.length).toBe(1);
    expect(rows[0].creditLimit).toBeNull();
    expect(rows[0].creditTermDays).toBeNull();
    expect(rows[0].utilizacionPct).toBeNull();
  });

  it('avgDaysOverdueWeighted pondera daysOverdue por balance, con POR_VENCER aportando 0', () => {
    const counterparty = makeCounterparty({ id: 'cp-mix', label: 'Mixta' });
    const documents = [
      // 600 vencido con 20 días de mora, 400 por vencer con 0 días -- promedio ponderado: (600*20 + 400*0) / 1000 = 12
      makeDoc({ id: 'd-overdue', counterpartyId: 'cp-mix', status: 'VENCIDO', balance: 600, daysOverdue: 20 }),
      makeDoc({ id: 'd-current', counterpartyId: 'cp-mix', status: 'POR_VENCER', balance: 400, daysOverdue: 0 }),
    ];

    const { rows } = buildCollectionsDetailTree(documents, [counterparty], CUTOFF_ISO, true);

    expect(rows.length).toBe(1);
    expect(rows[0].avgDaysOverdueWeighted).toBeCloseTo(12, 6);
  });
});
