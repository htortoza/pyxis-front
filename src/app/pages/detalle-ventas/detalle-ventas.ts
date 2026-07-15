import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { GlobalHeaderComponent } from '../../components/shared/global-header/global-header';
import { ContextFilterComponent } from '../../components/shared/context-filter/context-filter';
import { FilterChipsSummaryComponent } from '../../components/shared/filter-chips-summary/filter-chips-summary';
import { LoadingSkeletonComponent } from '../../components/shared/loading-skeleton/loading-skeleton';
import { CONTEXT_TREE } from '../../data/mock/context-tree.mock';
import { SALES_FACTS } from '../../data/mock/sales-facts.mock';
import { getDescendantLeafIds } from '../../data/utils/context-tree.utils';
import { filterFacts } from '../../data/utils/sales-fact.utils';
import { SalesDataService } from '../../services/sales-data.service';
import { SalesDetailTreeTableComponent } from './sales-detail-tree-table/sales-detail-tree-table';

/**
 * Composition root for "Detalle de Ventas". Mirrors VentasGeneralComponent's conventions but
 * scopes facts through this screen's own Sector/Marca/Tienda filter (`detalleContextFilter`)
 * instead of the ranking cross-filter -- SalesDataService itself is intentionally untouched.
 */
@Component({
  selector: 'app-detalle-ventas',
  standalone: true,
  imports: [
    GlobalHeaderComponent,
    ContextFilterComponent,
    FilterChipsSummaryComponent,
    LoadingSkeletonComponent,
    SalesDetailTreeTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-ventas.html',
  styleUrl: './detalle-ventas.css',
})
export class DetalleVentasComponent {
  protected readonly salesData = inject(SalesDataService);

  protected readonly scopedFacts = computed(() => {
    let scopedStoreIds = getDescendantLeafIds(CONTEXT_TREE, this.salesData.selectedContextId());

    const detalleFilter = this.salesData.detalleContextFilter();
    if (detalleFilter !== null) {
      const allowedIds = new Set(detalleFilter);
      scopedStoreIds = scopedStoreIds.filter((id) => allowedIds.has(id));
    }

    return filterFacts(SALES_FACTS, {
      storeIds: scopedStoreIds,
      periodIds: this.salesData.selectedPeriodIds(),
    });
  });
}
