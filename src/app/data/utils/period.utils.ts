import type { ComparisonAlignment } from '../models/comparison.model';
import type { Period, PeriodGranularity } from '../models/period.model';

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
  granularity: PeriodGranularity;
  /** Given the full period list (of this preset's own granularity) and "today", returns matching period ids. */
  resolve: (periods: Period[], today: { year: number; month: number; day: number }) => string[];
}

function toOrder(today: { year: number; month: number }): number {
  return today.year * 12 + today.month;
}

function toIso(today: { year: number; month: number; day: number }): string {
  return `${today.year}-${String(today.month).padStart(2, '0')}-${String(today.day).padStart(2, '0')}`;
}

function currentWeek(periods: Period[], today: { year: number; month: number; day: number }): Period | undefined {
  const todayIso = toIso(today);
  return periods.find((p) => p.startDate <= todayIso && todayIso <= p.endDate);
}

export const PERIOD_PRESETS: PeriodPreset[] = [
  {
    key: 'mes-actual',
    label: 'Mes Actual',
    granularity: 'mes',
    resolve: (periods, today) => {
      const todayOrder = toOrder(today);
      return periods.filter((p) => p.order === todayOrder).map((p) => p.id);
    },
  },
  {
    key: 'ultimo-trimestre',
    label: 'Último Trimestre',
    granularity: 'mes',
    resolve: (periods, today) => {
      const todayOrder = toOrder(today);
      return periods.filter((p) => p.order > todayOrder - 3 && p.order <= todayOrder).map((p) => p.id);
    },
  },
  {
    key: 'ultimos-6-meses',
    label: 'Últimos 6 Meses',
    granularity: 'mes',
    resolve: (periods, today) => {
      const todayOrder = toOrder(today);
      return periods.filter((p) => p.order > todayOrder - 6 && p.order <= todayOrder).map((p) => p.id);
    },
  },
  {
    key: 'ano-actual',
    label: 'Año en Curso',
    granularity: 'mes',
    resolve: (periods, today) =>
      periods.filter((p) => p.year === today.year && p.month <= today.month).map((p) => p.id),
  },
  {
    key: 'ano-anterior',
    label: 'Año Anterior',
    granularity: 'mes',
    resolve: (periods, today) => periods.filter((p) => p.year === today.year - 1).map((p) => p.id),
  },
  {
    key: 'ultimos-3-anos',
    label: 'Últimos 3 Años',
    granularity: 'mes',
    resolve: (periods, today) =>
      periods.filter((p) => p.year >= today.year - 2 && p.year <= today.year).map((p) => p.id),
  },
  {
    key: 'ultimas-3-semanas',
    label: 'Últimas 3 Semanas',
    granularity: 'semana',
    resolve: (periods, today) => {
      const week = currentWeek(periods, today);
      if (!week) return [];
      return periods.filter((p) => p.order > week.order - 3 && p.order <= week.order).map((p) => p.id);
    },
  },
  {
    key: 'ultimas-12-semanas',
    label: 'Últimas 12 Semanas',
    granularity: 'semana',
    resolve: (periods, today) => {
      const week = currentWeek(periods, today);
      if (!week) return [];
      return periods.filter((p) => p.order > week.order - 12 && p.order <= week.order).map((p) => p.id);
    },
  },
];

/**
 * Ventana de periodo anterior. Alineación calendario: mismo tamaño de ventana, inmediatamente
 * antes, por `order` (funciona igual para las 3 granularidades porque `order` es monotónico
 * dentro de cada una). Alineación día de semana: solo produce un resultado distinto a calendario
 * cuando la granularidad es Día -- se desplaza en múltiplos de 7 para que cada día caiga en el
 * mismo día de semana que su contraparte seleccionada (para Semana, una ventana de N semanas
 * completas ya alinea día-a-día por sí sola, así que ambos criterios coinciden).
 */
export function previousPeriodWindow(
  selectedPeriods: Period[],
  alignment: ComparisonAlignment,
  granularity: PeriodGranularity,
  allPeriods: Period[],
): Period[] {
  if (selectedPeriods.length === 0) return [];
  const shift =
    alignment === 'dia_semana' && granularity === 'dia'
      ? 7 * Math.ceil(selectedPeriods.length / 7)
      : selectedPeriods.length;
  const previousOrders = new Set(selectedPeriods.map((period) => period.order - shift));
  return allPeriods.filter((period) => previousOrders.has(period.order));
}
