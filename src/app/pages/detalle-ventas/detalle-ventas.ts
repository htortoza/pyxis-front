import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SelectButton } from 'primeng/selectbutton';

import { GlobalHeaderComponent } from '../../components/shared/global-header/global-header';
import { LoadingSkeletonComponent } from '../../components/shared/loading-skeleton/loading-skeleton';
import { PERIODS } from '../../data/mock/periods.mock';
import { PRODUCTS } from '../../data/mock/products.mock';
import { buildDetailTree } from '../../data/utils/sales-detail-tree.utils';
import { SalesDataService } from '../../services/sales-data.service';
import { SalesDetailTreeTableComponent } from './sales-detail-tree-table/sales-detail-tree-table';
import { SalesDetailTreemapComponent } from './sales-detail-treemap/sales-detail-treemap';

type ViewMode = 'tabla' | 'mapa';

interface ViewModeOption {
  label: string;
  value: ViewMode;
}

const VIEW_MODE_OPTIONS: ViewModeOption[] = [
  { label: 'Tabla', value: 'tabla' },
  { label: 'Mapa', value: 'mapa' },
];

/**
 * Composition root for "Detalle de Ventas". All filters (context/period/Sector-Marca-Tienda)
 * live in the shared GlobalHeaderComponent -- scopedFacts just reads SalesDataService's own
 * shared scoping, kept in sync with whatever's applied there (and with Ventas General).
 *
 * The Familia>Subfamilia>Artículo tree is built once here (not inside each view) and passed
 * to both Vista Tabla and Vista Mapa, so their node keys line up -- that's what lets
 * focusedFamiliaId/focusedSubfamiliaId mean the same node in either view. Switching views
 * never resets this focus; only in-memory, doesn't survive a page reload (not asked for).
 */
@Component({
  selector: 'app-detalle-ventas',
  standalone: true,
  imports: [
    FormsModule,
    SelectButton,
    GlobalHeaderComponent,
    LoadingSkeletonComponent,
    SalesDetailTreeTableComponent,
    SalesDetailTreemapComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-ventas.html',
  styleUrl: './detalle-ventas.css',
})
export class DetalleVentasComponent {
  protected readonly salesData = inject(SalesDataService);
  protected readonly scopedFacts = this.salesData.scopedFacts;

  protected readonly viewModeOptions = VIEW_MODE_OPTIONS;
  protected readonly viewMode = signal<ViewMode>('tabla');

  protected readonly focusedFamiliaId = signal<string | null>(null);
  protected readonly focusedSubfamiliaId = signal<string | null>(null);

  protected readonly detailTree = computed(() => {
    const selectedIds = new Set(this.salesData.selectedPeriodIds());
    const selectedPeriods = PERIODS.filter((period) => selectedIds.has(period.id));
    return buildDetailTree(this.scopedFacts(), PRODUCTS, selectedPeriods);
  });

  protected onViewModeChange(mode: ViewMode): void {
    this.viewMode.set(mode);
  }
}
