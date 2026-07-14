export interface KpiValue {
  current: number;
  previous: number;
  deltaPct: number | null; // null when previous is 0 (no meaningful % change)
}

export interface KpiSet {
  ventasTotales: KpiValue;
  transacciones: KpiValue;
  unidadesPorTransaccion: KpiValue;
  ticketPromedio: KpiValue;
}
