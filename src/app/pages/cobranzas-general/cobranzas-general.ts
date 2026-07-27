import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { CollectionsFilterChipsSummaryComponent } from '../../components/shared/collections-filter-chips-summary/collections-filter-chips-summary';
import { CollectionsFiltersModalComponent } from '../../components/shared/collections-filters-modal/collections-filters-modal';
import { CollectionsFooterComponent } from '../../components/shared/collections-footer/collections-footer';
import { GlobalHeaderComponent, type GlobalHeaderTab } from '../../components/shared/global-header/global-header';
import { LoadingSkeletonComponent } from '../../components/shared/loading-skeleton/loading-skeleton';
import { CollectionsDataService } from '../../services/collections-data.service';
import { AgingChartComponent } from './aging-chart/aging-chart';
import { CollectionsKpiCardsGridComponent } from './collections-kpi-cards-grid/collections-kpi-cards-grid';
import { VentaCajaBridgeComponent } from './venta-caja-bridge/venta-caja-bridge';

const HEADER_TABS: GlobalHeaderTab[] = [
  { label: 'Cobranzas General', route: '/cobranzas', exact: true },
  { label: 'Detalle de Cartera', route: '/cobranzas/cartera' },
];

/**
 * Composition root for "Cobranzas General": wires the page around CollectionsDataService
 * (filters, loading, footer) and composes the SP2 visualizations -- 5 KPI cards, Puente
 * Venta->Caja, Antigüedad de Cartera. Proyección de Recaudación y Concentración de Cartera land
 * in SP3 without touching this shell's plumbing.
 */
@Component({
  selector: 'app-cobranzas-general',
  standalone: true,
  imports: [
    GlobalHeaderComponent,
    CollectionsFiltersModalComponent,
    CollectionsFilterChipsSummaryComponent,
    CollectionsFooterComponent,
    LoadingSkeletonComponent,
    CollectionsKpiCardsGridComponent,
    VentaCajaBridgeComponent,
    AgingChartComponent,
    Button,
    Tooltip,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cobranzas-general.html',
  styleUrl: './cobranzas-general.css',
})
export class CobranzasGeneralComponent {
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
