import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { SalesDataService } from '../../../services/sales-data.service';
import { LoadingSkeletonComponent } from '../../../components/shared/loading-skeleton/loading-skeleton';
import { HourlyBarChartComponent } from './hourly-bar-chart/hourly-bar-chart';
import { SalesHeatmapComponent } from './sales-heatmap/sales-heatmap';

type ViewMode = 'bars' | 'heatmap';

@Component({
  selector: 'app-hourly-sales-chart',
  standalone: true,
  imports: [Button, Card, LoadingSkeletonComponent, HourlyBarChartComponent, SalesHeatmapComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hourly-sales-chart.html',
  styleUrl: './hourly-sales-chart.css',
})
export class HourlySalesChartComponent {
  protected readonly salesData = inject(SalesDataService);

  protected readonly viewMode = signal<ViewMode>('bars');

  protected setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }
}
