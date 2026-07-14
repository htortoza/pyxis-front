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
