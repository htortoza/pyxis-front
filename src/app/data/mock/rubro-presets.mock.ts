import type { DimensionVocabulary, RubroId } from '../models/tenant-vocabulary.model';

/**
 * Sector/Marca/Tienda display labels per industry ("rubro"). Only 'retail' is populated today --
 * the same names already hardcoded across the UI. Add a new RubroId + entry here (never a
 * reduced/parallel mechanism) when a tenant with a different vocabulary (e.g. gastronomia) ships.
 */
export const RUBRO_PRESETS: Record<RubroId, DimensionVocabulary> = {
  retail: {
    sector: 'Sectores',
    marca: 'Marcas',
    tienda: 'Tiendas',
  },
};
