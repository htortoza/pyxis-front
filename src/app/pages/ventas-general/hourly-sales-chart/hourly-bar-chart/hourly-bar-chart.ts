import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { UIChart } from 'primeng/chart';

import type { Period } from '../../../../data/models/period.model';
import { mobileMediaQueryList } from '../../../../data/utils/mobile-breakpoint.utils';
import { OPERATIONAL_HOURS, formatHourLabel } from '../../../../data/utils/sales-fact.utils';
import { formatSignedAmount } from '../../../../pipes/signed-amount';

/**
 * Fixed, deterministic palette keyed by a period's `order` — so a given calendar
 * period always renders in the same color regardless of which periods are selected.
 * Chart.js needs literal color strings, it cannot resolve CSS custom properties,
 * so hardcoding this small named palette here (not in a page CSS file) is the
 * accepted exception to the "no hardcoded hex" rule. Sampled from the reference
 * mockup (dashboard.png) instead of the old monochrome blue ladder -- same varied,
 * soft palette used for the KPI cards/sidebar (see --dash-* in styles.css), plus 2
 * extra hues (amber, indigo) since this palette needs to cover more than 4 periods.
 * `order` is `year*12 + month` for monthly periods (periods.mock.ts), so with this
 * 6-slot array the current default 3-month view (May/Jun/Jul 2026) happens to land
 * on periwinkle/green/blue in that order, same as the mockup's Mayo/Junio/Julio.
 */
const PERIOD_COLOR_PALETTE = [
  '#728bd4', // periwinkle
  '#64d6a4', // green
  '#e87868', // coral
  '#8e9bc5', // indigo
  '#e8b85c', // amber
  '#3b80ea', // blue
];

function colorForPeriod(order: number): string {
  const index = ((order % PERIOD_COLOR_PALETTE.length) + PERIOD_COLOR_PALETTE.length) % PERIOD_COLOR_PALETTE.length;
  return PERIOD_COLOR_PALETTE[index];
}

const COMPACT_FORMATTER = new Intl.NumberFormat('es-CL', { notation: 'compact' });

/**
 * Chart.js has no built-in "margin below the legend" option -- `labels.padding` only pads
 * between legend items, not the gap before the plot area. This patches the legend's own
 * `fit()` (the standard workaround) to add fixed extra height, keeping the bars from
 * visually touching the legend row above them.
 */
const LEGEND_MARGIN_PLUGIN = {
  id: 'legendMargin',
  afterInit(chart: { legend?: { fit: () => void; height: number } }) {
    const legend = chart.legend;
    if (!legend) return;
    const originalFit = legend.fit;
    legend.fit = function (this: { height: number }) {
      originalFit.call(this);
      this.height += 20;
    };
  },
};

@Component({
  selector: 'app-hourly-bar-chart',
  standalone: true,
  imports: [UIChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hourly-bar-chart.html',
  styleUrl: './hourly-bar-chart.css',
})
export class HourlyBarChartComponent {
  readonly seriesByPeriod = input.required<Record<string, number[]>>();
  readonly periods = input.required<Period[]>();
  readonly selectedPeriodIds = input.required<string[]>();

  private readonly hourLabels = OPERATIONAL_HOURS.map(formatHourLabel);

  protected readonly chartPlugins = [LEGEND_MARGIN_PLUGIN];

  /** Dual-chart frozen-axis layout only kicks in below 900px -- see chart-scroll-shell in the
   * template. Desktop keeps the single auto-fit chart untouched. */
  private readonly isMobile = signal(mobileMediaQueryList()?.matches ?? false);
  protected readonly isMobileMode = this.isMobile.asReadonly();

  constructor() {
    mobileMediaQueryList()?.addEventListener('change', (event) => this.isMobile.set(event.matches));
  }

  protected readonly orderedSelectedPeriods = computed(() => {
    const selectedIds = new Set(this.selectedPeriodIds());
    return this.periods().filter((period) => selectedIds.has(period.id));
  });

  protected readonly chartData = computed(() => {
    const series = this.seriesByPeriod();
    return {
      labels: this.hourLabels,
      datasets: this.orderedSelectedPeriods().map((period) => ({
        label: period.label,
        data: series[period.id] ?? [],
        backgroundColor: colorForPeriod(period.order),
        borderRadius: 4,
      })),
    };
  });

  /** Same data as chartData (so Chart.js auto-scales both charts to an identical y range) --
   * only the bars' own paint is turned invisible, since this canvas exists purely to carry a
   * frozen copy of the y-axis ticks (see chart-axis in the template/css). */
  protected readonly axisChartData = computed(() => {
    const data = this.chartData();
    return {
      ...data,
      datasets: data.datasets.map((dataset) => ({ ...dataset, backgroundColor: 'transparent', borderWidth: 0 })),
    };
  });

  protected readonly plotMinWidthPx = computed(() => Math.max(600, this.hourLabels.length * 42));

  /** Exposes colorForPeriod to the template's mobile legend dots (see mobile-legend-dot). */
  protected periodColor(order: number): string {
    return colorForPeriod(order);
  }

  protected readonly chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'start' as const,
        labels: { usePointStyle: true, padding: 20 },
      },
      tooltip: {
        callbacks: {
          label: (context: { dataset: { label?: string }; parsed: { y: number } }) =>
            `${context.dataset.label ?? ''}: ${formatSignedAmount(context.parsed.y).text}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Hora' },
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

  /** Legend is dropped here on purpose (rendered as plain HTML instead, see the template's
   * .mobile-legend) -- Chart.js's own legend wraps to a different number of lines depending on
   * container width, which would silently throw off the two mobile canvases' vertical
   * alignment since they're two separate legend measurements at two very different widths. */
  protected readonly mobilePlotChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: { legend: { display: false } },
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

  /** Same x-scale shape as mobilePlotChartOptions (transparent ticks instead of display:false)
   * so both canvases reserve the exact same bottom chrome height -- only the y-axis actually
   * paints here, everything else exists just to keep the two plot areas vertically aligned. */
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
