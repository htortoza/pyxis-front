import { TestBed } from '@angular/core/testing';

import type { Counterparty, CounterpartyBehavior, ReceivableDocument } from '../models/collections.model';
import { COUNTERPARTIES, COUNTERPARTY_BEHAVIORS, UNMAPPED_COUNTERPARTY_ID } from '../mock/collections.mock';
import { CollectionsDataService } from '../../services/collections-data.service';
import { buildConcentrationRows } from './collections-concentration.utils';

/** Documento mínimo válido para armar casos de borde a mano -- solo los campos que
 * `buildConcentrationRows` efectivamente lee importan; el resto se completa con valores neutros. */
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

function makeBehavior(overrides: Partial<CounterpartyBehavior>): CounterpartyBehavior {
  return {
    counterpartyId: 'cp-1',
    avgDaysLate: 0,
    closedDocumentCount: 10,
    ...overrides,
  };
}

describe('buildConcentrationRows', () => {
  let service: CollectionsDataService;

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionsDataService);
  });

  it('rows.length coincide con la cantidad de contrapartes distintas presentes en documents (scope default)', () => {
    const documents = service.scopedDocuments();
    const { rows } = buildConcentrationRows(documents, COUNTERPARTIES, COUNTERPARTY_BEHAVIORS, 'saldo');

    const distinctCounterpartyIds = new Set(documents.map((d) => d.counterpartyId));
    expect(rows.length).toBe(distinctCounterpartyIds.size);
  });

  it('cuadra exactamente: suma de saldo de todas las filas === suma de balance de documents (scope default)', () => {
    const documents = service.scopedDocuments();
    const { rows } = buildConcentrationRows(documents, COUNTERPARTIES, COUNTERPARTY_BEHAVIORS, 'saldo');

    const rowsSum = rows.reduce((sum, r) => sum + r.saldo, 0);
    const documentsSum = documents.reduce((sum, d) => sum + d.balance, 0);
    expect(rowsSum).toBeCloseTo(documentsSum, 6);
  });

  describe('ordenamiento', () => {
    it("'saldo' ordena descendente por saldo", () => {
      const documents = service.scopedDocuments();
      const { rows } = buildConcentrationRows(documents, COUNTERPARTIES, COUNTERPARTY_BEHAVIORS, 'saldo');

      for (let i = 1; i < rows.length; i++) {
        expect(rows[i - 1].saldo).toBeGreaterThanOrEqual(rows[i].saldo);
      }
    });

    it("'saldoVencido' ordena descendente por saldoVencido", () => {
      const documents = service.scopedDocuments();
      const { rows } = buildConcentrationRows(documents, COUNTERPARTIES, COUNTERPARTY_BEHAVIORS, 'saldoVencido');

      for (let i = 1; i < rows.length; i++) {
        expect(rows[i - 1].saldoVencido).toBeGreaterThanOrEqual(rows[i].saldoVencido);
      }
    });

    it("'utilizacion' ordena descendente por utilizacionPct y empuja utilizacionPct:null al final", () => {
      const counterpartyA = makeCounterparty({ id: 'cp-a', label: 'A', creditLimit: 1000 }); // 50%
      const counterpartyB = makeCounterparty({ id: 'cp-b', label: 'B', creditLimit: 500 }); // 160%
      const counterpartyC = makeCounterparty({ id: 'cp-c', label: 'C', creditLimit: null }); // null

      const documents = [
        makeDoc({ id: 'd-a', counterpartyId: 'cp-a', balance: 500 }),
        makeDoc({ id: 'd-b', counterpartyId: 'cp-b', balance: 800 }),
        makeDoc({ id: 'd-c', counterpartyId: 'cp-c', balance: 2000 }), // saldo mayor, pero null va al final
      ];

      const { rows } = buildConcentrationRows(
        documents,
        [counterpartyA, counterpartyB, counterpartyC],
        [],
        'utilizacion',
      );

      expect(rows.map((r) => r.counterpartyId)).toEqual(['cp-b', 'cp-a', 'cp-c']);
      expect(rows[rows.length - 1].utilizacionPct).toBeNull();
    });
  });

  describe('highestRisk', () => {
    it('elige la de mayor saldo ENTRE las que cumplen sobre-límite + mora positiva, no la de mayor saldo absoluto', () => {
      const lowBalanceAtRisk = makeCounterparty({ id: 'cp-low-risk', label: 'Riesgo bajo saldo', creditLimit: 100 });
      const highBalanceAtRisk = makeCounterparty({ id: 'cp-high-risk', label: 'Riesgo alto saldo', creditLimit: 100 });
      const highestBalanceNoRisk = makeCounterparty({ id: 'cp-no-risk', label: 'Sin riesgo', creditLimit: 100 });

      const documents = [
        makeDoc({ id: 'd-low', counterpartyId: 'cp-low-risk', balance: 200 }), // 200% utilización
        makeDoc({ id: 'd-high', counterpartyId: 'cp-high-risk', balance: 500 }), // 500% utilización
        makeDoc({ id: 'd-none', counterpartyId: 'cp-no-risk', balance: 900 }), // saldo más alto de todos, pero sin mora
      ];

      const behaviors = [
        makeBehavior({ counterpartyId: 'cp-low-risk', avgDaysLate: 5 }),
        makeBehavior({ counterpartyId: 'cp-high-risk', avgDaysLate: 10 }),
        makeBehavior({ counterpartyId: 'cp-no-risk', avgDaysLate: 0 }), // sin mora -- no cumple
      ];

      const { highestRisk } = buildConcentrationRows(
        documents,
        [lowBalanceAtRisk, highBalanceAtRisk, highestBalanceNoRisk],
        behaviors,
        'saldo',
      );

      expect(highestRisk).not.toBeNull();
      expect(highestRisk!.counterpartyId).toBe('cp-high-risk');
    });

    it('es null cuando ninguna contraparte cumple las 3 condiciones simultáneamente', () => {
      const overLimitNoLateness = makeCounterparty({ id: 'cp-a', label: 'A', creditLimit: 100 });
      const lateNoOverLimit = makeCounterparty({ id: 'cp-b', label: 'B', creditLimit: 1000 });

      const documents = [
        makeDoc({ id: 'd-a', counterpartyId: 'cp-a', balance: 200 }), // sobre-límite pero sin mora
        makeDoc({ id: 'd-b', counterpartyId: 'cp-b', balance: 100 }), // mora pero no sobre-límite
      ];

      const behaviors = [
        makeBehavior({ counterpartyId: 'cp-a', avgDaysLate: 0 }),
        makeBehavior({ counterpartyId: 'cp-b', avgDaysLate: 15 }),
      ];

      const { highestRisk } = buildConcentrationRows(
        documents,
        [overLimitNoLateness, lateNoOverLimit],
        behaviors,
        'saldo',
      );

      expect(highestRisk).toBeNull();
    });
  });

  it('documento con counterpartyId no mapeado (§8.C) genera una fila con label "Contraparte no mapeada"', () => {
    const documents = [makeDoc({ id: 'd-unmapped', counterpartyId: UNMAPPED_COUNTERPARTY_ID, balance: 300 })];

    const { rows } = buildConcentrationRows(documents, COUNTERPARTIES, COUNTERPARTY_BEHAVIORS, 'saldo');

    expect(rows.length).toBe(1);
    expect(rows[0].counterpartyId).toBe(UNMAPPED_COUNTERPARTY_ID);
    expect(rows[0].label).toBe('Contraparte no mapeada');
  });
});
