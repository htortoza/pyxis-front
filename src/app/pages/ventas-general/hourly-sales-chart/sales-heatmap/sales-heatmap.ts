import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { OPERATIONAL_HOURS } from '../../../../data/utils/sales-fact.utils';
import { formatSignedAmount } from '../../../../pipes/signed-amount';

/** index 0 = Sunday, matching the standard `Date.getDay()` convention used by `SalesFact.dayOfWeek`. */
const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/** Cells are small (a couple rem across) -- a compact "45K" fits, a full "$45.291" doesn't. */
const COMPACT_FORMATTER = new Intl.NumberFormat('es-CL', { notation: 'compact', maximumFractionDigits: 1 });

/** Above this intensity the red background is saturated enough that dark text stops
 * being readable -- switches the cell to light text instead. */
const LIGHT_TEXT_INTENSITY_THRESHOLD = 0.45;

/**
 * Aura's red.600 (`--p-red-600`), as raw RGB -- needed here (not just the CSS var) because
 * the cell's background alpha must vary independently of its text, which stays fully
 * opaque. Baking the alpha into an rgba() string does that; the CSS `opacity` property
 * would fade the number along with the background. Same accepted "hardcoded hex" exception
 * as hourly-bar-chart.ts's Chart.js palette, for the same reason (need a literal color a
 * charting/inline-style context can compute with, not a token reference).
 */
const HEAT_COLOR_RGB = '220, 38, 38';

function heatBackground(intensity: number): string {
  const alpha = 0.12 + intensity * 0.88;
  return `rgba(${HEAT_COLOR_RGB}, ${alpha.toFixed(2)})`;
}

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
  formattedAmountCompact: string;
  background: string;
  useLightText: boolean;
  /** The single highest-selling cell in the whole matrix -- gets a subtle radar-pulse ring
   * (sales-heatmap.css) to draw the eye to it. True for every cell in a tie at the max. */
  isTopCell: boolean;
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
          const intensity = amount / max;
          return {
            dayLabel,
            hourLabel,
            amount,
            intensity,
            formattedAmount,
            formattedAmountCompact: amount === 0 ? '' : COMPACT_FORMATTER.format(amount),
            background: heatBackground(intensity),
            useLightText: intensity > LIGHT_TEXT_INTENSITY_THRESHOLD,
            isTopCell: amount === max,
            tooltip: `${dayLabel} ${hourLabel}: ${formattedAmount}`,
          };
        }),
      };
    });
  });
}
