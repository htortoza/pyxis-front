import { ChangeDetectionStrategy, Component, computed, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';

import type { Period } from '../../../data/models/period.model';
import { PERIODS_MES } from '../../../data/mock/periods.mock';
import { groupPeriodsByYear } from '../../../data/utils/period.utils';

const PERIODS_BY_YEAR = groupPeriodsByYear(PERIODS_MES);
const MIN_YEAR = Math.min(...PERIODS_MES.map((period) => period.year));
const MAX_YEAR = Math.max(...PERIODS_MES.map((period) => period.year));

/**
 * Grid de año + 12 meses (chips con p-checkbox) para elegir periodos de granularidad Mes --
 * único componente compartido por PeriodPickerComponent y por el picker de Periodo Específico
 * de ComparisonSelectorComponent, para que ambos se vean y se comporten exactamente igual.
 */
@Component({
  selector: 'app-month-period-picker',
  standalone: true,
  imports: [Button, Checkbox, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './month-period-picker.html',
  styleUrl: './month-period-picker.css',
})
export class MonthPeriodPickerComponent {
  readonly selectedIds = model.required<Set<string>>();

  protected readonly viewedYear = signal<number>(2026);

  protected readonly viewedYearPeriods = computed<Period[]>(() =>
    (PERIODS_BY_YEAR.get(this.viewedYear()) ?? []).slice().sort((a, b) => a.order - b.order),
  );

  protected readonly canGoPrevYear = computed(() => this.viewedYear() > MIN_YEAR);
  protected readonly canGoNextYear = computed(() => this.viewedYear() < MAX_YEAR);

  goPrevYear(): void {
    if (this.canGoPrevYear()) this.viewedYear.update((year) => year - 1);
  }

  goNextYear(): void {
    if (this.canGoNextYear()) this.viewedYear.update((year) => year + 1);
  }

  isSelected(periodId: string): boolean {
    return this.selectedIds().has(periodId);
  }

  toggle(periodId: string): void {
    const next = new Set(this.selectedIds());
    if (next.has(periodId)) {
      next.delete(periodId);
    } else {
      next.add(periodId);
    }
    this.selectedIds.set(next);
  }
}
