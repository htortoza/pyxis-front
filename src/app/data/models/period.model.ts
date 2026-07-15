export interface Period {
  id: string;
  label: string;
  /** Calendar year, e.g. 2025. */
  year: number;
  /** Calendar month, 1-12. */
  month: number;
  /** `year * 12 + month` -- global monotonic sort/comparison key across years. */
  order: number;
}
