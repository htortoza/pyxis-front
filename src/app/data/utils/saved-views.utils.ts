/**
 * Pure functions + tenant-namespaced localStorage persistence for saved views. There is no
 * backend in this app -- localStorage is a documented mock stand-in for what would be real,
 * per-tenant server-side persistence once one exists.
 */

import type { UserRole } from '../models/mock-user.model';
import type { ApplyViewResult, SavedView } from '../models/saved-view.model';
import { canManageTeamViews as roleCanManageTeamViews } from '../mock/mock-user.mock';
import { DEFAULT_SELECTED_PERIOD_IDS } from '../mock/periods.mock';
import { getDescendantIds } from './tristate.utils';
import type { FilterTreeNode } from './sector-marca-tienda-tree.utils';

const STORAGE_KEY_PREFIX = 'pyxis:saved-views:';

function isSavedView(value: unknown): value is SavedView {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['id'] === 'string' &&
    typeof candidate['label'] === 'string' &&
    typeof candidate['ownerId'] === 'string' &&
    typeof candidate['ownerName'] === 'string' &&
    typeof candidate['tenantId'] === 'string' &&
    (candidate['scope'] === 'personal' || candidate['scope'] === 'equipo') &&
    Array.isArray(candidate['periodIds']) &&
    candidate['periodIds'].every((id) => typeof id === 'string') &&
    typeof candidate['compareToPrevious'] === 'boolean' &&
    Array.isArray(candidate['checkedNodeIds']) &&
    candidate['checkedNodeIds'].every((id) => typeof id === 'string') &&
    typeof candidate['createdAt'] === 'string' &&
    typeof candidate['lastUsedAt'] === 'string'
  );
}

export function loadSavedViews(tenantId: string): SavedView[] {
  try {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${tenantId}`);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isSavedView);
  } catch {
    return [];
  }
}

/** Persists the given views for a tenant. Swallows failures (e.g. quota exceeded) -- a persistence error must never crash the UI. */
export function persistSavedViews(tenantId: string, views: SavedView[]): void {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${tenantId}`, JSON.stringify(views));
  } catch {
    // no-op -- see doc comment above.
  }
}

/**
 * Fallback default views a caller can use when loadSavedViews() returns empty on first run --
 * NOT persisted to localStorage by this function; the caller decides whether/when to persist.
 * Fixed seed timestamp (not `new Date()`) since this is static demo data, not a live event.
 */
const SEED_TIMESTAMP = '2026-06-01T00:00:00.000Z';

export function seedDefaultViews(tenantId: string, ownerId: string, ownerName: string): SavedView[] {
  return [
    {
      id: 'seed-solo-costanera',
      label: 'Solo Costanera',
      ownerId,
      ownerName,
      tenantId,
      scope: 'personal',
      periodIds: [...DEFAULT_SELECTED_PERIOD_IDS],
      compareToPrevious: true,
      checkedNodeIds: ['sector-costanera'],
      createdAt: SEED_TIMESTAMP,
      lastUsedAt: SEED_TIMESTAMP,
    },
    {
      id: 'seed-barra-chalaca',
      label: 'Barra Chalaca',
      ownerId,
      ownerName,
      tenantId,
      scope: 'equipo',
      periodIds: [...DEFAULT_SELECTED_PERIOD_IDS],
      compareToPrevious: true,
      checkedNodeIds: ['sector-costanera::marca-barra-chalaca'],
      createdAt: SEED_TIMESTAMP,
      lastUsedAt: SEED_TIMESTAMP,
    },
  ];
}

/**
 * Views a given user may see: their own personal views, plus every team ("equipo") view
 * regardless of owner. Sorted personal-mine-first, each group ordered by most-recently-used.
 */
export function visibleViewsFor(allViews: SavedView[], userId: string): SavedView[] {
  const personalMine = allViews
    .filter((view) => view.scope === 'personal' && view.ownerId === userId)
    .sort((a, b) => b.lastUsedAt.localeCompare(a.lastUsedAt));

  const equipo = allViews
    .filter((view) => view.scope === 'equipo')
    .sort((a, b) => b.lastUsedAt.localeCompare(a.lastUsedAt));

  return [...personalMine, ...equipo];
}

/**
 * Edit/delete permission: the owner may always edit/delete their own view (personal or
 * equipo). A non-owner may only edit/delete an 'equipo' view, and only if their role can
 * manage team views (HOLDING_ADMIN/CLIENT_ADMIN). A non-owner can never touch another
 * user's personal view, and a non-admin non-owner can never touch a team view either --
 * their only options on a view they don't own and can't manage are "apply" or
 * "duplicate as personal copy" (a separate save-as-new action, not an edit).
 */
export function canEditOrDelete(
  view: SavedView,
  currentUser: { id: string; role: UserRole },
): boolean {
  if (view.ownerId === currentUser.id) {
    return true;
  }
  return view.scope === 'equipo' && roleCanManageTeamViews(currentUser.role);
}

/**
 * Reconciles a saved view's checked nodes against the current allowed Tienda scope.
 *
 * `allowedTiendaContextIds === null` means unrestricted (e.g. HOLDING_ADMIN) -- the view is
 * returned unchanged.
 *
 * Otherwise, each checked node is kept only if EVERY Tienda leaf it resolves to (via
 * tiendaContextId) is in the allowed set; if even one of its descendant Tiendas falls outside
 * the allowed scope, the whole node is dropped rather than silently narrowed. Silently
 * narrowing what a saved view "means" without telling the user exactly what changed would be
 * worse than a clear, explicit all-or-nothing drop per node -- the caller can surface
 * `droppedNodeIds` as a warning naming exactly what didn't apply.
 */
export function reconcileViewToScope(
  view: SavedView,
  allowedTiendaContextIds: string[] | null,
  filterTree: FilterTreeNode[],
): ApplyViewResult {
  if (allowedTiendaContextIds === null) {
    return { view, droppedNodeIds: [] };
  }

  const allowedSet = new Set(allowedTiendaContextIds);
  const nodeById = new Map(filterTree.map((node) => [node.id, node]));

  const keptNodeIds: string[] = [];
  const droppedNodeIds: string[] = [];

  for (const nodeId of view.checkedNodeIds) {
    const node = nodeById.get(nodeId);
    if (!node) {
      // Node no longer exists in the current tree (stale reference) -- drop it.
      droppedNodeIds.push(nodeId);
      continue;
    }

    const tiendaContextIds =
      node.type === 'tienda'
        ? node.tiendaContextId
          ? [node.tiendaContextId]
          : []
        : getDescendantIds(filterTree, node.id)
            .map((id) => nodeById.get(id))
            .filter((descendant): descendant is FilterTreeNode => descendant?.type === 'tienda')
            .map((descendant) => descendant.tiendaContextId)
            .filter((id): id is string => !!id);

    const allInScope =
      tiendaContextIds.length > 0 && tiendaContextIds.every((id) => allowedSet.has(id));

    if (allInScope) {
      keptNodeIds.push(nodeId);
    } else {
      droppedNodeIds.push(nodeId);
    }
  }

  return {
    view: { ...view, checkedNodeIds: keptNodeIds },
    droppedNodeIds,
  };
}

/** Returns a NEW SavedView with lastUsedAt bumped to now -- a real "when was this used" event, not deterministic mock data. */
export function touchLastUsed(view: SavedView): SavedView {
  return { ...view, lastUsedAt: new Date().toISOString() };
}
