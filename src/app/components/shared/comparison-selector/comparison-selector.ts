import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Popover } from 'primeng/popover';

import type { ComparisonAlignment, ComparisonMode } from '../../../data/models/comparison.model';
import type { Period } from '../../../data/models/period.model';
import { PERIODS_BY_GRANULARITY } from '../../../data/mock/periods.mock';
import { groupPeriodsByYear } from '../../../data/utils/period.utils';
import { SalesDataService } from '../../../services/sales-data.service';

@Component({
  selector: 'app-comparison-selector',
  standalone: true,
  imports: [Button, Checkbox, FormsModule, Popover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comparison-selector.html',
  styleUrl: './comparison-selector.css',
})
export class ComparisonSelectorComponent {
  protected readonly salesData = inject(SalesDataService);

  protected readonly draftMode = signal<ComparisonMode>('periodo_anterior');
  protected readonly draftAlignment = signal<ComparisonAlignment>('calendario');
  protected readonly draftExplicitPeriodIds = signal<Set<string>>(new Set());

  /** El toggle de alineación solo tiene sentido en modo periodo_anterior y granularidad Día/Semana. */
  protected readonly showAlignment = computed(
    () => this.draftMode() === 'periodo_anterior' && this.salesData.selectedPeriodGranularity() !== 'mes',
  );
  protected readonly showExplicitPicker = computed(() => this.draftMode() === 'periodo_especifico');

  private readonly activePeriods = computed<Period[]>(
    () => PERIODS_BY_GRANULARITY[this.salesData.selectedPeriodGranularity()],
  );
  private readonly periodsByYear = computed(() => groupPeriodsByYear(this.activePeriods()));
  private readonly minYear = computed(() => Math.min(...this.activePeriods().map((period) => period.year)));
  private readonly maxYear = computed(() => Math.max(...this.activePeriods().map((period) => period.year)));

  protected readonly viewedYear = signal<number>(2026);
  protected readonly viewedYearPeriods = computed<Period[]>(() =>
    (this.periodsByYear().get(this.viewedYear()) ?? []).slice().sort((a, b) => a.order - b.order),
  );
  protected readonly canGoPrevYear = computed(() => this.viewedYear() > this.minYear());
  protected readonly canGoNextYear = computed(() => this.viewedYear() < this.maxYear());

  protected readonly modeLabel = computed(() => {
    switch (this.salesData.comparisonMode()) {
      case 'periodo_anterior':
        return 'Periodo Anterior';
      case 'periodo_especifico':
        return 'Periodo Específico';
      case 'meta':
        return 'Meta';
    }
  });

  onPopoverShow(): void {
    this.draftMode.set(this.salesData.comparisonMode());
    this.draftAlignment.set(this.salesData.comparisonAlignment());
    this.draftExplicitPeriodIds.set(new Set(this.salesData.explicitComparisonPeriodIds() ?? []));
    this.viewedYear.set(2026);
  }

  setMode(mode: ComparisonMode): void {
    this.draftMode.set(mode);
  }

  setAlignment(alignment: ComparisonAlignment): void {
    this.draftAlignment.set(alignment);
  }

  goPrevYear(): void {
    if (this.canGoPrevYear()) this.viewedYear.update((year) => year - 1);
  }

  goNextYear(): void {
    if (this.canGoNextYear()) this.viewedYear.update((year) => year + 1);
  }

  isExplicitSelected(periodId: string): boolean {
    return this.draftExplicitPeriodIds().has(periodId);
  }

  toggleExplicitPeriod(periodId: string): void {
    const next = new Set(this.draftExplicitPeriodIds());
    if (next.has(periodId)) {
      next.delete(periodId);
    } else {
      next.add(periodId);
    }
    this.draftExplicitPeriodIds.set(next);
  }

  apply(popover: Popover): void {
    this.salesData.comparisonMode.set(this.draftMode());
    this.salesData.comparisonAlignment.set(this.draftAlignment());
    this.salesData.explicitComparisonPeriodIds.set(
      this.draftMode() === 'periodo_especifico' ? [...this.draftExplicitPeriodIds()] : null,
    );
    popover.hide();
  }

  cancel(popover: Popover): void {
    popover.hide();
  }
}
