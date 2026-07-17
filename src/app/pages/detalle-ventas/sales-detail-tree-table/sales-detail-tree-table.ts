import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { PrimeTemplate } from 'primeng/api';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { TreeTableModule } from 'primeng/treetable';

import { MiniSparklineComponent, type SparklinePoint } from '../../../components/shared/mini-sparkline/mini-sparkline';
import type { Period } from '../../../data/models/period.model';
import type { DetailTreeNode, DetailTreeNodeData } from '../../../data/utils/sales-detail-tree.utils';
import { highlightMatch } from '../../../data/utils/tristate.utils';
import { formatSignedAmount } from '../../../pipes/signed-amount';
import { SignedAmountPipe } from '../../../pipes/signed-amount.pipe';

const QUANTITY_FORMATTER = new Intl.NumberFormat('es-CL');

/** How many children of an expanded branch render before a "Cargar más" row appears. */
const INITIAL_VISIBLE_CHILDREN = 20;
const LOAD_MORE_STEP = 20;

interface DetailColumn {
  field: string;
  header: string;
  kind: 'total' | 'cantidad';
  /** null for the consolidado pair -- there's no single period to key off. */
  periodId: string | null;
}

interface LoadMoreRowData {
  isLoadMore: true;
  label: string;
  parentKey: string;
}

interface LoadMoreNode {
  key: string;
  data: LoadMoreRowData;
  children?: undefined;
}

interface PaginatedTreeNode {
  key: string;
  data: DetailTreeNodeData;
  children?: DisplayNode[];
  expanded?: boolean;
}

type DisplayNode = PaginatedTreeNode | LoadMoreNode;

function isLoadMoreRow(data: DetailTreeNodeData | LoadMoreRowData): data is LoadMoreRowData {
  return 'isLoadMore' in data;
}

/**
 * Recursively hides branches with zero matches anywhere in their subtree and force-expands
 * every node that has a match so the path down to it is visible -- implemented directly on
 * the nested DetailTreeNode shape rather than round-tripping through tristate.utils' flat
 * parentId-linked TristateNode, since that would need an artificial flatten/re-nest step here.
 */
function filterAndExpand(nodes: DetailTreeNode[], query: string): DetailTreeNode[] {
  const normalized = query.toLowerCase();

  function walk(node: DetailTreeNode): DetailTreeNode | null {
    const ownMatch = node.data.label.toLowerCase().includes(normalized);

    if (!node.children || node.children.length === 0) {
      return ownMatch ? node : null;
    }

    if (ownMatch) {
      // The branch itself matched -- keep its full subtree intact, just force it open.
      return { ...node, expanded: true };
    }

    const filteredChildren = node.children
      .map(walk)
      .filter((child): child is DetailTreeNode => child !== null);

    if (filteredChildren.length === 0) {
      return null;
    }

    return { ...node, children: filteredChildren, expanded: true };
  }

  return nodes.map(walk).filter((node): node is DetailTreeNode => node !== null);
}

/** Force-expands whichever Familia/Subfamilia the shared focus (set by Vista Mapa's own
 * drill-down, or by this same table) points at -- without touching any other branch's own
 * expand state, per "no perder el punto" when switching views. */
function forceExpandFocused(
  nodes: DetailTreeNode[],
  familiaId: string | null,
  subfamiliaId: string | null,
): DetailTreeNode[] {
  if (!familiaId) return nodes;
  return nodes.map((node) => {
    if (node.key !== familiaId) return node;
    if (!subfamiliaId || !node.children) {
      return { ...node, expanded: true };
    }
    const children = node.children.map((child) =>
      child.key === subfamiliaId ? { ...child, expanded: true } : child,
    );
    return { ...node, expanded: true, children };
  });
}

/**
 * Caps every branch's rendered children to its own visibleCount (default
 * INITIAL_VISIBLE_CHILDREN), appending a synthetic "Cargar más" row when more exist. Runs over
 * the whole tree regardless of expand state -- PrimeNG TreeTable only ever mounts rows for
 * expanded branches, so pagination on a collapsed branch is inert until it's opened anyway.
 *
 * Also re-applies `expandedKeys` (this component's own record of which rows the user has
 * toggled open) on top of whatever `expanded` the tree already carries in from search/focus
 * force-expansion. This tree gets rebuilt from `tree()` on every render (paginating, focusing,
 * filtering), so PrimeNG's own habit of mutating `node.expanded` directly on the row objects it
 * was handed would otherwise be silently discarded the next time any of those recompute --
 * e.g. clicking "Cargar más" would reset every other already-open branch back to collapsed.
 */
function applyProgressiveLoading(
  nodes: DetailTreeNode[],
  visibleCounts: ReadonlyMap<string, number>,
  expandedKeys: ReadonlySet<string>,
): DisplayNode[] {
  return nodes.map((node) => paginateNode(node, visibleCounts, expandedKeys));
}

function paginateNode(
  node: DetailTreeNode,
  visibleCounts: ReadonlyMap<string, number>,
  expandedKeys: ReadonlySet<string>,
): PaginatedTreeNode {
  const expanded = node.expanded || expandedKeys.has(node.key);

  if (!node.children || node.children.length === 0) {
    return { ...node, expanded };
  }

  const paginatedChildren = node.children.map((child) => paginateNode(child, visibleCounts, expandedKeys));
  const visibleCount = visibleCounts.get(node.key) ?? INITIAL_VISIBLE_CHILDREN;
  const visibleChildren: DisplayNode[] = paginatedChildren.slice(0, visibleCount);
  const remaining = paginatedChildren.length - visibleChildren.length;

  const children: DisplayNode[] =
    remaining > 0
      ? [
          ...visibleChildren,
          {
            key: `load-more-${node.key}`,
            data: { isLoadMore: true, label: `Cargar más (${remaining} restantes)`, parentKey: node.key },
          },
        ]
      : visibleChildren;

  return { key: node.key, data: node.data, children, expanded };
}

/**
 * Familia > Subfamilia > Artículo tree-table for "Detalle de Ventas", with per-period +
 * consolidado Total/Cantidad columns, a debounced inline search that filters branches and
 * auto-expands the path down to any match, per-branch progressive loading past
 * INITIAL_VISIBLE_CHILDREN rows, a sticky Familia/Subfamilia context label while scrolling a
 * long expanded branch, and a per-row trend sparkline across the selected periods.
 */
@Component({
  selector: 'app-sales-detail-tree-table',
  standalone: true,
  imports: [
    FormsModule,
    PrimeTemplate,
    IconField,
    InputIcon,
    InputText,
    TreeTableModule,
    SignedAmountPipe,
    MiniSparklineComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sales-detail-tree-table.html',
  styleUrl: './sales-detail-tree-table.css',
})
export class SalesDetailTreeTableComponent {
  /** The already-aggregated Familia>Subfamilia>Artículo tree -- built once by the parent
   * (DetalleVentasComponent) and shared with Vista Mapa, so both views' node keys line up for
   * the shared Familia/Subfamilia focus that survives switching between them. */
  readonly tree = input.required<DetailTreeNode[]>();
  readonly selectedPeriodIds = input.required<string[]>();
  readonly periods = input.required<Period[]>();

  /** Shared focus set by Vista Mapa's drill-down (or a previous visit to this same table) --
   * forces that branch open and scrolls to it, without collapsing anything else. */
  readonly focusedFamiliaId = input<string | null>(null);
  readonly focusedSubfamiliaId = input<string | null>(null);

  /** Emitted when the user expands a Familia/Subfamilia row -- feeds the same shared focus
   * state Vista Mapa reads/writes, so "the last branch you opened" survives switching views. */
  readonly familiaFocused = output<string>();
  readonly subfamiliaFocused = output<string>();

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly searchRaw = signal('');
  protected readonly searchDebounced = toSignal(
    toObservable(this.searchRaw).pipe(debounceTime(300)),
    { initialValue: '' },
  );

  private readonly visibleCounts = signal<ReadonlyMap<string, number>>(new Map());

  /** This component's own record of manually-toggled-open rows -- see applyProgressiveLoading's
   * doc comment for why PrimeNG's own node.expanded mutation isn't enough on its own. */
  private readonly expandedKeys = signal<ReadonlySet<string>>(new Set());

  /** Familia/Subfamilia label currently pinned at the top while scrolling -- empty when
   * nothing has been scrolled past yet (the real header row is already visible). */
  protected readonly stickyLabel = signal('');

  /** Measured height of PrimeNG's own (already-sticky) column header row, so this label bar
   * sits directly beneath it rather than at a guessed pixel offset. */
  protected readonly stickyLabelTop = signal('0px');

  protected readonly displayTree = computed<DisplayNode[]>(() => {
    const query = this.searchDebounced().trim();
    const base = this.tree();
    const filtered = query.length > 0 ? filterAndExpand(base, query) : base;
    const focused = forceExpandFocused(filtered, this.focusedFamiliaId(), this.focusedSubfamiliaId());
    return applyProgressiveLoading(focused, this.visibleCounts(), this.expandedKeys());
  });

  protected readonly columns = computed<DetailColumn[]>(() => {
    const selected = new Set(this.selectedPeriodIds());
    const orderedPeriods = this.periods().filter((period) => selected.has(period.id));

    const cols: DetailColumn[] = [];
    for (const period of orderedPeriods) {
      cols.push({ field: `total_${period.id}`, header: `${period.label} Total`, kind: 'total', periodId: period.id });
      cols.push({ field: `cantidad_${period.id}`, header: `${period.label} Cantidad`, kind: 'cantidad', periodId: period.id });
    }
    cols.push({ field: 'consolidadoTotal', header: 'Consolidado Total', kind: 'total', periodId: null });
    cols.push({ field: 'consolidadoCantidad', header: 'Consolidado Cantidad', kind: 'cantidad', periodId: null });
    return cols;
  });

  constructor() {
    // The scrollable body wrapper persists across data re-renders (PrimeNG only refreshes the
    // rows inside it), so attaching the listener once after first render is enough.
    afterNextRender(() => {
      const scrollBody = this.elementRef.nativeElement.querySelector<HTMLElement>('.p-treetable-scrollable-body');
      if (!scrollBody) return;

      const header = this.elementRef.nativeElement.querySelector<HTMLElement>('.p-treetable-scrollable-header');
      if (header) {
        this.stickyLabelTop.set(`${header.getBoundingClientRect().height}px`);
      }

      let rafPending = false;
      scrollBody.addEventListener(
        'scroll',
        () => {
          if (rafPending) return;
          rafPending = true;
          requestAnimationFrame(() => {
            rafPending = false;
            this.updateStickyLabel(scrollBody);
          });
        },
        { passive: true },
      );
    });

    // A changed tree (search, filters, "cargar más") can invalidate whatever the sticky label
    // was pointing at -- clear it and let the next scroll event recompute from scratch.
    effect(() => {
      this.displayTree();
      this.stickyLabel.set('');
    });

    // Scrolls to whichever branch the shared focus points at (set by Vista Mapa, or by this
    // same table) -- deferred a tick so it runs after forceExpandFocused's row has actually
    // rendered into the DOM.
    effect(() => {
      const targetKey = this.focusedSubfamiliaId() ?? this.focusedFamiliaId();
      if (!targetKey) return;
      setTimeout(() => this.scrollRowIntoView(targetKey));
    });
  }

  private scrollRowIntoView(key: string): void {
    const row = this.elementRef.nativeElement.querySelector<HTMLElement>(`tr[data-key="${key}"]`);
    row?.scrollIntoView({ block: 'nearest' });
  }

  private updateStickyLabel(scrollBody: HTMLElement): void {
    const containerTop = scrollBody.getBoundingClientRect().top;
    const rows = scrollBody.querySelectorAll<HTMLElement>(
      'tr.detail-tree-row--familia, tr.detail-tree-row--subfamilia',
    );

    let familiaLabel = '';
    let subfamiliaLabel = '';
    for (const row of Array.from(rows)) {
      if (row.getBoundingClientRect().top > containerTop) break;
      if (row.classList.contains('detail-tree-row--familia')) {
        familiaLabel = row.dataset['label'] ?? '';
        subfamiliaLabel = '';
      } else {
        subfamiliaLabel = row.dataset['label'] ?? '';
      }
    }

    this.stickyLabel.set(familiaLabel ? [familiaLabel, subfamiliaLabel].filter(Boolean).join(' · ') : '');
  }

  protected isLoadMoreRow(data: DetailTreeNodeData | LoadMoreRowData): data is LoadMoreRowData {
    return isLoadMoreRow(data);
  }

  protected loadMore(parentKey: string): void {
    this.visibleCounts.update((current) => {
      const next = new Map(current);
      next.set(parentKey, (next.get(parentKey) ?? INITIAL_VISIBLE_CHILDREN) + LOAD_MORE_STEP);
      return next;
    });
  }

  protected sparklinePoints(data: DetailTreeNodeData): SparklinePoint[] {
    const selected = new Set(this.selectedPeriodIds());
    return this.periods()
      .filter((period) => selected.has(period.id))
      .map((period) => ({ label: period.label, value: data.periodTotals[period.id]?.total ?? 0 }));
  }

  protected onNodeExpand(event: { node: { key?: string; data?: DetailTreeNodeData } }): void {
    const { node } = event;
    if (!node.key || !node.data) return;

    this.expandedKeys.update((current) => new Set(current).add(node.key!));

    if (node.data.level === 'familia') {
      this.familiaFocused.emit(node.key);
    } else if (node.data.level === 'subfamilia') {
      const parentKey = this.findParentFamiliaKey(node.key);
      if (parentKey) this.familiaFocused.emit(parentKey);
      this.subfamiliaFocused.emit(node.key);
    }
  }

  protected onNodeCollapse(event: { node: { key?: string } }): void {
    const key = event.node.key;
    if (!key) return;
    this.expandedKeys.update((current) => {
      const next = new Set(current);
      next.delete(key);
      return next;
    });
  }

  private findParentFamiliaKey(subfamiliaKey: string): string | null {
    for (const familia of this.tree()) {
      if (familia.children?.some((child) => child.key === subfamiliaKey)) {
        return familia.key;
      }
    }
    return null;
  }

  cellValue(data: DetailTreeNodeData, col: DetailColumn): number {
    if (col.periodId === null) {
      return col.kind === 'total' ? data.consolidadoTotal : data.consolidadoCantidad;
    }
    const bucket = data.periodTotals[col.periodId];
    if (!bucket) {
      return 0;
    }
    return col.kind === 'total' ? bucket.total : bucket.cantidad;
  }

  isNegativeAmount(value: number): boolean {
    return formatSignedAmount(value).isNegative;
  }

  formatQuantity(value: number): string {
    return QUANTITY_FORMATTER.format(value);
  }

  highlight(label: string) {
    return highlightMatch(label, this.searchDebounced().trim());
  }
}
