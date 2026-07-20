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
