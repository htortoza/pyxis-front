/**
 * Generic tristate checkbox tree algorithm -- ported from the "Propagación Hacia Abajo" spec.
 * Operates on any flat, parentId-linked tree shape (TristateNode), not tied to any domain model,
 * so it's reusable for the Sector/Marca/Tienda filter tree or anything else tree-shaped.
 *
 * Deviation from a naive port: upward state (parents becoming checked/indeterminate) is never
 * stored -- `checkedIds` is the single source of truth (only ever holds directly-toggled leaf
 * and ancestor ids from downward propagation), and `computeSelectionStates` derives every node's
 * display state fresh on demand. No separate excluded/indeterminate id arrays to keep in sync.
 */

export interface TristateNode {
  id: string;
  parentId: string | null;
}

export type SelectionState = 'checked' | 'indeterminate' | 'unchecked';

function buildChildrenByParent(tree: TristateNode[]): Map<string, TristateNode[]> {
  const map = new Map<string, TristateNode[]>();
  for (const node of tree) {
    if (node.parentId === null) {
      continue;
    }
    const siblings = map.get(node.parentId) ?? [];
    siblings.push(node);
    map.set(node.parentId, siblings);
  }
  return map;
}

export function getChildren(tree: TristateNode[], parentId: string): TristateNode[] {
  return tree.filter((node) => node.parentId === parentId);
}

export function getDescendantIds(tree: TristateNode[], nodeId: string): string[] {
  const childrenByParent = buildChildrenByParent(tree);
  const result: string[] = [];
  const queue: TristateNode[] = [...(childrenByParent.get(nodeId) ?? [])];

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current.id);
    queue.push(...(childrenByParent.get(current.id) ?? []));
  }

  return result;
}

export function toggleNode(
  tree: TristateNode[],
  nodeId: string,
  checkedIds: ReadonlySet<string>,
): Set<string> {
  const next = new Set(checkedIds);
  const descendantIds = getDescendantIds(tree, nodeId);
  const isCurrentlyChecked = checkedIds.has(nodeId);

  if (isCurrentlyChecked) {
    next.delete(nodeId);
    for (const id of descendantIds) {
      next.delete(id);
    }
  } else {
    next.add(nodeId);
    for (const id of descendantIds) {
      next.add(id);
    }
  }

  return next;
}

export function computeSelectionStates(
  tree: TristateNode[],
  checkedIds: ReadonlySet<string>,
): Map<string, SelectionState> {
  const childrenByParent = buildChildrenByParent(tree);
  const states = new Map<string, SelectionState>();

  // Recursive with memoization -- each node's state is computed once, reading its already-
  // resolved children states (leaves resolve first as the recursion bottoms out on them).
  function resolve(node: TristateNode): SelectionState {
    const cached = states.get(node.id);
    if (cached) {
      return cached;
    }

    const children = childrenByParent.get(node.id) ?? [];
    let state: SelectionState;

    if (children.length === 0) {
      state = checkedIds.has(node.id) ? 'checked' : 'unchecked';
    } else {
      const childStates = children.map(resolve);
      const allChecked = childStates.every((s) => s === 'checked');
      const allUnchecked = childStates.every((s) => s === 'unchecked');
      state = allChecked ? 'checked' : allUnchecked ? 'unchecked' : 'indeterminate';
    }

    states.set(node.id, state);
    return state;
  }

  for (const node of tree) {
    resolve(node);
  }

  return states;
}

export function getEffectiveLeafIds(tree: TristateNode[], checkedIds: ReadonlySet<string>): string[] {
  const parentIds = new Set(
    tree.filter((node) => node.parentId !== null).map((node) => node.parentId as string),
  );
  const isLeaf = (node: TristateNode) => !parentIds.has(node.id);

  return tree.filter((node) => isLeaf(node) && checkedIds.has(node.id)).map((node) => node.id);
}

/**
 * Pure synchronous filter -- no debounce timer in here. Whatever component drives the search
 * input is responsible for debouncing keystrokes before calling this.
 */
export function filterVisibleNodeIds(
  tree: TristateNode[],
  labelOf: (id: string) => string,
  query: string,
): Set<string> {
  if (query.length === 0) {
    return new Set(tree.map((node) => node.id));
  }

  const normalizedQuery = query.toLowerCase();
  const nodeMap = new Map(tree.map((node) => [node.id, node]));
  const visible = new Set<string>();

  for (const node of tree) {
    const label = labelOf(node.id).toLowerCase();
    if (!label.includes(normalizedQuery)) {
      continue;
    }

    let current: TristateNode | undefined = node;
    while (current) {
      visible.add(current.id);
      current = current.parentId !== null ? nodeMap.get(current.parentId) : undefined;
    }
  }

  return visible;
}

export function highlightMatch(
  label: string,
  query: string,
): { before: string; match: string; after: string } | null {
  if (query.length === 0) {
    return null;
  }

  const index = label.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) {
    return null;
  }

  return {
    before: label.slice(0, index),
    match: label.slice(index, index + query.length),
    after: label.slice(index + query.length),
  };
}
