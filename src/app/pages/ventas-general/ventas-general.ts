import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { GlobalHeaderComponent, type GlobalHeaderTab } from '../../components/shared/global-header/global-header';
import { FilterChipsSummaryComponent } from '../../components/shared/filter-chips-summary/filter-chips-summary';
import { FiltersModalComponent } from '../../components/shared/filters-modal/filters-modal';
import { SalesDataService } from '../../services/sales-data.service';
import { KpiCardsGridComponent } from './kpi-cards-grid/kpi-cards-grid';
import { HourlySalesChartComponent } from './hourly-sales-chart/hourly-sales-chart';
import { PeriodSummarySidebarComponent } from './period-summary-sidebar/period-summary-sidebar';
import { RankingPanelsComponent } from './ranking-panels/ranking-panels';

const HEADER_TABS: GlobalHeaderTab[] = [
  { label: 'Ventas General', route: '/', exact: true },
  { label: 'Detalle de Ventas', route: '/detalle-ventas' },
];

@Component({
  selector: 'app-ventas-general',
  standalone: true,
  imports: [
    GlobalHeaderComponent,
    FiltersModalComponent,
    FilterChipsSummaryComponent,
    Button,
    Tooltip,
    KpiCardsGridComponent,
    HourlySalesChartComponent,
    PeriodSummarySidebarComponent,
    RankingPanelsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ventas-general.html',
  styleUrl: './ventas-general.css',
})
export class VentasGeneralComponent {
  protected readonly salesData = inject(SalesDataService);
  private readonly messageService = inject(MessageService);

  protected readonly headerTabs = HEADER_TABS;

  /** SalesDataService.saveAsDefault() stays UI-agnostic (it's also reachable from anywhere
   * else that ends up calling it later) -- the toast is this component's own concern, fired
   * right after the save actually happens. No `life` here -- the app-wide <p-toast [life]>
   * in app.html (4000ms) is the single source of truth for every toast's auto-dismiss time. */
  onSaveAsDefault(): void {
    this.salesData.saveAsDefault();
    this.messageService.add({
      severity: 'success',
      summary: 'Filtros guardados',
      detail: 'Esta será la vista que se cargue siempre que abras la página.',
    });
  }
}
