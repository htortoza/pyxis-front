import type { Period } from '../models/period.model';

/** Fully static/deterministic -- no Date.now()/new Date() here, hardcode the loop bounds. */
const START_YEAR = 2024;
const END_YEAR = 2026;

const MONTH_LABELS_ES = [
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

function buildPeriods(): Period[] {
  const periods: Period[] = [];
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    for (let month = 1; month <= 12; month++) {
      const id = `${year}-${String(month).padStart(2, '0')}`;
      periods.push({
        id,
        label: MONTH_LABELS_ES[month - 1],
        year,
        month,
        order: year * 12 + month,
      });
    }
  }
  return periods;
}

export const PERIODS: Period[] = buildPeriods();

export const DEFAULT_SELECTED_PERIOD_IDS = ['2026-05', '2026-06', '2026-07'];
