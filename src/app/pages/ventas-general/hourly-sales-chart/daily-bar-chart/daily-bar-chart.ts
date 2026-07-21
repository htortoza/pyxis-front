import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { UIChart } from 'primeng/chart';

import { mobileMediaQueryList } from '../../../../data/utils/mobile-breakpoint.utils';
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

  /** Dual-chart frozen-axis layout only kicks in below 900px -- see chart-scroll-shell in the
   * template. Desktop keeps the single auto-fit chart untouched. */
  private readonly isMobile = signal(mobileMediaQueryList()?.matches ?? false);
  protected readonly isMobileMode = this.isMobile.asReadonly();

  constructor() {
    mobileMediaQueryList()?.addEventListener('change', (event) => this.isMobile.set(event.matches));
  }

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

  /** Same data as chartData (so both charts auto-scale to an identical y range) -- only the
   * bars' own paint is turned invisible, since this canvas exists purely to carry a frozen
   * copy of the y-axis ticks (see chart-axis in the template/css). */
  protected readonly axisChartData = computed(() => {
    const data = this.chartData();
    return {
      ...data,
      datasets: data.datasets.map((dataset) => ({ ...dataset, backgroundColor: 'transparent', borderWidth: 0 })),
    };
  });

  protected readonly plotMinWidthPx = computed(() => Math.max(600, this.series().length * 26));

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

  /** Same x-scale shape as mobileAxisChartOptions (transparent ticks instead of display:false)
   * so both canvases reserve the exact same bottom chrome height -- only the y-axis actually
   * paints here, everything else exists just to keep the two plot areas vertically aligned. */
  protected readonly mobilePlotChartOptions = computed(() => ({
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
        title: { display: false },
        ticks: { color: 'rgba(0, 0, 0, 0.6)' },
        grid: { display: false },
      },
      y: {
        title: { display: false },
        ticks: { display: false },
        grid: { color: 'rgba(0, 0, 0, 0.06)' },
      },
    },
  }));

  protected readonly mobileAxisChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: {
        title: { display: false },
        ticks: { color: 'transparent' },
        grid: { display: false },
      },
      y: {
        title: { display: false },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)',
          font: { size: 9 },
          padding: 2,
          callback: (value: number | string) => COMPACT_FORMATTER.format(Number(value)),
        },
        grid: { display: false },
      },
    },
  }));
}
