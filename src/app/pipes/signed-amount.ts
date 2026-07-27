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

/**
 * `direction` and `sensitivityPct` are additive params for Cobranzas metrics where a rise isn't
 * always good (%Vencido, DSO) -- both default to Ventas's original semantics, so 1-arg call sites
 * are byte-for-byte unchanged. `direction: 'lower-good'` flips the sign before classifying (a rise
 * in %Vencido is bad, a drop is good). `sensitivityPct` (default 0, so it never fires unless a
 * caller opts in) mutes small moves to 'medium' regardless of direction -- DSO shouldn't turn red
 * over a 1-2% wobble.
 */
export function comparisonBand(
  deltaPct: number | null,
  direction: 'higher-good' | 'lower-good' = 'higher-good',
  sensitivityPct = 0,
): ComparisonBand {
  if (deltaPct === null) return 'medium';
  if (sensitivityPct > 0 && Math.abs(deltaPct) <= sensitivityPct) return 'medium';
  const effectivePct = direction === 'lower-good' ? -deltaPct : deltaPct;
  if (effectivePct >= 0) return 'good';
  if (effectivePct <= BAD_THRESHOLD_PCT) return 'bad';
  return 'medium';
}

export function bandSeverity(band: ComparisonBand): 'success' | 'warn' | 'danger' {
  if (band === 'good') return 'success';
  if (band === 'bad') return 'danger';
  return 'warn';
}

/**
 * Semáforo graduado ligado al % de cumplimiento contra una Meta (no al delta vs. periodo
 * anterior -- comparisonBand de arriba sigue rigiendo esos otros dos modos). deltaPct en modo
 * Meta ya es "% de distancia respecto al target" (ver computeKpisAgainstMeta), así que
 * cumplimientoPct = deltaPct + 100. Cortes provisorios para el mockup (~80%/~50%), a confirmar
 * con el cliente -- especialmente pensado para escanear de un vistazo qué tienda o día
 * necesita atención urgente al hacer drill-down.
 */
const CUMPLIMIENTO_GOOD_THRESHOLD_PCT = 80;
const CUMPLIMIENTO_BAD_THRESHOLD_PCT = 50;

export function cumplimientoBand(deltaPct: number | null): ComparisonBand {
  if (deltaPct === null) return 'medium';
  const cumplimientoPct = deltaPct + 100;
  if (cumplimientoPct >= CUMPLIMIENTO_GOOD_THRESHOLD_PCT) return 'good';
  if (cumplimientoPct < CUMPLIMIENTO_BAD_THRESHOLD_PCT) return 'bad';
  return 'medium';
}
