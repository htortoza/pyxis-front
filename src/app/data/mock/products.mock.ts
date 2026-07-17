import type { Product } from '../models/product.model';

/**
 * Legacy hand-authored products -- kept verbatim (same ids/category/subcategory) because
 * sales-facts.mock.ts's hand-authored discount rows reference these ids directly.
 */
const LEGACY_PRODUCTS: Product[] = [
  { id: 'prod-lomo-saltado', name: 'Lomo Saltado', categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-carnes', subcategoryName: 'Carnes' },
  { id: 'prod-entrana-200', name: 'Entraña 200g', categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-cortes', subcategoryName: '7 Cortes' },
  { id: 'prod-filete-250', name: 'Filete 250g', categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-cortes', subcategoryName: '7 Cortes' },
  { id: 'prod-coca-cola-z', name: 'Coca Cola Z.', categoryId: 'cat-bebidas', categoryName: 'Bebidas', subcategoryId: 'sub-gaseosas', subcategoryName: 'Gaseosas' },
  { id: 'prod-limonada-m', name: 'Limonada M.', categoryId: 'cat-bebidas', categoryName: 'Bebidas', subcategoryId: 'sub-jugos', subcategoryName: 'Jugos y Refrescos' },
];

const SIZE_VARIANTS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const COLOR_VARIANTS = ['Blanco', 'Negro', 'Azul Marino', 'Gris Melange', 'Rojo', 'Verde Oliva', 'Beige', 'Celeste', 'Café', 'Amarillo'];
const PORTION_VARIANTS = ['Individual', 'Para Compartir', 'Familiar'];
const CAPACITY_VARIANTS = ['350ml', '500ml', '1L', '1.5L', '2L', 'Lata 350cc', 'Six Pack'];
const STYLE_VARIANTS = ['Moderno', 'Clásico', 'Vintage', 'Minimalista', 'Rústico'];

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
 * Deliberately spans a wide range of branch sizes (from a handful of items to 40+) so the
 * Detalle de Ventas table's progressive-loading ("cargar más" past ~20 rows) and the treemap's
 * long-tail grouping (items below ~1% of their level) both have real branches to exercise, per
 * the product spec's testing needs. Mixes gastronomía and retail familias on purpose -- the
 * spec requires both views to behave identically regardless of rubro.
 */
const SUBFAMILIA_DEFS: SubfamiliaDef[] = [
  // Comida
  { categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-carnes', subcategoryName: 'Carnes',
    bases: ['Bife a lo Pobre', 'Churrasco Italiano', 'Anticucho de Res', 'Costillar BBQ', 'Chorizo Parrillero', 'Pollo Arvejado', 'Asado de Tira'],
    variants: PORTION_VARIANTS, count: 21 },
  { categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-cortes', subcategoryName: '7 Cortes',
    bases: ['Lomo Vetado', 'Punta Paleta', 'Plateada', 'Asiento', 'Tapapecho', 'Abastero', 'Malaya'],
    variants: ['150g', '200g', '250g', '300g'], count: 28 },
  { categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-pastas', subcategoryName: 'Pastas',
    bases: ['Tallarines', 'Ravioles', 'Ñoquis', 'Lasaña', 'Canelones', 'Fettuccine'],
    variants: ['Clásico', 'Picante', 'Light', 'Premium', 'Artesanal'], count: 30 },
  { categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-ensaladas', subcategoryName: 'Ensaladas',
    bases: ['César', 'Griega', 'Caprese', 'Mixta', 'Quinoa', 'Atún'],
    variants: ['Individual', 'Grande'], count: 12 },
  { categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-sandwiches', subcategoryName: 'Sándwiches',
    bases: ['Chacarero', 'Barros Luco', 'Italiano', 'Ave Palta', 'Lomo Completo', 'Vegetariano'],
    variants: PORTION_VARIANTS, count: 18 },
  { categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-pescados', subcategoryName: 'Pescados y Mariscos',
    bases: ['Salmón', 'Congrio', 'Reineta', 'Camarones', 'Pulpo', 'Machas', 'Ceviche', 'Corvina'],
    variants: ['A la Plancha', 'Frito', 'Al Vapor'], count: 24 },
  { categoryId: 'cat-comida', categoryName: 'Comida', subcategoryId: 'sub-guarniciones', subcategoryName: 'Guarniciones',
    bases: ['Papas Fritas', 'Puré', 'Arroz', 'Ensalada de la Casa', 'Vegetales Salteados', 'Pan Amasado', 'Choclo', 'Palta Reina'],
    variants: ['Chica', 'Mediana', 'Grande'], count: 24 },

  // Bebidas
  { categoryId: 'cat-bebidas', categoryName: 'Bebidas', subcategoryId: 'sub-gaseosas', subcategoryName: 'Gaseosas',
    bases: ['Fanta', 'Sprite', 'Pepsi', 'Bilz', 'Ginger Ale', 'Schweppes Piña', 'Kem Piña'],
    variants: CAPACITY_VARIANTS, count: 27 },
  { categoryId: 'cat-bebidas', categoryName: 'Bebidas', subcategoryId: 'sub-jugos', subcategoryName: 'Jugos y Refrescos',
    bases: ['Jugo de Naranja', 'Jugo de Frutilla', 'Mango Sour', 'Refresco de Maracuyá', 'Agua de Piña'],
    variants: CAPACITY_VARIANTS, count: 19 },
  { categoryId: 'cat-bebidas', categoryName: 'Bebidas', subcategoryId: 'sub-cervezas', subcategoryName: 'Cervezas',
    bases: ['Lager', 'IPA', 'Stout', 'Pilsner', 'Cerveza de Trigo', 'Cerveza Artesanal Roja'],
    variants: CAPACITY_VARIANTS, count: 20 },
  { categoryId: 'cat-bebidas', categoryName: 'Bebidas', subcategoryId: 'sub-vinos', subcategoryName: 'Vinos',
    bases: ['Cabernet Sauvignon', 'Carmenere', 'Sauvignon Blanc', 'Chardonnay', 'Pinot Noir', 'Malbec', 'Syrah', 'Rosé'],
    variants: ['Copa', 'Botella 375ml', 'Botella 750ml', 'Reserva', 'Gran Reserva'], count: 32 },
  { categoryId: 'cat-bebidas', categoryName: 'Bebidas', subcategoryId: 'sub-cocteles', subcategoryName: 'Cócteles',
    bases: ['Pisco Sour', 'Mojito', 'Piña Colada', 'Margarita', 'Daiquiri', 'Aperol Spritz', 'Gin Tonic'],
    variants: ['Clásico', 'Sin Alcohol'], count: 14 },
  { categoryId: 'cat-bebidas', categoryName: 'Bebidas', subcategoryId: 'sub-aguas', subcategoryName: 'Aguas',
    bases: ['Agua Mineral', 'Agua con Gas', 'Agua Saborizada'],
    variants: ['500ml', '1L', '1.5L'], count: 9 },

  // Postres
  { categoryId: 'cat-postres', categoryName: 'Postres', subcategoryId: 'sub-tortas', subcategoryName: 'Tortas',
    bases: ['Torta de Chocolate', 'Torta de Zanahoria', 'Cheesecake', 'Torta Tres Leches', 'Torta Red Velvet', 'Torta Selva Negra'],
    variants: ['Porción', 'Entera Chica', 'Entera Grande'], count: 18 },
  { categoryId: 'cat-postres', categoryName: 'Postres', subcategoryId: 'sub-helados', subcategoryName: 'Helados',
    bases: ['Vainilla', 'Chocolate', 'Frutilla', 'Menta', 'Manjar', 'Lúcuma', 'Piña', 'Maracuyá'],
    variants: ['1 Bola', '2 Bolas', 'Copa'], count: 24 },
  { categoryId: 'cat-postres', categoryName: 'Postres', subcategoryId: 'sub-reposteria', subcategoryName: 'Repostería Individual',
    bases: ['Alfajor', 'Brownie', 'Cheesecake Individual', 'Kuchen', 'Empanada de Manzana', 'Mousse de Chocolate', 'Tiramisú', 'Panqueque'],
    variants: ['Clásico', 'Premium', 'Sin Azúcar'], count: 24 },

  // Retail -- Indumentaria
  { categoryId: 'cat-indumentaria', categoryName: 'Indumentaria', subcategoryId: 'sub-camisetas', subcategoryName: 'Camisetas',
    bases: ['Camiseta Básica', 'Camiseta Estampada', 'Camiseta Deportiva', 'Camiseta Oversize', 'Camiseta Manga Larga'],
    variants: COLOR_VARIANTS, count: 40 },
  { categoryId: 'cat-indumentaria', categoryName: 'Indumentaria', subcategoryId: 'sub-pantalones', subcategoryName: 'Pantalones',
    bases: ['Jeans Slim', 'Jeans Recto', 'Jogger', 'Pantalón de Vestir', 'Short Deportivo'],
    variants: SIZE_VARIANTS, count: 35 },
  { categoryId: 'cat-indumentaria', categoryName: 'Indumentaria', subcategoryId: 'sub-accesorios-vestir', subcategoryName: 'Accesorios de Vestir',
    bases: ['Cinturón', 'Gorro', 'Bufanda', 'Guantes', 'Corbata', 'Pañuelo', 'Cartera'],
    variants: ['Cuero', 'Algodón', 'Lana', 'Sintético'], count: 28 },

  // Retail -- Hogar
  { categoryId: 'cat-hogar', categoryName: 'Hogar', subcategoryId: 'sub-decoracion', subcategoryName: 'Decoración',
    bases: ['Cojín', 'Espejo', 'Cuadro Decorativo', 'Vela Aromática', 'Jarrón', 'Portarretrato', 'Alfombra', 'Cortina', 'Manta'],
    variants: STYLE_VARIANTS, count: 45 },
  { categoryId: 'cat-hogar', categoryName: 'Hogar', subcategoryId: 'sub-cocina', subcategoryName: 'Cocina',
    bases: ['Olla', 'Sartén', 'Set de Cuchillos', 'Tabla de Picar', 'Juego de Vasos', 'Tetera', 'Cafetera'],
    variants: ['Básico', 'Premium', 'Antiadherente', 'Acero Inoxidable'], count: 28 },
  { categoryId: 'cat-hogar', categoryName: 'Hogar', subcategoryId: 'sub-textil-hogar', subcategoryName: 'Textil Hogar',
    bases: ['Sábana', 'Funda de Almohada', 'Toalla', 'Cubrecama', 'Mantel'],
    variants: ['Algodón 300 Hilos', 'Microfibra', 'Lino', 'Percal', 'Jacquard', 'Franela'], count: 30 },

  // Retail -- Electro
  { categoryId: 'cat-electro', categoryName: 'Electro', subcategoryId: 'sub-electro-menor', subcategoryName: 'Pequeños Electrodomésticos',
    bases: ['Batidora', 'Licuadora', 'Tostadora', 'Sandwichera', 'Hervidor', 'Freidora de Aire'],
    variants: ['Básico', 'Digital', 'Pro'], count: 18 },
  { categoryId: 'cat-electro', categoryName: 'Electro', subcategoryId: 'sub-audio-video', subcategoryName: 'Audio y Video',
    bases: ['Parlante Bluetooth', 'Audífonos', 'Barra de Sonido', 'Smart TV 43"', 'Proyector Portátil'],
    variants: ['Estándar', 'Plus'], count: 10 },
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

export const PRODUCTS: Product[] = [
  ...LEGACY_PRODUCTS,
  ...SUBFAMILIA_DEFS.flatMap(generateSubfamiliaProducts),
];
