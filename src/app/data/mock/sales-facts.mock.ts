import type { Product } from '../models/product.model';
import type { SalesFact } from '../models/sales-fact.model';
import { addDaysIso } from '../utils/date.utils';
import { CONTEXT_TREE } from './context-tree.mock';
import { PERIODS_MES } from './periods.mock';
import { PRODUCTS } from './products.mock';

/** Deterministic 32-bit PRNG (mulberry32) so the mock dataset is stable across reloads. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Zipf-like weight per product (rank-based, exponent 0.8) so a handful of products dominate
 * sales and most trail off into a long tail -- needed to exercise Detalle de Ventas' treemap
 * long-tail grouping (items <1% of their level) and its table's progressive-loading threshold
 * with real, non-zero rows rather than mostly-empty ones. Ranks are shuffled (not literal
 * array position) so "who sells well" doesn't just track familia order in products.mock.ts.
 */
function buildProductWeights(products: Product[], rng: () => number): number[] {
  const ranks = products.map((_, i) => i);
  for (let i = ranks.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [ranks[i], ranks[j]] = [ranks[j], ranks[i]];
  }
  const weights = new Array<number>(products.length);
  for (let i = 0; i < products.length; i++) {
    weights[ranks[i]] = 1 / Math.pow(i + 1, 0.8);
  }
  const cumulative: number[] = [];
  let sum = 0;
  for (const w of weights) {
    sum += w;
    cumulative.push(sum);
  }
  return cumulative;
}

function pickWeightedProduct(products: Product[], cumulative: number[], rng: () => number) {
  const target = rng() * cumulative[cumulative.length - 1];
  let lo = 0;
  let hi = cumulative.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (cumulative[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return products[lo];
}

function daysInPeriod(period: { startDate: string; endDate: string }): number {
  return Number(period.endDate.slice(-2)) - Number(period.startDate.slice(-2)) + 1;
}

function generateSalesFacts(): SalesFact[] {
  const rng = mulberry32(20260714);
  const tiendaNodes = CONTEXT_TREE.filter((node) => node.type === 'TIENDA');
  const productWeights = buildProductWeights(PRODUCTS, rng);
  const facts: SalesFact[] = [];
  let txCounter = 0;

  for (const period of PERIODS_MES) {
    const totalDays = daysInPeriod(period);
    for (const tienda of tiendaNodes) {
      const transactionCount = 380 + Math.floor(rng() * 60); // dense enough that most of the
      // ~500-product catalog gets real (non-zero) sales within any 3-period window, not just
      // the top sellers -- see buildProductWeights' doc comment above.
      for (let t = 0; t < transactionCount; t++) {
        txCounter++;
        const transactionId = `tx-${txCounter}`;
        const date = addDaysIso(period.startDate, Math.floor(rng() * totalDays));
        const hour = Math.floor(rng() * 24);
        const lineItemCount = 1 + Math.floor(rng() * 3); // 1-3 line items

        for (let li = 0; li < lineItemCount; li++) {
          const product = pickWeightedProduct(PRODUCTS, productWeights, rng);
          const quantity = 1 + Math.floor(rng() * 3);
          const basePerUnit = 8000 + rng() * 8000; // 8000-16000 CLP per unit
          const multiplier = 0.8 + rng() * 0.6; // 0.8-1.4
          const amount = Math.round(basePerUnit * quantity * multiplier);

          facts.push({
            transactionId,
            date,
            storeId: tienda.id,
            productId: product.id,
            hour,
            amount,
            quantity,
          });
        }
      }
    }
  }

  // Hand-authored negative rows (discounts/mermas) so the negative-amount formatting path
  // has real data to render.
  facts.push(
    {
      transactionId: 'tx-descuento-1',
      date: '2026-06-18',
      storeId: 'tienda-costanera-center',
      productId: 'prod-lomo-saltado',
      hour: 13,
      amount: -6500,
      quantity: -1,
    },
    {
      transactionId: 'tx-descuento-2',
      date: '2026-07-24',
      storeId: 'tienda-parque-arauco',
      productId: 'prod-coca-cola-z',
      hour: 20,
      amount: -3200,
      quantity: -1,
    },
    {
      transactionId: 'tx-descuento-3',
      date: '2026-05-04',
      storeId: 'tienda-vespucio-mall',
      productId: 'prod-filete-250',
      hour: 19,
      amount: -12000,
      quantity: -1,
    },
  );

  return facts;
}

export const SALES_FACTS: SalesFact[] = generateSalesFacts();
