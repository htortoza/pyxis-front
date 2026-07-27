import type { Counterparty, ReceivableDocument } from '../models/collections.model';

/** Spec: bloques individualmente bajo 1% del total de la banda se agrupan en "+N más" -- mismo
 * umbral que `sales-detail-treemap.utils.ts` (Ventas), redeclarado acá a propósito (ver Task 2
 * del plan: cada util de Cobranzas calcula sus propios agregados, sin importar de Ventas nada
 * salvo `squarify`/`TreemapRect`). */
export const LONG_TAIL_THRESHOLD_PCT = 1;

/** Tope duro de bloques "principales" por banda, independiente de la regla del 1% -- misma razón
 * que en Ventas: más allá de este rank, aunque el bloque individualmente supere el 1%, un bloque
 * más en una banda ya saturada deja de comunicar mejor que una lista. */
export const MAX_MAIN_BLOCKS = 8;

/** Mismo fallback visible que `collections-concentration.utils.ts`/Task 1 de este plan (spec
 * §8.C) -- documentos con `counterpartyId` que no calza con ninguna `Counterparty` conocida se
 * agrupan bajo esta etiqueta, nunca se descartan. Redeclarado localmente a propósito (independencia
 * entre utils de Cobranzas). */
const UNMAPPED_LABEL = 'Contraparte no mapeada';

export interface CollectionsTreemapBlock {
  id: string; // counterpartyId
  label: string;
  isLongTail: false;
  /** 0-100, share de este bloque sobre el saldo total de la banda. */
  sharePct: number;
  saldo: number;
  /** Mora para el color -- promedio de `daysOverdue` ponderado por `balance` sobre los documentos
   * abiertos de esta contraparte (mismo cálculo que `avgDaysOverdueWeighted` de Task 1, redeclarado
   * acá para no acoplar este util con `collections-detail-tree.utils.ts`). */
  avgDaysOverdueWeighted: number;
}

export interface CollectionsTreemapLongTailBlock {
  id: 'long-tail';
  label: string;
  isLongTail: true;
  sharePct: number;
  saldo: number;
  /** Los items individuales agrupados -- para el diálogo buscable "+N más". */
  items: CollectionsTreemapBlock[];
}

export type CollectionsTreemapEntry = CollectionsTreemapBlock | CollectionsTreemapLongTailBlock;

interface CounterpartyTotals {
  saldo: number;
  weightedDaysOverdueSum: number; // suma de daysOverdue*balance, sin dividir todavía
}

function buildBlock(counterpartyId: string, totals: CounterpartyTotals, counterparties: Counterparty[], bandTotal: number): CollectionsTreemapBlock {
  const counterparty = counterparties.find((c) => c.id === counterpartyId);
  const avgDaysOverdueWeighted = totals.saldo === 0 ? 0 : totals.weightedDaysOverdueSum / totals.saldo;
  return {
    id: counterpartyId,
    label: counterparty?.label ?? UNMAPPED_LABEL,
    isLongTail: false,
    sharePct: bandTotal === 0 ? 0 : (totals.saldo / bandTotal) * 100,
    saldo: totals.saldo,
    avgDaysOverdueWeighted,
  };
}

/**
 * Una sola banda de bloques (spec §5.1: sin drill-down, todas las contrapartes a la vez) a partir
 * de `documents` ya escopeados/cutoff-reconstruidos (`CollectionsDataService.scopedDocuments()`).
 * Mismo criterio de long-tail que `buildTreemapBand` de Ventas (bloques bajo 1% del total de la
 * banda, o más allá del rank 8, se agrupan en un bloque "+N más" con lista buscable; un long-tail
 * de exactamente 1 item se promueve a bloque principal en vez de un "+1 más") -- reimplementado
 * acá porque agrupa por `counterpartyId`/`balance`, no por `DetailTreeNode`/`consolidadoTotal`.
 *
 * Cuadre (spec §6): la suma de `saldo` de todos los `entries` (blocks + long-tail) es exactamente
 * la suma de `balance` de `documents` -- cada documento aporta a exactamente 1 grupo.
 */
export function buildCollectionsTreemapBand(
  documents: ReceivableDocument[],
  counterparties: Counterparty[],
): CollectionsTreemapEntry[] {
  const grouped = new Map<string, CounterpartyTotals>();
  for (const doc of documents) {
    const entry = grouped.get(doc.counterpartyId) ?? { saldo: 0, weightedDaysOverdueSum: 0 };
    entry.saldo += doc.balance;
    entry.weightedDaysOverdueSum += doc.daysOverdue * doc.balance;
    grouped.set(doc.counterpartyId, entry);
  }

  const bandTotal = Array.from(grouped.values()).reduce((sum, totals) => sum + totals.saldo, 0);

  const blocks = Array.from(grouped.entries())
    .map(([counterpartyId, totals]) => buildBlock(counterpartyId, totals, counterparties, bandTotal))
    .sort((a, b) => b.saldo - a.saldo);

  const main: CollectionsTreemapBlock[] = [];
  const tail: CollectionsTreemapBlock[] = [];
  for (const block of blocks) {
    if (bandTotal > 0 && block.sharePct < LONG_TAIL_THRESHOLD_PCT) {
      tail.push(block);
    } else if (main.length < MAX_MAIN_BLOCKS) {
      main.push(block);
    } else {
      tail.push(block);
    }
  }

  // Un único item agrupado no necesita esconderse detrás de un "+1 más" -- se muestra como bloque
  // propio, re-ordenando porque puede quedar por delante de algún bloque principal ya colocado.
  if (tail.length === 1) {
    main.push(tail.pop()!);
    main.sort((a, b) => b.saldo - a.saldo);
  }

  const entries: CollectionsTreemapEntry[] = [...main];
  if (tail.length > 0) {
    const tailSaldo = tail.reduce((sum, block) => sum + block.saldo, 0);
    entries.push({
      id: 'long-tail',
      label: `+${tail.length} más`,
      isLongTail: true,
      sharePct: bandTotal === 0 ? 0 : (tailSaldo / bandTotal) * 100,
      saldo: tailSaldo,
      items: tail,
    });
  }
  return entries;
}
