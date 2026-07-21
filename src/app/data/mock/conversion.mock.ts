export interface ConversionBase {
  /** Entradas (tráfico de la tienda) del snapshot real usado como base. */
  entradas: number;
  /** Tickets (transacciones) del mismo snapshot. */
  tickets: number;
}

/**
 * Base real de tráfico/tickets por tienda -- tomada de un snapshot diario de cliente
 * (2026-03-05) y adaptada a los 7 ids de tienda de este mock (los nombres de tienda del
 * dataset original no calzan 1:1 con context-tree.mock.ts, pero los VALORES sí son reales).
 * Con esto, la Tasa de Conversión deja de ser un número fijo: se agrega (entradas/tickets
 * ponderado, no promedio simple de %) sobre las tiendas que estén en alcance del filtro de
 * Contexto -- ver computeTasaConversionKpi en sales-fact.utils.ts. El snapshot es de un solo
 * día, así que la variación POR PERIODO es simulada (determinística, ver periodConversionVariation
 * en sales-fact.utils.ts), no un dato real por mes -- eso quedó explícito en la decisión de
 * producto de este cambio.
 */
export const CONVERSION_BASE_BY_STORE: Record<string, ConversionBase> = {
  'tienda-antofagasta': { entradas: 172, tickets: 33 }, // ~19.2%
  'tienda-costanera-center': { entradas: 197, tickets: 32 }, // ~16.2%
  'tienda-tanta-cost': { entradas: 227, tickets: 40 }, // ~17.6%
  'tienda-open-kenn': { entradas: 113, tickets: 24 }, // ~21.2%
  'tienda-parque-arauco': { entradas: 137, tickets: 29 }, // ~21.2%
  'tienda-vespucio-mall': { entradas: 216, tickets: 40 }, // ~18.5%
  'tienda-vespucio-norte': { entradas: 128, tickets: 26 }, // ~20.3%
};
