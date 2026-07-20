import type { DimensionVocabulary } from '../models/tenant-vocabulary.model';
import type { FilterNodeType } from './sector-marca-tienda-tree.utils';

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Resolves the display label for a Sector/Marca/Tienda dimension through a 3-level fallback:
 * tenant override -> rubro preset -> capitalized dimension key. The third rung only fires if a
 * rubro preset doesn't define that dimension -- never the case for 'retail' today, but the chain
 * must exist so a future rubro preset can ship incomplete without breaking the UI.
 */
export function resolveDimensionLabel(
  dimension: FilterNodeType,
  overrides: Partial<DimensionVocabulary> | undefined,
  preset: Partial<DimensionVocabulary>,
): string {
  return overrides?.[dimension] ?? preset[dimension] ?? capitalize(dimension);
}
