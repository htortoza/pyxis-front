import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';

import { CollectionsFilterChipsSummaryComponent } from '../../components/shared/collections-filter-chips-summary/collections-filter-chips-summary';
import { CollectionsFiltersModalComponent } from '../../components/shared/collections-filters-modal/collections-filters-modal';
import { CollectionsFooterComponent } from '../../components/shared/collections-footer/collections-footer';
import { GlobalHeaderComponent, type GlobalHeaderTab } from '../../components/shared/global-header/global-header';
import { LoadingSkeletonComponent } from '../../components/shared/loading-skeleton/loading-skeleton';
import { CollectionsDataService } from '../../services/collections-data.service';

const HEADER_TABS: GlobalHeaderTab[] = [
  { label: 'Cobranzas General', route: '/cobranzas', exact: true },
  { label: 'Detalle de Cartera', route: '/cobranzas/cartera' },
];

/**
 * Shell for "Detalle de Cartera" -- SP1 only wires the page around CollectionsDataService
 * (filters, loading, footer); the dual Vista Tabla/Vista Mapa (calca Detalle de Ventas, foco
 * compartido `focusedCounterpartyId`) lands in SP4 without touching this composition root.
 */
@Component({
  selector: 'app-detalle-cartera',
  standalone: true,
  imports: [
    GlobalHeaderComponent,
    CollectionsFiltersModalComponent,
    CollectionsFilterChipsSummaryComponent,
    CollectionsFooterComponent,
    LoadingSkeletonComponent,
    Button,
    Card,
    Tooltip,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-cartera.html',
  styleUrl: './detalle-cartera.css',
})
export class DetalleCarteraComponent {
  protected readonly collectionsData = inject(CollectionsDataService);
  private readonly messageService = inject(MessageService);

  protected readonly headerTabs = HEADER_TABS;

  /** CollectionsDataService.saveAsDefault() stays UI-agnostic -- the toast is this component's
   * own concern, fired right after the save actually happens. No `life` here -- the app-wide
   * <p-toast [life]> in app.html (4000ms) is the single source of truth for every toast's
   * auto-dismiss time. */
  onSaveAsDefault(): void {
    this.collectionsData.saveAsDefault();
    this.messageService.add({
      severity: 'success',
      summary: 'Vista guardada',
      detail: 'Esta será la vista que se cargue siempre que abras la página.',
    });
  }
}
