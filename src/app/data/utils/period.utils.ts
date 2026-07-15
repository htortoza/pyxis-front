import type { Period } from '../models/period.model';

export function groupPeriodsByYear(periods: Period[]): Map<number, Period[]> {
  const map = new Map<number, Period[]>();
  for (const period of periods) {
    const yearPeriods = map.get(period.year) ?? [];
    yearPeriods.push(period);
    map.set(period.year, yearPeriods);
  }
  return map;
}

export interface PeriodPreset {
  key: string;
  label: string;
  /** Given the full period list and "today" (year+month, injected -- never Date.now() in this pure file), returns the matching period ids. */
  resolve: (periods: Period[], today: { year: number; month: number }) => string[];
}

function toOrder(today: { year: number; month: number }): number {
  return today.year * 12 + today.month;
}

export const PERIOD_PRESETS: PeriodPreset[] = [
  {
    key: 'mes-actual',
    label: 'Mes Actual',
    resolve: (periods, today) => {
      const todayOrder = toOrder(today);
      return periods.filter((p) => p.order === todayOrder).map((p) => p.id);
    },
  },
  {
    key: 'ultimo-trimestre',
    label: 'Último Trimestre',
    resolve: (periods, today) => {
      const todayOrder = toOrder(today);
      return periods.filter((p) => p.order > todayOrder - 3 && p.order <= todayOrder).map((p) => p.id);
    },
  },
  {
    key: 'ultimos-6-meses',
    label: 'Últimos 6 Meses',
    resolve: (periods, today) => {
      const todayOrder = toOrder(today);
      return periods.filter((p) => p.order > todayOrder - 6 && p.order <= todayOrder).map((p) => p.id);
    },
  },
  {
    key: 'ano-actual',
    label: 'Año en Curso',
    resolve: (periods, today) =>
      periods.filter((p) => p.year === today.year && p.month <= today.month).map((p) => p.id),
  },
  {
    key: 'ano-anterior',
    label: 'Año Anterior',
    resolve: (periods, today) => periods.filter((p) => p.year === today.year - 1).map((p) => p.id),
  },
  {
    key: 'ultimos-3-anos',
    label: 'Últimos 3 Años',
    resolve: (periods, today) =>
      periods.filter((p) => p.year >= today.year - 2 && p.year <= today.year).map((p) => p.id),
  },
];
