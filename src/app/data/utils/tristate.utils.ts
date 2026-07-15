/**
 * Generic checkbox tree algorithm for the Sector/Marca/Tienda filter (or anything else
 * tree-shaped -- operates on any flat, parentId-linked TristateNode[], not a domain model).
 *
 * Per an explicit product decision, checking a node does NOT tick its descendants' checkboxes --
 * clicking a Sector's checkbox only checks that Sector itself (navigation into it, i.e. which
 * Marcas/Tiendas are *shown* in the next column, is a separate concern entirely -- see
 * ContextFilterComponent.toggleCheckbox). `checkedIds` therefore only ever holds exactly the
 * node ids the user explicitly toggled, never anything added by cascading.
 *
 * What still cascades: an explicit check on a branch means everything under it is "in scope"
 * for the actual applied filter (getEffectiveLeafIds expands a checked branch to all its
 * descendant leaves) -- only the visual checkbox state of the descendants doesn't change.
 * A branch's own displayed state also still derives from its children when the branch itself
 * hasn't been explicitly checked (so manually checking individual leaves still surfaces
 * indeterminate/checked on their ancestors, same as before).
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

/**
 * Toggles exactly `nodeId` -- no cascading in either direction. Checking a Sector checks only
 * that Sector; any Marcas/Tiendas individually checked before or after are entirely independent.
 */
export function toggleNode(
  tree: TristateNode[],
  nodeId: string,
  checkedIds: ReadonlySet<string>,
): Set<string> {
  const next = new Set(checkedIds);
  if (next.has(nodeId)) {
    next.delete(nodeId);
  } else {
    next.add(nodeId);
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

    // An explicit check always wins, leaf or branch -- a checked Sector displays as solidly
    // checked even though its Marcas/Tiendas were never individually ticked (see file header).
    if (checkedIds.has(node.id)) {
      states.set(node.id, 'checked');
      return 'checked';
    }

    const children = childrenByParent.get(node.id) ?? [];
    let state: SelectionState;

    if (children.length === 0) {
      state = 'unchecked';
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

/**
 * The actual filtering scope: for every explicitly checked node, either itself (if it's a leaf)
 * or all of its descendant leaves (if it's a branch) -- since checking a branch no longer ticks
 * its children's own checkboxes, this is what restores "checking a Sector scopes to everything
 * under it" for the applied filter, independent of what's visually shown as checked.
 */
export function getEffectiveLeafIds(tree: TristateNode[], checkedIds: ReadonlySet<string>): string[] {
  const parentIds = new Set(
    tree.filter((node) => node.parentId !== null).map((node) => node.parentId as string),
  );
  const isLeaf = (node: TristateNode) => !parentIds.has(node.id);
  const nodeById = new Map(tree.map((node) => [node.id, node]));

  const result = new Set<string>();
  for (const id of checkedIds) {
    const node = nodeById.get(id);
    if (!node) {
      continue;
    }
    if (isLeaf(node)) {
      result.add(id);
      continue;
    }
    for (const descendantId of getDescendantIds(tree, id)) {
      const descendant = nodeById.get(descendantId);
      if (descendant && isLeaf(descendant)) {
        result.add(descendantId);
      }
    }
  }
  return [...result];
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
