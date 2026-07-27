import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import { TreeTableModule } from 'primeng/treetable';

import { LoadingSkeletonComponent } from '../../../components/shared/loading-skeleton/loading-skeleton';
import type { DocumentStatus, ReceivableDocument } from '../../../data/models/collections.model';
import { COUNTERPARTIES } from '../../../data/mock/collections.mock';
import type { AgingBucketKey } from '../../../data/utils/collections-aging.utils';
import {
  buildCollectionsDetailTree,
  type CollectionsDetailCounterpartyRow,
  type CollectionsDetailDocumentRow,
} from '../../../data/utils/collections-detail-tree.utils';
import { highlightMatch } from '../../../data/utils/tristate.utils';
import { formatSignedAmount } from '../../../pipes/signed-amount';
import { SignedAmountPipe } from '../../../pipes/signed-amount.pipe';
import { CollectionsDataService } from '../../../services/collections-data.service';

/** How many document children of an expanded Contraparte branch render before a "Cargar más" row
 * appears -- same pagination knobs as Ventas' sales-detail-tree-table, reimplemented here (not
 * imported) because the child shape (1 level of ReceivableDocument rows, not a recursive tree) is
 * simpler and doesn't need the generic recursive walk Ventas' 3-level tree requires. */
const INITIAL_VISIBLE_CHILDREN = 20;
const LOAD_MORE_STEP = 20;

/** Every column sortable on the Contraparte level (spec: "todas las columnas ordenables") -- the 7
 * aging buckets plus every other fixed metric column, and `label` for the identity column itself. */
type SortField =
  | AgingBucketKey
  | 'label'
  | 'saldo'
  | 'creditLimit'
  | 'utilizacionPct'
  | 'avgDaysOverdueWeighted'
  | 'sharePct'
  | 'creditTermDays';

/** Separately sortable fields for a Contraparte's own expanded documents (its own local header,
 * see `documento-header` row kind below) -- a completely different field set from `SortField`
 * above, since a single document doesn't have aging-bucket amounts or a credit limit. */
type DocumentSortField =
  | 'externalRef'
  | 'issueDate'
  | 'dueDate'
  | 'grossAmount'
  | 'appliedAmount'
  | 'creditNoteAmount'
  | 'balance'
  | 'daysOverdue'
  | 'status';

type SortDirection = 1 | -1;

type ColumnKind = 'bucket' | 'amount' | 'amount-or-dash' | 'percent-or-dash' | 'days' | 'share-bar' | 'days-or-dash';

interface DetailColumn {
  field: SortField;
  header: string;
  kind: ColumnKind;
}

const BUCKET_COLUMN_LABELS: Record<AgingBucketKey, string> = {
  POR_VENCER_0_30: 'Por vencer 0-30',
  POR_VENCER_30_PLUS: 'Por vencer 30+',
  VENCIDO_1_30: 'Vencido 1-30',
  VENCIDO_31_60: 'Vencido 31-60',
  VENCIDO_61_90: 'Vencido 61-90',
  VENCIDO_90_PLUS: 'Vencido 90+',
  NO_DUE_DATE: 'Sin vencimiento',
};

/** Columns are FIXED (spec diff #2) -- no Total/Cantidad selector like Ventas, this is a STOCK view
 * at the active cutoff, not a per-period flow. Declared once, never recomputed. */
const COLUMNS: DetailColumn[] = [
  { field: 'POR_VENCER_0_30', header: BUCKET_COLUMN_LABELS.POR_VENCER_0_30, kind: 'bucket' },
  { field: 'POR_VENCER_30_PLUS', header: BUCKET_COLUMN_LABELS.POR_VENCER_30_PLUS, kind: 'bucket' },
  { field: 'VENCIDO_1_30', header: BUCKET_COLUMN_LABELS.VENCIDO_1_30, kind: 'bucket' },
  { field: 'VENCIDO_31_60', header: BUCKET_COLUMN_LABELS.VENCIDO_31_60, kind: 'bucket' },
  { field: 'VENCIDO_61_90', header: BUCKET_COLUMN_LABELS.VENCIDO_61_90, kind: 'bucket' },
  { field: 'VENCIDO_90_PLUS', header: BUCKET_COLUMN_LABELS.VENCIDO_90_PLUS, kind: 'bucket' },
  { field: 'NO_DUE_DATE', header: BUCKET_COLUMN_LABELS.NO_DUE_DATE, kind: 'bucket' },
  { field: 'saldo', header: 'Saldo', kind: 'amount' },
  { field: 'creditLimit', header: 'Límite', kind: 'amount-or-dash' },
  { field: 'utilizacionPct', header: '% Util.', kind: 'percent-or-dash' },
  { field: 'avgDaysOverdueWeighted', header: 'Mora', kind: 'days' },
  { field: 'sharePct', header: '% de la cartera', kind: 'share-bar' },
  { field: 'creditTermDays', header: 'Plazo pactado', kind: 'days-or-dash' },
];

interface CounterpartyRowData {
  kind: 'contraparte';
  row: CollectionsDetailCounterpartyRow;
}

/** Synthetic local header row for a Contraparte's expanded documents -- rendered as the first
 * child once `row.documents.length > 0`, never counted toward `INITIAL_VISIBLE_CHILDREN`. Clicking
 * one of its fields sorts THAT branch's documents only (spec diff #3: "ordenamiento de columna
 * nunca reordena los documentos hijos... se ordenan aparte si el usuario hace clic en un header
 * DENTRO de la sub-tabla expandida"). Documents don't share the Contraparte-level bucket/límite/
 * %util/plazo columns (a single document doesn't have those), so this renders its own compact
 * field set (folio/fechas/montos/estado) inside one wide cell instead of reusing the outer grid. */
interface DocumentHeaderRowData {
  kind: 'documento-header';
  parentKey: string;
}

interface DocumentRowData {
  kind: 'documento';
  doc: CollectionsDetailDocumentRow;
}

interface LoadMoreRowData {
  kind: 'load-more';
  label: string;
  parentKey: string;
}

type RowData = CounterpartyRowData | DocumentHeaderRowData | DocumentRowData | LoadMoreRowData;

interface DisplayNode {
  key: string;
  data: RowData;
  children?: DisplayNode[];
  expanded?: boolean;
}

function isContraparteRow(data: RowData): data is CounterpartyRowData {
  return data.kind === 'contraparte';
}

function isDocumentHeaderRow(data: RowData): data is DocumentHeaderRowData {
  return data.kind === 'documento-header';
}

function isDocumentRow(data: RowData): data is DocumentRowData {
  return data.kind === 'documento';
}

function isLoadMoreRow(data: RowData): data is LoadMoreRowData {
  return data.kind === 'load-more';
}

/** Single generic nulls-last comparator, reused both for Contraparte rows (via `rowSortValue`) and
 * for a branch's own `row.documents` (via `documentSortValue`) -- spec diff #3: "un único
 * comparador reusado también para row.documents". Nulls always sort last regardless of direction
 * (same convention as `collections-concentration.utils.ts`'s `utilizacion` sort). */
function compareNullable(a: number | string | null, b: number | string | null, direction: SortDirection): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b) * direction;
  }
  return ((a as number) - (b as number)) * direction;
}

function rowSortValue(row: CollectionsDetailCounterpartyRow, field: SortField): number | string | null {
  switch (field) {
    case 'label':
      return row.label;
    case 'saldo':
    case 'sharePct':
      return row.saldo;
    case 'creditLimit':
      return row.creditLimit;
    case 'utilizacionPct':
      return row.utilizacionPct;
    case 'avgDaysOverdueWeighted':
      return row.avgDaysOverdueWeighted;
    case 'creditTermDays':
      return row.creditTermDays;
    default:
      return row.bucketAmounts[field];
  }
}

function documentSortValue(doc: CollectionsDetailDocumentRow, field: DocumentSortField): number | string | null {
  return doc[field];
}

function compareCounterpartyRows(
  a: CollectionsDetailCounterpartyRow,
  b: CollectionsDetailCounterpartyRow,
  field: SortField,
  direction: SortDirection,
): number {
  return compareNullable(rowSortValue(a, field), rowSortValue(b, field), direction);
}

function compareDocuments(
  a: CollectionsDetailDocumentRow,
  b: CollectionsDetailDocumentRow,
  field: DocumentSortField,
  direction: SortDirection,
): number {
  return compareNullable(documentSortValue(a, field), documentSortValue(b, field), direction);
}

interface FilteredRow {
  row: CollectionsDetailCounterpartyRow;
  forceExpanded: boolean;
}

/** Filters by Contraparte label OR document folio (spec diff #7 -- a reconciliation search, not a
 * dimension search like Ventas'). A label match keeps the whole branch intact (all its documents);
 * a folio-only match keeps the branch but narrows `documents` down to the matching ones -- same
 * "force the path down to a match open, hide everything else" idea as Ventas' `filterAndExpand`,
 * simplified to 2 levels instead of a recursive walk. */
function filterAndExpandRows(rows: CollectionsDetailCounterpartyRow[], query: string): FilteredRow[] {
  const normalized = query.toLowerCase();
  const result: FilteredRow[] = [];

  for (const row of rows) {
    if (row.label.toLowerCase().includes(normalized)) {
      result.push({ row, forceExpanded: true });
      continue;
    }
    const matchingDocs = row.documents.filter((doc) => doc.externalRef.toLowerCase().includes(normalized));
    if (matchingDocs.length > 0) {
      result.push({ row: { ...row, documents: matchingDocs }, forceExpanded: true });
    }
  }

  return result;
}

/**
 * Contraparte > Documento tree-table for "Detalle de Cartera" (Vista Tabla) -- mirrors the
 * mechanics of Ventas' `SalesDetailTreeTableComponent` (debounced search with auto-expand,
 * progressive loading past INITIAL_VISIBLE_CHILDREN, sticky context label while scrolling, shared
 * focus with scroll-into-view) with 8 deliberate differences documented inline where they apply:
 * (1) 2 levels, not 3 -- no Familia/Subfamilia logic, `buildCollectionsDetailTree` already
 *     flattens to Contraparte>Documento. (2) Fixed columns, no Total/Cantidad selector -- this is
 *     a stock view at the cutoff, not a per-period flow. (3) Every column is sortable (Ventas'
 *     order is fixed alphabetical); documents get their own local sort via the `documento-header`
 *     synthetic row. (4) A totals row is pinned at the table's foot via PrimeNG TreeTable's native
 *     `pTemplate="footer"` (see doc comment on `totals` below for why that mechanism, not manual
 *     CSS, satisfies "fixed footer"). (5) A visible "mostrar filas sin saldo" toggle (Ventas hides
 *     zero rows unconditionally). (6) An over-limit warning mark on rows with `utilizacionPct >= 1`.
 *     (7) Search matches Contraparte label OR document folio, not a Familia/Subfamilia/Artículo
 *     name. (8) A "% de la cartera" column with an inline proportional bar (Concentración de
 *     Cartera's CSS technique, not its component).
 */
@Component({
  selector: 'app-collections-detail-tree-table',
  standalone: true,
  imports: [
    FormsModule,
    PrimeTemplate,
    IconField,
    InputIcon,
    InputText,
    ToggleSwitch,
    Tooltip,
    TreeTableModule,
    SignedAmountPipe,
    LoadingSkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collections-detail-tree-table.html',
  styleUrl: './collections-detail-tree-table.css',
})
export class CollectionsDetailTreeTableComponent {
  readonly documents = input.required<ReceivableDocument[]>();
  readonly cutoffDate = input.required<string>();

  /** Shared focus set by Vista Mapa (or a previous visit to this same table) -- forces that
   * Contraparte branch open and scrolls to it, without collapsing anything else. */
  readonly focusedCounterpartyId = input<string | null>(null);

  /** Emitted when the user expands a Contraparte row -- feeds the same shared focus Vista Mapa
   * reads, so "the last contraparte you opened" survives switching views. */
  readonly counterpartyFocused = output<string>();

  protected readonly collectionsData = inject(CollectionsDataService);

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly columns = COLUMNS;

  protected readonly searchRaw = signal('');
  protected readonly searchDebounced = toSignal(toObservable(this.searchRaw).pipe(debounceTime(300)), {
    initialValue: '',
  });

  /** Default `false` (spec: "toggle visible", unlike Ventas' incondicional hide-zero). */
  protected readonly includeZeroBalance = signal(false);

  protected readonly sortField = signal<SortField | null>(null);
  protected readonly sortDirection = signal<SortDirection>(-1);

  /** Per-Contraparte-key local sort state for that branch's own documents (spec diff #3). */
  protected readonly documentSort = signal<ReadonlyMap<string, { field: DocumentSortField; direction: SortDirection }>>(
    new Map(),
  );

  private readonly visibleCounts = signal<ReadonlyMap<string, number>>(new Map());

  /** This component's own record of manually-toggled-open rows -- same reason as Ventas'
   * `expandedKeys`: PrimeNG's own `node.expanded` mutation would otherwise be silently discarded
   * whenever `displayTree` recomputes (search, sort, "cargar más", toggle sin-saldo). */
  private readonly expandedKeys = signal<ReadonlySet<string>>(new Set());

  /** Contraparte label currently pinned at the top while scrolling its expanded documents. */
  protected readonly stickyLabel = signal('');
  protected readonly stickyLabelTop = signal('0px');
  protected readonly scrollHeight = signal('600px');

  protected readonly tree = computed(() =>
    buildCollectionsDetailTree(this.documents(), COUNTERPARTIES, this.cutoffDate(), this.includeZeroBalance()),
  );

  protected readonly totals = computed(() => this.tree().totals);

  protected readonly displayTree = computed<DisplayNode[]>(() => {
    const query = this.searchDebounced().trim();
    const treeResult = this.tree();
    const field = this.sortField();
    const direction = this.sortDirection();
    const expandedKeys = this.expandedKeys();

    let rows: CollectionsDetailCounterpartyRow[];
    let forceExpandedKeys: ReadonlySet<string>;

    if (query.length > 0) {
      const filtered = filterAndExpandRows(treeResult.rows, query);
      rows = filtered.map((f) => f.row);
      forceExpandedKeys = new Set(filtered.filter((f) => f.forceExpanded).map((f) => f.row.key));
    } else {
      rows = field === null ? treeResult.rows : [...treeResult.rows].sort((a, b) => compareCounterpartyRows(a, b, field, direction));
      forceExpandedKeys = new Set();
    }

    return rows.map((row) => ({
      key: row.key,
      data: { kind: 'contraparte', row },
      children: this.buildDocumentChildren(row),
      expanded: forceExpandedKeys.has(row.key) || expandedKeys.has(row.key),
    }));
  });

  constructor() {
    afterNextRender(() => {
      const scrollBody = this.elementRef.nativeElement.querySelector<HTMLElement>('.p-treetable-scrollable-body');
      if (!scrollBody) return;

      const header = this.elementRef.nativeElement.querySelector<HTMLElement>('.p-treetable-scrollable-header');
      if (header) {
        this.stickyLabelTop.set(`${header.getBoundingClientRect().height}px`);
      }

      this.updateScrollHeight();

      const onResize = () => this.updateScrollHeight();
      window.addEventListener('resize', onResize);
      this.destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));

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

    effect(() => {
      this.displayTree();
      this.stickyLabel.set('');
    });

    effect(() => {
      const counterpartyId = this.focusedCounterpartyId();
      if (!counterpartyId) return;

      const key = `contraparte-${counterpartyId}`;
      this.expandedKeys.update((current) => new Set(current).add(key));
      setTimeout(() => this.scrollRowIntoView(key));
    });
  }

  private buildDocumentChildren(row: CollectionsDetailCounterpartyRow): DisplayNode[] {
    if (row.documents.length === 0) {
      return [];
    }

    const sortState = this.documentSort().get(row.key);
    const sortedDocs = sortState
      ? [...row.documents].sort((a, b) => compareDocuments(a, b, sortState.field, sortState.direction))
      : row.documents;

    const visibleCount = this.visibleCounts().get(row.key) ?? INITIAL_VISIBLE_CHILDREN;
    const visibleDocs = sortedDocs.slice(0, visibleCount);
    const remaining = sortedDocs.length - visibleDocs.length;

    const headerNode: DisplayNode = {
      key: `doc-header-${row.key}`,
      data: { kind: 'documento-header', parentKey: row.key },
    };
    const docNodes: DisplayNode[] = visibleDocs.map((doc) => ({
      key: doc.key,
      data: { kind: 'documento', doc },
    }));

    const children = [headerNode, ...docNodes];
    if (remaining > 0) {
      children.push({
        key: `load-more-${row.key}`,
        data: { kind: 'load-more', label: `Cargar más (${remaining} restantes)`, parentKey: row.key },
      });
    }
    return children;
  }

  private scrollRowIntoView(key: string): void {
    const row = this.elementRef.nativeElement.querySelector<HTMLElement>(`tr[data-key="${key}"]`);
    row?.scrollIntoView({ block: 'nearest' });
  }

  private updateStickyLabel(scrollBody: HTMLElement): void {
    const containerTop = scrollBody.getBoundingClientRect().top;
    const rows = scrollBody.querySelectorAll<HTMLElement>('tr.detail-tree-row--contraparte');

    let label = '';
    for (const row of Array.from(rows)) {
      if (row.getBoundingClientRect().top > containerTop) break;
      label = row.dataset['label'] ?? '';
    }

    this.stickyLabel.set(label);
  }

  /** .page-body's own bottom padding (detalle-cartera.css) -- kept as a named constant here since
   * this component has no dependency on that page's CSS to read it from (same as Ventas). */
  private static readonly PAGE_BOTTOM_PADDING_PX = 32;

  private updateScrollHeight(): void {
    const wrapper = this.elementRef.nativeElement.querySelector<HTMLElement>('.detail-tree-table-wrapper');
    if (!wrapper) return;
    const top = wrapper.getBoundingClientRect().top;
    this.scrollHeight.set(`calc(100vh - ${top}px - ${CollectionsDetailTreeTableComponent.PAGE_BOTTOM_PADDING_PX}px)`);
  }

  protected isContraparteRow(data: RowData): data is CounterpartyRowData {
    return isContraparteRow(data);
  }

  protected isDocumentHeaderRow(data: RowData): data is DocumentHeaderRowData {
    return isDocumentHeaderRow(data);
  }

  protected isDocumentRow(data: RowData): data is DocumentRowData {
    return isDocumentRow(data);
  }

  protected isLoadMoreRow(data: RowData): data is LoadMoreRowData {
    return isLoadMoreRow(data);
  }

  protected loadMore(parentKey: string): void {
    this.visibleCounts.update((current) => {
      const next = new Map(current);
      next.set(parentKey, (next.get(parentKey) ?? INITIAL_VISIBLE_CHILDREN) + LOAD_MORE_STEP);
      return next;
    });
  }

  protected onNodeExpand(event: { node: { key?: string; data?: RowData } }): void {
    const { node } = event;
    if (!node.key || !node.data || !isContraparteRow(node.data)) return;

    this.expandedKeys.update((current) => new Set(current).add(node.key!));
    this.counterpartyFocused.emit(node.data.row.counterpartyId);
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

  protected sortBy(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDirection.update((d) => (d === 1 ? -1 : 1));
    } else {
      this.sortField.set(field);
      this.sortDirection.set(-1);
    }
  }

  protected sortIndicator(field: SortField): string {
    if (this.sortField() !== field) return '';
    return this.sortDirection() === 1 ? '▲' : '▼';
  }

  protected sortDocuments(parentKey: string, field: DocumentSortField): void {
    this.documentSort.update((current) => {
      const next = new Map(current);
      const existing = next.get(parentKey);
      const direction: SortDirection = existing && existing.field === field && existing.direction === -1 ? 1 : -1;
      next.set(parentKey, { field, direction });
      return next;
    });
  }

  protected documentSortIndicator(parentKey: string, field: DocumentSortField): string {
    const state = this.documentSort().get(parentKey);
    if (!state || state.field !== field) return '';
    return state.direction === 1 ? '▲' : '▼';
  }

  protected bucketAmount(row: CollectionsDetailCounterpartyRow, field: SortField): number {
    return row.bucketAmounts[field as AgingBucketKey];
  }

  protected bucketTotal(field: SortField): number {
    return this.totals().bucketAmounts[field as AgingBucketKey];
  }

  /** `saldo / totals.saldo * 100` (spec diff #8) -- 0 when the scope has no saldo at all, rather
   * than dividing by 0. */
  protected sharePct(row: CollectionsDetailCounterpartyRow): number {
    const totalSaldo = this.totals().saldo;
    return totalSaldo === 0 ? 0 : (row.saldo / totalSaldo) * 100;
  }

  /** Sobre-límite (spec diff #6): saldo igual o por encima del límite de crédito pactado. `null`
   * (sin límite definido) nunca cuenta como sobre-límite. */
  protected isOverLimit(row: CollectionsDetailCounterpartyRow): boolean {
    return row.utilizacionPct !== null && row.utilizacionPct >= 1;
  }

  protected isNegativeAmount(value: number): boolean {
    return formatSignedAmount(value).isNegative;
  }

  private static readonly PERCENT_FORMATTER = new Intl.NumberFormat('es-CL', {
    style: 'percent',
    maximumFractionDigits: 1,
  });
  private static readonly PCT_NUMBER_FORMATTER = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 });
  private static readonly DAYS_FORMATTER = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 });

  protected formatUtilizacion(ratio: number): string {
    return CollectionsDetailTreeTableComponent.PERCENT_FORMATTER.format(ratio);
  }

  protected formatSharePct(pct0to100: number): string {
    return `${CollectionsDetailTreeTableComponent.PCT_NUMBER_FORMATTER.format(pct0to100)}%`;
  }

  protected formatDays(days: number): string {
    return `${CollectionsDetailTreeTableComponent.DAYS_FORMATTER.format(days)} días`;
  }

  protected statusLabel(status: DocumentStatus): string {
    if (status === 'POR_VENCER') return 'Por vencer';
    if (status === 'VENCIDO') return 'Vencido';
    return 'Pagado';
  }

  protected highlight(label: string) {
    return highlightMatch(label, this.searchDebounced().trim());
  }
}
