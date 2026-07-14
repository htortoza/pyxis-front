import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';

import { bandSeverity, comparisonBand } from '../../../pipes/signed-amount';

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
   * A single fill bar against a flat baseline: current normalized against previous
   * (previous = 100), capped at 100% -- a full bar means current is at or above the
   * previous period. Below 100% shows how far current still is from matching it.
   * Null when there's no previous-period baseline to compare against.
   */
  readonly fillPct = computed<number | null>(() => {
    const delta = this.deltaPct();
    if (delta === null) return null;
    return Math.min(100, Math.max(0, 100 + delta));
  });
}
