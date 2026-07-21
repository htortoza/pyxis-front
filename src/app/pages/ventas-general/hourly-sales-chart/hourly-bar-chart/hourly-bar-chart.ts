import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UIChart } from 'primeng/chart';

import type { Period } from '../../../../data/models/period.model';
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

  protected readonly chartData = computed(() => {
    const selectedIds = new Set(this.selectedPeriodIds());
    const series = this.seriesByPeriod();
    const orderedSelected = this.periods().filter((period) => selectedIds.has(period.id));

    return {
      labels: this.hourLabels,
      datasets: orderedSelected.map((period) => ({
        label: period.label,
        data: series[period.id] ?? [],
        backgroundColor: colorForPeriod(period.order),
        borderRadius: 4,
      })),
    };
  });

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
}
