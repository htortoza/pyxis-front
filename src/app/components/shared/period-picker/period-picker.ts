import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Popover } from 'primeng/popover';
import { ToggleSwitch } from 'primeng/toggleswitch';

import type { Period, PeriodGranularity } from '../../../data/models/period.model';
import { PERIODS_BY_GRANULARITY } from '../../../data/mock/periods.mock';
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

  protected readonly draftGranularity = signal<PeriodGranularity>('mes');
  protected readonly draftPeriodIds = signal<Set<string>>(new Set());
  protected readonly draftCompare = signal<boolean>(true);

  protected readonly presets = computed<PeriodPreset[]>(() =>
    PERIOD_PRESETS.filter((preset) => preset.granularity === this.draftGranularity()),
  );

  private readonly activePeriods = computed<Period[]>(() => PERIODS_BY_GRANULARITY[this.draftGranularity()]);
  private readonly periodsByYear = computed(() => groupPeriodsByYear(this.activePeriods()));
  private readonly minYear = computed(() => Math.min(...this.activePeriods().map((period) => period.year)));
  private readonly maxYear = computed(() => Math.max(...this.activePeriods().map((period) => period.year)));

  /** Persists across popover open/close -- only the draft selection resets on (onShow). */
  protected readonly viewedYear = signal<number>(2026);

  protected readonly viewedYearPeriods = computed<Period[]>(() =>
    (this.periodsByYear().get(this.viewedYear()) ?? []).slice().sort((a, b) => a.order - b.order),
  );

  protected readonly canGoPrevYear = computed(() => this.viewedYear() > this.minYear());
  protected readonly canGoNextYear = computed(() => this.viewedYear() < this.maxYear());

  /** Live summary of the applied (not draft) selection shown on the trigger button. */
  protected readonly summaryLabel = computed(() => {
    const granularity = this.salesData.selectedPeriodGranularity();
    const selectedIds = new Set(this.salesData.selectedPeriodIds());
    const selected = PERIODS_BY_GRANULARITY[granularity].filter((period) => selectedIds.has(period.id));
    if (selected.length === 0) return 'Seleccionar periodos';

    const years = selected.map((period) => period.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearLabel = minYear === maxYear ? `${minYear}` : `${minYear}–${maxYear}`;
    return `${selected.length} periodos · ${yearLabel}`;
  });

  /** Reseeds the draft from the last-applied state every time the popover opens. */
  onPopoverShow(): void {
    this.draftGranularity.set(this.salesData.selectedPeriodGranularity());
    this.draftPeriodIds.set(new Set(this.salesData.selectedPeriodIds()));
    this.draftCompare.set(this.salesData.compareToPrevious());
    this.viewedYear.set(2026);
  }

  /** Cambiar de granularidad resetea la selección -- un id de Día no tiene sentido en Semana. */
  setGranularity(granularity: PeriodGranularity): void {
    if (granularity === this.draftGranularity()) return;
    this.draftGranularity.set(granularity);
    this.draftPeriodIds.set(new Set());
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
    this.draftPeriodIds.set(new Set(preset.resolve(this.activePeriods(), TODAY)));
  }

  apply(popover: Popover): void {
    this.salesData.selectedPeriodGranularity.set(this.draftGranularity());
    this.salesData.selectedPeriodIds.set([...this.draftPeriodIds()]);
    this.salesData.compareToPrevious.set(this.draftCompare());
    popover.hide();
  }

  cancel(popover: Popover): void {
    popover.hide();
  }
}
