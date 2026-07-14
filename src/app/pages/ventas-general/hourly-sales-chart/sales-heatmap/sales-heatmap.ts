import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { OPERATIONAL_HOURS } from '../../../../data/utils/sales-fact.utils';
import { formatSignedAmount } from '../../../../pipes/signed-amount';

/** index 0 = Sunday, matching the standard `Date.getDay()` convention used by `SalesFact.dayOfWeek`. */
const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

interface HeatmapColumnHeader {
  hourIndex: number;
  label: string;
  showLabel: boolean;
}

interface HeatmapCell {
  dayLabel: string;
  hourLabel: string;
  amount: number;
  intensity: number;
  formattedAmount: string;
  tooltip: string;
}

interface HeatmapRow {
  dayLabel: string;
  cells: HeatmapCell[];
}

@Component({
  selector: 'app-sales-heatmap',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sales-heatmap.html',
  styleUrl: './sales-heatmap.css',
})
export class SalesHeatmapComponent {
  readonly matrix = input.required<number[][]>();

  /** Fixed opacity steps for the legend swatch — mirrors the 0.12-1.0 range used per cell. */
  protected readonly legendSteps = [0.12, 0.32, 0.52, 0.72, 1];

  private readonly hourLabels = OPERATIONAL_HOURS.map((hour) => `${hour.toString().padStart(2, '0')}:00`);

  protected readonly columnHeaders = computed<HeatmapColumnHeader[]>(() =>
    OPERATIONAL_HOURS.map((_, hourIndex) => ({
      hourIndex,
      label: this.hourLabels[hourIndex],
      showLabel: hourIndex % 3 === 0,
    })),
  );

  private readonly maxAmount = computed(() => Math.max(1, ...this.matrix().flat()));

  protected readonly rows = computed<HeatmapRow[]>(() => {
    const max = this.maxAmount();
    return this.matrix().map((rowAmounts, dayIndex) => {
      const dayLabel = DAY_LABELS[dayIndex] ?? `Día ${dayIndex}`;
      return {
        dayLabel,
        cells: rowAmounts.map((amount, hourIndex) => {
          const hourLabel = this.hourLabels[hourIndex];
          const formattedAmount = formatSignedAmount(amount).text;
          return {
            dayLabel,
            hourLabel,
            amount,
            intensity: amount / max,
            formattedAmount,
            tooltip: `${dayLabel} ${hourLabel}: ${formattedAmount}`,
          };
        }),
      };
    });
  });
}
