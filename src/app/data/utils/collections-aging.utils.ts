import type { ReceivableDocument } from '../models/collections.model';
import { daysBetweenIso } from './date.utils';

/** Los 7 tramos de Antigüedad de Cartera (spec §10.1), en el orden en que siempre se devuelven. */
export type AgingBucketKey =
  | 'POR_VENCER_0_30'
  | 'POR_VENCER_30_PLUS'
  | 'VENCIDO_1_30'
  | 'VENCIDO_31_60'
  | 'VENCIDO_61_90'
  | 'VENCIDO_90_PLUS'
  | 'NO_DUE_DATE';

/** Cortes parametrizables por tenant (gancho, sin UI de configuración en SP2 -- spec §10.1). */
export interface AgingBucketConfig {
  /** Corte entre "por vencer 0-30" y "por vencer 30+", en días hasta el vencimiento. Default 30. */
  porVencerSplitDays: number;
  /**
   * Cortes de mora vencida en días: `[1..v1]` = VENCIDO_1_30 (`v1` default 30), `(v1..v2]` =
   * VENCIDO_31_60 (`v2` default 60), `(v2..v3]` = VENCIDO_61_90 (`v3` default 90), `>v3` =
   * VENCIDO_90_PLUS. Cada límite es INCLUSIVE en su propio tramo (exactamente `v1` días de mora
   * cae en VENCIDO_1_30, no en VENCIDO_31_60).
   */
  vencidoBoundaries: [number, number, number];
}

export const DEFAULT_AGING_BUCKET_CONFIG: AgingBucketConfig = {
  porVencerSplitDays: 30,
  vencidoBoundaries: [30, 60, 90],
};

export interface AgingBucket {
  key: AgingBucketKey;
  label: string;
  /**
   * `false` = franja "por vencer" (paleta azul/verde), `true` = franja "vencido" (paleta
   * roja/coral), `null` = "sin vencimiento definido" -- fuera de ambos clusters, spec: NO es una
   * escala continua entre las 3 familias.
   */
  overdue: boolean | null;
  amount: number;
  documentCount: number;
  counterpartyCount: number;
}

export interface AgingBucketsResult {
  /** Siempre las 7 keys de `AgingBucketKey`, en ese orden, incluso con `amount`/`documentCount` 0. */
  buckets: AgingBucket[];
}

const BUCKET_ORDER: AgingBucketKey[] = [
  'POR_VENCER_0_30',
  'POR_VENCER_30_PLUS',
  'VENCIDO_1_30',
  'VENCIDO_31_60',
  'VENCIDO_61_90',
  'VENCIDO_90_PLUS',
  'NO_DUE_DATE',
];

const LABELS: Record<AgingBucketKey, string> = {
  POR_VENCER_0_30: 'Por vencer (0-30 días)',
  POR_VENCER_30_PLUS: 'Por vencer (30+ días)',
  VENCIDO_1_30: 'Vencido (1-30 días)',
  VENCIDO_31_60: 'Vencido (31-60 días)',
  VENCIDO_61_90: 'Vencido (61-90 días)',
  VENCIDO_90_PLUS: 'Vencido (90+ días)',
  NO_DUE_DATE: 'Sin vencimiento definido',
};

const OVERDUE_FLAG: Record<AgingBucketKey, boolean | null> = {
  POR_VENCER_0_30: false,
  POR_VENCER_30_PLUS: false,
  VENCIDO_1_30: true,
  VENCIDO_31_60: true,
  VENCIDO_61_90: true,
  VENCIDO_90_PLUS: true,
  NO_DUE_DATE: null,
};

function classify(doc: ReceivableDocument, cutoffIso: string, config: AgingBucketConfig): AgingBucketKey {
  // NO_DUE_DATE tiene prioridad sobre cualquier otra clasificación -- chequeado primero.
  if (doc.dueDate === null) {
    return 'NO_DUE_DATE';
  }
  if (doc.status === 'VENCIDO') {
    // VENCIDO usa `doc.daysOverdue` directo -- ya reconstruido al corte activo por `scopedDocuments`
    // (`documentStateAsOf`), nunca se recalcula acá.
    const [v1, v2, v3] = config.vencidoBoundaries;
    const days = doc.daysOverdue;
    if (days <= v1) return 'VENCIDO_1_30';
    if (days <= v2) return 'VENCIDO_31_60';
    if (days <= v3) return 'VENCIDO_61_90';
    return 'VENCIDO_90_PLUS';
  }
  // POR_VENCER: "días hasta el vencimiento" no lo expone `documentStateAsOf` (daysOverdue es
  // siempre 0 para POR_VENCER) -- se calcula acá mismo contra `cutoffIso`.
  const daysUntilDue = daysBetweenIso(cutoffIso, doc.dueDate);
  return daysUntilDue <= config.porVencerSplitDays ? 'POR_VENCER_0_30' : 'POR_VENCER_30_PLUS';
}

/**
 * Clasifica `documents` (ya reconstruidos al corte activo -- `CollectionsDataService.scopedDocuments`,
 * que YA aplica `documentStateAsOf`/`ivaMode`/escopeo de dimensión) en los 7 tramos de antigüedad de
 * cartera (spec §10.1). `cutoffIso` se usa SOLO para calcular "días hasta el vencimiento" de los
 * documentos POR_VENCER con `dueDate` no-null.
 *
 * Invariante de cuadre (spec §6): `buckets.reduce(sum amount) === documents.reduce(sum balance)`
 * exactamente -- cada documento cae en EXACTAMENTE 1 tramo, sin solaparse ni excluirse.
 */
export function buildAgingBuckets(
  documents: ReceivableDocument[],
  cutoffIso: string,
  bucketConfig: AgingBucketConfig = DEFAULT_AGING_BUCKET_CONFIG,
): AgingBucketsResult {
  const groups = new Map<AgingBucketKey, ReceivableDocument[]>(BUCKET_ORDER.map((key) => [key, []]));

  for (const doc of documents) {
    const key = classify(doc, cutoffIso, bucketConfig);
    groups.get(key)!.push(doc);
  }

  return {
    buckets: BUCKET_ORDER.map((key) => {
      const docs = groups.get(key)!;
      return {
        key,
        label: LABELS[key],
        overdue: OVERDUE_FLAG[key],
        amount: docs.reduce((sum, d) => sum + d.balance, 0),
        documentCount: docs.length,
        counterpartyCount: new Set(docs.map((d) => d.counterpartyId)).size,
      };
    }),
  };
}
