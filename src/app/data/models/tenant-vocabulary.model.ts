import type { FilterNodeType } from '../utils/sector-marca-tienda-tree.utils';

/** Union of one member today; extend when a second rubro preset ships (e.g. 'gastronomia'). */
export type RubroId = 'retail';

/**
 * Vocabulary dimension keys across every module. `FilterNodeType` is Ventas's own
 * Sector/Marca/Tienda union (owned by sector-marca-tienda-tree.utils, never edited for other
 * modules -- see [[feedback-backend-contract-is-fixed]]); `'contraparte'` is Cobranzas' 4th filter
 * column, added here as a vocabulary term without joining that union.
 */
export type DimensionKey = FilterNodeType | 'contraparte';

/**
 * Partial because a rubro preset only needs to define the dimensions its own module(s) use --
 * requiring every module's keys on every preset would force Cobranzas-only presets to stub out
 * Sector/Marca/Tienda (and vice versa).
 */
export type DimensionVocabulary = Partial<Record<DimensionKey, string>>;
