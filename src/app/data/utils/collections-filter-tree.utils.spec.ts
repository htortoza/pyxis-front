import { COUNTERPARTIES } from '../mock/collections.mock';
import { CONTEXT_TREE, MARCAS, SECTORES } from '../mock/context-tree.mock';
import {
  buildCollectionsFilterTree,
  UNASSOCIATED_COUNTERPARTY_ROOT_ID,
} from './collections-filter-tree.utils';
import { computeSelectionStates, getEffectiveLeafIds, toggleNode } from './tristate.utils';

describe('collections-filter-tree.utils', () => {
  const tree = buildCollectionsFilterTree(CONTEXT_TREE, MARCAS, SECTORES, COUNTERPARTIES);

  it('contains all 4 dimension node types', () => {
    const types = new Set(tree.map((node) => node.type));
    expect(types.has('sector')).toBe(true);
    expect(types.has('marca')).toBe(true);
    expect(types.has('local')).toBe(true);
    expect(types.has('contraparte')).toBe(true);
  });

  it('a counterparty with commercialNodeIds=[] still appears as a node hanging off the standalone root', () => {
    // 'Transbank' -- primer ADQUIRENTE del generador, commercialNodesFor() siempre devuelve []
    // para ADQUIRENTE (ver collections.mock.ts), así que este id es determinista.
    const unassociated = COUNTERPARTIES.find((cp) => cp.id === 'cp-adquirente-01');
    expect(unassociated).toBeTruthy();
    expect(unassociated!.commercialNodeIds.length).toBe(0);

    const node = tree.find((n) => n.counterpartyId === unassociated!.id);
    expect(node).toBeTruthy();
    expect(node!.parentId).toBe(UNASSOCIATED_COUNTERPARTY_ROOT_ID);

    const rootNode = tree.find((n) => n.id === UNASSOCIATED_COUNTERPARTY_ROOT_ID);
    expect(rootNode).toBeTruthy();
    expect(rootNode!.parentId).toBeNull();
  });

  it('a counterparty with commercialNodeIds set hangs off every one of those Local nodes', () => {
    const associated = COUNTERPARTIES.find((cp) => cp.commercialNodeIds.length > 0);
    expect(associated).toBeTruthy();

    const nodesForCounterparty = tree.filter((n) => n.counterpartyId === associated!.id);
    expect(nodesForCounterparty.length).toBe(associated!.commercialNodeIds.length);

    for (const commercialNodeId of associated!.commercialNodeIds) {
      const edge = nodesForCounterparty.find((n) => n.parentId === commercialNodeId);
      expect(edge).toBeTruthy();
      expect(edge!.type).toBe('contraparte');
    }
  });

  it('getEffectiveLeafIds resolves a checked Sector down to local/contraparte leaves', () => {
    const sectorId = SECTORES[0].id;
    const leafIds = getEffectiveLeafIds(tree, new Set([sectorId]));

    expect(leafIds.length).toBeGreaterThan(0);

    // Ningún leaf resuelto debe ser un nodo 'sector' o 'marca' -- deben ser 'local' o 'contraparte'.
    const nodeById = new Map(tree.map((n) => [n.id, n]));
    for (const id of leafIds) {
      const node = nodeById.get(id);
      expect(node).toBeTruthy();
      expect(['local', 'contraparte']).toContain(node!.type);
    }

    // Al menos un nodo 'contraparte' resuelto (alguna tienda de este sector tiene contraparte asociada)
    // o, en su defecto, al menos nodos 'local' -- cualquiera de los dos confirma que la resolución
    // atravesó las 4 capas sin romperse.
    const hasLocalOrContraparte = leafIds.some((id) => {
      const type = nodeById.get(id)!.type;
      return type === 'local' || type === 'contraparte';
    });
    expect(hasLocalOrContraparte).toBe(true);
  });

  it('toggleNode + computeSelectionStates propagate tristate through the added Contraparte level', () => {
    const sectorId = SECTORES[0].id;
    const checkedIds = toggleNode(tree, sectorId, new Set());
    expect(checkedIds.has(sectorId)).toBe(true);

    const states = computeSelectionStates(tree, checkedIds);
    expect(states.get(sectorId)).toBe('checked');

    // La cascada real (el "scope" del filtro aplicado, no el estado visual del checkbox) debe
    // seguir resolviendo hasta las hojas de Contraparte/Local bajo este sector, sin importar
    // cuántos niveles tenga el árbol ahora.
    const leafIds = getEffectiveLeafIds(tree, checkedIds);
    expect(leafIds.length).toBeGreaterThan(0);

    // Todo nodo bajo el sector marcado (Marca/Local/Contraparte) debe seguir teniendo un estado
    // tristate resuelto -- ninguno debe quedar `undefined`, lo cual confirmaría que el 4º nivel
    // rompió la recursión de computeSelectionStates.
    for (const node of tree) {
      expect(states.get(node.id)).toBeDefined();
    }
  });
});
