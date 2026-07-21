import { ChangeDetectionStrategy, Component, computed, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { ToggleSwitch } from 'primeng/toggleswitch';

import type { Period, PeriodGranularity } from '../../../data/models/period.model';
import { PERIODS_BY_GRANULARITY } from '../../../data/mock/periods.mock';
import { groupPeriodsByYear, PERIOD_PRESETS, type PeriodPreset } from '../../../data/utils/period.utils';

/** Stands in for the real current date -- this is a mock-data app with no live clock dependency. */
const TODAY = { year: 2026, month: 7, day: 20 };

/** Panel presentacional -- sin trigger ni popover propios, embebido en FiltersModalComponent. */
@Component({
  selector: 'app-period-picker',
  standalone: true,
  imports: [Button, Checkbox, FormsModule, ToggleSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './period-picker.html',
  styleUrl: './period-picker.css',
})
export class PeriodPickerComponent {
  readonly granularity = model.required<PeriodGranularity>();
  readonly periodIds = model.required<Set<string>>();
  readonly compare = model.required<boolean>();

  protected readonly presets = computed<PeriodPreset[]>(() =>
    PERIOD_PRESETS.filter((preset) => preset.granularity === this.granularity()),
  );

  private readonly activePeriods = computed<Period[]>(() => PERIODS_BY_GRANULARITY[this.granularity()]);
  private readonly periodsByYear = computed(() => groupPeriodsByYear(this.activePeriods()));
  private readonly minYear = computed(() => Math.min(...this.activePeriods().map((period) => period.year)));
  private readonly maxYear = computed(() => Math.max(...this.activePeriods().map((period) => period.year)));

  protected readonly viewedYear = signal<number>(2026);

  protected readonly viewedYearPeriods = computed<Period[]>(() =>
    (this.periodsByYear().get(this.viewedYear()) ?? []).slice().sort((a, b) => a.order - b.order),
  );

  protected readonly canGoPrevYear = computed(() => this.viewedYear() > this.minYear());
  protected readonly canGoNextYear = computed(() => this.viewedYear() < this.maxYear());

  /** Cambiar de granularidad resetea la selección -- un id de Día no tiene sentido en Semana. */
  setGranularity(granularity: PeriodGranularity): void {
    if (granularity === this.granularity()) return;
    this.granularity.set(granularity);
    this.periodIds.set(new Set());
  }

  isSelected(periodId: string): boolean {
    return this.periodIds().has(periodId);
  }

  togglePeriod(periodId: string): void {
    const next = new Set(this.periodIds());
    if (next.has(periodId)) {
      next.delete(periodId);
    } else {
      next.add(periodId);
    }
    this.periodIds.set(next);
  }

  goPrevYear(): void {
    if (this.canGoPrevYear()) this.viewedYear.update((year) => year - 1);
  }

  goNextYear(): void {
    if (this.canGoNextYear()) this.viewedYear.update((year) => year + 1);
  }

  applyPreset(preset: PeriodPreset): void {
    this.periodIds.set(new Set(preset.resolve(this.activePeriods(), TODAY)));
  }
}
