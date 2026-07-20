export interface SalesFact {
  transactionId: string;
  /** ISO 'YYYY-MM-DD' -- fuente de verdad; dayOfWeek se deriva de acá vía date.utils.getDayOfWeek. */
  date: string;
  storeId: string;
  productId: string;
  hour: number; // 0-23 raw clock hour
  amount: number; // CLP, can be negative (discounts/mermas)
  quantity: number;
}
