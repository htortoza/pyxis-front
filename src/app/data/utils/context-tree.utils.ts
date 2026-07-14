import type { ContextNode } from '../models/context-node.model';

export function buildNodeMap(tree: ContextNode[]): Map<string, ContextNode> {
  const map = new Map<string, ContextNode>();
  for (const node of tree) {
    map.set(node.id, node);
  }
  return map;
}

export function getDescendantLeafIds(tree: ContextNode[], nodeId: string): string[] {
  const nodeMap = buildNodeMap(tree);
  const target = nodeMap.get(nodeId);
  if (!target) {
    return [];
  }
  if (target.type === 'TIENDA') {
    return [target.id];
  }

  const childrenByParent = new Map<string, ContextNode[]>();
  for (const node of tree) {
    if (node.parentId === null) {
      continue;
    }
    const siblings = childrenByParent.get(node.parentId) ?? [];
    siblings.push(node);
    childrenByParent.set(node.parentId, siblings);
  }

  const leaves: string[] = [];
  const stack: ContextNode[] = [target];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current.type === 'TIENDA') {
      leaves.push(current.id);
      continue;
    }
    const children = childrenByParent.get(current.id) ?? [];
    stack.push(...children);
  }
  return leaves;
}

/**
 * Marca/Sector are horizontal tags directly on each Tienda (leaf) node, not ancestors in the
 * containment tree -- so this just reads them off, it doesn't walk parentId links.
 */
export function buildStoreAncestryMap(
  tree: ContextNode[],
): Map<string, { sectorId: string; marcaId: string }> {
  const result = new Map<string, { sectorId: string; marcaId: string }>();

  for (const node of tree) {
    if (node.type !== 'TIENDA') {
      continue;
    }
    result.set(node.id, { sectorId: node.sectorId ?? '', marcaId: node.marcaId ?? '' });
  }

  return result;
}

export function toPrimeNgTreeNodes(tree: ContextNode[]): any[] {
  const childrenByParent = new Map<string, ContextNode[]>();
  for (const node of tree) {
    if (node.parentId === null) {
      continue;
    }
    const siblings = childrenByParent.get(node.parentId) ?? [];
    siblings.push(node);
    childrenByParent.set(node.parentId, siblings);
  }

  const root = tree.find((node) => node.type === 'HOLDING');
  if (!root) {
    return [];
  }

  function buildNode(node: ContextNode): any {
    const children = childrenByParent.get(node.id) ?? [];
    return {
      key: node.id,
      label: node.label,
      data: node,
      children: children.map(buildNode),
    };
  }

  return [buildNode(root)];
}
