import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, effect, inject, model, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';

import { COUNTERPARTIES } from '../../../data/mock/collections.mock';
import { CONTEXT_TREE, MARCAS, SECTORES } from '../../../data/mock/context-tree.mock';
import {
  buildCollectionsFilterTree,
  UNASSOCIATED_COUNTERPARTY_ROOT_ID,
  type CollectionsFilterNode,
} from '../../../data/utils/collections-filter-tree.utils';
import {
  computeSelectionStates,
  filterVisibleNodeIds,
  getDescendantIds,
  getEffectiveLeafIds,
  highlightMatch,
  toggleNode,
  type SelectionState,
} from '../../../data/utils/tristate.utils';
import { TenantVocabularyService } from '../../../services/tenant-vocabulary.service';

interface DebouncedSearch {
  raw: WritableSignal<string>;
  debounced: Signal<string>;
}

/** Same debounce-via-rxjs-interop pattern ContextFilterComponent/SalesDataService use. */
function createDebouncedSearch(): DebouncedSearch {
  const raw = signal('');
  const debounced = toSignal(toObservable(raw).pipe(debounceTime(300)), { initialValue: '' });
  return { raw, debounced };
}

/** Contraparte can list thousands of rows -- rendered in pages of this size ("Cargar más" grows
 * the visible slice) instead of the full list, so the column stays fast at any catalog size. */
const COUNTERPARTY_PAGE_SIZE = 50;

/**
 * Cobranzas' analogue of ContextFilterComponent -- same presentational contract (`checkedIds` is
 * a two-way `model()`, no trigger/popover of its own, embedded inside CollectionsFiltersModal),
 * extended with a 4th column (Contraparte). Deliberately its own component rather than a
 * generalization of ContextFilterComponent -- see [[feedback-backend-contract-is-fixed]] and the
 * design doc §2: Ventas' component and tree stay untouched, this one calcs the same tristate/
 * search/breadcrumb patterns against `CollectionsFilterNode` instead.
 *
 * Navigation model: Sector > Marca > Local cascades exactly like Ventas. Contraparte is reachable
 * two ways -- (a) navigate into a Local, its associated counterparties show; (b) a pinned row
 * "Sin asociación comercial" (always visible, independent of Sector/Marca/Local nav) jumps
 * straight to the standalone bucket for counterparties with no commercial association
 * (`commercialNodeIds: []` -- adquirentes/gift cards/agregadores, see collections.mock.ts).
 */
@Component({
  selector: 'app-collections-context-filter',
  standalone: true,
  imports: [Checkbox, FormsModule, IconField, InputIcon, InputText, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collections-context-filter.html',
  styleUrl: './collections-context-filter.css',
})
export class CollectionsContextFilterComponent {
  protected readonly vocab = inject(TenantVocabularyService);

  readonly checkedIds = model.required<Set<string>>();

  /** Static mock data -- built once, never recomputed reactively. */
  protected readonly filterTree: CollectionsFilterNode[] = buildCollectionsFilterTree(
    CONTEXT_TREE,
    MARCAS,
    SECTORES,
    COUNTERPARTIES,
  );
  private readonly nodeById = new Map(this.filterTree.map((node) => [node.id, node]));
  private readonly labelOf = (id: string): string => this.nodeById.get(id)?.label ?? '';

  protected readonly selectionStates = computed(() =>
    computeSelectionStates(this.filterTree, this.checkedIds()),
  );

  /** Navigation state -- which sector/marca/local columns 2/3/4 are currently showing, separate
   * from selection. `viewingUnassociated` is orthogonal to the sector/marca/local path: it
   * overrides which parent the Contraparte column reads from without disturbing that path, so
   * returning to it (unchecking "Sin asociación comercial") restores whatever Local was active. */
  protected readonly navSectorId = signal<string | null>(null);
  protected readonly navMarcaId = signal<string | null>(null);
  protected readonly navLocalId = signal<string | null>(null);
  protected readonly viewingUnassociated = signal<boolean>(false);

  protected readonly sectorSearch = createDebouncedSearch();
  protected readonly marcaSearch = createDebouncedSearch();
  protected readonly localSearch = createDebouncedSearch();
  protected readonly contraparteSearch = createDebouncedSearch();
  protected readonly globalSearch = createDebouncedSearch();

  private readonly visibleSectorIds = computed(() =>
    filterVisibleNodeIds(this.filterTree, this.labelOf, this.sectorSearch.debounced()),
  );
  private readonly visibleMarcaIds = computed(() =>
    filterVisibleNodeIds(this.filterTree, this.labelOf, this.marcaSearch.debounced()),
  );
  private readonly visibleLocalIds = computed(() =>
    filterVisibleNodeIds(this.filterTree, this.labelOf, this.localSearch.debounced()),
  );
  private readonly visibleContraparteIds = computed(() =>
    filterVisibleNodeIds(this.filterTree, this.labelOf, this.contraparteSearch.debounced()),
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

  protected readonly localRows = computed(() => {
    const marcaId = this.navMarcaId();
    if (!marcaId) return [];
    const visible = this.visibleLocalIds();
    return this.filterTree.filter(
      (node) => node.type === 'local' && node.parentId === marcaId && visible.has(node.id),
    );
  });

  /** The node whose 'contraparte' children the 4th column reads -- either the standalone
   * unassociated bucket or the currently navigated Local. Null when neither applies. */
  protected readonly contraparteParentId = computed(() =>
    this.viewingUnassociated() ? UNASSOCIATED_COUNTERPARTY_ROOT_ID : this.navLocalId(),
  );

  private readonly contraparteAllRows = computed(() => {
    const parentId = this.contraparteParentId();
    if (!parentId) return [];
    const visible = this.visibleContraparteIds();
    return this.filterTree.filter(
      (node) => node.type === 'contraparte' && node.parentId === parentId && visible.has(node.id),
    );
  });

  /** Progressive-loading page size -- reset to the first page whenever the parent context or the
   * search query changes (a stale "50 more of the previous Local" count would be meaningless). */
  protected readonly contraparteVisibleCount = signal(COUNTERPARTY_PAGE_SIZE);
  private readonly contraparteContextKey = computed(
    () => `${this.contraparteParentId() ?? ''}::${this.contraparteSearch.debounced()}`,
  );

  constructor() {
    effect(() => {
      this.contraparteContextKey();
      this.contraparteVisibleCount.set(COUNTERPARTY_PAGE_SIZE);
    });
  }

  protected readonly contraparteRows = computed(() =>
    this.contraparteAllRows().slice(0, this.contraparteVisibleCount()),
  );
  protected readonly contraparteRemainingCount = computed(() =>
    Math.max(0, this.contraparteAllRows().length - this.contraparteVisibleCount()),
  );

  /** Pinned "Sin asociación comercial" row -- always rendered regardless of Sector/Marca/Local nav. */
  protected readonly unassociatedNode = this.filterTree.find(
    (node) => node.id === UNASSOCIATED_COUNTERPARTY_ROOT_ID,
  )!;

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
  protected readonly breadcrumbLocalLabel = computed(() => {
    const id = this.navLocalId();
    return id ? this.labelOf(id) : null;
  });

  protected readonly summaryText = computed(() => {
    const states = this.selectionStates();
    const countActive = (type: 'sector' | 'marca' | 'local') =>
      this.filterTree
        .filter((node) => node.type === type)
        .filter((node) => {
          const state = states.get(node.id);
          return state === 'checked' || state === 'indeterminate';
        }).length;

    const sectores = countActive('sector');
    const marcas = countActive('marca');
    const locales = countActive('local');

    const effectiveLeafIds = getEffectiveLeafIds(this.filterTree, this.checkedIds());
    const contrapartes = effectiveLeafIds.filter(
      (id) => this.nodeById.get(id)?.type === 'contraparte',
    ).length;

    const parts: string[] = [];
    if (sectores > 0) parts.push(`${sectores} sector${sectores === 1 ? '' : 'es'}`);
    if (marcas > 0) parts.push(`${marcas} marca${marcas === 1 ? '' : 's'}`);
    if (locales > 0) parts.push(`${locales} local${locales === 1 ? '' : 'es'}`);
    if (contrapartes > 0) {
      parts.push(
        `${contrapartes} contraparte${contrapartes === 1 ? '' : 's'} seleccionada${contrapartes === 1 ? '' : 's'}`,
      );
    }

    return parts.length > 0 ? parts.join(' · ') : 'Sin selección';
  });

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

    // Checking (not unchecking) a Sector/Marca/Local -- or the unassociated bucket -- also
    // navigates into it, mirroring ContextFilterComponent's convenience on top of the separate
    // navigate-by-clicking-the-row-body gesture.
    if (wasChecked) {
      return;
    }
    if (nodeId === UNASSOCIATED_COUNTERPARTY_ROOT_ID) {
      this.navigateToUnassociated();
      return;
    }
    const node = this.nodeById.get(nodeId);
    if (node?.type === 'sector') {
      this.navigateToSector(node);
    } else if (node?.type === 'marca') {
      this.navigateToMarca(node);
    } else if (node?.type === 'local') {
      this.navigateToLocal(node);
    }
  }

  /**
   * Descendant 'contraparte' leaf-count ratio for a Sector/Marca/Local row's badge -- counts
   * *effective* coverage (getEffectiveLeafIds), not raw checkbox state, same reasoning as
   * ContextFilterComponent.descendantBadge. A Local with no associated counterparties shows
   * "0/0", which correctly conveys "nothing to select here" rather than hiding the row.
   */
  descendantBadge(nodeId: string): { checked: number; total: number } {
    const effective = new Set(getEffectiveLeafIds(this.filterTree, this.checkedIds()));
    const leafIds = getDescendantIds(this.filterTree, nodeId).filter(
      (id) => this.nodeById.get(id)?.type === 'contraparte',
    );
    const checked = leafIds.filter((id) => effective.has(id)).length;
    return { checked, total: leafIds.length };
  }

  highlight(label: string, query: string) {
    return highlightMatch(label, query);
  }

  pathFor(node: CollectionsFilterNode): string {
    const parts: string[] = [];
    let current: CollectionsFilterNode | undefined = node;
    while (current) {
      parts.unshift(current.label);
      current = current.parentId ? this.nodeById.get(current.parentId) : undefined;
    }
    return parts.join(' / ');
  }

  navigateToSector(node: CollectionsFilterNode): void {
    this.navSectorId.set(node.id);
    this.navMarcaId.set(null);
    this.navLocalId.set(null);
    this.viewingUnassociated.set(false);
  }

  navigateToMarca(node: CollectionsFilterNode): void {
    this.navMarcaId.set(node.id);
    this.navLocalId.set(null);
    this.viewingUnassociated.set(false);
  }

  navigateToLocal(node: CollectionsFilterNode): void {
    this.navLocalId.set(node.id);
    this.viewingUnassociated.set(false);
  }

  navigateToUnassociated(): void {
    this.viewingUnassociated.set(true);
  }

  /** Leaves "Sin asociación comercial" mode -- returns to whatever Local was navigated before
   * (or the empty state, if none was). */
  exitUnassociated(): void {
    this.viewingUnassociated.set(false);
  }

  navigateToResult(node: CollectionsFilterNode): void {
    if (node.type === 'sector') {
      this.navigateToSector(node);
      return;
    }
    if (node.type === 'marca') {
      this.navSectorId.set(node.parentId);
      this.navMarcaId.set(node.id);
      this.navLocalId.set(null);
      this.viewingUnassociated.set(false);
      return;
    }
    if (node.type === 'local') {
      const marca = node.parentId ? this.nodeById.get(node.parentId) : undefined;
      this.navSectorId.set(marca?.parentId ?? null);
      this.navMarcaId.set(node.parentId);
      this.navLocalId.set(node.id);
      this.viewingUnassociated.set(false);
      return;
    }
    // 'contraparte' -- either the pinned unassociated root itself or one of its children, vs. a
    // counterparty hanging off a real Local.
    if (node.id === UNASSOCIATED_COUNTERPARTY_ROOT_ID || node.parentId === UNASSOCIATED_COUNTERPARTY_ROOT_ID) {
      this.navigateToUnassociated();
      return;
    }
    const local = node.parentId ? this.nodeById.get(node.parentId) : undefined;
    const marca = local?.parentId ? this.nodeById.get(local.parentId) : undefined;
    this.navSectorId.set(marca?.parentId ?? null);
    this.navMarcaId.set(local?.parentId ?? null);
    this.navLocalId.set(node.parentId);
    this.viewingUnassociated.set(false);
  }

  resetToAllSectors(): void {
    this.navSectorId.set(null);
    this.navMarcaId.set(null);
    this.navLocalId.set(null);
    this.viewingUnassociated.set(false);
  }

  resetToSector(): void {
    this.navMarcaId.set(null);
    this.navLocalId.set(null);
    this.viewingUnassociated.set(false);
  }

  resetToMarca(): void {
    this.navLocalId.set(null);
    this.viewingUnassociated.set(false);
  }

  loadMoreCounterparties(): void {
    this.contraparteVisibleCount.update((count) => count + COUNTERPARTY_PAGE_SIZE);
  }
}
