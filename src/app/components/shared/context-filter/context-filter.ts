import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, inject, model, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';

import { CONTEXT_TREE, MARCAS, SECTORES } from '../../../data/mock/context-tree.mock';
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
import { TenantVocabularyService } from '../../../services/tenant-vocabulary.service';

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
 * Panel presentacional de Sector/Marca/Tienda -- sin trigger ni popover propios, se embebe
 * dentro de FiltersModalComponent. La selección es un `model()` bidireccional; el padre decide
 * cuándo/si se aplica (FiltersModalComponent.apply()) y cuándo se guarda como vista
 * (SavedViewsSidebarComponent, que la recibe como draft). Vistas Guardadas ya no vive aquí --
 * ver SavedViewsSidebarComponent.
 */
@Component({
  selector: 'app-context-filter',
  standalone: true,
  imports: [Checkbox, FormsModule, IconField, InputIcon, InputText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './context-filter.html',
  styleUrl: './context-filter.css',
})
export class ContextFilterComponent {
  protected readonly vocab = inject(TenantVocabularyService);

  readonly checkedIds = model.required<Set<string>>();

  /** Static mock data -- built once, never recomputed reactively. */
  protected readonly filterTree: FilterTreeNode[] = buildSectorMarcaTiendaTree(
    CONTEXT_TREE,
    MARCAS,
    SECTORES,
  );
  private readonly nodeById = new Map(this.filterTree.map((node) => [node.id, node]));
  private readonly labelOf = (id: string): string => this.nodeById.get(id)?.label ?? '';

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
}
