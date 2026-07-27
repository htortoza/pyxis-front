import type { ReceivableDocument } from '../models/collections.model';
import { documentStateAsOf } from './collections-history.utils';

function buildDoc(overrides: Partial<ReceivableDocument>): ReceivableDocument {
  return {
    id: 'doc-test-1',
    externalRef: 'F-100001',
    counterpartyId: 'cp-test-01',
    issueDate: '2026-01-01',
    dueDate: '2026-02-01',
    grossAmount: 1_000_000,
    netAmount: 840_336,
    appliedAmount: 0,
    creditNoteAmount: 0,
    balance: 1_000_000,
    status: 'POR_VENCER',
    daysOverdue: 0,
    currency: 'CLP',
    paidDate: null,
    ...overrides,
  };
}

describe('documentStateAsOf', () => {
  it('devuelve null si el documento aún no había sido emitido al corte (issueDate > cutoffIso)', () => {
    const doc = buildDoc({ issueDate: '2026-03-01' });
    expect(documentStateAsOf(doc, '2026-02-15')).toBeNull();
  });

  it('incluye el documento cuando issueDate === cutoffIso (borde, no excluido)', () => {
    const doc = buildDoc({ issueDate: '2026-02-15', dueDate: '2026-03-01' });
    expect(documentStateAsOf(doc, '2026-02-15')).not.toBeNull();
  });

  it('devuelve null si el documento ya estaba pagado ANTES del corte (paidDate <= cutoffIso)', () => {
    const doc = buildDoc({ status: 'PAGADO', paidDate: '2026-02-01', dueDate: '2026-02-10' });
    expect(documentStateAsOf(doc, '2026-02-15')).toBeNull();
  });

  it('devuelve null en el borde exacto paidDate === cutoffIso (ya saldado ese mismo día)', () => {
    const doc = buildDoc({ status: 'PAGADO', paidDate: '2026-02-15', dueDate: '2026-02-10' });
    expect(documentStateAsOf(doc, '2026-02-15')).toBeNull();
  });

  it('reconstruye POR_VENCER para un documento pagado hoy pero cuyo paidDate es POSTERIOR al corte, si su dueDate aún no vencía', () => {
    const doc = buildDoc({
      status: 'PAGADO',
      dueDate: '2026-03-01',
      paidDate: '2026-02-20', // se pagó DESPUÉS del corte histórico de abajo
    });
    const state = documentStateAsOf(doc, '2026-02-10');
    expect(state).not.toBeNull();
    expect(state!.status).toBe('POR_VENCER');
    expect(state!.daysOverdue).toBe(0);
  });

  it('reconstruye VENCIDO con daysOverdue recalculado para un documento pagado hoy pero cuyo paidDate es posterior al corte, si dueDate ya había pasado', () => {
    const doc = buildDoc({
      status: 'PAGADO',
      dueDate: '2026-01-15',
      paidDate: '2026-02-20',
    });
    const state = documentStateAsOf(doc, '2026-02-10');
    expect(state).not.toBeNull();
    expect(state!.status).toBe('VENCIDO');
    expect(state!.daysOverdue).toBe(26); // 2026-01-15 -> 2026-02-10
  });

  it('POR_VENCER cuando dueDate es null, sin importar el corte', () => {
    const doc = buildDoc({ dueDate: null });
    const state = documentStateAsOf(doc, '2027-01-01');
    expect(state).toEqual({ status: 'POR_VENCER', daysOverdue: 0, balance: doc.balance });
  });

  it('POR_VENCER cuando dueDate === cutoffIso (borde: vence justo ese día, todavía no vencido)', () => {
    const doc = buildDoc({ dueDate: '2026-02-15' });
    const state = documentStateAsOf(doc, '2026-02-15');
    expect(state).toEqual({ status: 'POR_VENCER', daysOverdue: 0, balance: doc.balance });
  });

  it('VENCIDO cuando dueDate < cutoffIso, con daysOverdue = diferencia calendario exacta', () => {
    const doc = buildDoc({ dueDate: '2026-01-01' });
    const state = documentStateAsOf(doc, '2026-01-31');
    expect(state).toEqual({ status: 'VENCIDO', daysOverdue: 30, balance: doc.balance });
  });

  it('conserva el balance del documento sin recalcularlo (no modela pagos parciales por fecha)', () => {
    const doc = buildDoc({ dueDate: '2026-01-01', balance: 456_789 });
    const state = documentStateAsOf(doc, '2026-01-31');
    expect(state!.balance).toBe(456_789);
  });

  it('ignora el status/daysOverdue horneados del documento -- siempre recalcula desde dueDate/cutoffIso', () => {
    // status horneado dice POR_VENCER pero el dueDate ya pasó respecto al corte -- debe ganar el recálculo.
    const doc = buildDoc({ status: 'POR_VENCER', daysOverdue: 0, dueDate: '2025-12-01' });
    const state = documentStateAsOf(doc, '2026-01-10');
    expect(state!.status).toBe('VENCIDO');
    expect(state!.daysOverdue).toBe(40);
  });
});
