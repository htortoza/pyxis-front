import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';

import type { PeriodGranularity } from '../../../data/models/period.model';
import { MONTH_LABELS_ES, PERIODS_DIA, WEEK_ID_BY_DATE } from '../../../data/mock/periods.mock';
import { buildCalendarGrid, type CalendarDay } from '../../../data/utils/date.utils';

const MIN_YEAR = PERIODS_DIA[0].year;
const MIN_MONTH = PERIODS_DIA[0].month;
const MAX_YEAR = PERIODS_DIA[PERIODS_DIA.length - 1].year;
const MAX_MONTH = PERIODS_DIA[PERIODS_DIA.length - 1].month;

/** Stands in for the real current date -- same mock convention as the other period components. */
const TODAY = { year: 2026, month: 7 };

const WEEKDAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MONTH_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * Calendario mensual reutilizable para elegir Días o Semanas -- reemplaza la lista plana de
 * periodos que existía antes. En modo 'dia', cada celda es un día independiente. En modo
 * 'semana', clickear cualquier día de una fila selecciona/deselecciona LA SEMANA COMPLETA: todas
 * las celdas de una fila resuelven al mismo id de Semana (WEEK_ID_BY_DATE), así que "seleccionar
 * la fila entera" sale gratis de la misma lógica de "seleccionar una celda" -- ver idFor().
 *
 * `granularity` acepta el tipo completo PeriodGranularity (no solo 'dia'|'semana') para que el
 * padre no necesite un cast al pasarlo desde un signal ya angostado por un @if/@else -- en la
 * práctica este componente nunca se monta para granularidad 'mes' (esa sigue con su propio
 * grid de meses en PeriodPickerComponent).
 */
@Component({
  selector: 'app-calendar-period-picker',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-period-picker.html',
  styleUrl: './calendar-period-picker.css',
})
export class CalendarPeriodPickerComponent {
  readonly granularity = input.required<PeriodGranularity>();
  readonly selectedIds = model.required<Set<string>>();

  protected readonly viewedYear = signal(TODAY.year);
  protected readonly viewedMonth = signal(TODAY.month);
  protected readonly showMonthJump = signal(false);

  protected readonly weekdayLabels = WEEKDAY_LABELS;
  protected readonly monthLabels = MONTH_LABELS_ES;
  protected readonly monthNumbers = MONTH_NUMBERS;

  protected readonly monthLabel = computed(() => `${MONTH_LABELS_ES[this.viewedMonth() - 1]} ${this.viewedYear()}`);
  protected readonly weeks = computed<CalendarDay[][]>(() =>
    buildCalendarGrid(this.viewedYear(), this.viewedMonth()),
  );

  protected readonly canPrevMonth = computed(
    () => this.viewedYear() > MIN_YEAR || (this.viewedYear() === MIN_YEAR && this.viewedMonth() > MIN_MONTH),
  );
  protected readonly canNextMonth = computed(
    () => this.viewedYear() < MAX_YEAR || (this.viewedYear() === MAX_YEAR && this.viewedMonth() < MAX_MONTH),
  );
  protected readonly canJumpPrevYear = computed(() => this.viewedYear() > MIN_YEAR);
  protected readonly canJumpNextYear = computed(() => this.viewedYear() < MAX_YEAR);

  prevMonth(): void {
    if (!this.canPrevMonth()) return;
    if (this.viewedMonth() === 1) {
      this.viewedYear.update((year) => year - 1);
      this.viewedMonth.set(12);
    } else {
      this.viewedMonth.update((month) => month - 1);
    }
  }

  nextMonth(): void {
    if (!this.canNextMonth()) return;
    if (this.viewedMonth() === 12) {
      this.viewedYear.update((year) => year + 1);
      this.viewedMonth.set(1);
    } else {
      this.viewedMonth.update((month) => month + 1);
    }
  }

  toggleMonthJump(): void {
    this.showMonthJump.update((open) => !open);
  }

  jumpPrevYear(): void {
    if (this.canJumpPrevYear()) this.viewedYear.update((year) => year - 1);
  }

  jumpNextYear(): void {
    if (this.canJumpNextYear()) this.viewedYear.update((year) => year + 1);
  }

  isMonthDisabled(month: number): boolean {
    return (
      (this.viewedYear() === MIN_YEAR && month < MIN_MONTH) || (this.viewedYear() === MAX_YEAR && month > MAX_MONTH)
    );
  }

  jumpToMonth(month: number): void {
    if (this.isMonthDisabled(month)) return;
    this.viewedMonth.set(month);
    this.showMonthJump.set(false);
  }

  dayNumber(day: CalendarDay): number {
    return Number(day.iso.slice(8, 10));
  }

  private idFor(day: CalendarDay): string {
    return this.granularity() === 'dia' ? day.iso : (WEEK_ID_BY_DATE.get(day.iso) ?? '');
  }

  isSelected(day: CalendarDay): boolean {
    const id = this.idFor(day);
    return id !== '' && this.selectedIds().has(id);
  }

  toggle(day: CalendarDay): void {
    if (this.granularity() === 'dia' && !day.inMonth) return; // no seleccionar días de desborde del mes vecino
    const id = this.idFor(day);
    if (!id) return;
    const next = new Set(this.selectedIds());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.selectedIds.set(next);
  }
}
