import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

import { comparisonBand, deltaSeverity } from '../../../pipes/signed-amount';

interface CompareSegments {
  previousShare: number;
  currentShare: number;
}

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

  readonly severity = computed(() => deltaSeverity(this.deltaPct()));
  readonly isPositive = computed(() => (this.deltaPct() ?? 0) >= 0);
  readonly deltaText = computed(() => {
    const pct = this.deltaPct();
    if (pct === null) return '';
    return `${Math.abs(pct).toFixed(1)}%`;
  });

  /** Semaphore band (good/medium/bad) driving the pastel color of the comparison bar. */
  readonly band = computed(() => comparisonBand(this.deltaPct()));

  /**
   * A single bar split into two proportional segments (previous | current), derived
   * purely from deltaPct (previous normalized to 100, current = 100 + deltaPct), so no
   * raw current/previous values need to flow into this presentational component.
   * Shares always sum to 100. Null when there's no previous-period baseline to compare.
   */
  readonly compareSegments = computed<CompareSegments | null>(() => {
    const delta = this.deltaPct();
    if (delta === null) return null;
    const previousBase = 100;
    const currentBase = Math.max(0, 100 + delta);
    const total = Math.max(previousBase + currentBase, 1);
    return {
      previousShare: (previousBase / total) * 100,
      currentShare: (currentBase / total) * 100,
    };
  });
}
