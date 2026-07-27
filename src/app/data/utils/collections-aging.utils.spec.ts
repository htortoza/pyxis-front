import { TestBed } from '@angular/core/testing';

import type { ReceivableDocument } from '../models/collections.model';
import { CollectionsDataService } from '../../services/collections-data.service';
import { buildAgingBuckets, DEFAULT_AGING_BUCKET_CONFIG } from './collections-aging.utils';

/** Documento mínimo válido para armar casos de borde a mano -- solo los campos que
 * `buildAgingBuckets`/`classify` efectivamente leen importan para estos tests; el resto se completa
 * con valores neutros. */
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

describe('buildAgingBuckets', () => {
  let service: CollectionsDataService;

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionsDataService);
  });

  it('cuadra exactamente: suma de buckets === suma de balances de scopedDocuments (scope default)', () => {
    const documents = service.scopedDocuments();
    const cutoffIso = service.cutoffDate();

    const { buckets } = buildAgingBuckets(documents, cutoffIso);

    const bucketsSum = buckets.reduce((sum, b) => sum + b.amount, 0);
    const documentsSum = documents.reduce((sum, d) => sum + d.balance, 0);
    expect(bucketsSum).toBeCloseTo(documentsSum, 6);
  });

  it('NO_DUE_DATE no está vacío bajo el scope default (SP1 garantizó >=1 doc sin dueDate)', () => {
    const documents = service.scopedDocuments();
    const cutoffIso = service.cutoffDate();

    const { buckets } = buildAgingBuckets(documents, cutoffIso);

    const noDueDate = buckets.find((b) => b.key === 'NO_DUE_DATE')!;
    expect(noDueDate.documentCount).toBeGreaterThan(0);
  });

  it('cada documento cae en exactamente 1 tramo: suma de documentCount === documents.length', () => {
    const documents = service.scopedDocuments();
    const cutoffIso = service.cutoffDate();

    const { buckets } = buildAgingBuckets(documents, cutoffIso);

    const totalCount = buckets.reduce((sum, b) => sum + b.documentCount, 0);
    expect(totalCount).toBe(documents.length);
  });

  it('boundary exacto de mora vencida: 30 días cae en VENCIDO_1_30, 31 días en VENCIDO_31_60', () => {
    const cutoffIso = '2026-07-25';
    const docAt30 = makeDoc({ id: 'd30', status: 'VENCIDO', daysOverdue: 30, dueDate: '2026-06-25' });
    const docAt31 = makeDoc({ id: 'd31', status: 'VENCIDO', daysOverdue: 31, dueDate: '2026-06-24' });

    const { buckets } = buildAgingBuckets([docAt30, docAt31], cutoffIso);

    const vencido1_30 = buckets.find((b) => b.key === 'VENCIDO_1_30')!;
    const vencido31_60 = buckets.find((b) => b.key === 'VENCIDO_31_60')!;
    expect(vencido1_30.documentCount).toBe(1);
    expect(vencido1_30.amount).toBe(docAt30.balance);
    expect(vencido31_60.documentCount).toBe(1);
    expect(vencido31_60.amount).toBe(docAt31.balance);
  });

  it('boundary exacto de "por vencer": exactamente porVencerSplitDays cae en 0-30, uno más en 30+', () => {
    const cutoffIso = '2026-07-25';
    const splitDays = DEFAULT_AGING_BUCKET_CONFIG.porVencerSplitDays;
    const docAtSplit = makeDoc({
      id: 'd-split',
      status: 'POR_VENCER',
      daysOverdue: 0,
      dueDate: '2026-08-24', // 30 días después del cutoff
    });
    const docPastSplit = makeDoc({
      id: 'd-past-split',
      status: 'POR_VENCER',
      daysOverdue: 0,
      dueDate: '2026-08-25', // 31 días después del cutoff
    });

    const { buckets } = buildAgingBuckets([docAtSplit, docPastSplit], cutoffIso);

    const porVencer0_30 = buckets.find((b) => b.key === 'POR_VENCER_0_30')!;
    const porVencer30Plus = buckets.find((b) => b.key === 'POR_VENCER_30_PLUS')!;
    expect(porVencer0_30.documentCount).toBe(1);
    expect(porVencer0_30.amount).toBe(docAtSplit.balance);
    expect(porVencer30Plus.documentCount).toBe(1);
    expect(porVencer30Plus.amount).toBe(docPastSplit.balance);
    // Garantía cruzada: el corte usado arriba efectivamente coincide con el config default.
    expect(splitDays).toBe(30);
  });

  it('overdue nunca mezcla paletas: ningún bucket "por vencer" (overdue:false) comparte key/semántica con uno "vencido" (overdue:true)', () => {
    const cutoffIso = service.cutoffDate();
    const { buckets } = buildAgingBuckets(service.scopedDocuments(), cutoffIso);

    const porVencerKeys = new Set(['POR_VENCER_0_30', 'POR_VENCER_30_PLUS']);
    const vencidoKeys = new Set(['VENCIDO_1_30', 'VENCIDO_31_60', 'VENCIDO_61_90', 'VENCIDO_90_PLUS']);

    for (const bucket of buckets) {
      if (porVencerKeys.has(bucket.key)) {
        expect(bucket.overdue).toBe(false);
      } else if (vencidoKeys.has(bucket.key)) {
        expect(bucket.overdue).toBe(true);
      } else {
        expect(bucket.key).toBe('NO_DUE_DATE');
        expect(bucket.overdue).toBeNull();
      }
    }
    // Ninguna key aparece en ambos sets (garantía de diseño, documentada acá).
    for (const key of porVencerKeys) {
      expect(vencidoKeys.has(key)).toBe(false);
    }
  });

  it('siempre devuelve las 7 keys en el orden fijo, incluso cuando algún tramo queda en 0', () => {
    const { buckets } = buildAgingBuckets([], '2026-07-25');
    expect(buckets.map((b) => b.key)).toEqual([
      'POR_VENCER_0_30',
      'POR_VENCER_30_PLUS',
      'VENCIDO_1_30',
      'VENCIDO_31_60',
      'VENCIDO_61_90',
      'VENCIDO_90_PLUS',
      'NO_DUE_DATE',
    ]);
    expect(buckets.every((b) => b.amount === 0 && b.documentCount === 0 && b.counterpartyCount === 0)).toBe(true);
  });
});
