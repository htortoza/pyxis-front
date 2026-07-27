import type { ReceivableDocument } from '../models/collections.model';
import type { Period } from '../models/period.model';
import { documentStateAsOf } from './collections-history.utils';
import { resolvePeriods } from './collections-kpi.utils';

/** Un tramo del Puente Venta→Caja (spec §4.2). `amount` es SIEMPRE >= 0 para los 4 segmentos,
 * incluido `CREDIT_NOTE` -- es la magnitud económica real, nunca negativa acá. El formato
 * "negativo/rojo/paréntesis" de notas de crédito que pide el plan se aplica solo en la capa de
 * presentación del componente (`displayAmountFor`), no en el dato. `ratio` es `amount / totalSales`
 * (0 si `totalSales` es 0). */
export interface VentaCajaBridgeSegment {
  key: 'COLLECTED' | 'UPCOMING' | 'OVERDUE' | 'CREDIT_NOTE';
  label: string;
  amount: number;
  ratio: number;
}

export interface VentaCajaBridge {
  totalSales: number;
  segments: VentaCajaBridgeSegment[];
}

const SEGMENT_LABELS: Record<VentaCajaBridgeSegment['key'], string> = {
  COLLECTED: 'Cobrado',
  UPCOMING: 'Por vencer',
  OVERDUE: 'Vencido',
  CREDIT_NOTE: 'Notas de crédito',
};

interface WindowTotals {
  collected: number;
  upcoming: number;
  overdue: number;
  creditNoteTotal: number;
  totalSales: number;
}

/**
 * Recorrido compartido entre `buildVentaCajaBridge` y `collectedRatioForWindow` -- opera sobre
 * PERIODO DE EMISIÓN (`issueDate` dentro de `windowPeriods`), NO sobre `cutoffIso` (spec §4.2):
 * `cutoffIso` solo se usa para reconstruir el estado (PAGADO antes del corte vs. todavía abierto)
 * de cada documento ya filtrado por su fecha de EMISIÓN.
 *
 * `totalSales` (`periodSalesTotal`, típicamente `PERIOD_SALES_TOTAL_CLP`) es la venta TOTAL del
 * periodo -- todos los canales (efectivo/tarjeta/crédito) --, mientras que los documentos
 * (`ReceivableDocument`) son SOLO el subconjunto a crédito. La diferencia (`totalSales -
 * documentGrossTotal`) es venta en efectivo/tarjeta: nunca genera un `ReceivableDocument`, pero SÍ
 * es caja desde el instante de la venta, así que se pliega en `collected` (Causa raíz #1).
 *
 * Invariante de cuadre (spec §6, no negociable): las 4 magnitudes (todas >= 0, incluida
 * `creditNoteTotal`) siempre suman exactamente `totalSales` -- identidad algebraica de
 * `balance = grossAmount - appliedAmount - creditNoteAmount` (=> `grossAmount = appliedAmount +
 * creditNoteAmount + balance`, los 3 sumados) aplicada documento a documento, más el remanente
 * no-crédito plegado en `collected` (Causa raíz #2: ningún término se resta dos veces). `totalSales`
 * usa `periodSalesTotal` SIN escalar por el filtro de dimensión activo (misma simplificación ya
 * aceptada en Task 2 para DSO/CEI) -- el cuadre exacto solo está garantizado bajo el scope SIN
 * filtro de Contraparte/Sector/Marca/Local.
 */
function computeWindowTotals(
  allDocuments: ReceivableDocument[],
  cutoffIso: string,
  windowPeriods: Period[],
  periodSalesTotal: Record<string, number>,
): WindowTotals {
  if (windowPeriods.length === 0) {
    return { collected: 0, upcoming: 0, overdue: 0, creditNoteTotal: 0, totalSales: 0 };
  }
  const sorted = [...windowPeriods].sort((a, b) => a.order - b.order);
  const rangeStart = sorted[0].startDate;
  const rangeEnd = sorted[sorted.length - 1].endDate;
  const totalSales = sorted.reduce((sum, p) => sum + (periodSalesTotal[p.id] ?? 0), 0);

  let documentGrossTotal = 0;
  let appliedTotal = 0;
  let upcoming = 0;
  let overdue = 0;
  let creditNoteTotal = 0;

  for (const doc of allDocuments) {
    if (doc.issueDate < rangeStart || doc.issueDate > rangeEnd) continue;
    documentGrossTotal += doc.grossAmount;
    appliedTotal += doc.appliedAmount;
    creditNoteTotal += doc.creditNoteAmount;

    if (doc.paidDate !== null && doc.paidDate <= cutoffIso) {
      continue; // cerrado -- balance 0 por construcción, ya cubierto por appliedTotal+creditNoteTotal
    }
    const state = documentStateAsOf(doc, cutoffIso);
    if (state === null) continue; // no existía aún a este corte (issueDate > cutoffIso)
    if (state.status === 'VENCIDO') {
      overdue += state.balance;
    } else {
      upcoming += state.balance;
    }
  }

  // Venta no-crédito (efectivo/tarjeta) del periodo: nunca genera ReceivableDocument, pero es caja
  // desde el instante de la venta -- se pliega en collected. Clamp a 0 por si el proxy de venta
  // total y la suma de documentos alguna vez divergieran al revés (no debería pasar: los
  // documentos son un subconjunto estructural de la venta total).
  const cashOrCardSales = Math.max(0, totalSales - documentGrossTotal);
  const collected = cashOrCardSales + appliedTotal;

  return { collected, upcoming, overdue, creditNoteTotal, totalSales };
}

function ratioOf(amount: number, totalSales: number): number {
  return totalSales === 0 ? 0 : amount / totalSales;
}

/**
 * Puente Venta→Caja (spec §4.2): descompone la venta bruta del periodo de EMISIÓN seleccionado en
 * 4 destinos -- Cobrado, Por vencer, Vencido y Notas de crédito. Opera sobre `issueDate` dentro de
 * los periodos seleccionados, NO sobre `cutoffDate` -- rotular esto explícitamente en el componente
 * (spec §4.2). `allDocuments` debe venir dimension-scoped pero SIN filtrar por `cutoffIso` (mismo
 * shape que `allDocuments` de `computeCollectionsKpis`, Task 2 -- en el servicio,
 * `scopedDocumentsByDimension()`).
 */
export function buildVentaCajaBridge(
  allDocuments: ReceivableDocument[],
  cutoffIso: string,
  selectedPeriodIds: string[],
  periods: Period[],
  periodSalesTotal: Record<string, number>,
): VentaCajaBridge {
  const selectedPeriods = resolvePeriods(selectedPeriodIds, periods);
  const { collected, upcoming, overdue, creditNoteTotal, totalSales } = computeWindowTotals(
    allDocuments,
    cutoffIso,
    selectedPeriods,
    periodSalesTotal,
  );

  const build = (key: VentaCajaBridgeSegment['key'], amount: number): VentaCajaBridgeSegment => ({
    key,
    label: SEGMENT_LABELS[key],
    amount,
    ratio: ratioOf(amount, totalSales),
  });

  return {
    totalSales,
    segments: [
      build('COLLECTED', collected),
      build('UPCOMING', upcoming),
      build('OVERDUE', overdue),
      build('CREDIT_NOTE', creditNoteTotal),
    ],
  };
}

/**
 * Mejora #1 (titular + variación): ratio `collected/totalSales` para una ventana de periodos
 * arbitraria (típicamente `previousPeriodWindow` de `collections-kpi.utils.ts`, para comparar el
 * titular del Puente contra el periodo anterior). Reusa el mismo recorrido que
 * `buildVentaCajaBridge` vía `computeWindowTotals` (incluido el fold-in de venta no-crédito) --
 * ninguna lógica de loop duplicada. `null` cuando `windowPeriods` está vacío o `totalSales` de esa
 * ventana es 0 (ratio no calculable, mismo convenio "no calculable" que el resto de los KPIs de
 * Cobranzas).
 */
export function collectedRatioForWindow(
  allDocuments: ReceivableDocument[],
  cutoffIso: string,
  windowPeriods: Period[],
  periodSalesTotal: Record<string, number>,
): number | null {
  if (windowPeriods.length === 0) {
    return null;
  }
  const { collected, totalSales } = computeWindowTotals(allDocuments, cutoffIso, windowPeriods, periodSalesTotal);
  if (totalSales === 0) {
    return null;
  }
  return collected / totalSales;
}
