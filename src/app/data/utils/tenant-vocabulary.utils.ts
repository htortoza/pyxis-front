import type { DimensionKey, DimensionVocabulary } from '../models/tenant-vocabulary.model';

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Resolves the display label for any vocabulary dimension (Ventas' Sector/Marca/Tienda or
 * Cobranzas' Contraparte) through a 3-level fallback: tenant override -> rubro preset ->
 * capitalized dimension key. The third rung only fires if a rubro preset doesn't define that
 * dimension -- never the case for 'retail' today, but the chain must exist so a future rubro
 * preset (or module) can ship incomplete without breaking the UI.
 */
export function resolveDimensionLabel(
  dimension: DimensionKey,
  overrides: DimensionVocabulary | undefined,
  preset: DimensionVocabulary,
): string {
  return overrides?.[dimension] ?? preset[dimension] ?? capitalize(dimension);
}
