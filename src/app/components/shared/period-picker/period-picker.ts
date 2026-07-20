import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Popover } from 'primeng/popover';
import { ToggleSwitch } from 'primeng/toggleswitch';

import type { Period } from '../../../data/models/period.model';
import { PERIODS } from '../../../data/mock/periods.mock';
import { groupPeriodsByYear, PERIOD_PRESETS, type PeriodPreset } from '../../../data/utils/period.utils';
import { SalesDataService } from '../../../services/sales-data.service';

/** Stands in for the real current date -- this is a mock-data app with no live clock dependency. */
const TODAY = { year: 2026, month: 7, day: 20 };

@Component({
  selector: 'app-period-picker',
  standalone: true,
  imports: [Button, Checkbox, FormsModule, Popover, ToggleSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './period-picker.html',
  styleUrl: './period-picker.css',
})
export class PeriodPickerComponent {
  protected readonly salesData = inject(SalesDataService);
  protected readonly presets = PERIOD_PRESETS;

  private readonly periodsByYear = groupPeriodsByYear(PERIODS);
  private readonly minYear = Math.min(...PERIODS.map((period) => period.year));
  private readonly maxYear = Math.max(...PERIODS.map((period) => period.year));

  /** Persists across popover open/close -- only the draft selection resets on (onShow). */
  protected readonly viewedYear = signal<number>(this.maxYear);

  protected readonly draftPeriodIds = signal<Set<string>>(new Set());
  protected readonly draftCompare = signal<boolean>(true);

  protected readonly viewedYearPeriods = computed<Period[]>(
    () => this.periodsByYear.get(this.viewedYear()) ?? [],
  );

  protected readonly canGoPrevYear = computed(() => this.viewedYear() > this.minYear);
  protected readonly canGoNextYear = computed(() => this.viewedYear() < this.maxYear);

  /** Live summary of the applied (not draft) selection shown on the trigger button. */
  protected readonly summaryLabel = computed(() => {
    const selectedIds = new Set(this.salesData.selectedPeriodIds());
    const selected = PERIODS.filter((period) => selectedIds.has(period.id));
    if (selected.length === 0) return 'Seleccionar periodos';

    const years = selected.map((period) => period.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearLabel = minYear === maxYear ? `${minYear}` : `${minYear}–${maxYear}`;
    return `${selected.length} periodos · ${yearLabel}`;
  });

  /** Reseeds the draft from the last-applied state every time the popover opens. */
  onPopoverShow(): void {
    this.draftPeriodIds.set(new Set(this.salesData.selectedPeriodIds()));
    this.draftCompare.set(this.salesData.compareToPrevious());
  }

  isDraftSelected(periodId: string): boolean {
    return this.draftPeriodIds().has(periodId);
  }

  toggleDraftPeriod(periodId: string): void {
    const next = new Set(this.draftPeriodIds());
    if (next.has(periodId)) {
      next.delete(periodId);
    } else {
      next.add(periodId);
    }
    this.draftPeriodIds.set(next);
  }

  goPrevYear(): void {
    if (this.canGoPrevYear()) this.viewedYear.update((year) => year - 1);
  }

  goNextYear(): void {
    if (this.canGoNextYear()) this.viewedYear.update((year) => year + 1);
  }

  applyPreset(preset: PeriodPreset): void {
    this.draftPeriodIds.set(new Set(preset.resolve(PERIODS, TODAY)));
  }

  apply(popover: Popover): void {
    this.salesData.selectedPeriodIds.set([...this.draftPeriodIds()]);
    this.salesData.compareToPrevious.set(this.draftCompare());
    popover.hide();
  }

  cancel(popover: Popover): void {
    popover.hide();
  }
}
