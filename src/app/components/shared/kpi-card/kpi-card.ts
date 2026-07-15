import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

import type { TrendPoint } from '../../../data/models/kpi.model';
import { MIN_TREND_POINTS } from '../../../data/utils/sales-fact.utils';
import { bandSeverity, comparisonBand } from '../../../pipes/signed-amount';

/** Fixed sparkline viewBox -- coordinates are computed as percentages of this, not real px. */
const SPARKLINE_VIEWBOX_WIDTH = 100;
const SPARKLINE_VIEWBOX_HEIGHT = 32;
/** Vertical inset so peaks/valleys never touch the very top/bottom edge. */
const SPARKLINE_Y_INSET = 4;

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [Card, Tag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly deltaPct = input<number | null>(null);
  /** Candidate sparkline points from SalesDataService -- not yet threshold-checked (see trendState). */
  readonly trendPoints = input<TrendPoint[]>([]);

  /** Semaphore band (good/medium/bad) -- single source of truth for both the tag and the bar. */
  readonly band = computed(() => comparisonBand(this.deltaPct()));
  readonly severity = computed(() => bandSeverity(this.band()));
  readonly isPositive = computed(() => (this.deltaPct() ?? 0) >= 0);
  readonly deltaText = computed(() => {
    const pct = this.deltaPct();
    if (pct === null) return '';
    return `${Math.abs(pct).toFixed(1)}%`;
  });

  /**
   * Three states, per the product spec on insufficient-history handling:
   * - 'none': no previous period at all (deltaPct null) -- no badge, no sparkline, neutral copy.
   * - 'insufficient': a previous period exists (badge shows) but fewer than MIN_TREND_POINTS
   *   real data points are available -- sparkline area shows discreet copy instead of a line
   *   that would suggest a trend from just 1-2 points.
   * - 'chart': enough real points to draw a representative line.
   */
  readonly trendState = computed<'none' | 'insufficient' | 'chart'>(() => {
    if (this.deltaPct() === null) return 'none';
    return this.trendPoints().length >= MIN_TREND_POINTS ? 'chart' : 'insufficient';
  });

  private readonly sparklineValues = computed(() => this.trendPoints().map((point) => point.value));

  /** SVG polyline "x,y x,y ..." string, scaled to the fixed viewBox with a flat line for constant data. */
  readonly sparklinePoints = computed(() => {
    const values = this.sparklineValues();
    if (values.length === 0) return '';

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const plotHeight = SPARKLINE_VIEWBOX_HEIGHT - SPARKLINE_Y_INSET * 2;
    const lastIndex = Math.max(1, values.length - 1);

    return values
      .map((value, index) => {
        const x = (index / lastIndex) * SPARKLINE_VIEWBOX_WIDTH;
        const normalized = range === 0 ? 0.5 : (value - min) / range;
        const y = SPARKLINE_Y_INSET + (1 - normalized) * plotHeight;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  });

  readonly sparklineViewBox = `0 0 ${SPARKLINE_VIEWBOX_WIDTH} ${SPARKLINE_VIEWBOX_HEIGHT}`;
}
