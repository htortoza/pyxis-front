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
 * accepted exception to the "no hardcoded hex" rule. These 6 colors are sampled
 * directly off the Pyxis logo's own gradient (Logo/SVG/icono-color copia.svg:
 * violet #8400c8 at 0% -> indigo #2010c0 at 50% -> blue #0271ed at 100%) at
 * evenly spaced points, not a generic Tailwind/Aura hue ramp.
 */
const PERIOD_COLOR_PALETTE = [
  '#8400c8',
  '#5c06c5',
  '#340dc2',
  '#1a23c9',
  '#0e4adb',
  '#0271ed',
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
 * Vertical gradient (solid at the top, fading toward the base) spanning the whole plot area.
 * Deliberately NOT keyed to each bar's own pixel geometry (context.chart.getDatasetMeta(...)
 * .data[i].y/.base) -- those can still be undefined/non-finite on the pass where Chart.js
 * resolves element style before it finishes computing element geometry, and passing a
 * non-finite value to createLinearGradient throws, crashing the whole chart's initial render.
 * chartArea's bounds are always finite once chartArea itself exists.
 */
function createBarGradient(hex: string) {
  return (context: ScriptableContext<'bar'>) => {
    const { ctx, chartArea } = context.chart;
    if (!chartArea) return hex; // first layout pass, before chartArea is known

    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
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
