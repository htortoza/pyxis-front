import type { ContextNode } from '../models/context-node.model';
import type { Marca, Sector } from '../models/marca-sector.model';

export type FilterNodeType = 'sector' | 'marca' | 'tienda';

export interface FilterTreeNode {
  /**
   * sector: real Sector.id.
   * marca: composite `${sectorId}::${marcaId}` -- a Marca isn't exclusively owned by one Sector
   *   in the source data, so the same brand can appear as an independent row under two different
   *   sectors without id collisions.
   * tienda: real ContextNode.id.
   */
  id: string;
  parentId: string | null;
  label: string;
  type: FilterNodeType;
  /** Only set on 'tienda' nodes -- the real ContextNode.id, for mapping back to sales facts (storeId). */
  tiendaContextId?: string;
}

/**
 * Builds a synthetic, Sector-rooted 3-level filter tree (Sector > Marca > Tienda) from the
 * existing Holding>Empresa>Tienda CONTEXT_TREE plus the MARCAS/SECTORES catalogs. This is
 * deliberately NOT the same tree as CONTEXT_TREE -- it's grouped fresh by each Tienda's
 * sectorId/marcaId tags rather than by containment parentId.
 */
export function buildSectorMarcaTiendaTree(
  contextTree: ContextNode[],
  marcas: Marca[],
  sectores: Sector[],
): FilterTreeNode[] {
  const marcaById = new Map(marcas.map((marca) => [marca.id, marca]));
  const tiendas = contextTree.filter((node) => node.type === 'TIENDA');

  const result: FilterTreeNode[] = [];

  for (const sector of sectores) {
    result.push({
      id: sector.id,
      parentId: null,
      label: sector.label,
      type: 'sector',
    });

    const tiendasInSector = tiendas.filter((tienda) => tienda.sectorId === sector.id);

    const tiendasByMarca = new Map<string, ContextNode[]>();
    for (const tienda of tiendasInSector) {
      if (!tienda.marcaId) {
        continue;
      }
      const siblings = tiendasByMarca.get(tienda.marcaId) ?? [];
      siblings.push(tienda);
      tiendasByMarca.set(tienda.marcaId, siblings);
    }

    for (const [marcaId, tiendasForMarca] of tiendasByMarca) {
      const marcaNodeId = `${sector.id}::${marcaId}`;
      result.push({
        id: marcaNodeId,
        parentId: sector.id,
        label: marcaById.get(marcaId)?.label ?? marcaId,
        type: 'marca',
      });

      for (const tienda of tiendasForMarca) {
        result.push({
          id: tienda.id,
          parentId: marcaNodeId,
          label: tienda.label,
          type: 'tienda',
          tiendaContextId: tienda.id,
        });
      }
    }
  }

  return result;
}
