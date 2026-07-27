import { TestBed } from '@angular/core/testing';

import type { Counterparty, ReceivableDocument } from '../models/collections.model';
import { COUNTERPARTIES, UNMAPPED_COUNTERPARTY_ID } from '../mock/collections.mock';
import { CollectionsDataService } from '../../services/collections-data.service';
import { squarify } from './sales-detail-treemap.utils';
import {
  buildCollectionsTreemapBand,
  LONG_TAIL_THRESHOLD_PCT,
  MAX_MAIN_BLOCKS,
  type CollectionsTreemapBlock,
  type CollectionsTreemapEntry,
  type CollectionsTreemapLongTailBlock,
} from './collections-detail-treemap.utils';

/** Documento mínimo válido para armar casos de borde a mano -- solo los campos que
 * `buildCollectionsTreemapBand` efectivamente lee importan; el resto se completa con valores
 * neutros (mismo patrón que `collections-concentration.utils.spec.ts`). */
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

function isBlock(entry: CollectionsTreemapEntry): entry is CollectionsTreemapBlock {
  return entry.isLongTail === false;
}

function isLongTail(entry: CollectionsTreemapEntry): entry is CollectionsTreemapLongTailBlock {
  return entry.isLongTail === true;
}

describe('buildCollectionsTreemapBand', () => {
  let service: CollectionsDataService;

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionsDataService);
  });

  it('cuadra exactamente: suma de saldo de todos los entries (blocks + long-tail) === suma de balance de documents (scope default)', () => {
    const documents = service.scopedDocuments();
    const entries = buildCollectionsTreemapBand(documents, COUNTERPARTIES);

    const entriesSum = entries.reduce((sum, e) => sum + e.saldo, 0);
    const documentsSum = documents.reduce((sum, d) => sum + d.balance, 0);
    expect(entriesSum).toBeCloseTo(documentsSum, 6);
  });

  it('los bloques principales quedan ordenados descendente por saldo (scope default)', () => {
    const documents = service.scopedDocuments();
    const entries = buildCollectionsTreemapBand(documents, COUNTERPARTIES);
    const mainBlocks = entries.filter(isBlock);

    for (let i = 1; i < mainBlocks.length; i++) {
      expect(mainBlocks[i - 1].saldo).toBeGreaterThanOrEqual(mainBlocks[i].saldo);
    }
  });

  it('nunca hay más de MAX_MAIN_BLOCKS bloques principales, el resto cae en long-tail (scope default)', () => {
    const documents = service.scopedDocuments();
    const entries = buildCollectionsTreemapBand(documents, COUNTERPARTIES);
    const mainBlocks = entries.filter(isBlock);

    expect(mainBlocks.length).toBeLessThanOrEqual(MAX_MAIN_BLOCKS);
  });

  it('agrupa por counterpartyId: cada contraparte distinta de documents produce a lo sumo 1 bloque propio o 1 item dentro del long-tail', () => {
    const documents = service.scopedDocuments();
    const entries = buildCollectionsTreemapBand(documents, COUNTERPARTIES);

    const distinctCounterpartyIds = new Set(documents.map((d) => d.counterpartyId));
    const longTail = entries.find(isLongTail);
    const mainIds = entries.filter(isBlock).map((b) => b.id);
    const tailIds = longTail ? longTail.items.map((i) => i.id) : [];

    expect(new Set([...mainIds, ...tailIds]).size).toBe(distinctCounterpartyIds.size);
  });

  it('bloques bajo el umbral del 1% se agrupan en long-tail', () => {
    // 1 contraparte grande (99%) + 3 contrapartes diminutas, cada una bien bajo el 1% del total.
    const big = makeCounterparty({ id: 'cp-big', label: 'Grande' });
    const tiny1 = makeCounterparty({ id: 'cp-tiny-1', label: 'Diminuta 1' });
    const tiny2 = makeCounterparty({ id: 'cp-tiny-2', label: 'Diminuta 2' });
    const tiny3 = makeCounterparty({ id: 'cp-tiny-3', label: 'Diminuta 3' });

    const documents = [
      makeDoc({ id: 'd-big', counterpartyId: 'cp-big', balance: 1_940_000 }),
      makeDoc({ id: 'd-tiny-1', counterpartyId: 'cp-tiny-1', balance: 10_000 }), // ~0.51% del total
      makeDoc({ id: 'd-tiny-2', counterpartyId: 'cp-tiny-2', balance: 10_000 }),
      makeDoc({ id: 'd-tiny-3', counterpartyId: 'cp-tiny-3', balance: 10_000 }),
    ];

    const entries = buildCollectionsTreemapBand(documents, [big, tiny1, tiny2, tiny3]);

    const longTail = entries.find(isLongTail);
    expect(longTail).toBeTruthy();
    expect(longTail!.items.length).toBe(3);
    const mainBlocks = entries.filter(isBlock);
    expect(mainBlocks.map((b) => b.id)).toEqual(['cp-big']);
  });

  it('bloques más allá del rank 8 caen en long-tail aunque individualmente superen el 1%', () => {
    // 10 contrapartes de saldo similar (10% cada una) -- todas superan el 1%, pero solo las 8
    // primeras (por saldo desc) deben ser bloques principales.
    const counterparties: Counterparty[] = [];
    const documents: ReceivableDocument[] = [];
    for (let i = 0; i < 10; i++) {
      const id = `cp-${i}`;
      counterparties.push(makeCounterparty({ id, label: `Contraparte ${i}` }));
      // Saldos estrictamente decrecientes para que el orden sea determinístico y sin empates.
      documents.push(makeDoc({ id: `d-${i}`, counterpartyId: id, balance: 100_000 - i * 1_000 }));
    }

    const entries = buildCollectionsTreemapBand(documents, counterparties);
    const mainBlocks = entries.filter(isBlock);
    const longTail = entries.find(isLongTail);

    expect(mainBlocks.length).toBe(MAX_MAIN_BLOCKS);
    expect(mainBlocks.map((b) => b.id)).toEqual(['cp-0', 'cp-1', 'cp-2', 'cp-3', 'cp-4', 'cp-5', 'cp-6', 'cp-7']);
    expect(longTail).toBeTruthy();
    expect(longTail!.items.map((i) => i.id)).toEqual(['cp-8', 'cp-9']);
  });

  it('promoción de 1 solo item: si exactamente 1 contraparte cae bajo el umbral, aparece como bloque propio, no como "+1 más"', () => {
    const big = makeCounterparty({ id: 'cp-big', label: 'Grande' });
    const single = makeCounterparty({ id: 'cp-single', label: 'Única cola' });

    const documents = [
      makeDoc({ id: 'd-big', counterpartyId: 'cp-big', balance: 995_000 }),
      makeDoc({ id: 'd-single', counterpartyId: 'cp-single', balance: 5_000 }), // 0.5% del total: claramente bajo el umbral del 1%
    ];

    const entries = buildCollectionsTreemapBand(documents, [big, single]);

    expect(entries.some((e) => e.isLongTail)).toBe(false);
    const mainBlocks = entries.filter(isBlock);
    expect(mainBlocks.map((b) => b.id)).toEqual(['cp-big', 'cp-single']);
  });

  it('utiliza LONG_TAIL_THRESHOLD_PCT=1 (mismo umbral que Ventas)', () => {
    expect(LONG_TAIL_THRESHOLD_PCT).toBe(1);
  });

  it('avgDaysOverdueWeighted: promedio ponderado por balance sobre los documentos abiertos de la contraparte', () => {
    const cp = makeCounterparty({ id: 'cp-1' });
    const documents = [
      makeDoc({ id: 'd-1', counterpartyId: 'cp-1', balance: 300, daysOverdue: 10, status: 'VENCIDO' }),
      makeDoc({ id: 'd-2', counterpartyId: 'cp-1', balance: 700, daysOverdue: 0, status: 'POR_VENCER' }),
    ];

    const entries = buildCollectionsTreemapBand(documents, [cp]);
    const block = entries.filter(isBlock).find((b) => b.id === 'cp-1');

    // (300*10 + 700*0) / 1000 = 3
    expect(block!.avgDaysOverdueWeighted).toBeCloseTo(3, 6);
  });

  it('contraparte no mapeada (§8.C): documento con counterpartyId inexistente genera un bloque con label "Contraparte no mapeada"', () => {
    const documents = [makeDoc({ id: 'd-unmapped', counterpartyId: UNMAPPED_COUNTERPARTY_ID, balance: 5000 })];

    const entries = buildCollectionsTreemapBand(documents, COUNTERPARTIES);
    const block = entries.filter(isBlock).find((b) => b.id === UNMAPPED_COUNTERPARTY_ID);

    expect(block).toBeTruthy();
    expect(block!.label).toBe('Contraparte no mapeada');
  });

  it('documents vacío produce una banda vacía', () => {
    expect(buildCollectionsTreemapBand([], COUNTERPARTIES)).toEqual([]);
  });

  it('humo: squarify (importado tal cual de Ventas) sigue funcionando con los valores de saldo de la banda, llenando el contenedor', () => {
    const documents = service.scopedDocuments();
    const entries = buildCollectionsTreemapBand(documents, COUNTERPARTIES);
    const container = { x: 0, y: 0, width: 800, height: 600 };

    const rects = squarify(
      entries.map((e) => e.saldo),
      container,
    );

    expect(rects.length).toBe(entries.length);
    const totalArea = rects.reduce((sum, r) => sum + r.width * r.height, 0);
    expect(totalArea).toBeCloseTo(container.width * container.height, 3);
  });
});
