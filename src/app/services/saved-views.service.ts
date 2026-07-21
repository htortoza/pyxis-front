import { Injectable, computed, inject, signal } from '@angular/core';

import type { ComparisonAlignment, ComparisonMode } from '../data/models/comparison.model';
import type { IvaMode } from '../data/models/iva.model';
import type { PeriodGranularity } from '../data/models/period.model';
import { CURRENT_USER, canManageTeamViews as roleCanManageTeamViews } from '../data/mock/mock-user.mock';
import type { SavedView, SavedViewScope, ApplyViewResult } from '../data/models/saved-view.model';
import { logAudit } from '../data/utils/audit-log.utils';
import {
  canEditOrDelete,
  loadSavedViews,
  persistSavedViews,
  reconcileViewToScope,
  seedDefaultViews,
  touchLastUsed,
  visibleViewsFor,
} from '../data/utils/saved-views.utils';
import type { FilterTreeNode } from '../data/utils/sector-marca-tienda-tree.utils';
import { getEffectiveLeafIds } from '../data/utils/tristate.utils';
import { SalesDataService } from './sales-data.service';

/**
 * Owns saved-views state for the header's Sector/Marca/Tienda filter (shared by both Ventas
 * General and Detalle de Ventas). There is no backend in this app --
 * `currentUser` is a hardcoded mock standing in for real auth (see CURRENT_USER doc comment),
 * and persistence goes through the localStorage-backed utils in saved-views.utils.ts, which are
 * themselves a documented stand-in for real per-tenant server-side storage.
 */
@Injectable({ providedIn: 'root' })
export class SavedViewsService {
  private readonly salesData = inject(SalesDataService);

  /** Mock stand-in for the real logged-in user -- see CURRENT_USER doc comment in mock-user.mock.ts. */
  readonly currentUser = CURRENT_USER;

  private readonly _views = signal<SavedView[]>(this.loadInitial());

  /** Views the current user may see: their own personal views + every team view, most-recently-used first. */
  readonly visibleViews = computed(() => visibleViewsFor(this._views(), this.currentUser.id));

  /** Whether the current user's role allows creating/editing/deleting team ("equipo") views. */
  readonly canCreateTeamViews = computed(() => roleCanManageTeamViews(this.currentUser.role));

  private loadInitial(): SavedView[] {
    const stored = loadSavedViews(this.currentUser.tenantId);
    if (stored.length > 0) {
      return stored;
    }
    const seeded = seedDefaultViews(this.currentUser.tenantId, this.currentUser.id, this.currentUser.name);
    persistSavedViews(this.currentUser.tenantId, seeded);
    return seeded;
  }

  /** Guarda el DRAFT que el usuario está configurando en el modal (aplicado o no) como una vista nueva. */
  saveCurrentSelection(input: {
    label: string;
    scope: SavedViewScope;
    checkedNodeIds: string[];
    periodIds: string[];
    granularity: PeriodGranularity;
    compareToPrevious: boolean;
    comparisonMode: ComparisonMode;
    comparisonAlignment: ComparisonAlignment;
    explicitComparisonPeriodIds: string[] | null;
    ivaMode: IvaMode;
  }): void {
    const now = new Date().toISOString();
    const view: SavedView = {
      id: crypto.randomUUID(),
      label: input.label,
      ownerId: this.currentUser.id,
      ownerName: this.currentUser.name,
      tenantId: this.currentUser.tenantId,
      scope: input.scope,
      periodIds: [...input.periodIds],
      granularity: input.granularity,
      compareToPrevious: input.compareToPrevious,
      comparisonMode: input.comparisonMode,
      comparisonAlignment: input.comparisonAlignment,
      explicitComparisonPeriodIds: input.explicitComparisonPeriodIds
        ? [...input.explicitComparisonPeriodIds]
        : null,
      ivaMode: input.ivaMode,
      checkedNodeIds: [...input.checkedNodeIds],
      createdAt: now,
      lastUsedAt: now,
    };

    const next = [...this._views(), view];
    this.persistAndSet(next);

    if (view.scope === 'equipo') {
      logAudit({
        entity: 'saved_view',
        entityId: view.id,
        entityLabel: view.label,
        action: 'create',
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        tenantId: this.currentUser.tenantId,
      });
    }
  }

  /** No-ops silently if the current user isn't allowed to delete this view (see canEditOrDelete doc comment). */
  deleteView(viewId: string): void {
    const view = this._views().find((candidate) => candidate.id === viewId);
    if (!view || !canEditOrDelete(view, this.currentUser)) {
      return;
    }

    const next = this._views().filter((candidate) => candidate.id !== viewId);
    this.persistAndSet(next);

    if (view.scope === 'equipo') {
      logAudit({
        entity: 'saved_view',
        entityId: view.id,
        entityLabel: view.label,
        action: 'delete',
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        tenantId: this.currentUser.tenantId,
      });
    }
  }

  /** Minimal "edit" -- renames the view's label. No-ops silently if not allowed (see canEditOrDelete doc comment). */
  renameView(viewId: string, newLabel: string): void {
    const view = this._views().find((candidate) => candidate.id === viewId);
    if (!view || !canEditOrDelete(view, this.currentUser)) {
      return;
    }

    const renamed: SavedView = { ...view, label: newLabel };
    const next = this._views().map((candidate) => (candidate.id === viewId ? renamed : candidate));
    this.persistAndSet(next);

    if (view.scope === 'equipo') {
      logAudit({
        entity: 'saved_view',
        entityId: view.id,
        entityLabel: newLabel,
        action: 'update',
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        tenantId: this.currentUser.tenantId,
      });
    }
  }

  /**
   * Applies a saved view: reconciles it against the current allowed Tienda scope, pushes the
   * reconciled selection into SalesDataService, bumps lastUsedAt, and returns the reconciliation
   * result so the caller can warn about anything that got dropped (droppedNodeIds).
   */
  applyView(
    viewId: string,
    allowedTiendaContextIds: string[] | null,
    filterTree: FilterTreeNode[],
  ): ApplyViewResult | null {
    const view = this._views().find((candidate) => candidate.id === viewId);
    if (!view) {
      return null;
    }

    const result = reconcileViewToScope(view, allowedTiendaContextIds, filterTree);

    this.salesData.selectedPeriodIds.set([...result.view.periodIds]);
    this.salesData.selectedPeriodGranularity.set(result.view.granularity);
    this.salesData.compareToPrevious.set(result.view.compareToPrevious);
    this.salesData.comparisonMode.set(result.view.comparisonMode);
    this.salesData.comparisonAlignment.set(result.view.comparisonAlignment);
    this.salesData.explicitComparisonPeriodIds.set(
      result.view.explicitComparisonPeriodIds ? [...result.view.explicitComparisonPeriodIds] : null,
    );
    this.salesData.ivaMode.set(result.view.ivaMode);

    const effectiveLeafIds = getEffectiveLeafIds(filterTree, new Set(result.view.checkedNodeIds));
    const nodeById = new Map(filterTree.map((node) => [node.id, node]));
    const tiendaContextIds = effectiveLeafIds
      .map((id) => nodeById.get(id)?.tiendaContextId)
      .filter((id): id is string => !!id);
    // A view that never had a context filter means "unfiltered" (null). But a view that DID
    // have one, which reconciliation then dropped entirely for being out of scope, must NOT
    // fall back to "unfiltered" -- that would leak access to data the view never granted.
    // It becomes an explicit empty allowlist (show nothing) instead.
    const hadOriginalFilter = view.checkedNodeIds.length > 0;
    this.salesData.setSectorMarcaTiendaFilter(hadOriginalFilter ? tiendaContextIds : null);

    const touched = touchLastUsed(view);
    const next = this._views().map((candidate) => (candidate.id === viewId ? touched : candidate));
    this.persistAndSet(next);

    return result;
  }

  /** Saves the current user's own editable personal copy of any view they can see (e.g. a VIEWER_ESTRATEGICO copying a team view). Not audited -- personal views aren't per the spec. */
  duplicateAsPersonal(viewId: string, newLabel: string): void {
    const source = this._views().find((candidate) => candidate.id === viewId);
    if (!source) {
      return;
    }

    const now = new Date().toISOString();
    const copy: SavedView = {
      ...source,
      id: crypto.randomUUID(),
      label: newLabel,
      ownerId: this.currentUser.id,
      ownerName: this.currentUser.name,
      scope: 'personal',
      createdAt: now,
      lastUsedAt: now,
    };

    const next = [...this._views(), copy];
    this.persistAndSet(next);
  }

  private persistAndSet(views: SavedView[]): void {
    persistSavedViews(this.currentUser.tenantId, views);
    this._views.set(views);
  }
}
