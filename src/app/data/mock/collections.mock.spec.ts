import {
  COLLECTION_TARGETS,
  COUNTERPARTIES,
  COUNTERPARTY_BEHAVIORS,
  PERIOD_SALES_TOTAL_CLP,
  RECEIVABLE_DOCUMENTS,
  TODAY_ISO,
  UNMAPPED_COUNTERPARTY_ID,
  generateCollectionsMockData,
} from './collections.mock';
import { PERIODS_MES } from './periods.mock';
import { SALES_FACTS } from './sales-facts.mock';

/** Grupos por counterpartyId, usado por varias aserciones (concentración, mora). */
function balanceByCounterparty(): Map<string, number> {
  const totals = new Map<string, number>();
  for (const doc of RECEIVABLE_DOCUMENTS) {
    totals.set(doc.counterpartyId, (totals.get(doc.counterpartyId) ?? 0) + doc.balance);
  }
  return totals;
}

describe('collections.mock', () => {
  describe('determinismo', () => {
    it('produce un tamaño de universo fijo de contrapartes (no depende de Math.random ni del reloj)', () => {
      // El tamaño no es fruto del stream rng -- es la suma de listas fijas de nombres reales
      // (adquirentes/gift card/convenios/agregadores/cuentas corporativas) + un lote procedural
      // de tamaño fijo de CLIENTE_CREDITO. Si esto cambiara entre corridas, el generador estaría
      // usando algo no determinista.
      expect(COUNTERPARTIES.length).toBeGreaterThanOrEqual(30);
      expect(COUNTERPARTIES.length).toBeLessThanOrEqual(60);
    });

    it('es reproducible: invocar el generador dos veces produce arrays byte-idénticos', () => {
      // Prueba real de determinismo (no solo "el módulo es un singleton"): se re-invoca la misma
      // función generadora -- si usara Date.now()/Math.random() o cualquier estado externo, el
      // segundo JSON.stringify divergiría del primero.
      const first = generateCollectionsMockData();
      const second = generateCollectionsMockData();
      expect(JSON.stringify(second.counterparties)).toBe(JSON.stringify(first.counterparties));
      expect(JSON.stringify(second.documents)).toBe(JSON.stringify(first.documents));
      expect(JSON.stringify(second.behaviors)).toBe(JSON.stringify(first.behaviors));
      expect(second.periodSalesTotalClp).toEqual(first.periodSalesTotalClp);
    });

    it('golden numbers -- tamaños fijos que detectan una regresión de determinismo si cambian entre corridas', () => {
      expect(COUNTERPARTIES.length).toBe(45);
      expect(COUNTERPARTY_BEHAVIORS.length).toBe(45);
      expect(COUNTERPARTIES[0].id).toBe('cp-adquirente-01');
      expect(RECEIVABLE_DOCUMENTS.length).toBeGreaterThan(0);
    });
  });

  it('balance = grossAmount - appliedAmount - creditNoteAmount para todo documento', () => {
    for (const doc of RECEIVABLE_DOCUMENTS) {
      expect(doc.balance).toBe(doc.grossAmount - doc.appliedAmount - doc.creditNoteAmount);
    }
  });

  describe('paidDate', () => {
    it('todo documento PAGADO tiene paidDate no-null, entre issueDate y TODAY_ISO', () => {
      const paid = RECEIVABLE_DOCUMENTS.filter((doc) => doc.status === 'PAGADO');
      expect(paid.length).toBeGreaterThan(0);
      for (const doc of paid) {
        expect(doc.paidDate).not.toBeNull();
        const paidDate = doc.paidDate as string;
        expect(paidDate >= doc.issueDate).toBe(true);
        expect(paidDate <= TODAY_ISO).toBe(true);
      }
    });

    it('todo documento no-PAGADO tiene paidDate === null', () => {
      const open = RECEIVABLE_DOCUMENTS.filter((doc) => doc.status !== 'PAGADO');
      expect(open.length).toBeGreaterThan(0);
      expect(open.every((doc) => doc.paidDate === null)).toBe(true);
    });
  });

  it('existe al menos 1 documento sin dueDate', () => {
    expect(RECEIVABLE_DOCUMENTS.some((doc) => doc.dueDate === null)).toBe(true);
  });

  it('existe al menos 1 sobrepago (balance negativo)', () => {
    expect(RECEIVABLE_DOCUMENTS.some((doc) => doc.balance < 0)).toBe(true);
    expect(RECEIVABLE_DOCUMENTS.some((doc) => doc.appliedAmount > doc.grossAmount)).toBe(true);
  });

  it('existe al menos 1 documento con counterpartyId no mapeado (no presente en COUNTERPARTIES)', () => {
    const knownIds = new Set(COUNTERPARTIES.map((c) => c.id));
    const unmapped = RECEIVABLE_DOCUMENTS.filter((doc) => !knownIds.has(doc.counterpartyId));
    expect(unmapped.length).toBeGreaterThanOrEqual(1);
    expect(unmapped.some((doc) => doc.counterpartyId === UNMAPPED_COUNTERPARTY_ID)).toBe(true);
  });

  it('concentración Zipf: la contraparte de mayor saldo es >= 1.5x la segunda', () => {
    const totals = balanceByCounterparty();
    const sorted = [...totals.values()].sort((a, b) => b - a);
    expect(sorted.length).toBeGreaterThan(2);
    expect(sorted[0]).toBeGreaterThanOrEqual(sorted[1] * 1.5);
  });

  it('mezcla de los 6 counterpartyType', () => {
    const types = new Set(COUNTERPARTIES.map((c) => c.type));
    expect(types.size).toBe(6);
    for (const type of ['CLIENTE_CREDITO', 'ADQUIRENTE', 'GIFT_CARD', 'CONVENIO', 'AGREGADOR', 'CUENTA_CORPORATIVA']) {
      expect(types.has(type as any)).toBe(true);
    }
  });

  it('algunas contrapartes tienen commercialNodeIds vacío (sin asociación comercial)', () => {
    expect(COUNTERPARTIES.some((c) => c.commercialNodeIds.length === 0)).toBe(true);
    // pero igual deben listarse -- tienen societaryNodeId siempre.
    expect(COUNTERPARTIES.every((c) => !!c.societaryNodeId)).toBe(true);
  });

  it('algunas contrapartes tienen creditLimit=null y algunas creditTermDays=null', () => {
    expect(COUNTERPARTIES.some((c) => c.creditLimit === null)).toBe(true);
    expect(COUNTERPARTIES.some((c) => c.creditTermDays === null)).toBe(true);
  });

  describe('COUNTERPARTY_BEHAVIORS', () => {
    it('tiene una entrada por contraparte real, con closedDocumentCount y avgDaysLate variados', () => {
      expect(COUNTERPARTY_BEHAVIORS.length).toBe(COUNTERPARTIES.length);
      expect(COUNTERPARTY_BEHAVIORS.some((b) => b.closedDocumentCount >= 6)).toBe(true);
      expect(COUNTERPARTY_BEHAVIORS.some((b) => b.closedDocumentCount < 6)).toBe(true);
      expect(COUNTERPARTY_BEHAVIORS.some((b) => b.avgDaysLate < 0)).toBe(true);
    });
  });

  describe('COLLECTION_TARGETS', () => {
    it('define al menos un target global y algunos por nodo, con campos opcionales en null', () => {
      expect(COLLECTION_TARGETS.length).toBeGreaterThanOrEqual(2);
      expect(
        COLLECTION_TARGETS.some((t) => t.dsoTarget === null || t.overdueRatioTarget === null || t.ceiTarget === null),
      ).toBe(true);
    });
  });

  describe('PERIOD_SALES_TOTAL_CLP', () => {
    it('trae una entrada por periodo mensual y cuadra con la suma real de SALES_FACTS de ese periodo', () => {
      expect(Object.keys(PERIOD_SALES_TOTAL_CLP).length).toBe(PERIODS_MES.length);
      const sample = PERIODS_MES[10]; // periodo intermedio cualquiera, no el primero/último (casos borde)
      const expected = SALES_FACTS.filter((f) => f.date >= sample.startDate && f.date <= sample.endDate).reduce(
        (sum, f) => sum + f.amount,
        0,
      );
      expect(PERIOD_SALES_TOTAL_CLP[sample.id]).toBe(expected);
    });
  });
});
