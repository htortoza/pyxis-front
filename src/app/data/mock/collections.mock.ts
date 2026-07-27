import type {
  CollectionTarget,
  Counterparty,
  CounterpartyBehavior,
  CounterpartyType,
  DocumentStatus,
  ReceivableDocument,
} from '../models/collections.model';
import { addDaysIso, daysBetweenIso } from '../utils/date.utils';
import { CONTEXT_TREE } from './context-tree.mock';
import { PERIODS_MES } from './periods.mock';
import { SALES_FACTS } from './sales-facts.mock';

/**
 * Deterministic 32-bit PRNG (mulberry32) -- misma técnica que sales-facts.mock.ts, pero con su
 * propia semilla literal: tocar el generador de Ventas nunca debe reordenar el stream de
 * Cobranzas (y viceversa), son universos mock independientes.
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED = 726_014;

/**
 * "Fecha de corte por defecto = última carga" para Cobranzas (spec §4). Deliberadamente propia
 * de este módulo -- Ventas tiene su propio "hoy" mock ('2026-07-20' en sales-fact.utils.ts) y no
 * hay una única fecha de sistema global; cada dataset mock declara la suya para no acoplar dos
 * generadores que evolucionan por separado.
 */
export const TODAY_ISO = '2026-07-25';

/** counterpartyId deliberadamente ausente de COUNTERPARTIES -- caso de borde real: un documento
 * legado cuya contraparte nunca se migró/mapeó correctamente. Debe listarse en tablas/rankings
 * igual (nunca descartarse en silencio), típicamente bajo un bucket "sin contraparte asociada". */
export const UNMAPPED_COUNTERPARTY_ID = 'cp-legacy-unmapped-001';

function shuffledIndices(n: number, rng: () => number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pesos Zipf (rank-based, exponente 1.0) sobre un orden barajado -- misma idea que
 * buildProductWeights en sales-facts.mock.ts: unos pocos concentran el grueso del saldo y el
 * resto se desvanece en cola larga. Exponente 1.0 da una relación #1/#2 == 2x ("casi duplica a
 * la #2", spec §4), con margen cómodo sobre el umbral de test (>= 1.5x) incluso con el ruido de
 * pagos parciales/notas de crédito que se aplica después sobre los montos.
 */
function buildRankWeights(n: number, rng: () => number): number[] {
  const ranks = shuffledIndices(n, rng);
  const weights = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    weights[ranks[i]] = 1 / (i + 1);
  }
  return weights;
}

// ---------------------------------------------------------------------------------------------
// Contrapartes
// ---------------------------------------------------------------------------------------------

/** Adquirentes de medios de pago -- liquidan por convenio de procesamiento, no por línea de
 * crédito ni por local: nunca tienen creditLimit/creditTermDays ni commercialNodeIds. */
const ADQUIRENTE_NAMES = ['Transbank', 'Getnet Chile', 'Mercado Pago POS'];
/** Emisores/gestores de tarjetas de regalo -- prepago, mismo motivo que arriba para los nulls. */
const GIFT_CARD_NAMES = ['Gift Card Multitienda', 'Tarjetas de Regalo Corporativas', 'Gift Card Programa Fidelización'];
/** Cajas de compensación / mutuales -- convenios de descuento por planilla, con frecuencia sin
 * plazo pactado individual (se liquida por convenio marco), de ahí el sesgo hacia dueDate/plazo null. */
const CONVENIO_NAMES = [
  'Convenio Caja Los Andes',
  'Convenio Caja Los Héroes',
  'Convenio Caja La Araucana',
  'Convenio ACHS',
  'Convenio Mutual de Seguridad',
  'Convenio IST',
];
/** Plataformas agregadoras de pedidos -- operan a nivel tenant completo, no por local. */
const AGREGADOR_NAMES = ['Rappi', 'PedidosYa', 'Uber Eats'];
/** Cuentas corporativas de gran cliente -- ticket alto, aportan a la cola pesada de concentración. */
const CUENTA_CORPORATIVA_NAMES = [
  'Cuenta Corporativa Grupo Falabella',
  'Cuenta Corporativa LATAM Airlines',
  'Cuenta Corporativa Codelco',
  'Cuenta Corporativa Banco Estado',
  'Cuenta Corporativa Entel',
  'Cuenta Corporativa CMPC',
  'Cuenta Corporativa Sodimac Empresas',
  'Cuenta Corporativa Colbún',
];

/** Plantillas para el lote procedural de CLIENTE_CREDITO (el grueso de la cola larga). Combinadas
 * determinísticamente vía el stream mulberry32, no vía Math.random. */
const CLIENTE_CREDITO_NOUNS = [
  'Distribuidora',
  'Comercial',
  'Importadora',
  'Abastecedora',
  'Suministros',
  'Servicios',
  'Inversiones',
  'Comercializadora',
];
const CLIENTE_CREDITO_NAMES = [
  'Andina',
  'Austral',
  'Cordillera',
  'Pacífico',
  'Boreal',
  'Meridional',
  'Altiplano',
  'Patagonia',
  'Rapa Nui',
  'Atacama',
  'Maule',
  'Bío Bío',
  'Ñuble',
  'Colchagua',
  'Elqui',
  'Aconcagua',
  'Cachapoal',
  'Maipo',
  'Curicó',
  'Coquimbo',
  'Arica',
  'Iquique',
  'Calama',
  'Copiapó',
];
const CLIENTE_CREDITO_SUFFIXES = ['SpA', 'Ltda.', 'S.A.', 'E.I.R.L.'];
/** Tamaño fijo del lote procedural (no depende del rng) -- junto a los 23 nombres fijos de arriba
 * da un universo total de 45 contrapartes, dentro del rango 30-60 pedido por el plan. */
const CLIENTE_CREDITO_COUNT = 22;

const EMPRESA_IDS = CONTEXT_TREE.filter((node) => node.type === 'EMPRESA').map((node) => node.id);
const TIENDA_IDS = CONTEXT_TREE.filter((node) => node.type === 'TIENDA').map((node) => node.id);

function buildClienteCreditoName(index: number, rng: () => number): string {
  const noun = CLIENTE_CREDITO_NOUNS[Math.floor(rng() * CLIENTE_CREDITO_NOUNS.length)];
  const place = CLIENTE_CREDITO_NAMES[index % CLIENTE_CREDITO_NAMES.length];
  const suffix = CLIENTE_CREDITO_SUFFIXES[Math.floor(rng() * CLIENTE_CREDITO_SUFFIXES.length)];
  return `${noun} ${place} ${suffix}`;
}

/** Plazos de pago pactados típicos (días) -- ninguno es "0" (no aplica, no un plazo real). */
const CREDIT_TERM_OPTIONS = [15, 30, 45, 60, 90];

/**
 * Perfil de crédito por contraparte. Adquirentes/gift card SIEMPRE null (liquidan por convenio o
 * son prepago, no por línea de crédito) -- esto es dato narrativo del mock, no una rama de lógica
 * que un consumidor de `Counterparty` deba condicionar por `type` (`counterpartyType` sigue
 * siendo un dato, ver JSDoc del modelo). El resto tiene una probabilidad de no traer límite/plazo
 * definido por el tenant (caso de borde real, "algunas contrapartes con creditLimit=null").
 */
function creditProfileFor(
  type: CounterpartyType,
  rng: () => number,
): { creditLimit: number | null; creditTermDays: number | null } {
  if (type === 'ADQUIRENTE' || type === 'GIFT_CARD') {
    return { creditLimit: null, creditTermDays: null };
  }
  const hasLimit = rng() > 0.15;
  const hasTerm = rng() > 0.1;
  const creditLimit = hasLimit ? Math.round((2_000_000 + rng() * 38_000_000) / 100_000) * 100_000 : null;
  const creditTermDays = hasTerm ? CREDIT_TERM_OPTIONS[Math.floor(rng() * CREDIT_TERM_OPTIONS.length)] : null;
  return { creditLimit, creditTermDays };
}

/** Nodos comerciales (Local) donde la contraparte tiene efecto en el filtro en cascada.
 * Adquirentes/gift card/agregadores operan a nivel tenant completo (no un local puntual) -> []
 * siempre, caso de borde obligatorio "contraparte sin asociación comercial" (spec §4). */
function commercialNodesFor(type: CounterpartyType, rng: () => number): string[] {
  if (type === 'ADQUIRENTE' || type === 'GIFT_CARD' || type === 'AGREGADOR') {
    return [];
  }
  const count = 1 + Math.floor(rng() * 3); // 1-3 locales
  const shuffled = shuffledIndices(TIENDA_IDS.length, rng);
  return shuffled.slice(0, count).map((i) => TIENDA_IDS[i]);
}

interface CounterpartySeed {
  label: string;
  type: CounterpartyType;
}

function buildCounterpartySeeds(rng: () => number): CounterpartySeed[] {
  const seeds: CounterpartySeed[] = [];
  for (const label of ADQUIRENTE_NAMES) seeds.push({ label, type: 'ADQUIRENTE' });
  for (const label of GIFT_CARD_NAMES) seeds.push({ label, type: 'GIFT_CARD' });
  for (const label of CONVENIO_NAMES) seeds.push({ label, type: 'CONVENIO' });
  for (const label of AGREGADOR_NAMES) seeds.push({ label, type: 'AGREGADOR' });
  for (const label of CUENTA_CORPORATIVA_NAMES) seeds.push({ label, type: 'CUENTA_CORPORATIVA' });
  for (let i = 0; i < CLIENTE_CREDITO_COUNT; i++) {
    seeds.push({ label: buildClienteCreditoName(i, rng), type: 'CLIENTE_CREDITO' });
  }
  return seeds;
}

function typeSlug(type: CounterpartyType): string {
  return type.toLowerCase().replace(/_/g, '-');
}

function buildCounterparties(rng: () => number): Counterparty[] {
  const seeds = buildCounterpartySeeds(rng);
  const weights = buildRankWeights(seeds.length, rng);
  const perTypeCounter = new Map<CounterpartyType, number>();

  return seeds.map((seed, index) => {
    const n = (perTypeCounter.get(seed.type) ?? 0) + 1;
    perTypeCounter.set(seed.type, n);
    const { creditLimit, creditTermDays } = creditProfileFor(seed.type, rng);
    return {
      id: `cp-${typeSlug(seed.type)}-${String(n).padStart(2, '0')}`,
      label: seed.label,
      type: seed.type,
      societaryNodeId: EMPRESA_IDS[Math.floor(rng() * EMPRESA_IDS.length)],
      commercialNodeIds: commercialNodesFor(seed.type, rng),
      creditLimit,
      creditTermDays,
      currency: 'CLP',
      // peso Zipf, usado solo internamente para escalar documentos -- no forma parte del modelo.
      __weight: weights[index],
    } as Counterparty & { __weight: number };
  });
}

// ---------------------------------------------------------------------------------------------
// Documentos por cobrar (abiertos, a la fecha de corte TODAY_ISO)
// ---------------------------------------------------------------------------------------------

type AgingBucket =
  | 'POR_VENCER_0_30'
  | 'POR_VENCER_30_PLUS'
  | 'VENCIDO_1_30'
  | 'VENCIDO_31_60'
  | 'VENCIDO_61_90'
  | 'VENCIDO_90_PLUS'
  | 'SIN_VENCIMIENTO';

/** Distribución de tramos de antigüedad de los documentos abiertos -- mezcla realista con más
 * peso en "por vencer próximo" y "recién vencido" que en la cola de 90+, más una porción con
 * `dueDate: null` (convenios sin plazo pactado individual). */
const BUCKET_WEIGHTS: Array<[AgingBucket, number]> = [
  ['POR_VENCER_0_30', 0.26],
  ['POR_VENCER_30_PLUS', 0.14],
  ['VENCIDO_1_30', 0.22],
  ['VENCIDO_31_60', 0.14],
  ['VENCIDO_61_90', 0.09],
  ['VENCIDO_90_PLUS', 0.07],
  ['SIN_VENCIMIENTO', 0.08],
];

function pickBucket(rng: () => number): AgingBucket {
  const target = rng();
  let cumulative = 0;
  for (const [bucket, weight] of BUCKET_WEIGHTS) {
    cumulative += weight;
    if (target <= cumulative) return bucket;
  }
  return BUCKET_WEIGHTS[BUCKET_WEIGHTS.length - 1][0];
}

function resolveBucket(
  bucket: AgingBucket,
  rng: () => number,
): { dueDate: string | null; status: DocumentStatus; daysOverdue: number } {
  switch (bucket) {
    case 'POR_VENCER_0_30': {
      const d = 1 + Math.floor(rng() * 30);
      return { dueDate: addDaysIso(TODAY_ISO, d), status: 'POR_VENCER', daysOverdue: 0 };
    }
    case 'POR_VENCER_30_PLUS': {
      const d = 31 + Math.floor(rng() * 60);
      return { dueDate: addDaysIso(TODAY_ISO, d), status: 'POR_VENCER', daysOverdue: 0 };
    }
    case 'VENCIDO_1_30': {
      const d = 1 + Math.floor(rng() * 30);
      return { dueDate: addDaysIso(TODAY_ISO, -d), status: 'VENCIDO', daysOverdue: d };
    }
    case 'VENCIDO_31_60': {
      const d = 31 + Math.floor(rng() * 30);
      return { dueDate: addDaysIso(TODAY_ISO, -d), status: 'VENCIDO', daysOverdue: d };
    }
    case 'VENCIDO_61_90': {
      const d = 61 + Math.floor(rng() * 30);
      return { dueDate: addDaysIso(TODAY_ISO, -d), status: 'VENCIDO', daysOverdue: d };
    }
    case 'VENCIDO_90_PLUS': {
      const d = 91 + Math.floor(rng() * 90);
      return { dueDate: addDaysIso(TODAY_ISO, -d), status: 'VENCIDO', daysOverdue: d };
    }
    case 'SIN_VENCIMIENTO':
      // Excluido de la Proyección de Recaudación (regla transversal, spec §6); status POR_VENCER
      // por convención -- no está vencido, simplemente no tiene fecha contra la cual medirse.
      return { dueDate: null, status: 'POR_VENCER', daysOverdue: 0 };
  }
}

let docCounter = 0;
function nextDocId(prefix: string): string {
  docCounter++;
  return `doc-${prefix}-${docCounter}`;
}
function nextExternalRef(): string {
  return `F-${100_000 + docCounter}`;
}

function buildOpenDocument(
  counterpartyId: string,
  weight: number,
  rng: () => number,
  overrides?: { forceOverpay?: boolean; forceBucket?: AgingBucket },
): ReceivableDocument {
  const bucket = overrides?.forceBucket ?? pickBucket(rng);
  const { dueDate, status, daysOverdue } = resolveBucket(bucket, rng);

  const base = 300_000 + rng() * 4_500_000;
  const grossAmount = Math.round(base * (0.5 + weight * 3));
  const netAmount = Math.round(grossAmount / 1.19);

  let appliedAmount = 0;
  const paymentRoll = rng();
  if (overrides?.forceOverpay) {
    appliedAmount = Math.round(grossAmount * (1.05 + rng() * 0.1)); // sobrepago real, 5%-15% de más
  } else if (paymentRoll < 0.3) {
    appliedAmount = Math.round(grossAmount * (0.2 + rng() * 0.6)); // pago parcial
  }

  const creditNoteAmount = rng() < 0.15 ? Math.round(grossAmount * (0.05 + rng() * 0.15)) : 0;
  const balance = grossAmount - appliedAmount - creditNoteAmount;

  return {
    id: nextDocId('open'),
    externalRef: nextExternalRef(),
    counterpartyId,
    issueDate: addDaysIso(TODAY_ISO, -30 - Math.floor(rng() * 60)),
    dueDate,
    grossAmount,
    netAmount,
    appliedAmount,
    creditNoteAmount,
    balance,
    status,
    daysOverdue,
    currency: 'CLP',
    // Abierto -- todavía no se paga, así que no hay fecha de pago que reconstruir (Task 1, SP2).
    paidDate: null,
  };
}

/** Cantidad de documentos abiertos por contraparte -- escala con el peso Zipf para que la
 * concentración de saldo (spec §4) sobreviva al ruido de pagos parciales/notas de crédito: una
 * contraparte pesada tiene más Y más grandes documentos, nunca solo uno de los dos factores. */
function openDocCountFor(weight: number, rng: () => number): number {
  const base = 2 + Math.floor(rng() * 3); // 2-4
  return Math.max(1, Math.round(base * (0.4 + weight)));
}

// ---------------------------------------------------------------------------------------------
// Documentos cerrados multi-año (historia para CEI / mora promedio / sparklines)
// ---------------------------------------------------------------------------------------------

const HISTORICAL_PERIODS = PERIODS_MES.filter((p) => p.endDate < TODAY_ISO);

/**
 * Cantidad de documentos cerrados por contraparte, escalada por peso Zipf -- deliberadamente
 * bimodal: contrapartes de cola larga caen naturalmente por debajo del mínimo publicable (~6,
 * política de degradación por falta de historial, spec §6), las pesadas superan largamente ese
 * mínimo (hasta 35). Sin este sesgo, "algunas por debajo del mínimo" quedaría librado al azar.
 */
function closedDocCountFor(weight: number, rng: () => number): number {
  return Math.max(1, Math.min(35, Math.round(1 + weight * 45 + rng() * 5)));
}

interface ClosedDocResult {
  documents: ReceivableDocument[];
  avgDaysLate: number;
  closedDocumentCount: number;
}

/**
 * Fecha de pago determinista para un documento cerrado (PAGADO), dentro de
 * `[issueDate, min(dueDate ?? issueDate+30, TODAY_ISO)]` -- nunca fuera de ese rango (Task 1, SP2:
 * `documentStateAsOf` depende de que esto sea siempre cierto). Sesgada por `daysLate` (el mismo
 * valor por-documento que alimenta `avgDaysLate` de la contraparte, spec §8.D): documentos con
 * mora alta tienden a pagarse más cerca del tope del rango; buenos pagadores, más cerca de la
 * emisión. Reusa el stream mulberry32 ya en curso -- ninguna fuente de aleatoriedad nueva.
 */
function pickPaidDate(
  issueDate: string,
  dueDate: string | null,
  daysLate: number,
  rng: () => number,
): string {
  const naturalUpperIso = dueDate ?? addDaysIso(issueDate, 30);
  const upperIso = naturalUpperIso < TODAY_ISO ? naturalUpperIso : TODAY_ISO;
  const clampedUpperIso = upperIso < issueDate ? issueDate : upperIso;
  const spanDays = daysBetweenIso(issueDate, clampedUpperIso);
  if (spanDays <= 0) {
    return issueDate;
  }
  // daysLate ronda entre ~-28 y ~+45 en este dataset -- normalizado a [0,1] como sesgo hacia el tope.
  const bias = Math.min(1, Math.max(0, (daysLate + 20) / 40));
  const fraction = 0.4 * rng() + 0.6 * bias;
  const offsetDays = Math.min(spanDays, Math.round(fraction * spanDays));
  return addDaysIso(issueDate, offsetDays);
}

function buildClosedDocuments(
  counterpartyId: string,
  weight: number,
  daysLateBias: number,
  rng: () => number,
): ClosedDocResult {
  const count = closedDocCountFor(weight, rng);
  const documents: ReceivableDocument[] = [];
  let sumDaysLate = 0;

  for (let i = 0; i < count; i++) {
    const period = HISTORICAL_PERIODS[Math.floor(rng() * HISTORICAL_PERIODS.length)];
    const issueDate = addDaysIso(period.startDate, Math.floor(rng() * 25));
    const termDays = 15 + Math.floor(rng() * 4) * 15; // 15/30/45/60, independiente del perfil vigente de la contraparte (el plazo pudo cambiar en el tiempo)
    const dueDate = addDaysIso(issueDate, termDays);

    const daysLate = daysLateBias + (rng() * 20 - 10);
    sumDaysLate += daysLate;

    const grossAmount = Math.round((200_000 + rng() * 3_000_000) * (0.6 + weight * 2));
    const netAmount = Math.round(grossAmount / 1.19);
    const creditNoteAmount = rng() < 0.1 ? Math.round(grossAmount * (0.05 + rng() * 0.1)) : 0;
    const appliedAmount = grossAmount - creditNoteAmount; // cerrado: saldo siempre 0
    const balance = grossAmount - appliedAmount - creditNoteAmount;
    // Calculado después de daysLate (arriba) a propósito: consumir rng acá no cambia el daysLate
    // ya fijado para ESTE documento, solo desplaza el stream para los draws siguientes -- ver
    // collections.mock.spec.ts "es reproducible" (el desplazamiento sigue siendo determinista).
    const paidDate = pickPaidDate(issueDate, dueDate, daysLate, rng);

    documents.push({
      id: nextDocId('closed'),
      externalRef: nextExternalRef(),
      counterpartyId,
      issueDate,
      dueDate,
      grossAmount,
      netAmount,
      appliedAmount,
      creditNoteAmount,
      balance,
      status: 'PAGADO',
      daysOverdue: 0,
      currency: 'CLP',
      paidDate,
    });
  }

  return { documents, avgDaysLate: count === 0 ? 0 : sumDaysLate / count, closedDocumentCount: count };
}

// ---------------------------------------------------------------------------------------------
// Ensamblado
// ---------------------------------------------------------------------------------------------

interface CollectionsMockData {
  counterparties: Counterparty[];
  documents: ReceivableDocument[];
  behaviors: CounterpartyBehavior[];
  periodSalesTotalClp: Record<string, number>;
}

/**
 * Genera todo el universo mock de Cobranzas desde una única semilla. Exportado (no solo usado
 * internamente) para que el spec pueda invocarlo más de una vez y verificar que produce
 * exactamente el mismo resultado -- la prueba de determinismo real, no solo "el módulo no cambió
 * de instancia".
 */
export function generateCollectionsMockData(): CollectionsMockData {
  docCounter = 0;
  const rng = mulberry32(SEED);
  const counterparties = buildCounterparties(rng) as Array<Counterparty & { __weight: number }>;

  const documents: ReceivableDocument[] = [];
  const behaviors: CounterpartyBehavior[] = [];

  counterparties.forEach((counterparty, index) => {
    const weight = counterparty.__weight;
    const openCount = openDocCountFor(weight, rng);
    for (let k = 0; k < openCount; k++) {
      // Casos de borde forzados de forma determinista (no librados a la probabilidad del bucket
      // aleatorio): la 1ª contraparte del universo siempre aporta un sobrepago real; la 2ª
      // siempre aporta un documento sin fecha de vencimiento. Así ambos casos de borde
      // obligatorios del plan sobreviven a cualquier reajuste futuro de BUCKET_WEIGHTS.
      const overrides =
        index === 0 && k === 0
          ? { forceOverpay: true }
          : index === 1 && k === 0
            ? { forceBucket: 'SIN_VENCIMIENTO' as AgingBucket }
            : undefined;
      documents.push(buildOpenDocument(counterparty.id, weight, rng, overrides));
    }

    // Sesgo de mora por contraparte: la mayoría paga tarde en distinto grado, algunas pagan
    // temprano (bias negativo). La contraparte de índice 2 se fuerza determinísticamente a buen
    // pagador (bias muy negativo) para que "algún avgDaysLate < 0" no dependa del azar.
    const daysLateBias = index === 2 ? -18 : -5 + rng() * 35;
    const closed = buildClosedDocuments(counterparty.id, weight, daysLateBias, rng);
    documents.push(...closed.documents);
    behaviors.push({
      counterpartyId: counterparty.id,
      avgDaysLate: Math.round(closed.avgDaysLate * 10) / 10,
      closedDocumentCount: closed.closedDocumentCount,
    });
  });

  // Contraparte no mapeada: documento legado cuyo counterpartyId nunca calzó con el catálogo
  // vigente de contrapartes (caso de borde obligatorio, spec §4) -- se muestra igual, nunca se
  // descarta en silencio.
  documents.push(buildOpenDocument(UNMAPPED_COUNTERPARTY_ID, 0, rng, { forceBucket: 'VENCIDO_31_60' }));

  const periodSalesTotalClp: Record<string, number> = {};
  for (const period of PERIODS_MES) periodSalesTotalClp[period.id] = 0;
  for (const fact of SALES_FACTS) {
    const periodId = fact.date.slice(0, 7);
    if (periodId in periodSalesTotalClp) {
      periodSalesTotalClp[periodId] += fact.amount;
    }
  }

  // El peso interno __weight no forma parte del modelo público -- se descarta al exportar.
  const publicCounterparties: Counterparty[] = counterparties.map(({ __weight, ...rest }) => rest);

  return { counterparties: publicCounterparties, documents, behaviors, periodSalesTotalClp };
}

const MOCK_DATA = generateCollectionsMockData();

export const COUNTERPARTIES: Counterparty[] = MOCK_DATA.counterparties;

export const RECEIVABLE_DOCUMENTS: ReceivableDocument[] = MOCK_DATA.documents;

export const COUNTERPARTY_BEHAVIORS: CounterpartyBehavior[] = MOCK_DATA.behaviors;

/**
 * Venta bruta (con IVA) por periodo, derivada de la MISMA fuente que Ventas usa para su KPI
 * "Ventas Totales" (`sumAmount` sobre `SALES_FACTS` -- ver sales-fact.utils.ts): se agrega cada
 * `SalesFact.amount` al periodo mensual cuyo id coincide con el prefijo `YYYY-MM` de su fecha,
 * exactamente como Ventas agregaría sus facts para ese mismo mes con todas las tiendas
 * seleccionadas y el toggle "Con IVA". Este es el número que el segmento "Venta del periodo" del
 * Puente Venta→Caja (SP2) debe igualar para que el cuadre de reconciliación nunca pueda divergir
 * -- si algún día alguien recalcula este total con otro criterio (p. ej. filtrando tiendas), deja
 * de cuadrar con el KPI de Ventas y el test de reconciliación de SP2 debe detectarlo.
 */
export const PERIOD_SALES_TOTAL_CLP: Record<string, number> = MOCK_DATA.periodSalesTotalClp;

/**
 * Metas de cobranza por nodo de alcance (spec §6, DSO/%Vencido/CEI). Todos los campos son
 * opcionales: un tenant puede no fijar meta para una métrica en un nodo dado.
 */
export const COLLECTION_TARGETS: CollectionTarget[] = [
  { scopeNodeId: 'holding', dsoTarget: 45, overdueRatioTarget: 0.18, ceiTarget: 0.85 },
  { scopeNodeId: 'empresa-gastronomia', dsoTarget: 40, overdueRatioTarget: 0.15, ceiTarget: 0.88 },
  // Retail: el tenant aún no definió meta de DSO ni de CEI para esta empresa -- null explícito,
  // no "0" (0 sería una meta real y absurda).
  { scopeNodeId: 'empresa-retail', dsoTarget: null, overdueRatioTarget: 0.2, ceiTarget: null },
];
