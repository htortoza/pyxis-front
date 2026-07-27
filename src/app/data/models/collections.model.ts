/**
 * Tipo de contraparte de cobranza. Es un **dato** (dimensión de valor), nunca una rama de lógica:
 * el mismo documento/KPI se calcula igual sin importar el `counterpartyType` de la contraparte.
 */
export type CounterpartyType =
  | 'CLIENTE_CREDITO'
  | 'ADQUIRENTE'
  | 'GIFT_CARD'
  | 'CONVENIO'
  | 'AGREGADOR'
  | 'CUENTA_CORPORATIVA';

/** Estado de un documento por cobrar a la fecha de corte activa. */
export type DocumentStatus = 'POR_VENCER' | 'VENCIDO' | 'PAGADO';

/**
 * Contraparte de cobranza (cliente a crédito, adquirente de tarjetas, convenio, etc.). Es la 4ª
 * columna del filtro en cascada (Sector/Marca/Local/Contraparte) — NO un `FilterNodeType`.
 */
export interface Counterparty {
  id: string;
  label: string;
  type: CounterpartyType;
  /** Nodo de `CONTEXT_TREE` al que pertenece societariamente (siempre existe). */
  societaryNodeId: string;
  /**
   * Nodos comerciales (sector/marca/local) donde esta contraparte tiene efecto en el filtro.
   * Puede venir vacío: una contraparte sin asociación comercial explícita igual debe listarse
   * (cuelga de un nodo raíz de contraparte independiente en el árbol de filtro).
   */
  commercialNodeIds: string[];
  /** `null` cuando el tenant no define un límite de crédito para esta contraparte (no aplica "0"). */
  creditLimit: number | null;
  /** `null` cuando no hay plazo pactado (p. ej. adquirentes que liquidan por convenio, no por plazo). */
  creditTermDays: number | null;
  currency: string;
}

/**
 * Documento por cobrar (factura, boleta a crédito, liquidación de adquirente, etc.). El saldo NO
 * se recalcula en pantalla: `balance` viene "calculado del backend" (en el mock, del generador) para
 * que la fila de totales de la tabla siempre cuadre con el KPI Saldo por Cobrar.
 */
export interface ReceivableDocument {
  id: string;
  /** Folio/número visible para el usuario (factura, boleta), distinto del `id` interno. */
  externalRef: string;
  counterpartyId: string;
  issueDate: string;
  /**
   * `null` cuando el documento no tiene vencimiento pactado (p. ej. ciertos convenios). Estos
   * documentos se excluyen de la Proyección de Recaudación y el monto excluido se declara visible.
   */
  dueDate: string | null;
  /** Monto bruto (con IVA) del documento — base sobre la que siempre opera la Proyección. */
  grossAmount: number;
  /** Monto neto (sin IVA), para la vista "Sin IVA" de KPIs/tabla. */
  netAmount: number;
  /** Suma de pagos imputados. Puede ser parcial (menor a `grossAmount`) o exceder el bruto (sobrepago). */
  appliedAmount: number;
  /** Notas de crédito imputadas al documento — categoría transversal, nunca una contraparte. */
  creditNoteAmount: number;
  /**
   * `grossAmount - appliedAmount - creditNoteAmount`. Puede ser negativo: un sobrepago
   * (`appliedAmount > grossAmount`) es un caso de borde real que se muestra, no se descarta.
   */
  balance: number;
  status: DocumentStatus;
  /** Días de mora a la fecha de corte activa; 0 si `status !== 'VENCIDO'`. */
  daysOverdue: number;
  currency: string;
}

/**
 * Comportamiento histórico de pago de una contraparte, usado para CEI, mora promedio y la serie
 * ajustada de la Proyección. Se calcula sobre documentos ya cerrados (multi-año), independiente
 * del `scopedDocuments` vigente.
 */
export interface CounterpartyBehavior {
  counterpartyId: string;
  /** Promedio de días de atraso respecto al vencimiento pactado, sobre documentos cerrados. */
  avgDaysLate: number;
  /**
   * Cantidad de documentos cerrados considerados. Alimenta la política de degradación por falta
   * de historial: por debajo del mínimo publicable no se dibuja serie ajustada parcial.
   */
  closedDocumentCount: number;
}

/**
 * Meta de cobranza definida por el tenant para un nodo de alcance (sector/marca/local/global).
 * Todos los targets son opcionales (`null`): un tenant puede no definir meta para una métrica.
 */
export interface CollectionTarget {
  scopeNodeId: string;
  /** Días de venta pendientes de cobro objetivo; `null` si el tenant no fija meta de DSO. */
  dsoTarget: number | null;
  /** Proporción objetivo de saldo vencido sobre saldo total; `null` si no hay meta definida. */
  overdueRatioTarget: number | null;
  /** Cash Efficiency Index objetivo; `null` si no hay meta definida. */
  ceiTarget: number | null;
}
