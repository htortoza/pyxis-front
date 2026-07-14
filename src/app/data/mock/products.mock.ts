import type { Product } from '../models/product.model';

export const PRODUCTS: Product[] = [
  { id: 'prod-lomo-saltado', name: 'Lomo Saltado', categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-carnes', subcategoryName: 'Carnes' },
  { id: 'prod-entrana-200', name: 'Entraña 200g', categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-cortes', subcategoryName: '7 Cortes' },
  { id: 'prod-filete-250', name: 'Filete 250g', categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-cortes', subcategoryName: '7 Cortes' },
  { id: 'prod-coca-cola-z', name: 'Coca Cola Z.', categoryId: 'cat-bebidas', categoryName: 'Bebidas', subcategoryId: 'sub-gaseosas', subcategoryName: 'Gaseosas' },
  { id: 'prod-limonada-m', name: 'Limonada M.', categoryId: 'cat-bebidas', categoryName: 'Bebidas', subcategoryId: 'sub-jugos', subcategoryName: 'Jugos y Refrescos' },
];
