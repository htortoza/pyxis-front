import type { Period, PeriodGranularity } from '../models/period.model';
import { addDaysIso, daysInMonth } from '../utils/date.utils';

/** Fully static/deterministic -- no Date.now()/new Date() here, hardcode the loop bounds. */
const START_DATE = '2024-01-01';
const END_DATE = '2026-12-31';
const START_YEAR = 2024;
const END_YEAR = 2026;

export const MONTH_LABELS_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function isoParts(iso: string): { year: number; month: number; day: number } {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month, day };
}

function shortLabel(iso: string): string {
  const { month, day } = isoParts(iso);
  return `${day} de ${MONTH_LABELS_ES[month - 1]}`;
}

function buildDailyPeriods(): Period[] {
  const periods: Period[] = [];
  let cursor = START_DATE;
  let order = 1;
  while (cursor <= END_DATE) {
    const { year, month } = isoParts(cursor);
    periods.push({
      id: cursor,
      label: shortLabel(cursor),
      granularity: 'dia',
      year,
      month,
      order,
      startDate: cursor,
      endDate: cursor,
    });
    order++;
    cursor = addDaysIso(cursor, 1);
  }
  return periods;
}

function buildWeeklyPeriods(): Period[] {
  const periods: Period[] = [];
  let cursor = START_DATE;
  let order = 1;
  while (addDaysIso(cursor, 6) <= END_DATE) {
    const weekEnd = addDaysIso(cursor, 6);
    const { year, month } = isoParts(cursor);
    periods.push({
      id: `week-${cursor}`,
      label: `Semana del ${shortLabel(cursor)} al ${shortLabel(weekEnd)}`,
      granularity: 'semana',
      year,
      month,
      order,
      startDate: cursor,
      endDate: weekEnd,
    });
    order++;
    cursor = addDaysIso(cursor, 7);
  }
  return periods;
}

function buildMonthlyPeriods(): Period[] {
  const periods: Period[] = [];
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    for (let month = 1; month <= 12; month++) {
      const id = `${year}-${String(month).padStart(2, '0')}`;
      const lastDay = String(daysInMonth(year, month)).padStart(2, '0');
      periods.push({
        id,
        label: MONTH_LABELS_ES[month - 1],
        granularity: 'mes',
        year,
        month,
        order: year * 12 + month, // preserva exactamente la fórmula ya usada hoy en toda comparación de periodo anterior
        startDate: `${id}-01`,
        endDate: `${id}-${lastDay}`,
      });
    }
  }
  return periods;
}

export const PERIODS_DIA: Period[] = buildDailyPeriods();
export const PERIODS_SEMANA: Period[] = buildWeeklyPeriods();
export const PERIODS_MES: Period[] = buildMonthlyPeriods();

export const PERIODS_BY_GRANULARITY: Record<PeriodGranularity, Period[]> = {
  dia: PERIODS_DIA,
  semana: PERIODS_SEMANA,
  mes: PERIODS_MES,
};

/** Alias legacy -- código no migrado a granularidad sigue viendo exactamente los periodos de Mes. */
export const PERIODS: Period[] = PERIODS_MES;

export const DEFAULT_SELECTED_PERIOD_IDS = ['2026-05', '2026-06', '2026-07'];
export const DEFAULT_SELECTED_GRANULARITY: PeriodGranularity = 'mes';

/** Cada fecha ISO del rango -> id de la Semana (Period) a la que pertenece. Usado por
 * CalendarPeriodPickerComponent para resolver en qué semana cae un día del calendario --
 * construido una sola vez a partir de PERIODS_SEMANA, nunca reinventando la aritmética de
 * semanas por otro lado. */
export const WEEK_ID_BY_DATE: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const period of PERIODS_SEMANA) {
    let cursor = period.startDate;
    while (cursor <= period.endDate) {
      map.set(cursor, period.id);
      cursor = addDaysIso(cursor, 1);
    }
  }
  return map;
})();
