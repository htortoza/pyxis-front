export interface SalesFact {
  transactionId: string;
  periodId: string;
  storeId: string;
  productId: string;
  dayOfWeek: number; // 0-6
  hour: number;       // 0-23 raw clock hour
  amount: number;      // CLP, can be negative (discounts/mermas)
  quantity: number;
}
