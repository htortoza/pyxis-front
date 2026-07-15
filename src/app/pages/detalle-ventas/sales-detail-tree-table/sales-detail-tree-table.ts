import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { PrimeTemplate } from 'primeng/api';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { TreeTableModule } from 'primeng/treetable';

import type { Period } from '../../../data/models/period.model';
import type { SalesFact } from '../../../data/models/sales-fact.model';
import { PRODUCTS } from '../../../data/mock/products.mock';
import {
  buildDetailTree,
  type DetailTreeNode,
  type DetailTreeNodeData,
} from '../../../data/utils/sales-detail-tree.utils';
import { highlightMatch } from '../../../data/utils/tristate.utils';
import { formatSignedAmount } from '../../../pipes/signed-amount';
import { SignedAmountPipe } from '../../../pipes/signed-amount.pipe';

const QUANTITY_FORMATTER = new Intl.NumberFormat('es-CL');

interface DetailColumn {
  field: string;
  header: string;
  kind: 'total' | 'cantidad';
  /** null for the consolidado pair -- there's no single period to key off. */
  periodId: string | null;
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

/**
 * Familia > Subfamilia > Artículo tree-table for "Detalle de Ventas", with per-period +
 * consolidado Total/Cantidad columns and a debounced inline search that filters branches
 * and auto-expands the path down to any match.
 */
@Component({
  selector: 'app-sales-detail-tree-table',
  standalone: true,
  imports: [FormsModule, PrimeTemplate, IconField, InputIcon, InputText, TreeTableModule, SignedAmountPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sales-detail-tree-table.html',
  styleUrl: './sales-detail-tree-table.css',
})
export class SalesDetailTreeTableComponent {
  readonly facts = input.required<SalesFact[]>();
  readonly selectedPeriodIds = input.required<string[]>();
  readonly periods = input.required<Period[]>();

  protected readonly searchRaw = signal('');
  protected readonly searchDebounced = toSignal(
    toObservable(this.searchRaw).pipe(debounceTime(300)),
    { initialValue: '' },
  );

  protected readonly treeData = computed(() =>
    buildDetailTree(this.facts(), PRODUCTS, this.selectedPeriodIds()),
  );

  protected readonly displayTree = computed<DetailTreeNode[]>(() => {
    const query = this.searchDebounced().trim();
    const base = this.treeData();
    return query.length > 0 ? filterAndExpand(base, query) : base;
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
