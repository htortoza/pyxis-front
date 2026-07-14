import type { Period } from '../models/period.model';

export const PERIODS: Period[] = [
  { id: '2026-02', label: 'Febrero', order: 2 },
  { id: '2026-03', label: 'Marzo',   order: 3 },
  { id: '2026-04', label: 'Abril',   order: 4 },
  { id: '2026-05', label: 'Mayo',    order: 5 },
  { id: '2026-06', label: 'Junio',   order: 6 },
  { id: '2026-07', label: 'Julio',   order: 7 },
];

export const DEFAULT_SELECTED_PERIOD_IDS = ['2026-05', '2026-06', '2026-07'];
