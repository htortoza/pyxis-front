import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { ProgressBar } from 'primeng/progressbar';

import { SalesDataService } from '../../../services/sales-data.service';
import { formatHourLabel } from '../../../data/utils/sales-fact.utils';

const COMPACT_CLP_FORMATTER = new Intl.NumberFormat('es-CL', { notation: 'compact', maximumFractionDigits: 1 });

function formatCompactClp(value: number): string {
  return `$${COMPACT_CLP_FORMATTER.format(value)}`;
}

interface StatRow {
  accent: 'good' | 'bad' | 'info' | 'neutral';
  label: string;
  value: string;
  caption: string;
}

@Component({
  selector: 'app-period-summary-sidebar',
  standalone: true,
  imports: [Card, ProgressBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './period-summary-sidebar.html',
  styleUrl: './period-summary-sidebar.css',
})
export class PeriodSummarySidebarComponent {
  protected readonly salesData = inject(SalesDataService);

  /** p-progressbar's `color` input sets the value bar's CSS `background` directly -- a
   * gradient string works as-is, no PrimeNG internals override needed. Same blue -> green
   * as the reference mockup's Meta Mensual bar (see --dash-blue/--dash-green in styles.css). */
  protected readonly metaProgressColor = 'linear-gradient(90deg, var(--dash-blue), var(--dash-green))';

  protected readonly statRows = computed<StatRow[]>(() => {
    const summary = this.salesData.hourlySummary();
    const variation = summary.peakVariationPct;
    return [
      {
        accent: 'good',
        label: 'Mejor hora',
        value: formatHourLabel(summary.bestHour),
        caption: `${formatCompactClp(summary.bestHourAvg)} promedio`,
      },
      {
        accent: 'bad',
        label: 'Hora más baja',
        value: formatHourLabel(summary.worstHour),
        caption: `${formatCompactClp(summary.worstHourAvg)} promedio`,
      },
      {
        accent: 'info',
        label: 'Variación pico',
        value: variation === null ? 'Sin datos' : `${variation >= 0 ? '+' : ''}${variation.toFixed(0)}%`,
        caption: 'vs. periodo anterior',
      },
      {
        accent: 'neutral',
        label: 'Horas activas',
        value: `${summary.activeHoursCount} hrs`,
        caption: 'superan umbral',
      },
    ];
  });

  protected readonly metaCurrentLabel = computed(() => formatCompactClp(this.salesData.metaMensualProgress().current));
  protected readonly metaTargetLabel = computed(() => formatCompactClp(this.salesData.metaMensualProgress().target));
  protected readonly metaPctLabel = computed(() => `${this.salesData.metaMensualProgress().pct.toFixed(1)}%`);
  protected readonly metaProgressValue = computed(() => Math.min(100, Math.max(0, this.salesData.metaMensualProgress().pct)));

  protected readonly metaCaption = computed(() => {
    const progress = this.salesData.metaMensualProgress();
    if (progress.daysRemaining === null) {
      return progress.pct >= 100 ? 'Meta alcanzada' : 'Periodo cerrado';
    }
    const paceText = progress.paceSufficient ? 'ritmo actual suficiente' : 'ritmo actual insuficiente';
    return `Quedan ${progress.daysRemaining} días — ${paceText}`;
  });
}
