import type { Counterparty, CounterpartyBehavior, ReceivableDocument } from '../models/collections.model';

export type ConcentrationSortMode = 'saldo' | 'saldoVencido' | 'utilizacion';

export interface ConcentrationRow {
  counterpartyId: string;
  label: string;
  saldo: number;
  saldoVencido: number;
  /** `null` cuando la contraparte no tiene `creditLimit` definido (spec: "no aplica '0'") --
   * el caller debe excluir estas filas del ordenamiento por `'utilizacion'` (van al final, no se
   * fuerzan a 0% ni se ocultan) y mostrar un guion en vez de un %. */
  utilizacionPct: number | null;
  avgDaysLate: number | null; // null si no hay CounterpartyBehavior para esta contraparte
}

export interface ConcentrationResult {
  rows: ConcentrationRow[]; // ordenadas según sortMode, ya listas para renderizar
  /** Fila destacada de "mayor riesgo" (mejora #3): la contraparte con MAYOR saldo entre las que
   * simultáneamente están sobre-límite (`utilizacionPct > 1`) Y pagan tarde (`avgDaysLate > 0`).
   * `null` si ninguna contraparte cumple las 3 condiciones a la vez -- nunca se fuerza un
   * "ganador" cuando no hay uno real. */
  highestRisk: ConcentrationRow | null;
}

/** Etiqueta para documentos cuyo `counterpartyId` no calza con ninguna `Counterparty` conocida
 * (spec §8.C, mismo caso de borde que `UNMAPPED_COUNTERPARTY_ID` en `collections.mock.ts`) --
 * se agrupan bajo esta etiqueta visible, nunca se descartan. */
const UNMAPPED_LABEL = 'Contraparte no mapeada';

/**
 * Agrupa `documents` por contraparte y arma las filas de Concentración de Cartera (spec §4.5),
 * ya ordenadas según `sortMode` y con la fila de "mayor riesgo" (mejora #3) resuelta.
 *
 * Cuadre (spec §6): la suma de `saldo` de todas las filas es exactamente la suma de `balance` de
 * `documents` -- cada documento aporta a exactamente 1 fila (agrupado por `counterpartyId`), sin
 * excluir ninguno.
 */
export function buildConcentrationRows(
  documents: ReceivableDocument[], // scopedDocuments del servicio (SÍ respeta ivaMode, a diferencia de Proyección)
  counterparties: Counterparty[],
  behaviors: CounterpartyBehavior[],
  sortMode: ConcentrationSortMode,
): ConcentrationResult {
  const counterpartyById = new Map(counterparties.map((c) => [c.id, c]));
  const behaviorByCounterparty = new Map(behaviors.map((b) => [b.counterpartyId, b]));

  const grouped = new Map<string, { saldo: number; saldoVencido: number }>();
  for (const doc of documents) {
    const entry = grouped.get(doc.counterpartyId) ?? { saldo: 0, saldoVencido: 0 };
    entry.saldo += doc.balance;
    if (doc.status === 'VENCIDO') {
      entry.saldoVencido += doc.balance;
    }
    grouped.set(doc.counterpartyId, entry);
  }

  const rows: ConcentrationRow[] = Array.from(grouped.entries()).map(([counterpartyId, totals]) => {
    const counterparty = counterpartyById.get(counterpartyId);
    const behavior = behaviorByCounterparty.get(counterpartyId);
    const creditLimit = counterparty?.creditLimit ?? null;
    return {
      counterpartyId,
      label: counterparty?.label ?? UNMAPPED_LABEL,
      saldo: totals.saldo,
      saldoVencido: totals.saldoVencido,
      utilizacionPct: creditLimit === null ? null : totals.saldo / creditLimit,
      avgDaysLate: behavior?.avgDaysLate ?? null,
    };
  });

  const sortedRows = sortRows(rows, sortMode);

  const highestRisk = sortedRows
    .filter((row) => row.utilizacionPct !== null && row.utilizacionPct > 1 && row.avgDaysLate !== null && row.avgDaysLate > 0)
    .reduce<ConcentrationRow | null>((best, row) => (best === null || row.saldo > best.saldo ? row : best), null);

  return { rows: sortedRows, highestRisk };
}

function sortRows(rows: ConcentrationRow[], sortMode: ConcentrationSortMode): ConcentrationRow[] {
  const sorted = [...rows];
  if (sortMode === 'saldo') {
    sorted.sort((a, b) => b.saldo - a.saldo);
    return sorted;
  }
  if (sortMode === 'saldoVencido') {
    sorted.sort((a, b) => b.saldoVencido - a.saldoVencido);
    return sorted;
  }
  // 'utilizacion': null siempre al final, nunca intercalado; entre nulls, orden secundario por saldo desc.
  sorted.sort((a, b) => {
    if (a.utilizacionPct === null && b.utilizacionPct === null) return b.saldo - a.saldo;
    if (a.utilizacionPct === null) return 1;
    if (b.utilizacionPct === null) return -1;
    return b.utilizacionPct - a.utilizacionPct;
  });
  return sorted;
}
