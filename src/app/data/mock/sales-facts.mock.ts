import type { SalesFact } from '../models/sales-fact.model';
import { CONTEXT_TREE } from './context-tree.mock';
import { PERIODS } from './periods.mock';
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

function generateSalesFacts(): SalesFact[] {
  const rng = mulberry32(20260714);
  const localNodes = CONTEXT_TREE.filter((node) => node.type === 'LOCAL');
  const facts: SalesFact[] = [];
  let txCounter = 0;

  for (const period of PERIODS) {
    for (const local of localNodes) {
      const transactionCount = 38 + Math.floor(rng() * 5); // ~40 transactions per store/period
      for (let t = 0; t < transactionCount; t++) {
        txCounter++;
        const transactionId = `tx-${txCounter}`;
        const dayOfWeek = Math.floor(rng() * 7);
        const hour = Math.floor(rng() * 24);
        const lineItemCount = 1 + Math.floor(rng() * 3); // 1-3 line items

        for (let li = 0; li < lineItemCount; li++) {
          const product = PRODUCTS[Math.floor(rng() * PRODUCTS.length)];
          const quantity = 1 + Math.floor(rng() * 3);
          const basePerUnit = 8000 + rng() * 8000; // 8000-16000 CLP per unit
          const multiplier = 0.8 + rng() * 0.6; // 0.8-1.4
          const amount = Math.round(basePerUnit * quantity * multiplier);

          facts.push({
            transactionId,
            periodId: period.id,
            storeId: local.id,
            productId: product.id,
            dayOfWeek,
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
      periodId: '2026-06',
      storeId: 'local-costanera-center',
      productId: 'prod-lomo-saltado',
      dayOfWeek: 4,
      hour: 13,
      amount: -6500,
      quantity: -1,
    },
    {
      transactionId: 'tx-descuento-2',
      periodId: '2026-07',
      storeId: 'local-parque-arauco',
      productId: 'prod-coca-cola-z',
      dayOfWeek: 5,
      hour: 20,
      amount: -3200,
      quantity: -1,
    },
    {
      transactionId: 'tx-descuento-3',
      periodId: '2026-05',
      storeId: 'local-vespucio-mall',
      productId: 'prod-filete-250',
      dayOfWeek: 1,
      hour: 19,
      amount: -12000,
      quantity: -1,
    },
  );

  return facts;
}

export const SALES_FACTS: SalesFact[] = generateSalesFacts();
