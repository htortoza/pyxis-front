import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';

import type { ComparisonAlignment, ComparisonMode } from '../../../data/models/comparison.model';
import type { Period, PeriodGranularity } from '../../../data/models/period.model';
import { PERIODS_BY_GRANULARITY } from '../../../data/mock/periods.mock';
import { groupPeriodsByYear } from '../../../data/utils/period.utils';
import { CalendarPeriodPickerComponent } from '../calendar-period-picker/calendar-period-picker';

/**
 * Panel presentacional -- sin trigger ni popover propios, embebido en el mini-modal
 * "Comparación" de FiltersModalComponent. El picker explícito de Periodo Específico usa su
 * propio grid de chips año+mes para 'mes'; para Día/Semana delega en
 * CalendarPeriodPickerComponent (mismo componente que usa PeriodPickerComponent).
 */
@Component({
  selector: 'app-comparison-selector',
  standalone: true,
  imports: [Button, CalendarPeriodPickerComponent, Checkbox, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comparison-selector.html',
  styleUrl: './comparison-selector.css',
})
export class ComparisonSelectorComponent {
  /** Granularidad activa en el draft del modal -- de solo lectura acá, la dueña es PeriodPickerComponent. */
  readonly granularity = input.required<PeriodGranularity>();

  readonly mode = model.required<ComparisonMode>();
  readonly alignment = model.required<ComparisonAlignment>();
  readonly explicitPeriodIds = model.required<Set<string>>();

  /** El toggle de alineación solo tiene sentido en modo periodo_anterior y granularidad Día/Semana. */
  protected readonly showAlignment = computed(
    () => this.mode() === 'periodo_anterior' && this.granularity() !== 'mes',
  );
  protected readonly showExplicitPicker = computed(() => this.mode() === 'periodo_especifico');

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

  goPrevYear(): void {
    if (this.canGoPrevYear()) this.viewedYear.update((year) => year - 1);
  }

  goNextYear(): void {
    if (this.canGoNextYear()) this.viewedYear.update((year) => year + 1);
  }

  isExplicitSelected(periodId: string): boolean {
    return this.explicitPeriodIds().has(periodId);
  }

  toggleExplicitPeriod(periodId: string): void {
    const next = new Set(this.explicitPeriodIds());
    if (next.has(periodId)) {
      next.delete(periodId);
    } else {
      next.add(periodId);
    }
    this.explicitPeriodIds.set(next);
  }
}
