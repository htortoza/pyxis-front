import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { SalesDataService } from '../../../services/sales-data.service';
import { LoadingSkeletonComponent } from '../../../components/shared/loading-skeleton/loading-skeleton';
import { DailyBarChartComponent } from './daily-bar-chart/daily-bar-chart';
import { HourlyBarChartComponent } from './hourly-bar-chart/hourly-bar-chart';
import { SalesHeatmapComponent } from './sales-heatmap/sales-heatmap';

type ViewMode = 'bars' | 'daily' | 'heatmap';

const TITLE_BY_VIEW_MODE: Record<ViewMode, string> = {
  bars: 'Ventas por Hora',
  daily: 'Ventas por Día',
  heatmap: 'Mapa de Calor',
};

const SUBTITLE_BY_VIEW_MODE: Record<ViewMode, string> = {
  bars: 'Distribución horaria de ventas (CLP)',
  daily: 'Distribución diaria de ventas (CLP)',
  heatmap: 'Patrón semanal de ventas por hora y día (CLP)',
};

@Component({
  selector: 'app-hourly-sales-chart',
  standalone: true,
  imports: [
    Button,
    Card,
    LoadingSkeletonComponent,
    DailyBarChartComponent,
    HourlyBarChartComponent,
    SalesHeatmapComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hourly-sales-chart.html',
  styleUrl: './hourly-sales-chart.css',
})
export class HourlySalesChartComponent {
  protected readonly salesData = inject(SalesDataService);

  protected readonly viewMode = signal<ViewMode>('bars');

  protected readonly chartTitle = computed(() => TITLE_BY_VIEW_MODE[this.viewMode()]);
  protected readonly chartSubtitle = computed(() => SUBTITLE_BY_VIEW_MODE[this.viewMode()]);

  protected setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }
}
