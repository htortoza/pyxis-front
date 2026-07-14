export type RankingDimension = 'sector' | 'marca' | 'tienda' | 'producto';

export interface RankingItem {
  id: string;
  label: string;
  amount: number;
  quantity: number;
}

export interface RankingSet {
  sectores: RankingItem[];
  marcas: RankingItem[];
  tiendas: RankingItem[];
  productos: RankingItem[];
}
