# Cobranzas — SP4: Detalle de Cartera — Plan de Implementación

> **Para el worker:** implementá tarea por tarea, en orden. Leé los archivos de referencia
> nombrados ANTES de escribir código. Cada tarea termina con typecheck + build + tests verdes y un
> commit. Diseño canónico: `docs/superpowers/specs/2026-07-26-cobranzas-frontend-design.md`. SP1,
> SP2 y SP3 ya construidos y desplegados. Este es el ÚLTIMO sub-proyecto de la descomposición
> original de Cobranzas.

**Objetivo:** reemplazar el placeholder "Próximamente" de `/cobranzas/cartera` (Detalle de
Cartera) con la vista dual **Tabla** (reconciliación Contraparte→Documentos, fila de totales que
cuadra con Saldo por Cobrar) y **Mapa** (treemap de exposición por contraparte), calcando la
arquitectura de Detalle de Ventas con foco compartido `focusedCounterpartyId`.

## Global Constraints (idénticas a SP1/SP2/SP3, repetidas por completitud)

- Angular 21 **zoneless + signals**; componentes `standalone`, `ChangeDetectionStrategy.OnPush`,
  `inject()`, `input()/output()/model()`, control-flow `@if/@for/@switch`.
- PrimeNG 21; consultar el MCP `@primeng/mcp` antes de un componente nuevo.
- CSS: solo tokens `var(--p-…)`/`var(--dash-…)`; sin utilitarias inventadas; budget ≤24kB
  warn/48kB error por componente. Breakpoint móvil **900px**. Nunca truncar números/títulos.
- Mock determinista: prohibido `Date.now()`/`new Date()` argless/`Math.random()`.
- **Ventas no debe cambiar su comportamiento.** No tocar `SalesDataService`, ningún archivo de
  `pages/ventas-general` o `pages/detalle-ventas`. Se REUSA (import, sin copiar ni modificar)
  `squarify`/`TreemapRect` de `src/app/data/utils/sales-detail-treemap.utils.ts` -- es la única
  pieza de Ventas que este plan importa, ya diseñada como genérica (opera sobre `number[]`, no
  sobre tipos de Ventas).
- Comandos de verificación: `npx tsc --noEmit -p tsconfig.app.json`, `npx ng build`,
  `npx ng test --watch=false`. Correr 2 veces seguidas para confirmar estabilidad.
  Baseline: 1 fallo preexistente no relacionado (`app.spec.ts`/`ActivatedRoute`) — no es
  regresión.
- Formato de importes negativos: entre paréntesis, sin signo, rojo suave (`formatSignedAmount`).
- **Reconciliación no-negociable (spec §5.5):** la fila de totales de la tabla debe cuadrar
  EXACTAMENTE con el KPI Saldo por Cobrar bajo los mismos filtros -- ambos derivados de
  `CollectionsDataService.scopedDocuments()` (misma fuente, nunca pueden divergir).
- **Guion, nunca cero (spec §5.7):** `creditLimit: null` se muestra como "—", jamás como "0%" de
  utilización o "$0" de límite. Aplica a toda celda de límite/%util/plazo pactado, en la tabla Y
  en la fila de totales.
- **Ocultar filas sin saldo (spec §5.6):** contrapartes con saldo `$0` en todos los tramos al
  corte activo se ocultan por defecto, con un control visible para mostrarlas -- mismo principio
  de "hide-zero" ya usado en `buildDetailTree` de Ventas, pero acá es un TOGGLE VISIBLE (en Ventas
  era incondicional).

---

### Task 1: Utilidad pura del árbol de detalle (`collections-detail-tree.utils.ts`)

**Files:** Create `src/app/data/utils/collections-detail-tree.utils.ts` + spec. Read:
`src/app/data/utils/collections-aging.utils.ts` (SP2 Task 6, completo -- `buildAgingBuckets`,
`AgingBucketKey`, `DEFAULT_AGING_BUCKET_CONFIG`, vas a llamarla UNA VEZ POR CONTRAPARTE, pasándole
solo los documentos de esa contraparte), `src/app/data/models/collections.model.ts`
(`ReceivableDocument`, `Counterparty`), `src/app/data/utils/sales-detail-tree.utils.ts` (patrón de
referencia de forma -- `DetailTreeNode`/`key`/`children`/`expanded`, NO reusar sus tipos, son de
Ventas y su jerarquía es de 3 niveles con columnas por periodo; acá son 2 niveles con columnas de
tramo de antigüedad FIJAS, sin selector de periodo/métrica).

**Qué:**

```ts
import type { AgingBucketKey } from './collections-aging.utils';

export interface CollectionsDetailDocumentRow {
  key: string; // `doc-${document.id}`
  externalRef: string;
  issueDate: string;
  dueDate: string | null;
  grossAmount: number;
  appliedAmount: number;
  creditNoteAmount: number;
  balance: number;
  daysOverdue: number;
  status: 'POR_VENCER' | 'VENCIDO' | 'PAGADO'; // scopedDocuments nunca trae PAGADO, pero el tipo se hereda tal cual de ReceivableDocument
}

export interface CollectionsDetailCounterpartyRow {
  key: string; // `contraparte-${counterpartyId}`
  counterpartyId: string;
  label: string;
  /** Los 7 tramos de `buildAgingBuckets` (SP2), montos por bucket -- incluye `NO_DUE_DATE`
   * (spec §5.2 no lo dibuja en la maqueta ASCII, pero SÍ exige que "sin vencimiento" tenga su
   * propio tramo explícito en Antigüedad, §8.B -- extender la tabla con esa misma columna es la
   * única forma de que SALDO de la fila cuadre exactamente con la suma de los 6 tramos + esto,
   * sin ocultar plata en silencio; documentado como decisión de este plan). */
  bucketAmounts: Record<AgingBucketKey, number>;
  saldo: number; // suma balance de sus documentos -- === suma de bucketAmounts
  creditLimit: number | null;
  creditTermDays: number | null; // "plazo pactado" (columna adicional, spec §5.2)
  utilizacionPct: number | null; // saldo / creditLimit; null si creditLimit es null
  /** Promedio de `daysOverdue` ponderado por `balance`, sobre TODOS los documentos abiertos de
   * esta contraparte (POR_VENCER aporta 0 días, diluyendo la mora hacia abajo si hay saldo
   * corriente -- es la misma convención "promedio ponderado por saldo" que pide la fila de
   * totales, spec §5.5, aplicada acá a nivel de fila individual también). */
  avgDaysOverdueWeighted: number;
  documents: CollectionsDetailDocumentRow[]; // hijos de esta fila al expandir
}

export interface CollectionsDetailTotalsRow {
  saldo: number;
  bucketAmounts: Record<AgingBucketKey, number>;
  /** Mismo promedio ponderado por saldo que cada fila, pero sobre TODA la cartera en scope. */
  avgDaysOverdueWeighted: number;
  // límite/%util/plazo pactado NO se totalizan (spec §5.5) -- el caller muestra "—" para esas 3.
}

export interface CollectionsDetailTree {
  rows: CollectionsDetailCounterpartyRow[]; // orden default: descendente por saldoVencido (spec §5.3)
  totals: CollectionsDetailTotalsRow;
}

/**
 * Construye la tabla de reconciliación Contraparte→Documentos (spec §5.2-§5.5) a partir de
 * `documents` YA escopeados/cutoff-reconstruidos (`CollectionsDataService.scopedDocuments()`).
 * `includeZeroBalance`: si `false` (default de pantalla), contrapartes con `saldo === 0` en TODOS
 * los tramos se excluyen (spec §5.6 -- toggle visible en el componente, no acá: esta función solo
 * aplica el filtro que el caller le pida, no decide el default).
 */
export function buildCollectionsDetailTree(
  documents: ReceivableDocument[],
  counterparties: Counterparty[],
  cutoffIso: string,
  includeZeroBalance: boolean,
): CollectionsDetailTree
```

Algoritmo:
- Agrupar `documents` por `counterpartyId` (`Map<string, ReceivableDocument[]>`).
- Para cada grupo: `buildAgingBuckets(groupDocs, cutoffIso)` (reusar tal cual de SP2, default
  config) -> `bucketAmounts` (mapear el array `buckets` a un `Record<AgingBucketKey, number>`
  leyendo `.amount` de cada uno). `saldo = suma de bucketAmounts` (== suma de `balance` del grupo,
  mismo número, dos caminos -- útil como aserción cruzada en tests).
- `label`: `counterparties.find(c => c.id === counterpartyId)?.label ?? 'Contraparte no mapeada'`
  (mismo patrón §8.C que SP3 Task 2 -- redeclarar la constante local, no importar de
  `collections-concentration.utils.ts`, mantener cada util independiente).
- `creditLimit`/`creditTermDays`: de la `Counterparty` encontrada, `null` si no existe o si el
  campo del maestro es `null`.
- `utilizacionPct = creditLimit === null ? null : saldo / creditLimit`.
- `avgDaysOverdueWeighted = saldo === 0 ? 0 : (suma de daysOverdue*balance de cada doc) / saldo`.
- `documents`: mapear cada `ReceivableDocument` del grupo a `CollectionsDetailDocumentRow`
  (`key: 'doc-' + doc.id`), sin reordenar acá (el ordenamiento de documentos hijos lo decide el
  componente, spec §5.3 dice "todas las columnas deben ser ordenables", incluida a nivel de
  documento -- fuera de alcance de este util puro, que solo entrega los datos).
- Filtrar por `includeZeroBalance`: si `false`, excluir filas con `saldo === 0`.
- Ordenar filas resultantes: descendente por `bucketAmounts` VENCIDO total (`vencido1_30 +
  vencido31_60 + vencido61_90 + vencido90Plus`) -- spec §5.3 "descendente por saldo vencido", NO
  por saldo total.
- `totals`: sobre las filas YA FILTRADAS (post `includeZeroBalance`) -- suma de `saldo`, suma de
  cada `bucketAmounts[key]`, `avgDaysOverdueWeighted` ponderado por `saldo` sobre esas mismas
  filas (misma fórmula que a nivel de fila, aplicada al agregado).

**Acceptance (TDD):**
- Con `documents = CollectionsDataService.scopedDocuments()` real bajo el scope default (vía
  `TestBed`) y `includeZeroBalance: true`: suma de `saldo` de todas las filas === suma de
  `balance` de `documents` (cuadre no-negociable, spec §5.5) -- test EXPLÍCITO comparando contra
  `saldoTotalFromScope()` del propio servicio, no un número mágico.
- `totals.saldo` === la misma suma de arriba.
- Cada documento de `documents` aparece en EXACTAMENTE 1 fila (suma de `row.documents.length` ===
  `documents.length`, con `includeZeroBalance: true`).
- Orden: filas descendente por suma-de-tramos-vencidos, verificado con datos reales (monotonía) y
  un caso armado a mano donde una contraparte con saldo TOTAL mayor pero saldo VENCIDO menor queda
  DESPUÉS de una con saldo total menor pero más vencido.
- `includeZeroBalance: false` excluye filas con `saldo === 0` (armar 1 contraparte a mano con
  balance 0 en todos sus documentos -- posible si `appliedAmount === grossAmount` exacto).
- Contraparte no mapeada (§8.C): documento con `counterpartyId` inexistente en `counterparties`
  genera una fila con label "Contraparte no mapeada", no se descarta.
- `utilizacionPct`/`creditLimit`/`creditTermDays`: `null` cuando el maestro no los define,
  verificado con una contraparte armada a mano con `creditLimit: null`.

- [ ] Tests que fallan primero. [ ] Implementar. [ ] Verde. Commit.

---

### Task 2: Utilidad pura del treemap de cartera (`collections-detail-treemap.utils.ts`)

**Files:** Create `src/app/data/utils/collections-detail-treemap.utils.ts` + spec. Read:
`src/app/data/utils/sales-detail-treemap.utils.ts` completo (reusar `squarify`/`TreemapRect`
TAL CUAL, importados -- NO copiar su código; NO reusar `TreemapEntry`/`TreemapBlock`/
`buildTreemapBand`, que son específicos de la jerarquía de 3 niveles de Ventas con tendencia por
periodo). `src/app/data/models/collections.model.ts` (`Counterparty`, `ReceivableDocument`).

**Por qué es más simple que el treemap de Ventas:** Ventas tiene 3 bandas apiladas con
drill-down (Familia→Subfamilia→Artículo, clic para bajar de nivel). Cobranzas (spec §5.1) es
**una sola banda** -- todas las contrapartes a la vez, sin nivel siguiente al que perforar. "Hover
sin clic" (spec), no hay interacción de drill-down entre bandas.

**Qué:**

```ts
export interface CollectionsTreemapBlock {
  id: string; // counterpartyId
  label: string;
  isLongTail: false;
  sharePct: number; // 0-100, share del saldo total de la banda
  saldo: number;
  /** Mora para el color -- mismo `avgDaysOverdueWeighted` que Task 1 (promedio ponderado por
   * saldo de daysOverdue sobre los documentos abiertos de esta contraparte). Redeclarado acá
   * (no importado de collections-detail-tree.utils.ts) -- cada util de Cobranzas calcula sus
   * propios agregados desde `ReceivableDocument[]` crudo, sin depender uno del otro (mismo
   * criterio de independencia que collections-concentration.utils.ts/collections-aging.utils.ts
   * ya establecieron en SP2-SP3 -- evita acoplar 2 archivos que deben poder cambiar por separado).
   */
  avgDaysOverdueWeighted: number;
}

export interface CollectionsTreemapLongTailBlock {
  id: 'long-tail';
  label: string;
  isLongTail: true;
  sharePct: number;
  saldo: number;
  items: CollectionsTreemapBlock[];
}

export type CollectionsTreemapEntry = CollectionsTreemapBlock | CollectionsTreemapLongTailBlock;

export const LONG_TAIL_THRESHOLD_PCT = 1; // mismo umbral que sales-detail-treemap.utils.ts
export const MAX_MAIN_BLOCKS = 8; // ídem

/**
 * Una sola banda de bloques (spec §5.1: sin drill-down, todas las contrapartes a la vez) a partir
 * de `documents` ya escopeados al corte activo. Mismo criterio de long-tail que
 * `buildTreemapBand` de Ventas (bloques bajo 1% del total de la banda, o más allá del rank 8,
 * se agrupan en un bloque "+N más" con lista buscable) -- reimplementado acá porque agrupa por
 * `counterpartyId`/`balance`, no por `DetailTreeNode`/`consolidadoTotal`.
 */
export function buildCollectionsTreemapBand(
  documents: ReceivableDocument[],
  counterparties: Counterparty[],
): CollectionsTreemapEntry[]
```

Algoritmo: igual estructura que `buildTreemapBand` (agrupar, ordenar desc por `saldo`, aplicar
`LONG_TAIL_THRESHOLD_PCT`/`MAX_MAIN_BLOCKS`, "1 solo item en la cola se promueve a bloque
principal en vez de un '+1 más'"), pero agrupando `documents` por `counterpartyId` (mismo
`avgDaysOverdueWeighted` ponderado por balance que Task 1) en vez de leer un `DetailTreeNode`.
Reusá el patrón línea por línea de `buildTreemapBand` (está debajo de este mismo plan como
referencia de lectura obligatoria) -- la lógica de long-tail/promoción-de-1-item es idéntica,
solo cambia la fuente de datos agrupada.

**Acceptance (TDD):**
- Con datos mock reales bajo el scope default: suma de `saldo` de todos los `entries` (blocks +
  long-tail) === suma de `balance` de `documents` (cuadre, mismo principio de siempre).
- Orden desc por `saldo`; long-tail agrupa correctamente bloques bajo 1% o más allá del rank 8
  (mismos tests de forma que ya tiene `sales-detail-treemap.utils.spec.ts` para `buildTreemapBand`
  -- podés leer ese spec como referencia de qué escenarios cubrir, adaptados a este dominio).
- Caso "1 solo item en la cola se promueve": armá un escenario a mano donde exactamente 1
  contraparte cae bajo el umbral -- confirmá que aparece como bloque propio, no como "+1 más".
- `squarify(values, container)` sigue siendo la misma función importada de Ventas -- test de
  integración liviano confirmando que `buildCollectionsTreemapBand(...).map(e => e.saldo)`
  alimentado a `squarify` produce rects que llenan el contenedor (mismo test de humo que ya
  garantiza `sales-detail-treemap.utils.spec.ts`, no hace falta reescribir toda la suite de
  `squarify` -- esa función no cambia).

- [ ] Tests que fallan. [ ] Implementar. [ ] Verde. Commit.

---

### Task 3: Componente Vista Tabla (`CollectionsDetailTreeTableComponent`)

**Files:** Create `src/app/pages/detalle-cartera/collections-detail-tree-table/collections-detail-tree-table.ts`
+`.html`+`.css`+spec. Read COMPLETOS: `src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.ts`+`.html`+`.css`
(el patrón EXACTO a mirror: búsqueda debounced con auto-expand vía `filterAndExpand`, carga
progresiva `applyProgressiveLoading`/`INITIAL_VISIBLE_CHILDREN=20`/`LOAD_MORE_STEP=20`, header
adhesivo con medición de altura real, `scrollHeight` calculado, foco compartido con
`expandedKeys`/`scrollRowIntoView`), `src/app/data/utils/collections-detail-tree.utils.ts` (Task
1), `src/app/data/utils/tristate.utils.ts` (`highlightMatch`, ya reusado por Ventas, reusalo acá
tal cual), `src/app/pipes/signed-amount.ts`/`signed-amount.pipe.ts`.

**Diferencias deliberadas respecto al mirror de Ventas (documentar en el componente):**
1. **2 niveles, no 3:** Contraparte → Documento (sin nivel Subfamilia intermedio). El árbol de
   `buildCollectionsDetailTree` ya viene aplanado a esta forma -- no hace falta la lógica de
   `familia`/`subfamilia` de Ventas, solo un nivel de expansión.
2. **Sin selector Total/Cantidad:** las columnas son FIJAS (los 7 tramos de antigüedad +
   Saldo/Límite/%Util/Mora/%Cartera/Plazo), no hay métrica intercambiable ni columnas por periodo
   -- esto es una vista de STOCK al corte, no de flujo por periodo. Quitar el `p-selectButton` de
   métrica que sí tiene Ventas.
3. **Todas las columnas ordenables (spec §5.3), no solo búsqueda:** agregar un signal
   `sortColumn`/`sortDirection` + click en header de columna -- Ventas NO tiene esto (su orden es
   siempre alfabético fijo). Implementar con un comparador genérico sobre
   `CollectionsDetailCounterpartyRow` (por cada columna: `saldo`, cada `bucketAmounts[key]`,
   `utilizacionPct` con nulls al final -- mismo criterio que `collections-concentration.utils.ts`
   Task 2 de SP3 --, `avgDaysOverdueWeighted`). Ordenamiento de columna NUNCA reordena los
   documentos hijos dentro de una fila expandida (esos se ordenan aparte si el usuario hace clic
   en un header DENTRO de la sub-tabla expandida -- implementación más simple: un único
   comparador reusado también para `row.documents`, aplicado localmente por fila al expandir).
4. **Fila de totales fija al pie (spec §5.5, innegociable):** una fila `<tr>` extra, SIEMPRE
   visible (no scrollea con el body -- `position: sticky; bottom: 0` o el mecanismo equivalente de
   PrimeNG TreeTable para un footer fijo -- consultá el MCP `@primeng/mcp` para `p-treeTable`'s
   soporte de `pTemplate="footer"`), leyendo `tree().totals` (Task 1). Columnas límite/%util/plazo
   muestran "—" (spec §5.5); mora muestra `totals.avgDaysOverdueWeighted`.
5. **Toggle "Mostrar filas sin saldo" visible (spec §5.6):** un `p-toggleSwitch`/checkbox en la
   toolbar, signal `includeZeroBalance` (default `false`), pasado a
   `buildCollectionsDetailTree(..., includeZeroBalance)`.
6. **Semáforo de límite (spec §5.7):** filas con `utilizacionPct !== null && utilizacionPct >= 1`
   reciben una marca de advertencia visual (icono/borde, tono `var(--p-orange-...)` o
   `var(--p-red-...)` sutil -- consistente con el resto de semáforos de la pantalla, NO
   necesariamente `ceiBand`/`comparisonBand` de otros componentes, es un semáforo binario propio:
   sobre-límite o no).
7. **Sin búsqueda de "familia"/"subfamilia":** la búsqueda (mismo mecanismo debounced +
   `filterAndExpand` de Ventas, adaptado a 2 niveles) filtra por `label` de Contraparte O
   `externalRef` de Documento (folio) -- útil para el caso de uso de reconciliación real: un
   contador busca "F-100234" tanto como "Restaurantes del Sur".
8. **Columna "% de la cartera" con mini-barra (spec §5.2):** `saldo / totals.saldo * 100`, barra
   proporcional inline en la celda (mismo patrón visual `[style.width.%]` que Concentración de
   Cartera, SP3 Task 4 -- no reimportar ese componente, solo replicar la técnica CSS).

**Foco compartido:** mismo patrón `focusedFamiliaId`/`familiaFocused` de Ventas, pero un solo
nivel: `readonly focusedCounterpartyId = input<string | null>(null);` /
`readonly counterpartyFocused = output<string>();`, emitido en `onNodeExpand` cuando se expande
una fila de Contraparte, consumido con el mismo `effect()` de scroll-into-view + `expandedKeys`.

**Acceptance:** con datos mock reales bajo el default, la tabla renderiza sin NaN; la fila de
totales cuadra exactamente con `saldoTotalFromScope()`; ordenar por cada columna produce el orden
correcto; el toggle sin-saldo cambia la cantidad de filas visibles; buscar un folio real
auto-expande su contraparte; screenshot desktop+mobile si hay `ng serve` disponible.

- [ ] Implementar. [ ] Build; test. Commit.

---

### Task 4: Componente Vista Mapa (`CollectionsDetailTreemapComponent`)

**Files:** Create `src/app/pages/detalle-cartera/collections-detail-treemap/collections-detail-treemap.ts`
+`.html`+`.css`+spec. Read COMPLETOS: `src/app/pages/detalle-ventas/sales-detail-treemap/sales-detail-treemap.ts`+`.html`+`.css`
(patrón de layout con `squarify`, diálogo de long-tail buscable, tooltip -- SIN el mecanismo de
múltiples bandas apiladas ni drill-down por clic, que no aplican acá), `src/app/data/utils/collections-detail-treemap.utils.ts`
(Task 2).

**Qué:** selector `app-collections-detail-treemap`, standalone, `ChangeDetectionStrategy.OnPush`.
UNA sola banda (a diferencia de las 3 de Ventas) -- sin `familiaBand`/`subfamiliaBand`/
`articuloBand`, solo:

```ts
readonly documents = input.required<ReceivableDocument[]>();
readonly counterparties = input.required<Counterparty[]>();
readonly focusedCounterpartyId = input<string | null>(null);
readonly counterpartyFocused = output<string>();

protected readonly band = computed(() => buildCollectionsTreemapBand(this.documents(), this.counterparties()));
protected readonly layout = computed(() => layoutBand(this.band())); // mismo squarify(values, LAYOUT_CONTAINER) que Ventas
```

**Color por mora, no por tendencia (spec §5.1: "color semántico según días de mora"):** reemplazar
`trendBackground`/`TREND_UP_RGB`/`TREND_DOWN_RGB` de Ventas por una escala continua de intensidad
por `avgDaysOverdueWeighted` -- p.ej. `avgDaysOverdueWeighted <= 0` un verde suave (al día o
adelantado), creciendo hacia rojo intenso a partir de un umbral (reusá el mismo criterio de
"familias de color distintas para estados cualitativos" NO aplica acá -- esto SÍ es una escala
continua legítima, a diferencia de Antigüedad, spec §5.1 dice explícitamente "color semántico
según días de mora" como un gradiente, no clusters). Documentar la función de mapeo
días→intensidad con un comentario (p.ej. `intensity = Math.min(1, Math.max(0, avgDaysOverdueWeighted / 90))`
sobre `var(--p-red-500)`, ajustable a criterio del implementador dentro de ese espíritu).

**Hover sin clic (spec §5.1):** `pTooltip` con saldo/mora/%cartera al pasar el mouse -- SIN
ningún manejador de clic que dispare drill-down (no hay nivel siguiente). El bloque de long-tail
SÍ sigue siendo clickeable para abrir su diálogo buscable (mismo patrón `p-dialog` +
`IconField`/`InputText` que Ventas, reusado tal cual en estructura).

**Foco compartido:** al MONTAR (no al hacer clic, ya que no hay drill-down), este componente debe
poder recibir un `focusedCounterpartyId` desde Vista Tabla (si el usuario expandió una fila ahí y
después cambia a Vista Mapa) y resaltar visualmente ese bloque (borde/glow distintivo) sin mover
nada más -- no hay "banda hija" a la que bajar como en Ventas, así que el efecto es puramente
visual (highlight), no estructural. Vista Mapa NO necesita emitir `counterpartyFocused` al hacer
hover (sería demasiado ruidoso); si el usuario abre el diálogo de long-tail y clickea un item
específico ahí dentro, ESO sí puede emitir el foco (útil si luego cambia a Vista Tabla).

**Acceptance:** con datos mock reales, los bloques renderizan proporcional a `saldo`, llenando el
contenedor (mismo test de humo de squarify que Task 2); el color va de verde a rojo según mora,
verificable inspeccionando el CSS/estilos calculados en el test; el diálogo de long-tail abre,
filtra por búsqueda, y cierra; `focusedCounterpartyId` resalta el bloque correcto sin lanzar
excepciones cuando el id no existe en la banda actual (mismo `resolveFocusedId`-like fallback que
Ventas, adaptado: acá no hace falta un fallback "al más grande" porque no hay drill-down
obligatorio, un `null`/id-no-encontrado simplemente no resalta nada).

- [ ] Implementar. [ ] Build; test. Commit.

---

### Task 5: Composición — `DetalleCarteraComponent` con toggle Tabla/Mapa

**Files:** Modify `src/app/pages/detalle-cartera/detalle-cartera.ts`+`.html`. Read: el archivo
actual completo (placeholder de SP1) y `src/app/pages/detalle-ventas/detalle-ventas.ts`+`.html`
completos (patrón EXACTO de composición: `viewMode` signal, `p-selectButton` Tabla/Mapa, árbol
construido UNA VEZ en el composition root y pasado a ambas vistas, foco compartido
`focusedFamiliaId`/`focusedSubfamiliaId` -> acá `focusedCounterpartyId` singular).

**Qué:**
```ts
protected readonly viewMode = signal<'tabla' | 'mapa'>('tabla');
protected readonly focusedCounterpartyId = signal<string | null>(null);
```
Quitar el `p-card` "Próximamente"; componer `@if (viewMode() === 'tabla') { <app-collections-detail-tree-table
... /> } @else { <app-collections-detail-treemap ... /> }` con el `p-selectButton` de arriba, mismo
patrón visual que `detalle-ventas.html`. Ambos componentes reciben `collectionsData.scopedDocuments()`
directo (no hace falta construir el árbol acá arriba como hace Ventas con `buildDetailTree` -- Task
1/2 son funciones puras livianas que cada componente hijo puede llamar internamente con los
documentos que reciba por `input()`, evitando duplicar el cálculo del árbol en 2 lugares distintos
requeriría elevarlo acá; **decisión de diseño:** evaluá si `buildCollectionsDetailTree`/
`buildCollectionsTreemapBand` son suficientemente baratas (agrupar unos cientos de documentos) para
recomputarse una vez por vista activa sin necesidad de izarlas a este composition root -- si el
perfil de datos del mock (cientos de documentos, no decenas de miles) lo permite, dejalas dentro de
cada componente hijo como ya especifican Task 3/4, más simple que replicar el patrón de Ventas al
pie de la letra cuando la razón de ser de "construir una vez arriba" en Ventas era compartir NODOS
DE ÁRBOL por referencia entre bandas -- acá no hay bandas múltiples que necesiten la misma
instancia de árbol, solo re-derivar del mismo `scopedDocuments()` en cada vista es equivalente y
más simple).

**Acceptance:** `/cobranzas/cartera` muestra Vista Tabla por defecto con datos reales, cuadrando
con el KPI Saldo por Cobrar de Cobranzas General; el toggle cambia a Vista Mapa sin perder el
foco de contraparte si había uno; responsive mobile sin overflow horizontal fuera de sus propios
contenedores con scroll.

- [ ] Implementar. [ ] Build; test; screenshot desktop+mobile si hay `ng serve` disponible. Commit.

---

## Self-review (post-plan)

- Cobertura: Vista Tabla (2 niveles, columnas fijas de antigüedad + Saldo/Límite/%Util/Mora/
  %Cartera/Plazo, ordenamiento en todas las columnas, fila de totales que cuadra, toggle
  sin-saldo, semáforo de límite, búsqueda por contraparte/folio) + Vista Mapa (banda única,
  tamaño∝saldo, color∝mora continuo, hover sin clic, long-tail buscable) + foco compartido
  `focusedCounterpartyId` -- coincide con spec funcional §5.1-§5.7 completo.
  §8.A (sobrepago) ya está cubierto por el hecho de que la tabla se alimenta de
  `scopedDocuments()` sin excluir balances negativos (se muestran entre paréntesis vía
  `formatSignedAmount`, spec: "sí se muestra en la tabla con su saldo negativo").
- Reuso explícito y acotado de Ventas: solo `squarify`/`TreemapRect` (funciones puras genéricas),
  nunca sus componentes ni sus tipos de dominio.
- Ningún archivo de Ventas modificado en ninguna tarea (solo importado, de solo-lectura).
- Todas las tareas nombran archivos exactos, contratos de tipos y criterios de aceptación
  verificables, incluido el cuadre de reconciliación no-negociable del spec §5.5.
