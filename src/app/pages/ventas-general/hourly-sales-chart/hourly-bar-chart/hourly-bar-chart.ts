import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ScriptableContext } from 'chart.js';
import { UIChart } from 'primeng/chart';

import type { Period } from '../../../../data/models/period.model';
import { OPERATIONAL_HOURS } from '../../../../data/utils/sales-fact.utils';
import { formatSignedAmount } from '../../../../pipes/signed-amount';

/**
 * Fixed, deterministic palette keyed by a period's `order` — so a given calendar
 * period always renders in the same color regardless of which periods are selected.
 * Chart.js needs literal color strings, it cannot resolve CSS custom properties,
 * so hardcoding this small named palette here (not in a page CSS file) is the
 * accepted exception to the "no hardcoded hex" rule. Monochromatic indigo ramp
 * (light -> dark), matching the app's brand hue (see app.config.ts) rather than
 * a rainbow of hues.
 */
const PERIOD_COLOR_PALETTE = [
  '#a5b4fc',
  '#818cf8',
  '#6366f1',
  '#4f46e5',
  '#3730a3',
  '#312e81',
];

function colorForPeriod(order: number): string {
  const index = ((order % PERIOD_COLOR_PALETTE.length) + PERIOD_COLOR_PALETTE.length) % PERIOD_COLOR_PALETTE.length;
  return PERIOD_COLOR_PALETTE[index];
}

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Per-bar vertical gradient (solid at the top, fading toward the base) using the bar's own
 * pixel geometry -- not the whole chart area -- so short and tall bars each fade over their
 * own height instead of sampling different slices of one shared gradient.
 */
function createBarGradient(hex: string) {
  return (context: ScriptableContext<'bar'>) => {
    const { chart, datasetIndex, dataIndex } = context;
    const { ctx, chartArea } = chart;
    if (!chartArea) return hex; // first layout pass, before bar geometry is known

    const bar = chart.getDatasetMeta(datasetIndex).data[dataIndex] as unknown as
      | { y: number; base: number }
      | undefined;
    if (!bar) return hex;

    const gradient = ctx.createLinearGradient(0, bar.y, 0, bar.base);
    gradient.addColorStop(0, hex);
    gradient.addColorStop(1, hexToRgba(hex, 0.35));
    return gradient;
  };
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

  private readonly hourLabels = OPERATIONAL_HOURS.map((hour) => `${hour.toString().padStart(2, '0')}:00`);

  protected readonly chartPlugins = [LEGEND_MARGIN_PLUGIN];

  protected readonly chartData = computed(() => {
    const selectedIds = new Set(this.selectedPeriodIds());
    const series = this.seriesByPeriod();
    const orderedSelected = this.periods().filter((period) => selectedIds.has(period.id));

    return {
      labels: this.hourLabels,
      datasets: orderedSelected.map((period) => {
        const color = colorForPeriod(period.order);
        return {
          label: period.label,
          data: series[period.id] ?? [],
          backgroundColor: createBarGradient(color),
          borderRadius: 4,
          // Scriptable backgroundColor functions aren't resolved by Chart.js's default legend
          // swatch renderer -- generateLabels below reads this flat color instead.
          legendColor: color,
        };
      }),
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
        labels: {
          usePointStyle: true,
          padding: 20,
          generateLabels: (chart: { data: { datasets: { label?: string; legendColor?: string }[] }; isDatasetVisible: (index: number) => boolean }) =>
            chart.data.datasets.map((dataset, index) => ({
              text: dataset.label ?? '',
              fillStyle: dataset.legendColor,
              strokeStyle: dataset.legendColor,
              pointStyle: 'rect' as const,
              hidden: !chart.isDatasetVisible(index),
              index,
            })),
        },
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
