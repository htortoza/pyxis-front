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

/**
 * Totales reales de descuento (dataset de cliente) para los 3 meses que sí trae el dataset --
 * ancla la tasa de descuento de esos meses a la proporción relativa real entre ellos (Marzo >
 * Enero > Febrero), aplicada sobre REAL_DESCUENTO_BASE_RATE en vez de importar los montos
 * absolutos tal cual (esos montos superan el total de ventas del periodo en el dataset
 * original, así que no calzan como "% de descuento sobre ventas" sin volverse absurdos).
 * El resto del rango mock (2024-2026) usa una tasa determinística por periodo derivada de un
 * hash simple del id, no del stream mulberry32 compartido con la generación de transacciones
 * (así cambiar el catálogo/generación no corre el hash de descuentos).
 */
const REAL_DESCUENTO_TOTALS: Record<string, number> = {
  '2026-01': 538_026_949,
  '2026-02': 495_310_200,
  '2026-03': 612_450_100,
};
const REAL_DESCUENTO_BASE_RATE = 0.04;
const REAL_DESCUENTO_MIN = Math.min(...Object.values(REAL_DESCUENTO_TOTALS));

function hashUnitInterval(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return (hash >>> 0) / 4294967296;
}

/** % de descuento aplicado sobre las ventas positivas de un periodo (mismo para todas las tiendas de ese periodo). */
function discountRateForPeriod(periodId: string): number {
  const real = REAL_DESCUENTO_TOTALS[periodId];
  if (real !== undefined) {
    return REAL_DESCUENTO_BASE_RATE * (real / REAL_DESCUENTO_MIN);
  }
  return 0.03 + hashUnitInterval(periodId) * 0.03; // 3%-6%
}

function generateSalesFacts(): SalesFact[] {
  const rng = mulberry32(20260714);
  const tiendaNodes = CONTEXT_TREE.filter((node) => node.type === 'TIENDA');
  const productWeights = buildProductWeights(PRODUCTS, rng);
  const facts: SalesFact[] = [];
  let txCounter = 0;

  for (const period of PERIODS_MES) {
    const totalDays = daysInPeriod(period);
    const discountRate = discountRateForPeriod(period.id);
    for (const tienda of tiendaNodes) {
      const transactionCount = 380 + Math.floor(rng() * 60); // dense enough that most of the
      // ~500-product catalog gets real (non-zero) sales within any 3-period window, not just
      // the top sellers -- see buildProductWeights' doc comment above.
      let bucketPositiveTotal = 0;
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
          bucketPositiveTotal += amount;

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

      // Descuento sintético del periodo+tienda, proporcional a sus ventas positivas -- así
      // Descuentos varía de verdad por periodo y por tienda en vez de depender de 3 filas
      // sueltas hardcodeadas. productId es un placeholder: las filas de amount negativo no se
      // resuelven por producto (ver sales-detail-tree.utils.ts -- van directo al bucket
      // sintético zDescuentos, nunca hacen productById.get() sobre ellas).
      txCounter++;
      facts.push({
        transactionId: `tx-descuento-${txCounter}`,
        date: addDaysIso(period.startDate, Math.floor(rng() * totalDays)),
        storeId: tienda.id,
        productId: 'descuento-generico',
        hour: Math.floor(rng() * 24),
        amount: -Math.round(bucketPositiveTotal * discountRate),
        quantity: -1,
      });
    }
  }

  return facts;
}

export const SALES_FACTS: SalesFact[] = generateSalesFacts();
