import type { FilterNodeType } from '../utils/sector-marca-tienda-tree.utils';

/** Union of one member today; extend when a second rubro preset ships (e.g. 'gastronomia'). */
export type RubroId = 'retail';

export type DimensionVocabulary = Record<FilterNodeType, string>;
