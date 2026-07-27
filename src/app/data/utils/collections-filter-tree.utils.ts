import type { ContextNode } from '../models/context-node.model';
import type { Counterparty } from '../models/collections.model';
import type { Marca, Sector } from '../models/marca-sector.model';

/**
 * Root of the "sin asociación comercial" bucket -- a standalone, parentId=null node that lives
 * alongside the Sector roots. Counterparties with an empty `commercialNodeIds` (adquirentes de
 * medios de pago, gift cards, agregadores -- ver collections.mock.ts) hang from here instead of
 * being dropped, so the "no commercial association" edge case still lists and never breaks the
 * cascading filter (spec §1.5 / plan Task 5).
 */
export const UNASSOCIATED_COUNTERPARTY_ROOT_ID = 'contraparte-sin-asociacion';

/**
 * Cobranzas' filter-tree node. Deliberately NOT `FilterTreeNode`/`FilterNodeType` from
 * sector-marca-tienda-tree.utils.ts -- `type` is a plain string so `contraparte` can exist here
 * without becoming a member of Ventas' shared `FilterNodeType` union (see
 * [[feedback-backend-contract-is-fixed]]). `id`/`parentId` keep identical semantics to
 * `FilterTreeNode` so tristate.utils' `computeSelectionStates`/`toggleNode`/`getEffectiveLeafIds`/
 * `getDescendantIds` operate on it unchanged.
 */
export interface CollectionsFilterNode {
  /**
   * sector: real Sector.id. marca: composite `${sectorId}::${marcaId}` (same reasoning as
   * FilterTreeNode -- a Marca isn't exclusively owned by one Sector). local: real ContextNode.id
   * (TIENDA). contraparte: composite `${parentId}::${counterpartyId}` -- a counterparty can be
   * associated with 1-3 Local nodes (`commercialNodeIds`), so it needs one node per edge to avoid
   * id collisions in the flat, parentId-linked array; the standalone-root bucket itself is also a
   * `contraparte`-typed node with a fixed id (`UNASSOCIATED_COUNTERPARTY_ROOT_ID`).
   */
  id: string;
  parentId: string | null;
  label: string;
  type: string;
  /** Only set on 'contraparte' leaf nodes -- the real Counterparty.id, for mapping back to documents. */
  counterpartyId?: string;
  /** Only set on 'local' nodes -- the real ContextNode.id, for mapping back to sales/collections facts. */
  tiendaContextId?: string;
}

/**
 * Builds the 4-dimension Cobranzas filter tree: Sector > Marca > Local (mirrors
 * `buildSectorMarcaTiendaTree` exactly -- same grouping by each Tienda's sectorId/marcaId tags,
 * only the leaf level is labeled 'local' instead of 'tienda') plus a 4th Contraparte level.
 *
 * A counterparty hangs from every Local node in its `commercialNodeIds` (one node per edge, since
 * the same counterparty can be associated with several locales). A counterparty with an empty
 * `commercialNodeIds` (adquirentes/gift cards/agregadores that operate tenant-wide, not per local
 * -- see collections.mock.ts) hangs from the standalone `UNASSOCIATED_COUNTERPARTY_ROOT_ID` root
 * instead, so it still appears in the tree and the cascade never breaks.
 */
export function buildCollectionsFilterTree(
  contextTree: ContextNode[],
  marcas: Marca[],
  sectores: Sector[],
  counterparties: Counterparty[],
): CollectionsFilterNode[] {
  const marcaById = new Map(marcas.map((marca) => [marca.id, marca]));
  const tiendas = contextTree.filter((node) => node.type === 'TIENDA');

  const result: CollectionsFilterNode[] = [];

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
          type: 'local',
          tiendaContextId: tienda.id,
        });
      }
    }
  }

  // 4th level: Contraparte. The standalone root always exists, even if every counterparty in
  // this tenant happens to have a commercial association -- an empty bucket is harmless and
  // keeps the tree shape predictable.
  result.push({
    id: UNASSOCIATED_COUNTERPARTY_ROOT_ID,
    parentId: null,
    label: 'Sin asociación comercial',
    type: 'contraparte',
  });

  for (const counterparty of counterparties) {
    if (counterparty.commercialNodeIds.length === 0) {
      result.push({
        id: `${UNASSOCIATED_COUNTERPARTY_ROOT_ID}::${counterparty.id}`,
        parentId: UNASSOCIATED_COUNTERPARTY_ROOT_ID,
        label: counterparty.label,
        type: 'contraparte',
        counterpartyId: counterparty.id,
      });
      continue;
    }

    for (const commercialNodeId of counterparty.commercialNodeIds) {
      result.push({
        id: `${commercialNodeId}::${counterparty.id}`,
        parentId: commercialNodeId,
        label: counterparty.label,
        type: 'contraparte',
        counterpartyId: counterparty.id,
      });
    }
  }

  return result;
}
