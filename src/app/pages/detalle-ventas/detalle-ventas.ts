import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GlobalHeaderComponent } from '../../components/shared/global-header/global-header';
import { LoadingSkeletonComponent } from '../../components/shared/loading-skeleton/loading-skeleton';
import { SalesDataService } from '../../services/sales-data.service';
import { SalesDetailTreeTableComponent } from './sales-detail-tree-table/sales-detail-tree-table';

/**
 * Composition root for "Detalle de Ventas". All filters (context/period/Sector-Marca-Tienda)
 * now live in the shared GlobalHeaderComponent -- scopedFacts just reads SalesDataService's
 * own shared scoping, kept in sync with whatever's applied there (and with Ventas General).
 */
@Component({
  selector: 'app-detalle-ventas',
  standalone: true,
  imports: [GlobalHeaderComponent, LoadingSkeletonComponent, SalesDetailTreeTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-ventas.html',
  styleUrl: './detalle-ventas.css',
})
export class DetalleVentasComponent {
  protected readonly salesData = inject(SalesDataService);
  protected readonly scopedFacts = this.salesData.scopedFacts;
}
