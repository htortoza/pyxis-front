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
  if (target.type === 'LOCAL') {
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
    if (current.type === 'LOCAL') {
      leaves.push(current.id);
      continue;
    }
    const children = childrenByParent.get(current.id) ?? [];
    stack.push(...children);
  }
  return leaves;
}

export function buildStoreAncestryMap(
  tree: ContextNode[],
): Map<string, { sectorId: string; marcaId: string }> {
  const nodeMap = buildNodeMap(tree);
  const result = new Map<string, { sectorId: string; marcaId: string }>();

  for (const node of tree) {
    if (node.type !== 'LOCAL') {
      continue;
    }

    let sectorId = '';
    let marcaId = '';
    let current: ContextNode | undefined = node;
    while (current && current.parentId !== null) {
      current = nodeMap.get(current.parentId);
      if (!current) {
        break;
      }
      if (current.type === 'SECTOR') {
        sectorId = current.id;
      } else if (current.type === 'MARCA') {
        marcaId = current.id;
      }
    }

    result.set(node.id, { sectorId, marcaId });
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
