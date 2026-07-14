export interface FormattedAmount { text: string; isNegative: boolean; }

const CLP_FORMATTER = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export function formatSignedAmount(value: number): FormattedAmount {
  const isNegative = value < 0;
  const absText = CLP_FORMATTER.format(Math.abs(value));
  return { text: isNegative ? `(${absText})` : absText, isNegative };
}

export type ComparisonBand = 'good' | 'medium' | 'bad';

/**
 * Single source of truth for "how is this KPI doing vs. the previous period" --
 * drives both the delta tag's color AND the comparison bar's fill color, so they
 * can never disagree. >=0% is a full bar and reads as good (green); a small dip
 * (0% to -5%) is "medium" (amber, roughly flat); beyond -5% is a real drop (red).
 */
const BAD_THRESHOLD_PCT = -5;

export function comparisonBand(deltaPct: number | null): ComparisonBand {
  if (deltaPct === null) return 'medium';
  if (deltaPct >= 0) return 'good';
  if (deltaPct <= BAD_THRESHOLD_PCT) return 'bad';
  return 'medium';
}

export function bandSeverity(band: ComparisonBand): 'success' | 'warn' | 'danger' {
  if (band === 'good') return 'success';
  if (band === 'bad') return 'danger';
  return 'warn';
}
