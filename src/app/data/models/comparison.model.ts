export type ComparisonMode = 'periodo_anterior' | 'periodo_especifico' | 'meta';
export type ComparisonAlignment = 'calendario' | 'dia_semana';

/**
 * Solo los 4 KPIs originales -- Descuentos y Tasa de Conversión no participan del modo Meta:
 * Descuentos necesitaría lógica invertida (menor es mejor) para que el semáforo no mienta, y
 * Tasa de Conversión ya es un valor mock fijo sin sentido real de "cumplimiento". Ambos siguen
 * mostrando su comparación normal (vs. periodo anterior) aunque el modo global sea 'meta'.
 */
export interface KpiMetaMensual {
  ventasTotales: number;
  transacciones: number;
  unidadesPorTransaccion: number;
  ticketPromedio: number;
}
