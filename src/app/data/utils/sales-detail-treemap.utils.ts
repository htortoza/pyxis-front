import type { Period } from '../models/period.model';
import type { DetailTreeNode } from './sales-detail-tree.utils';

/** Spec: items individually below 1% of their level's total fold into one "+N más" block. */
const LONG_TAIL_THRESHOLD_PCT = 1;

/** Hard cap on how many "main" blocks render per band, independent of the 1% rule -- a
 * subfamilia with 20+ similarly-sized articulos can have most of them clear 1% individually
 * yet still be too many to render with a legible label each (labels truncate to 3-4 chars and
 * every block starts looking the same). Anything past this rank joins the long-tail bucket
 * regardless of its own share, per the spec's own "similar and small magnitude -> a list
 * communicates better than area" reasoning -- just applied by rank, not only by %. */
const MAX_MAIN_BLOCKS = 8;

export type TrendDirection = 'up' | 'down' | 'flat';

export interface TreemapPeriodPoint {
  periodId: string;
  label: string;
  total: number;
  cantidad: number;
  /** 0-100, this point's total relative to the block's own largest point -- backs the 3-bar mini-trend. */
  heightPct: number;
}

export interface TreemapBlock {
  id: string;
  label: string;
  isLongTail: false;
  /** 0-100, this block's share of its band's total -- drives its proportional width. */
  sharePct: number;
  consolidadoTotal: number;
  /** One point per selected period, oldest to newest. */
  periodPoints: TreemapPeriodPoint[];
  /** First vs. last selected period within this block, not a global comparison. */
  trend: TrendDirection;
  /** 0-1, magnitude of the first-to-last change -- drives trend color intensity. */
  trendIntensity: number;
}

export interface TreemapLongTailBlock {
  id: 'long-tail';
  label: string;
  isLongTail: true;
  sharePct: number;
  consolidadoTotal: number;
  /** The individual grouped-away items, for the "+N más" dialog's searchable list. */
  items: TreemapBlock[];
}

export type TreemapEntry = TreemapBlock | TreemapLongTailBlock;

function computeTrend(first: number, last: number): { direction: TrendDirection; intensity: number } {
  if (first === last) {
    return { direction: 'flat', intensity: 0 };
  }
  const direction: TrendDirection = last > first ? 'up' : 'down';
  const base = Math.max(Math.abs(first), Math.abs(last), 1);
  const intensity = Math.min(1, Math.abs(last - first) / base);
  return { direction, intensity };
}

function buildBlock(node: DetailTreeNode, orderedPeriods: Period[], bandTotal: number): TreemapBlock {
  const rawPoints = orderedPeriods.map((period) => {
    const bucket = node.data.periodTotals[period.id];
    return { periodId: period.id, label: period.label, total: bucket?.total ?? 0, cantidad: bucket?.cantidad ?? 0 };
  });
  const maxPoint = Math.max(1, ...rawPoints.map((point) => Math.abs(point.total)));
  const periodPoints = rawPoints.map((point) => ({
    ...point,
    heightPct: (Math.abs(point.total) / maxPoint) * 100,
  }));

  const first = periodPoints[0]?.total ?? 0;
  const last = periodPoints[periodPoints.length - 1]?.total ?? 0;
  const { direction, intensity } = computeTrend(first, last);

  return {
    id: node.key,
    label: node.data.label,
    isLongTail: false,
    sharePct: bandTotal === 0 ? 0 : (node.data.consolidadoTotal / bandTotal) * 100,
    consolidadoTotal: node.data.consolidadoTotal,
    periodPoints,
    trend: direction,
    trendIntensity: intensity,
  };
}

/**
 * Builds one Vista Mapa band (Familia, or the Subfamilia children of a focused Familia, or the
 * Articulo children of a focused Subfamilia) from buildDetailTree's already-aggregated,
 * alphabetically-sorted nodes -- re-sorted here by amount descending, since Vista Mapa's whole
 * point is monto-first exploration. Never mutates or reorders the tree Vista Tabla reads.
 * Blocks under 1% of the band's total, OR ranked past MAX_MAIN_BLOCKS even if individually
 * above 1%, are merged into one neutral "+N más" entry (still sized proportionally, by its
 * members' combined share) instead of rendered as a wall of illegibly-truncated slivers.
 */
export function buildTreemapBand(
  nodes: DetailTreeNode[],
  selectedPeriodIds: string[],
  periods: Period[],
): TreemapEntry[] {
  const orderedPeriods = periods.filter((period) => selectedPeriodIds.includes(period.id));
  const bandTotal = nodes.reduce((sum, node) => sum + node.data.consolidadoTotal, 0);

  const blocks = nodes
    .map((node) => buildBlock(node, orderedPeriods, bandTotal))
    .sort((a, b) => b.consolidadoTotal - a.consolidadoTotal);

  const main: TreemapBlock[] = [];
  const tail: TreemapBlock[] = [];
  for (const block of blocks) {
    if (bandTotal > 0 && block.sharePct < LONG_TAIL_THRESHOLD_PCT) {
      tail.push(block);
    } else if (main.length < MAX_MAIN_BLOCKS) {
      main.push(block);
    } else {
      tail.push(block);
    }
  }

  // A single grouped-away item is just that item -- there's no "many similar small ones" to
  // simplify by hiding it behind a "+1 más" bucket, so show it directly as its own block
  // instead. Re-sort since it may belong ahead of some already-placed main blocks.
  if (tail.length === 1) {
    main.push(tail.pop()!);
    main.sort((a, b) => b.consolidadoTotal - a.consolidadoTotal);
  }

  const entries: TreemapEntry[] = [...main];
  if (tail.length > 0) {
    const tailTotal = tail.reduce((sum, block) => sum + block.consolidadoTotal, 0);
    entries.push({
      id: 'long-tail',
      label: `+${tail.length} más`,
      isLongTail: true,
      sharePct: bandTotal === 0 ? 0 : (tailTotal / bandTotal) * 100,
      consolidadoTotal: tailTotal,
      items: tail,
    });
  }
  return entries;
}

/** Finds an immediate child of `nodes` by its DetailTreeNode key -- used to resolve which
 * Subfamilia/Articulo children populate the next band down after a drill-down click. */
export function findChildByKey(nodes: DetailTreeNode[], key: string | null): DetailTreeNode | null {
  if (key === null) return null;
  return nodes.find((node) => node.key === key) ?? null;
}

export interface TreemapRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function worstRatio(row: number[], side: number): number {
  const sum = row.reduce((a, b) => a + b, 0);
  if (sum === 0 || side === 0) return Infinity;
  const maxV = Math.max(...row);
  const minV = Math.min(...row);
  return Math.max((side * side * maxV) / (sum * sum), (sum * sum) / (side * side * minV));
}

/**
 * Lays out one row along `side` -- the SAME shorter-side length worstRatio just used to decide
 * this row's membership. Using anything else here (e.g. the remaining rect's raw width/height)
 * would size the row on a different basis than the one that justified including its items,
 * silently producing far-worse aspect ratios than worstRatio's comparisons ever saw.
 */
function layoutRow(row: number[], rect: TreemapRect, side: number): { rects: TreemapRect[]; remaining: TreemapRect } {
  const sum = row.reduce((a, b) => a + b, 0);
  const rects: TreemapRect[] = [];

  if (side === rect.width) {
    // Width is the shorter side -> a full-width horizontal strip along the top, spanning the
    // full (shorter) width; thickness (height) = sum/side.
    const rowHeight = side > 0 ? sum / side : 0;
    let x = rect.x;
    for (const value of row) {
      const width = rowHeight > 0 ? value / rowHeight : 0;
      rects.push({ x, y: rect.y, width, height: rowHeight });
      x += width;
    }
    return {
      rects,
      remaining: { x: rect.x, y: rect.y + rowHeight, width: rect.width, height: Math.max(0, rect.height - rowHeight) },
    };
  }

  // Height is the shorter side -> a full-height vertical column along the left, spanning the
  // full (shorter) height; thickness (width) = sum/side.
  const colWidth = side > 0 ? sum / side : 0;
  let y = rect.y;
  for (const value of row) {
    const height = colWidth > 0 ? value / colWidth : 0;
    rects.push({ x: rect.x, y, width: colWidth, height });
    y += height;
  }
  return {
    rects,
    remaining: { x: rect.x + colWidth, y: rect.y, width: Math.max(0, rect.width - colWidth), height: rect.height },
  };
}

/**
 * Squarified treemap layout (Bruls, Huizing & van Wijk) -- tiles `values` (expected sorted
 * descending, same order buildTreemapBand already produces) into `container`, producing
 * near-square rectangles that together fill it exactly in both dimensions. Replaces an earlier
 * single-row "proportional width only, fixed height" layout that left most of a band's
 * available vertical space empty while still cramming many blocks into one thin strip.
 */
export function squarify(values: number[], container: TreemapRect): TreemapRect[] {
  if (values.length === 0) return [];

  const totalValue = values.reduce((sum, value) => sum + value, 0);
  const area = container.width * container.height;
  if (totalValue <= 0 || area <= 0) {
    return values.map(() => ({ x: container.x, y: container.y, width: 0, height: 0 }));
  }

  const scaled = values.map((value) => (Math.max(value, 0) / totalValue) * area);
  const results: TreemapRect[] = new Array(values.length);

  let remaining = container;
  let i = 0;
  while (i < scaled.length) {
    const side = Math.min(remaining.width, remaining.height);
    let row = [scaled[i]];
    let rowWorst = worstRatio(row, side);
    let j = i + 1;
    while (j < scaled.length) {
      const candidateRow = [...row, scaled[j]];
      const candidateWorst = worstRatio(candidateRow, side);
      if (candidateWorst > rowWorst) break;
      row = candidateRow;
      rowWorst = candidateWorst;
      j++;
    }

    const { rects, remaining: nextRemaining } = layoutRow(row, remaining, side);
    for (let k = 0; k < row.length; k++) {
      results[i + k] = rects[k];
    }
    remaining = nextRemaining;
    i = j;
  }
  return results;
}
