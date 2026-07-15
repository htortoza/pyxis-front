import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UIChart } from 'primeng/chart';

import type { Period } from '../../../../data/models/period.model';
import { OPERATIONAL_HOURS } from '../../../../data/utils/sales-fact.utils';
import { formatSignedAmount } from '../../../../pipes/signed-amount';

/**
 * Fixed, deterministic palette keyed by a period's `order` — so a given calendar
 * period always renders in the same color regardless of which periods are selected.
 * Chart.js needs literal color strings, it cannot resolve CSS custom properties,
 * so hardcoding this small named palette here (not in a page CSS file) is the
 * accepted exception to the "no hardcoded hex" rule. Monochromatic violet ramp
 * (light -> dark), matching the app's brand hue rather than a rainbow of hues.
 */
const PERIOD_COLOR_PALETTE = [
  '#c4b5fd',
  '#a78bfa',
  '#8b5cf6',
  '#7c3aed',
  '#5b21b6',
  '#4c1d95',
];

function colorForPeriod(order: number): string {
  const index = ((order % PERIOD_COLOR_PALETTE.length) + PERIOD_COLOR_PALETTE.length) % PERIOD_COLOR_PALETTE.length;
  return PERIOD_COLOR_PALETTE[index];
}

const COMPACT_FORMATTER = new Intl.NumberFormat('es-CL', { notation: 'compact' });

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
