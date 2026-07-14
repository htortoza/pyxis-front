export type RankingDimension = 'sector' | 'marca' | 'local' | 'producto';

export interface RankingItem {
  id: string;
  label: string;
  amount: number;
  quantity: number;
}

export interface RankingSet {
  sectores: RankingItem[];
  marcas: RankingItem[];
  locales: RankingItem[];
  productos: RankingItem[];
}
