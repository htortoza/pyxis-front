import type { ContextNode } from '../models/context-node.model';
import type { Marca, Sector } from '../models/marca-sector.model';

/** Flat, cross-cutting brand/zone catalogs -- a Tienda tags itself with one of each below. */
export const MARCAS: Marca[] = [
  { id: 'marca-barra-chalaca', label: 'Barra Chalaca' },
  { id: 'marca-frida-kahlo', label: 'Frida Kahlo' },
  { id: 'marca-kairos', label: 'Kairos' },
  { id: 'marca-vespucio-retail', label: 'Vespucio Retail' },
];

export const SECTORES: Sector[] = [
  { id: 'sector-costanera', label: 'Costanera' },
  { id: 'sector-parque-a', label: 'Parque A.' },
  { id: 'sector-vespucio', label: 'Vespucio' },
];

/** Vertical containment tree: Holding > Empresa > Tienda (up to 3 levels, per product spec). */
export const CONTEXT_TREE: ContextNode[] = [
  { id: 'holding', label: 'Holding', type: 'HOLDING', parentId: null },

  { id: 'empresa-gastronomia', label: 'Empresa Gastronómica', type: 'EMPRESA', parentId: 'holding' },
  { id: 'tienda-antofagasta', label: 'Antofagasta', type: 'TIENDA', parentId: 'empresa-gastronomia', marcaId: 'marca-barra-chalaca', sectorId: 'sector-costanera' },
  { id: 'tienda-costanera-center', label: 'Costanera Center', type: 'TIENDA', parentId: 'empresa-gastronomia', marcaId: 'marca-barra-chalaca', sectorId: 'sector-costanera' },
  { id: 'tienda-tanta-cost', label: 'Tanta Cost.', type: 'TIENDA', parentId: 'empresa-gastronomia', marcaId: 'marca-frida-kahlo', sectorId: 'sector-costanera' },
  { id: 'tienda-open-kenn', label: 'Open Kenn.', type: 'TIENDA', parentId: 'empresa-gastronomia', marcaId: 'marca-kairos', sectorId: 'sector-parque-a' },
  { id: 'tienda-parque-arauco', label: 'Parque Arauco', type: 'TIENDA', parentId: 'empresa-gastronomia', marcaId: 'marca-kairos', sectorId: 'sector-parque-a' },

  { id: 'empresa-retail', label: 'Empresa Retail', type: 'EMPRESA', parentId: 'holding' },
  { id: 'tienda-vespucio-mall', label: 'Vespucio Mall', type: 'TIENDA', parentId: 'empresa-retail', marcaId: 'marca-vespucio-retail', sectorId: 'sector-vespucio' },
  { id: 'tienda-vespucio-norte', label: 'Vespucio Norte', type: 'TIENDA', parentId: 'empresa-retail', marcaId: 'marca-vespucio-retail', sectorId: 'sector-vespucio' },
];
