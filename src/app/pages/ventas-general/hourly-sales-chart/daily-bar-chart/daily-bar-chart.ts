import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UIChart } from 'primeng/chart';

import type { DailyPoint } from '../../../../data/utils/sales-fact.utils';
import { formatSignedAmount } from '../../../../pipes/signed-amount';

const COMPACT_FORMATTER = new Intl.NumberFormat('es-CL', { notation: 'compact' });
const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', timeZone: 'UTC' });

function formatDayLabel(iso: string): string {
  return DAY_LABEL_FORMATTER.format(new Date(`${iso}T00:00:00Z`));
}

/**
 * Una sola serie (no una por periodo, a diferencia de HourlyBarChartComponent) -- acá se está
 * mirando el total día a día dentro del rango seleccionado, no comparando un periodo contra otro.
 */
@Component({
  selector: 'app-daily-bar-chart',
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily-bar-chart.html',
  styleUrl: './daily-bar-chart.css',
})
export class DailyBarChartComponent {
  readonly series = input.required<DailyPoint[]>();

  protected readonly chartData = computed(() => {
    const points = this.series();
    return {
      labels: points.map((point) => formatDayLabel(point.date)),
      datasets: [
        {
          label: 'Ventas',
          data: points.map((point) => point.amount),
          // Same blue as the period palette (hourly-bar-chart.ts) -- Chart.js needs a literal
          // hex, can't resolve --dash-blue from styles.css.
          backgroundColor: '#3b80ea',
          borderRadius: 4,
        },
      ],
    };
  });

  protected readonly chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: { parsed: { y: number } }) => formatSignedAmount(context.parsed.y).text,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Día' },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: 'Ventas (CLP)' },
        ticks: {
          callback: (value: number | string) => COMPACT_FORMATTER.format(Number(value)),
        },
        grid: { color: 'rgba(0, 0, 0, 0.06)' },
      },
    },
  }));
}
