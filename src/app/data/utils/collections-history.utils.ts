import type { DocumentStatus, ReceivableDocument } from '../models/collections.model';
import { daysBetweenIso } from './date.utils';

/** Estado reconstruido de un `ReceivableDocument` a una fecha de corte arbitraria. `balance` es
 * siempre bruto (con IVA) -- el caller aplica `ivaMode` si corresponde (mismo criterio que
 * `scopedDocuments`/`toScopedBalance` en `CollectionsDataService`). */
export interface DocumentStateAsOf {
  status: DocumentStatus;
  daysOverdue: number;
  balance: number;
}

/**
 * Reconstruye el estado de un documento a una fecha de corte arbitraria, sin inventar datos: si el
 * documento aún no existía (`issueDate > cutoffIso`) devuelve `null`. Si ya fue pagado ANTES del
 * corte (`paidDate !== null && paidDate <= cutoffIso`), no forma parte del saldo en ese corte
 * (fuera de alcance -- el caller debe EXCLUIRLO, nunca tratar `null` como balance 0). Si el
 * documento todavía no se había pagado a esa fecha (`paidDate === null`, o `paidDate > cutoffIso`),
 * `status`/`daysOverdue` se recalculan contra `dueDate` y `cutoffIso` (POR_VENCER si `dueDate` es
 * `null` o `>= cutoffIso`; VENCIDO con `daysOverdue = cutoffIso - dueDate` en días si
 * `dueDate < cutoffIso`) -- el `status`/`daysOverdue` HORNEADOS del documento (relativos a
 * TODAY_ISO) se ignoran por completo acá, nunca se leen.
 *
 * `balance` se mantiene igual al balance actual del documento: el mock no modela pagos parciales
 * con fecha propia (spec §8.D), así que un balance con un pago parcial ya aplicado se trata como
 * "así estaba" en cualquier corte anterior a que el documento se cierre del todo -- limitación
 * documentada, no un bug.
 */
export function documentStateAsOf(doc: ReceivableDocument, cutoffIso: string): DocumentStateAsOf | null {
  if (doc.issueDate > cutoffIso) {
    return null;
  }
  if (doc.paidDate !== null && doc.paidDate <= cutoffIso) {
    return null;
  }
  if (doc.dueDate === null || doc.dueDate >= cutoffIso) {
    return { status: 'POR_VENCER', daysOverdue: 0, balance: doc.balance };
  }
  return { status: 'VENCIDO', daysOverdue: daysBetweenIso(doc.dueDate, cutoffIso), balance: doc.balance };
}
