import type { Product } from '../models/product.model';

const SIZE_VARIANTS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const COLOR_VARIANTS = ['Blanco', 'Negro', 'Azul Marino', 'Gris Melange', 'Rojo', 'Verde Oliva', 'Beige', 'Celeste', 'Café', 'Amarillo'];
const SHOE_SIZE_VARIANTS = ['37', '38', '39', '40', '41', '42', '43'];
const KIDS_AGE_VARIANTS = ['2 años', '4 años', '6 años', '8 años', '10 años', '12 años'];
const KIDS_SHOE_SIZE_VARIANTS = ['28', '30', '32', '34', '36'];
const BELT_SIZE_VARIANTS = ['S', 'M', 'L'];
const TIER_VARIANTS = ['Estándar', 'Premium', 'Edición Limitada'];
const BAG_SIZE_VARIANTS = ['Chico', 'Mediano', 'Grande'];

interface SubfamiliaDef {
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  bases: string[];
  variants: string[];
  /** Caps how many base x variant combinations are generated for this subfamilia. */
  count: number;
}

/**
 * Catálogo de moda/retail (Vestuario, Calzado, Accesorios, Deportivo, Niños) -- reemplaza el
 * catálogo anterior (gastronomía + retail mixto). Los primeros nombres de cada subfamilia
 * "ancla" coinciden con los productos reales del dataset de cliente (Camisa Slim Fit Azul,
 * Jean Skinny Negro, Zapatilla Running Pro, Cinturón Cuero Café, etc.); el resto de bases y
 * las subfamilias/categorías sin equivalente en ese dataset (Calzado Formal/Botas, Deportivo,
 * Niños, Relojes y Lentes, Bolsos y Mochilas) son inventadas para llenar el catálogo. Sigue
 * abarcando un rango amplio de tamaños de rama (chicas a 40+) por la misma razón que antes:
 * ejercitar el "cargar más" de Detalle de Ventas y el long-tail del treemap.
 */
const SUBFAMILIA_DEFS: SubfamiliaDef[] = [
  // Vestuario
  { categoryId: 'cat-vestuario', categoryName: 'Vestuario', subcategoryId: 'sub-camisas', subcategoryName: 'Camisas',
    bases: ['Camisa Slim Fit Azul', 'Camisa Slim Fit Blanca', 'Camisa Oxford Celeste', 'Camisa Cuadros Rojo', 'Camisa Lino Beige'],
    variants: SIZE_VARIANTS, count: 35 },
  { categoryId: 'cat-vestuario', categoryName: 'Vestuario', subcategoryId: 'sub-jeans', subcategoryName: 'Jeans',
    bases: ['Jean Skinny Negro', 'Jean Recto Azul', 'Jean Mom Fit', 'Jean Slim Gris'],
    variants: SIZE_VARIANTS, count: 28 },
  { categoryId: 'cat-vestuario', categoryName: 'Vestuario', subcategoryId: 'sub-vestidos', subcategoryName: 'Vestidos',
    bases: ['Vestido Casual Floral', 'Vestido Midi Negro', 'Vestido Lino Beige', 'Vestido Satén Rojo'],
    variants: SIZE_VARIANTS, count: 26 },
  { categoryId: 'cat-vestuario', categoryName: 'Vestuario', subcategoryId: 'sub-blazers', subcategoryName: 'Blazers',
    bases: ['Blazer Formal Gris', 'Blazer Cruzado Azul Marino', 'Blazer Lino Beige'],
    variants: SIZE_VARIANTS, count: 20 },
  { categoryId: 'cat-vestuario', categoryName: 'Vestuario', subcategoryId: 'sub-poleras', subcategoryName: 'Poleras',
    bases: ['Polera Básica Algodón', 'Polera Estampada', 'Polera Cuello V', 'Polera Oversize'],
    variants: COLOR_VARIANTS, count: 38 },
  { categoryId: 'cat-vestuario', categoryName: 'Vestuario', subcategoryId: 'sub-chaquetas', subcategoryName: 'Chaquetas',
    bases: ['Chaqueta Cortavientos', 'Chaqueta de Cuero', 'Parka Invierno', 'Chaqueta Denim'],
    variants: SIZE_VARIANTS, count: 26 },
  { categoryId: 'cat-vestuario', categoryName: 'Vestuario', subcategoryId: 'sub-shorts', subcategoryName: 'Shorts',
    bases: ['Short Deportivo', 'Short Jean', 'Bermuda Chino'],
    variants: SIZE_VARIANTS, count: 18 },
  { categoryId: 'cat-vestuario', categoryName: 'Vestuario', subcategoryId: 'sub-faldas', subcategoryName: 'Faldas',
    bases: ['Falda Plisada', 'Falda Lápiz', 'Falda Denim'],
    variants: SIZE_VARIANTS, count: 15 },

  // Calzado
  { categoryId: 'cat-calzado', categoryName: 'Calzado', subcategoryId: 'sub-running', subcategoryName: 'Running',
    bases: ['Zapatilla Running Pro', 'Zapatilla Running Lite', 'Zapatilla Trail'],
    variants: SHOE_SIZE_VARIANTS, count: 20 },
  { categoryId: 'cat-calzado', categoryName: 'Calzado', subcategoryId: 'sub-casual', subcategoryName: 'Casual',
    bases: ['Zapatilla Urbana', 'Zapatilla Lona', 'Náutico Cuero', 'Slip-On'],
    variants: SHOE_SIZE_VARIANTS, count: 26 },
  { categoryId: 'cat-calzado', categoryName: 'Calzado', subcategoryId: 'sub-formal', subcategoryName: 'Formal',
    bases: ['Zapato Oxford Cuero', 'Zapato Derby Negro', 'Mocasín Café'],
    variants: SHOE_SIZE_VARIANTS, count: 18 },
  { categoryId: 'cat-calzado', categoryName: 'Calzado', subcategoryId: 'sub-botas', subcategoryName: 'Botas',
    bases: ['Bota Chelsea', 'Bota Trekking', 'Bota de Cuero'],
    variants: SHOE_SIZE_VARIANTS, count: 15 },

  // Accesorios
  { categoryId: 'cat-accesorios', categoryName: 'Accesorios', subcategoryId: 'sub-cinturones', subcategoryName: 'Cinturones',
    bases: ['Cinturón Cuero Café', 'Cinturón Cuero Negro', 'Cinturón Reversible'],
    variants: BELT_SIZE_VARIANTS, count: 9 },
  { categoryId: 'cat-accesorios', categoryName: 'Accesorios', subcategoryId: 'sub-bufandas-gorros', subcategoryName: 'Bufandas y Gorros',
    bases: ['Bufanda Lana', 'Bufanda Seda', 'Gorro de Lana', 'Gorro Trucker'],
    variants: COLOR_VARIANTS, count: 30 },
  { categoryId: 'cat-accesorios', categoryName: 'Accesorios', subcategoryId: 'sub-relojes-lentes', subcategoryName: 'Relojes y Lentes',
    bases: ['Reloj Análogo Acero', 'Reloj Digital Deportivo', 'Lentes de Sol Aviador', 'Lentes de Sol Redondos'],
    variants: TIER_VARIANTS, count: 12 },
  { categoryId: 'cat-accesorios', categoryName: 'Accesorios', subcategoryId: 'sub-bolsos-mochilas', subcategoryName: 'Bolsos y Mochilas',
    bases: ['Mochila Urbana', 'Bolso Bandolera', 'Cartera de Mano', 'Billetera Cuero'],
    variants: BAG_SIZE_VARIANTS, count: 12 },

  // Deportivo
  { categoryId: 'cat-deportivo', categoryName: 'Deportivo', subcategoryId: 'sub-training', subcategoryName: 'Training',
    bases: ['Polerón Training', 'Calza Deportiva', 'Top Deportivo', 'Chaqueta Running', 'Short Training'],
    variants: SIZE_VARIANTS, count: 35 },
  { categoryId: 'cat-deportivo', categoryName: 'Deportivo', subcategoryId: 'sub-accesorios-deportivos', subcategoryName: 'Accesorios Deportivos',
    bases: ['Banda para el Pelo', 'Guantes de Entrenamiento', 'Botella Deportiva', 'Mochila Gym'],
    variants: BAG_SIZE_VARIANTS, count: 12 },

  // Niños
  { categoryId: 'cat-ninos', categoryName: 'Niños', subcategoryId: 'sub-ropa-infantil', subcategoryName: 'Ropa Infantil',
    bases: ['Polera Infantil Estampada', 'Pantalón Infantil', 'Vestido Infantil Floral', 'Polerón Infantil'],
    variants: KIDS_AGE_VARIANTS, count: 24 },
  { categoryId: 'cat-ninos', categoryName: 'Niños', subcategoryId: 'sub-calzado-infantil', subcategoryName: 'Calzado Infantil',
    bases: ['Zapatilla Infantil', 'Sandalia Infantil'],
    variants: KIDS_SHOE_SIZE_VARIANTS, count: 10 },
];

function generateSubfamiliaProducts(def: SubfamiliaDef): Product[] {
  const products: Product[] = [];
  let index = 0;
  for (const variant of def.variants) {
    for (const base of def.bases) {
      if (index >= def.count) return products;
      index++;
      products.push({
        id: `prod-gen-${def.subcategoryId}-${index}`,
        name: `${base} ${variant}`,
        categoryId: def.categoryId,
        categoryName: def.categoryName,
        subcategoryId: def.subcategoryId,
        subcategoryName: def.subcategoryName,
      });
    }
  }
  return products;
}

export const PRODUCTS: Product[] = SUBFAMILIA_DEFS.flatMap(generateSubfamiliaProducts);
