const MS_PER_DAY = 86_400_000;

export function toIsoDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function addDaysIso(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}

/** 0 = domingo .. 6 = sábado, mismo criterio que usaba el campo SalesFact.dayOfWeek. */
export function getDayOfWeek(iso: string): number {
  return parseIsoDate(iso).getUTCDay();
}

export function daysBetweenIso(fromIso: string, toIso: string): number {
  return Math.round((parseIsoDate(toIso).getTime() - parseIsoDate(fromIso).getTime()) / MS_PER_DAY);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export interface CalendarDay {
  iso: string;
  /** false para los días de desborde de los meses vecinos que completan la primera/última semana. */
  inMonth: boolean;
}

/**
 * Semanas completas (lunes a domingo) que cubren el mes dado, agregando días de desborde de
 * los meses vecinos para completar la primera y última fila -- igual que cualquier calendario.
 * Usado por CalendarPeriodPickerComponent para las vistas de Día y Semana.
 */
export function buildCalendarGrid(year: number, month: number): CalendarDay[][] {
  const firstOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
  const leadingDays = (getDayOfWeek(firstOfMonth) + 6) % 7; // getDayOfWeek: 0=domingo -- reindexa a 0=lunes
  const totalDaysInMonth = daysInMonth(year, month);
  const trailingDays = (7 - ((leadingDays + totalDaysInMonth) % 7)) % 7;
  const totalCells = leadingDays + totalDaysInMonth + trailingDays;

  const days: CalendarDay[] = [];
  let cursor = addDaysIso(firstOfMonth, -leadingDays);
  for (let i = 0; i < totalCells; i++) {
    days.push({ iso: cursor, inMonth: Number(cursor.slice(5, 7)) === month });
    cursor = addDaysIso(cursor, 1);
  }

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}
