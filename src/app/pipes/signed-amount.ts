export interface FormattedAmount { text: string; isNegative: boolean; }

const CLP_FORMATTER = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export function formatSignedAmount(value: number): FormattedAmount {
  const isNegative = value < 0;
  const absText = CLP_FORMATTER.format(Math.abs(value));
  return { text: isNegative ? `(${absText})` : absText, isNegative };
}

export function deltaSeverity(deltaPct: number | null): 'success' | 'danger' | 'secondary' {
  if (deltaPct === null) return 'secondary';
  return deltaPct >= 0 ? 'success' : 'danger';
}

export type ComparisonBand = 'good' | 'medium' | 'bad';

/** +/-5% is treated as "roughly flat" (medium); beyond that reads as a real improvement or drop. */
const GOOD_THRESHOLD_PCT = 5;
const BAD_THRESHOLD_PCT = -5;

export function comparisonBand(deltaPct: number | null): ComparisonBand {
  if (deltaPct === null) return 'medium';
  if (deltaPct >= GOOD_THRESHOLD_PCT) return 'good';
  if (deltaPct <= BAD_THRESHOLD_PCT) return 'bad';
  return 'medium';
}
