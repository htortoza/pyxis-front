import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Popover } from 'primeng/popover';

import { CONTEXT_TREE, MARCAS, SECTORES } from '../../../data/mock/context-tree.mock';
import type { SavedView, SavedViewScope } from '../../../data/models/saved-view.model';
import {
  buildSectorMarcaTiendaTree,
  type FilterNodeType,
  type FilterTreeNode,
} from '../../../data/utils/sector-marca-tienda-tree.utils';
import {
  computeSelectionStates,
  filterVisibleNodeIds,
  getDescendantIds,
  getEffectiveLeafIds,
  highlightMatch,
  toggleNode,
  type SelectionState,
} from '../../../data/utils/tristate.utils';
import { SalesDataService } from '../../../services/sales-data.service';
import { SavedViewsService } from '../../../services/saved-views.service';

interface DebouncedSearch {
  raw: WritableSignal<string>;
  debounced: Signal<string>;
}

/** Same debounce-via-rxjs-interop pattern SalesDataService already uses for its filter pipeline. */
function createDebouncedSearch(): DebouncedSearch {
  const raw = signal('');
  const debounced = toSignal(toObservable(raw).pipe(debounceTime(300)), { initialValue: '' });
  return { raw, debounced };
}

/**
 * Sector/Marca/Tienda context filter, with an embedded "Vistas Guardadas" panel per the
 * product spec (saved views live in the same filter panel, not a separate popover). Lives in
 * GlobalHeaderComponent, so it applies to (and is editable from) both Ventas General and
 * Detalle de Ventas. Follows the same draft/apply popover shell as PeriodPickerComponent.
 */
@Component({
  selector: 'app-context-filter',
  standalone: true,
  imports: [Button, Checkbox, FormsModule, IconField, InputIcon, InputText, Message, Popover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './context-filter.html',
  styleUrl: './context-filter.css',
})
export class ContextFilterComponent {
  protected readonly salesData = inject(SalesDataService);
  protected readonly savedViews = inject(SavedViewsService);

  /** Static mock data -- built once, never recomputed reactively. */
  protected readonly filterTree: FilterTreeNode[] = buildSectorMarcaTiendaTree(
    CONTEXT_TREE,
    MARCAS,
    SECTORES,
  );
  private readonly nodeById = new Map(this.filterTree.map((node) => [node.id, node]));
  private readonly labelOf = (id: string): string => this.nodeById.get(id)?.label ?? '';

  /** Draft selection -- only synced from the applied filter on (onShow), applied explicitly. */
  protected readonly checkedIds = signal<Set<string>>(new Set());
  protected readonly selectionStates = computed(() =>
    computeSelectionStates(this.filterTree, this.checkedIds()),
  );

  /** Navigation state (which sector/marca column 2/3 are currently showing) -- separate from selection. */
  protected readonly navSectorId = signal<string | null>(null);
  protected readonly navMarcaId = signal<string | null>(null);

  protected readonly sectorSearch = createDebouncedSearch();
  protected readonly marcaSearch = createDebouncedSearch();
  protected readonly tiendaSearch = createDebouncedSearch();
  protected readonly globalSearch = createDebouncedSearch();
  protected readonly savedViewsSearch = createDebouncedSearch();

  private readonly visibleSectorIds = computed(() =>
    filterVisibleNodeIds(this.filterTree, this.labelOf, this.sectorSearch.debounced()),
  );
  private readonly visibleMarcaIds = computed(() =>
    filterVisibleNodeIds(this.filterTree, this.labelOf, this.marcaSearch.debounced()),
  );
  private readonly visibleTiendaIds = computed(() =>
    filterVisibleNodeIds(this.filterTree, this.labelOf, this.tiendaSearch.debounced()),
  );

  protected readonly sectorRows = computed(() =>
    this.filterTree.filter((node) => node.type === 'sector' && this.visibleSectorIds().has(node.id)),
  );

  protected readonly marcaRows = computed(() => {
    const sectorId = this.navSectorId();
    if (!sectorId) return [];
    const visible = this.visibleMarcaIds();
    return this.filterTree.filter(
      (node) => node.type === 'marca' && node.parentId === sectorId && visible.has(node.id),
    );
  });

  protected readonly tiendaRows = computed(() => {
    const marcaId = this.navMarcaId();
    if (!marcaId) return [];
    const visible = this.visibleTiendaIds();
    return this.filterTree.filter(
      (node) => node.type === 'tienda' && node.parentId === marcaId && visible.has(node.id),
    );
  });

  /** Direct label hits only (not ancestor-of-a-match) -- used for the global search results list. */
  protected readonly globalResults = computed(() => {
    const query = this.globalSearch.debounced().trim().toLowerCase();
    if (!query) return [];
    return this.filterTree.filter((node) => node.label.toLowerCase().includes(query));
  });

  protected readonly breadcrumbSectorLabel = computed(() => {
    const id = this.navSectorId();
    return id ? this.labelOf(id) : null;
  });
  protected readonly breadcrumbMarcaLabel = computed(() => {
    const id = this.navMarcaId();
    return id ? this.labelOf(id) : null;
  });

  protected readonly summaryText = computed(() => {
    const states = this.selectionStates();
    const countActive = (type: FilterNodeType) =>
      this.filterTree
        .filter((node) => node.type === type)
        .filter((node) => {
          const state = states.get(node.id);
          return state === 'checked' || state === 'indeterminate';
        }).length;

    const sectores = countActive('sector');
    const marcas = countActive('marca');
    const tiendas = getEffectiveLeafIds(this.filterTree, this.checkedIds()).length;

    const parts: string[] = [];
    if (sectores > 0) parts.push(`${sectores} sector${sectores === 1 ? '' : 'es'}`);
    if (marcas > 0) parts.push(`${marcas} marca${marcas === 1 ? '' : 's'}`);
    if (tiendas > 0) {
      parts.push(`${tiendas} tienda${tiendas === 1 ? '' : 's'} seleccionada${tiendas === 1 ? '' : 's'}`);
    }

    return parts.length > 0 ? parts.join(' · ') : 'Sin selección';
  });

  /** Live summary of the APPLIED (not draft) filter, shown on the trigger button. */
  protected readonly triggerLabel = computed(() => {
    const applied = this.salesData.sectorMarcaTiendaFilter();
    if (!applied || applied.length === 0) return 'Sin filtro de contexto';
    return `${applied.length} tienda${applied.length === 1 ? '' : 's'} seleccionada${applied.length === 1 ? '' : 's'}`;
  });

  protected readonly canSaveCurrent = computed(() => this.checkedIds().size > 0);

  protected readonly suggestedLabel = computed(() => {
    const states = this.selectionStates();
    const topChecked = this.filterTree
      .filter((node) => node.parentId === null)
      .filter((node) => {
        const state = states.get(node.id);
        return state === 'checked' || state === 'indeterminate';
      })
      .slice(0, 3)
      .map((node) => node.label);

    const base = topChecked.length > 0 ? topChecked.join(' · ') : 'Selección personalizada';
    const periodCount = this.salesData.selectedPeriodIds().length;
    return `${base} · ${periodCount} periodo${periodCount === 1 ? '' : 's'}`;
  });

  protected readonly filteredSavedViews = computed(() => {
    const query = this.savedViewsSearch.debounced().trim().toLowerCase();
    const views = this.savedViews.visibleViews();
    if (!query) return views;
    return views.filter((view) => view.label.toLowerCase().includes(query));
  });

  protected readonly warningMessage = signal<string | null>(null);
  protected readonly editingViewId = signal<string | null>(null);
  protected readonly renameDraft = signal('');
  protected readonly showSaveForm = signal(false);
  protected readonly saveLabel = signal('');
  protected readonly saveScope = signal<SavedViewScope>('personal');

  /** Reseeds the draft (and resets navigation/search/save-form UI) every time the popover opens. */
  onPopoverShow(): void {
    this.checkedIds.set(new Set(this.salesData.sectorMarcaTiendaFilter() ?? []));
    this.navSectorId.set(null);
    this.navMarcaId.set(null);
    this.sectorSearch.raw.set('');
    this.marcaSearch.raw.set('');
    this.tiendaSearch.raw.set('');
    this.globalSearch.raw.set('');
    this.savedViewsSearch.raw.set('');
    this.showSaveForm.set(false);
    this.editingViewId.set(null);
    this.warningMessage.set(null);
  }

  nodeState(nodeId: string): SelectionState {
    return this.selectionStates().get(nodeId) ?? 'unchecked';
  }

  isChecked(nodeId: string): boolean {
    return this.nodeState(nodeId) === 'checked';
  }

  isIndeterminate(nodeId: string): boolean {
    return this.nodeState(nodeId) === 'indeterminate';
  }

  toggleCheckbox(nodeId: string): void {
    const wasChecked = this.checkedIds().has(nodeId);
    this.checkedIds.set(toggleNode(this.filterTree, nodeId, this.checkedIds()));

    // Checking (not unchecking) a Sector/Marca also navigates into it, so its children show
    // up in the next column right away -- a convenience on top of the separate navigate-by-
    // clicking-the-row-body gesture, which still works independently for browsing without selecting.
    if (wasChecked) {
      return;
    }
    const node = this.nodeById.get(nodeId);
    if (node?.type === 'sector') {
      this.navigateToSector(node);
    } else if (node?.type === 'marca') {
      this.navigateToMarca(node);
    }
  }

  /**
   * Leaf(tienda)-count ratio for a Sector/Marca row's descendant badge. Counts *effective*
   * coverage (getEffectiveLeafIds), not raw checkbox state -- checking a Sector no longer ticks
   * its Tiendas' own checkboxes, but they ARE all in scope for the applied filter, and the badge
   * should say so (otherwise a checked Sector would misleadingly show "0/12").
   */
  descendantBadge(nodeId: string): { checked: number; total: number } {
    const effective = new Set(getEffectiveLeafIds(this.filterTree, this.checkedIds()));
    const leafIds = getDescendantIds(this.filterTree, nodeId).filter(
      (id) => this.nodeById.get(id)?.type === 'tienda',
    );
    const checked = leafIds.filter((id) => effective.has(id)).length;
    return { checked, total: leafIds.length };
  }

  highlight(label: string, query: string) {
    return highlightMatch(label, query);
  }

  pathFor(node: FilterTreeNode): string {
    const parts: string[] = [];
    let current: FilterTreeNode | undefined = node;
    while (current) {
      parts.unshift(current.label);
      current = current.parentId ? this.nodeById.get(current.parentId) : undefined;
    }
    return parts.join(' / ');
  }

  navigateToSector(node: FilterTreeNode): void {
    this.navSectorId.set(node.id);
    this.navMarcaId.set(null);
  }

  navigateToMarca(node: FilterTreeNode): void {
    this.navMarcaId.set(node.id);
  }

  navigateToResult(node: FilterTreeNode): void {
    if (node.type === 'sector') {
      this.navSectorId.set(node.id);
      this.navMarcaId.set(null);
    } else if (node.type === 'marca') {
      this.navSectorId.set(node.parentId);
      this.navMarcaId.set(node.id);
    } else {
      const marca = node.parentId ? this.nodeById.get(node.parentId) : undefined;
      this.navSectorId.set(marca?.parentId ?? null);
      this.navMarcaId.set(node.parentId);
    }
  }

  resetToAllSectors(): void {
    this.navSectorId.set(null);
    this.navMarcaId.set(null);
  }

  resetToSector(): void {
    this.navMarcaId.set(null);
  }

  canEditOrDeleteView(view: SavedView): boolean {
    return (
      view.ownerId === this.savedViews.currentUser.id ||
      (view.scope === 'equipo' && this.savedViews.canCreateTeamViews())
    );
  }

  onApplyView(viewId: string): void {
    const result = this.savedViews.applyView(viewId, null, this.filterTree);
    this.warningMessage.set(
      result && result.droppedNodeIds.length > 0
        ? 'Algunos elementos de esta vista ya no están disponibles y no se aplicaron.'
        : null,
    );
    // applyView writes straight into SalesDataService, bypassing this component's own draft --
    // resync so further manual edits in this session build on the just-applied state.
    this.checkedIds.set(new Set(this.salesData.sectorMarcaTiendaFilter() ?? []));
  }

  onDeleteView(viewId: string): void {
    this.savedViews.deleteView(viewId);
  }

  startRename(view: SavedView): void {
    this.editingViewId.set(view.id);
    this.renameDraft.set(view.label);
  }

  confirmRename(viewId: string): void {
    const label = this.renameDraft().trim();
    if (label) {
      this.savedViews.renameView(viewId, label);
    }
    this.editingViewId.set(null);
  }

  cancelRename(): void {
    this.editingViewId.set(null);
  }

  onDuplicateView(view: SavedView): void {
    this.savedViews.duplicateAsPersonal(view.id, `${view.label} (copia)`);
  }

  openSaveForm(): void {
    this.saveLabel.set(this.suggestedLabel());
    this.saveScope.set('personal');
    this.showSaveForm.set(true);
  }

  cancelSaveForm(): void {
    this.showSaveForm.set(false);
  }

  confirmSave(): void {
    const label = this.saveLabel().trim();
    if (!label) return;
    this.savedViews.saveCurrentSelection({
      label,
      scope: this.saveScope(),
      checkedNodeIds: [...this.checkedIds()],
    });
    this.showSaveForm.set(false);
    this.saveLabel.set('');
  }

  dismissWarning(): void {
    this.warningMessage.set(null);
  }

  apply(popover: Popover): void {
    if (this.checkedIds().size === 0) {
      this.salesData.setSectorMarcaTiendaFilter(null);
    } else {
      const effectiveLeafIds = getEffectiveLeafIds(this.filterTree, this.checkedIds());
      const tiendaContextIds = effectiveLeafIds
        .map((id) => this.nodeById.get(id)?.tiendaContextId)
        .filter((id): id is string => !!id);
      this.salesData.setSectorMarcaTiendaFilter(tiendaContextIds);
    }
    popover.hide();
  }

  cancel(popover: Popover): void {
    popover.hide();
  }
}
