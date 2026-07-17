import type { Product } from '../models/product.model';
import type { SalesFact } from '../models/sales-fact.model';

export interface PeriodColumnTotals {
  periodId: string;
  total: number;
  cantidad: number;
}

export interface DetailTreeNodeData {
  label: string;
  level: 'familia' | 'subfamilia' | 'articulo' | 'descuentos';
  /** Keyed by periodId -- a Record reads far more cleanly than an array + `.find()` when the
   * component needs to look up a cell value for a given dynamic column's periodId. */
  periodTotals: Record<string, PeriodColumnTotals>;
  consolidadoTotal: number;
  consolidadoCantidad: number;
}

export interface DetailTreeNode {
  key: string;
  data: DetailTreeNodeData;
  children?: DetailTreeNode[];
  expanded?: boolean;
}

interface LeafAccum {
  label: string;
  periodTotals: Map<string, PeriodColumnTotals>;
  consolidadoTotal: number;
  consolidadoCantidad: number;
}

interface SubfamiliaAccum extends LeafAccum {
  articulos: Map<string, LeafAccum>;
}

interface FamiliaAccum extends LeafAccum {
  subfamilias: Map<string, SubfamiliaAccum>;
}

function newLeafAccum(label: string, selectedPeriodIds: string[]): LeafAccum {
  const periodTotals = new Map<string, PeriodColumnTotals>();
  for (const periodId of selectedPeriodIds) {
    periodTotals.set(periodId, { periodId, total: 0, cantidad: 0 });
  }
  return { label, periodTotals, consolidadoTotal: 0, consolidadoCantidad: 0 };
}

function addFact(accum: LeafAccum, fact: SalesFact): void {
  const bucket = accum.periodTotals.get(fact.periodId);
  if (bucket) {
    bucket.total += fact.amount;
    bucket.cantidad += fact.quantity;
  }
  accum.consolidadoTotal += fact.amount;
  accum.consolidadoCantidad += fact.quantity;
}

function toNodeData(accum: LeafAccum, level: DetailTreeNodeData['level']): DetailTreeNodeData {
  const periodTotals: Record<string, PeriodColumnTotals> = {};
  for (const [periodId, totals] of accum.periodTotals) {
    periodTotals[periodId] = totals;
  }
  return {
    label: accum.label,
    level,
    periodTotals,
    consolidadoTotal: accum.consolidadoTotal,
    consolidadoCantidad: accum.consolidadoCantidad,
  };
}

/**
 * Builds the Familia > Subfamilia > Articulo aggregation tree for "Detalle de Ventas", plus a
 * synthetic top-level zDescuentos row for negative-amount facts. Every level is sorted
 * alphabetically (never by amount) -- Vista Tabla's whole value is stable, ERP-comparable row
 * positions. Vista Mapa re-sorts by amount from this same tree in its own utils, without
 * touching this order. Pure and synchronous -- store/period scoping happens in the caller
 * (same split as sales-fact.utils.ts's filterFacts/computeKpis).
 */
export function buildDetailTree(
  facts: SalesFact[],
  products: Product[],
  selectedPeriodIds: string[],
): DetailTreeNode[] {
  const productById = new Map(products.map((product) => [product.id, product]));
  const positiveFacts = facts.filter((fact) => fact.amount >= 0);
  const negativeFacts = facts.filter((fact) => fact.amount < 0);

  const familias = new Map<string, FamiliaAccum>();

  for (const fact of positiveFacts) {
    const product = productById.get(fact.productId);
    if (!product) {
      continue; // defensive -- shouldn't happen with this mock data
    }

    let familia = familias.get(product.categoryId);
    if (!familia) {
      familia = { ...newLeafAccum(product.categoryName, selectedPeriodIds), subfamilias: new Map() };
      familias.set(product.categoryId, familia);
    }
    addFact(familia, fact);

    let subfamilia = familia.subfamilias.get(product.subcategoryId);
    if (!subfamilia) {
      subfamilia = {
        ...newLeafAccum(product.subcategoryName, selectedPeriodIds),
        articulos: new Map(),
      };
      familia.subfamilias.set(product.subcategoryId, subfamilia);
    }
    addFact(subfamilia, fact);

    let articulo = subfamilia.articulos.get(product.id);
    if (!articulo) {
      articulo = newLeafAccum(product.name, selectedPeriodIds);
      subfamilia.articulos.set(product.id, articulo);
    }
    addFact(articulo, fact);
  }

  const familiaNodes: DetailTreeNode[] = [];

  for (const [categoryId, familia] of familias) {
    const subfamiliaNodes: DetailTreeNode[] = [];

    for (const [subcategoryId, subfamilia] of familia.subfamilias) {
      const articuloNodes: DetailTreeNode[] = [];

      for (const [productId, articulo] of subfamilia.articulos) {
        const data = toNodeData(articulo, 'articulo');
        // Hide-zero-rows rule: drop leaves that are exactly zero across every selected period.
        if (data.consolidadoTotal === 0 && data.consolidadoCantidad === 0) {
          continue;
        }
        articuloNodes.push({ key: `articulo-${productId}`, data, expanded: false });
      }

      if (articuloNodes.length === 0) {
        continue; // drop an empty branch rather than leaving a dangling row
      }
      // Alphabetical, always -- Detalle de Ventas' Vista Tabla exists so ERP reconciliation
      // has stable, predictable row positions across months. Never reorder by amount here;
      // Vista Mapa re-sorts by amount itself from this same tree, without touching this order.
      articuloNodes.sort((a, b) => a.data.label.localeCompare(b.data.label, 'es'));

      subfamiliaNodes.push({
        key: `subfamilia-${categoryId}-${subcategoryId}`,
        data: toNodeData(subfamilia, 'subfamilia'),
        children: articuloNodes,
        expanded: false,
      });
    }

    if (subfamiliaNodes.length === 0) {
      continue;
    }
    subfamiliaNodes.sort((a, b) => a.data.label.localeCompare(b.data.label, 'es'));

    familiaNodes.push({
      key: `familia-${categoryId}`,
      data: toNodeData(familia, 'familia'),
      children: subfamiliaNodes,
      expanded: false,
    });
  }

  familiaNodes.sort((a, b) => a.data.label.localeCompare(b.data.label, 'es'));

  const result: DetailTreeNode[] = [...familiaNodes];

  if (negativeFacts.length > 0) {
    const descuentos = newLeafAccum('zDescuentos', selectedPeriodIds);
    for (const fact of negativeFacts) {
      addFact(descuentos, fact);
    }
    result.push({
      key: 'z-descuentos',
      data: toNodeData(descuentos, 'descuentos'),
      expanded: false,
    });
  }

  return result;
}
