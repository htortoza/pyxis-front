/** One historical point for a KPI card's sparkline -- only ever built from real loaded facts. */
export interface TrendPoint {
  periodId: string;
  value: number;
}

export interface KpiValue {
  current: number;
  previous: number;
  deltaPct: number | null; // null when previous is 0 (no meaningful % change, and no real previous-period data)
  /** Candidate sparkline points (see buildKpiTrendPoints) -- NOT yet threshold-checked; the card decides whether trend.length is enough to draw a line. */
  trend: TrendPoint[];
}

export interface KpiSet {
  ventasTotales: KpiValue;
  transacciones: KpiValue;
  unidadesPorTransaccion: KpiValue;
  ticketPromedio: KpiValue;
}
