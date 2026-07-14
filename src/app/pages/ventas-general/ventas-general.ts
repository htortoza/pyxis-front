import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GlobalHeaderComponent } from '../../components/shared/global-header/global-header';
import { KpiCardsGridComponent } from './kpi-cards-grid/kpi-cards-grid';
import { HourlySalesChartComponent } from './hourly-sales-chart/hourly-sales-chart';
import { RankingPanelsComponent } from './ranking-panels/ranking-panels';

@Component({
  selector: 'app-ventas-general',
  standalone: true,
  imports: [GlobalHeaderComponent, KpiCardsGridComponent, HourlySalesChartComponent, RankingPanelsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ventas-general.html',
  styleUrl: './ventas-general.css',
})
export class VentasGeneralComponent {}
