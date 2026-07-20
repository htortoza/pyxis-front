export type PeriodGranularity = 'dia' | 'semana' | 'mes';

export interface Period {
  id: string;
  label: string;
  granularity: PeriodGranularity;
  /** Calendar year, e.g. 2025. */
  year: number;
  /** Calendar month, 1-12 -- el mes en que cae (día) o empieza (semana) el periodo. */
  month: number;
  /** Monotonic dentro de su propia granularidad -- NO comparable entre granularidades distintas. */
  order: number;
  /** ISO 'YYYY-MM-DD', límite inferior real del periodo. */
  startDate: string;
  /** ISO 'YYYY-MM-DD', límite superior real del periodo (inclusive). */
  endDate: string;
}
