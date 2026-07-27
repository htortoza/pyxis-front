# Cobranzas — SP2: Cobranzas General (parte alta) — Plan de Implementación

> **Para el worker:** implementá tarea por tarea, en orden (cada una depende de la anterior salvo
> que se indique lo contrario). Leé los archivos de referencia nombrados ANTES de escribir código.
> Cada tarea termina con typecheck + build + tests verdes y un commit. Diseño canónico:
> `docs/superpowers/specs/2026-07-26-cobranzas-frontend-design.md`. Cimientos ya construidos en
> `docs/superpowers/plans/2026-07-26-cobranzas-1-cimientos.md` (SP1, completo).

**Objetivo:** reemplazar el placeholder "Próximamente" de `/cobranzas` con: 5 KPI cards (Saldo,
%Vencido, DSO, CEI, Recuperado), el **Puente Venta→Caja**, y **Antigüedad de Cartera**. Detalle de
Cartera, Proyección de Recaudación y Concentración de Cartera son sub-proyectos aparte (SP3/SP4).

## Global Constraints (aplican a TODA tarea — idénticas a SP1, repetidas por completitud)

- Angular 21 **zoneless + signals**; componentes `standalone`, `ChangeDetectionStrategy.OnPush`,
  `inject()`, `input()/output()/model()`, control-flow `@if/@for/@switch`.
- PrimeNG 21; consultar el MCP `@primeng/mcp` antes de un componente nuevo.
- CSS: solo tokens `var(--p-…)`/`var(--dash-…)`; sin utilitarias inventadas; budget ≤24kB
  warn/48kB error por componente. Breakpoint móvil **900px**. Nunca truncar números/títulos.
- Mock determinista: prohibido `Date.now()`/`new Date()` argless/`Math.random()`.
- **Ventas no debe cambiar su comportamiento.** No tocar `SalesDataService`, `kpi-cards-grid`,
  `ranking-panels`, `hourly-sales-chart`, ni ningún archivo de `pages/ventas-general` o
  `pages/detalle-ventas`.
- Comandos de verificación: `npx tsc --noEmit -p tsconfig.app.json`, `npx ng build`,
  `npx ng test --watch=false`. Baseline: 1 fallo preexistente no relacionado
  (`app.spec.ts` "should render title", `ActivatedRoute`) — no cuenta como regresión.
- Formato de importes negativos: entre paréntesis, sin signo, rojo suave (`formatSignedAmount`).
- **Trampa del IVA:** todo lo de esta pantalla respeta `ivaMode` salvo donde se indique lo
  contrario explícitamente (la Proyección, que siempre opera en bruto, es SP3 — no aplica acá).

---

### Task 1: Reconstrucción de estado histórico del documento (`documentStateAsOf`) + `paidDate` en el mock

**Por qué esta tarea va primero:** `CollectionsDataService.scopedDocuments` (SP1) filtra por
`issueDate <= cutoffDate` pero usa el `status`/`daysOverdue`/`balance` YA HORNEADOS del mock a
`TODAY_ISO` — exacto solo cuando `cutoffDate === TODAY_ISO`, incorrecto para cualquier otro corte
(ver el comentario propio del servicio: "recomputing status/aging for an arbitrary historical
cutoff is deferred to when the Antigüedad component (SP2) actually needs it" — es ahora). Además,
las 5 KPI cards necesitan sparklines (≥3 puntos históricos), y una serie de Saldo/%Vencido/DSO
requiere saber cómo era la cartera en cortes PASADOS, no solo hoy.

**Files:** Modify `src/app/data/models/collections.model.ts` (agregar 1 campo),
`src/app/data/mock/collections.mock.ts` (poblar el campo nuevo). Create
`src/app/data/utils/collections-history.utils.ts` + spec. Modify
`src/app/services/collections-data.service.ts` (usar la reconstrucción en vez de los campos
horneados) + su spec si hace falta ajustar aserciones.

Read primero: `collections.model.ts`, `collections.mock.ts` completo (especialmente cómo arma
`status`/`daysOverdue`/`dueDate` por tramo — función `resolveBucket`), `collections-data.service.ts`
completo (en particular `filteredDocuments`/`scopedDocuments`/`scopedDocumentsGross`).

**Qué:**
1. `ReceivableDocument` (collections.model.ts) agrega `paidDate: string | null` — JSDoc: "`null`
   mientras el documento no esté PAGADO; para documentos PAGADO, la fecha real en que se saldó.
   Habilita reconstruir el estado del documento en cualquier fecha de corte pasada sin inventar
   datos." (Campo aditivo — no rompe nada de SP1, ya que `ReceivableDocument` no se usaba con
   objetos literales fuera del mock).
2. En `collections.mock.ts`, para cada documento que hoy es `PAGADO`, poblar `paidDate` con una
   fecha determinista entre `issueDate` y `min(dueDate ?? issueDate+30, TODAY_ISO)`, sesgada por
   `avgDaysLate` de su contraparte cuando exista (mismo generador mulberry32, sin nuevas fuentes de
   aleatoriedad). Para documentos no-PAGADO, `paidDate: null`. Actualizar/agregar tests en
   `collections.mock.spec.ts`: todo doc `PAGADO` tiene `paidDate` no-null y `paidDate <= TODAY_ISO`;
   todo doc no-PAGADO tiene `paidDate === null`; `paidDate >= issueDate`.
3. Nuevo util `collections-history.utils.ts`:
   ```ts
   export interface DocumentStateAsOf {
     status: DocumentStatus;
     daysOverdue: number;
     balance: number; // bruto (con IVA) -- el caller aplica ivaMode si corresponde
   }
   /** Reconstruye el estado de un documento a una fecha de corte arbitraria, sin inventar datos:
    * si el documento aún no existía (`issueDate > cutoffIso`) devuelve null. Si ya fue pagado
    * ANTES del corte (`paidDate !== null && paidDate <= cutoffIso`), no forma parte del saldo en
    * ese corte (fuera de alcance -- el caller debe excluirlo, no tratarlo como balance 0). Si el
    * documento todavía no se pagaba a esa fecha (paidDate === null, o paidDate > cutoffIso),
    * status/daysOverdue se recalculan contra dueDate y cutoffIso (POR_VENCER si dueDate es null o
    * >= cutoffIso; VENCIDO con daysOverdue = cutoffIso - dueDate en días si dueDate < cutoffIso).
    * balance se mantiene igual al balance actual del documento (el mock no modela pagos parciales
    * con fecha propia -- ver spec §8.D -- así que un balance con pago parcial ya aplicado se trata
    * como "así estaba" en cualquier corte anterior a que el documento se cierre del todo). */
   export function documentStateAsOf(doc: ReceivableDocument, cutoffIso: string): DocumentStateAsOf | null
   ```
4. Reescribir `CollectionsDataService.filteredDocuments()`/`scopedDocuments`/`scopedDocumentsGross`
   para usar `documentStateAsOf(doc, cutoffDate())` en vez de leer `doc.status`/`doc.balance`
   directo: un documento entra en scope solo si `documentStateAsOf(...) !== null`; el `balance`/
   `status`/`daysOverdue` expuestos son los RECONSTRUIDOS, no los crudos del mock. Esto hace que
   `scopedDocuments` sea correcto para CUALQUIER `cutoffDate`, no solo `TODAY_ISO` — arregla el gap
   que SP1 dejó documentado. Actualizar el comentario de la clase que decía "at the default cutoff
   this is exact" (ya no es una limitación).

**Acceptance:** con `cutoffDate() === TODAY_ISO`, `scopedDocuments()`/`saldoTotalFromScope()`
devuelven EXACTAMENTE lo mismo que antes de esta tarea (regresión cero — correr los tests de SP1
`collections-data.service.spec.ts`, deben seguir verdes sin tocarlos). Con un `cutoffDate` de un mes
atrás, un documento que hoy es PAGADO pero cuyo `paidDate` es posterior a ese corte aparece como
POR_VENCER o VENCIDO (según su `dueDate` contra ese corte) — nuevo test explícito.

- [ ] Tests que fallan primero (mock: paidDate; util: documentStateAsOf casos null/no-emitido/
  pagado-antes/pagado-después/vencido-recalculado; servicio: corte histórico).
- [ ] Implementar. [ ] Verde, incl. suite completa de SP1 sin regresión. Commit.

---

### Task 2: Agregación de KPIs de cartera (`collections-kpi.utils.ts`)

**Files:** Create `src/app/data/utils/collections-kpi.utils.ts` + spec. Read:
`src/app/data/utils/sales-fact.utils.ts` (`buildKpiTrendPoints`, `MIN_TREND_POINTS`, patrón de
`computeKpis`), `src/app/data/models/kpi.model.ts` (`KpiValue`/`TrendPoint`), `collections.mock.ts`
(`COLLECTION_TARGETS`, `COUNTERPARTY_BEHAVIORS`, `PERIOD_SALES_TOTAL_CLP`),
`collections-history.utils.ts` (Task 1), `collections-data.service.ts`.

**Qué:** tipos y funciones puras (sin Angular) que reciben `ReceivableDocument[]` ya escopeados +
`Period[]` + `cutoffDate` y devuelven un `CollectionsKpiSet`:
```ts
export interface CollectionsKpiSet {
  saldoPorCobrar: KpiValue;       // monto, deltaUnit 'pct', higher-good (más saldo no es "malo" en sí, pero el signo del badge sigue la convención de monto)
  porcentajeVencido: KpiValue;    // %, deltaUnit 'pp', lower-good
  dso: KpiValue;                  // días, deltaUnit 'dias', lower-good, sensibilidad alta
  cei: KpiValue;                  // %, deltaUnit 'pp', higher-good
  recuperado: KpiValue;           // monto, deltaUnit 'pct', higher-good
}
```
- `saldoPorCobrar`: `current` = suma de `balance` de documentos en scope al corte activo (ya lo
  computa `saldoTotalFromScope` de SP1/Task1 — reusar); `previous` = mismo cálculo reconstruido al
  "corte anterior equivalente" (mismo día del mes anterior si granularidad mes; ver
  `comparisonAlignment`/`comparisonMode` — para SP2 alcanza con "mismo día calendario del periodo
  anterior de la granularidad activa", análogo a como Ventas resuelve `previousPeriodWindow`, pero
  aplicado a una FECHA no a un periodo — restar 1 mes/semana/día a `cutoffDate` según granularidad).
  `trend`: usar `documentStateAsOf` para reconstruir el saldo en los cortes trailing (hasta 12,
  mínimo 3 para dibujar, mismo criterio `MIN_TREND_POINTS`/`MAX_TRAILING_TREND_POINTS` que Ventas —
  puede vivir como constantes propias re-declaradas acá, no importar las privadas de
  sales-fact.utils.ts).
- `porcentajeVencido`: `current` = (suma balance VENCIDO / suma balance total) × 100 sobre los
  documentos reconstruidos al corte; análogo para `previous`/`trend`.
- `dso`: `DSO = (saldoPorCobrar.current / ventas_a_credito_del_periodo) × días_del_periodo`. Usar
  `PERIOD_SALES_TOTAL_CLP` sumado sobre `selectedPeriodIds` como proxy de "ventas a crédito del
  periodo" (documentar la simplificación: el mock no distingue venta a crédito de venta al contado
  por separado, así que se usa el total de venta del periodo, igual que hace el puente §4.2).
  `días_del_periodo` = suma de días calendario de los periodos seleccionados
  (`endDate - startDate + 1` por periodo, sumado).
- `cei`: fórmula del spec §4.1 Card 4, usando `saldoPorCobrar` al inicio/fin del periodo (corte =
  inicio y fin del rango de periodos seleccionado) + ventas a crédito del periodo
  (`PERIOD_SALES_TOTAL_CLP`) + "cartera final corriente" (documentos NO vencidos al fin del
  periodo). Documentar la fórmula exacta en un comentario con la referencia al spec.
- `recuperado`: suma de `appliedAmount` de documentos cuyo `paidDate` cae dentro del rango de
  periodos seleccionados (usar `paidDate` de Task 1 — esto es exactamente lo que faltaba sin ese
  campo). Documentos parcialmente pagados pero aún abiertos NO aportan a este KPI (spec §8.D: sin
  fecha de pago parcial individual, no se puede atribuir a un periodo — documentarlo).
- Exportar también `ceiBand(cei: number): ComparisonBand` (semáforo propio: `>=90` good,
  `80-90` medium, `<80` bad — spec §4.1) como función pura separada (NO tocar
  `comparisonBand`/`cumplimientoBand` de `signed-amount.ts`, que son de Ventas/genéricos).

**Acceptance (TDD):** tests con documentos mock reales bajo el default: `saldoPorCobrar.current`
coincide con `saldoTotalFromScope()`; `porcentajeVencido.current` entre 0-100 y coincide con
suma-vencido/suma-total calculada a mano en el test; `recuperado.current > 0` bajo el default
(hay documentos PAGADO con `paidDate` en el rango default); `ceiBand(95)==='good'`,
`ceiBand(85)==='medium'`, `ceiBand(70)==='bad'`.

- [ ] Tests que fallan. [ ] Implementar. [ ] Verde. Commit.

---

### Task 3: Extender `CollectionsDataService` con `kpis` público

**Files:** Modify `src/app/services/collections-data.service.ts` + spec.

**Qué:** `CollectionsDashboardData` (privado) suma un campo `kpis: CollectionsKpiSet` (Task 2),
calculado dentro de `computeCollectionsData()` junto a `saldoTotal` (que puede quedarse o derivarse
de `kpis.saldoPorCobrar.current` — mantener back-compat con lo que ya consume `collections-footer`/
tests de SP1 si algo lee `saldoTotal` directo). Exponer `readonly kpis = computed(() =>
this.dashboardData().kpis)`.

**Acceptance:** `service.kpis().saldoPorCobrar.current` definido tras el delay de 400ms; ningún
test de SP1 se rompe (`saldoTotalFromScope`/`saldoTotal` siguen funcionando igual).

- [ ] Test que falla (`kpis()` expone las 5 métricas). [ ] Implementar. [ ] Verde. Commit.

---

### Task 4: Grilla de 5 KPI cards de Cobranzas

**Files:** Create `src/app/pages/cobranzas-general/collections-kpi-cards-grid/collections-kpi-cards-grid.ts`
+`.html`+`.css`+spec. Read: `src/app/pages/ventas-general/kpi-cards-grid/kpi-cards-grid.ts`+`.html`+`.css`
(patrón EXACTO a mirror — 6 cards ahí, acá van 5), `src/app/components/shared/kpi-card/kpi-card.ts`
(inputs `deltaUnit`/`deltaDirection`/`deltaSensitivityPct` ya extendidos en SP1 Task 3 — usarlos acá
por primera vez con valores no-default), `src/app/data/mock/collections.mock.ts`
(`COLLECTION_TARGETS` para el semáforo de meta).

**Qué:** 5 `<app-kpi-card>`: **Saldo por Cobrar** (deltaUnit 'pct', higher-good, sin meta — spec
dice "Sin meta asociada"), **% Vencido** (deltaUnit 'pp', lower-good, semáforo graduado contra
`overdueRatioTarget` de `COLLECTION_TARGETS` si existe), **DSO** (deltaUnit 'dias', lower-good,
`deltaSensitivityPct` alto p.ej. 5, semáforo contra `dsoTarget`), **CEI** (deltaUnit 'pp',
higher-good, semáforo vía `ceiBand` de Task 2 — NO `cumplimientoBand`, ya que CEI tiene sus propios
cortes 90/80 fijos por spec, no una meta configurable genérica), **Recuperado en el Periodo**
(deltaUnit 'pct', higher-good, sin meta). **Regla no-negociable:** DSO y CEI SIEMPRE se muestran
juntos — si en el futuro se oculta una franja, se quitan o mantienen ambas cards juntas (dejar un
comentario marcando esto, no hace falta lógica extra en SP2 ya que las 5 siempre se muestran).
Reusar `formatSignedAmount`/`INT_FORMATTER` como hace Ventas.

**Acceptance:** las 5 cards renderizan con datos del mock bajo el default (sin infinitos/NaN);
%Vencido con delta positivo (empeoró) se ve en rojo (lower-good); DSO con una mejora chica no se
colorea (sensibilidad); responsive 2-col a ≤900px (mismo patrón `kpi-cards-grid.css`).

- [ ] Implementar (spec liviano: existencia de 5 cards + valores no vacíos). [ ] Build; test;
  screenshot desktop+mobile. Commit.

---

### Task 5: Puente Venta → Caja

**Files:** Create `src/app/pages/cobranzas-general/venta-caja-bridge/venta-caja-bridge.ts`+`.html`+`.css`
+spec, `src/app/data/utils/venta-caja-bridge.utils.ts`+spec. Read: spec §4.2 y §10.3 (forma del JSON
de referencia), `src/app/data/mock/collections.mock.ts` (`PERIOD_SALES_TOTAL_CLP`),
`collections-history.utils.ts`, `collections-kpi.utils.ts` (para reusar el criterio de `recuperado`),
`src/app/pages/ventas-general/ranking-panels/ranking-panel/ranking-panel.ts` (patrón de barra
proporcional + cross-filter al clic, para calcar la interacción), `signed-amount.ts`
(`formatSignedAmount` para el segmento de notas de crédito en rojo/paréntesis).

**Qué:** util `buildVentaCajaBridge(documents, periodSalesTotal, selectedPeriodIds): { totalSales,
segments: {key,label,amount,ratio}[] }` con 4 segmentos: `COLLECTED` (suma `appliedAmount` de
documentos PAGADO con `paidDate` en el rango de periodos — mismo criterio que `recuperado` de Task
2, reusar), `UPCOMING` (suma `balance` de documentos cuyo `issueDate` cae en el rango de periodos Y
están POR_VENCER al corte), `OVERDUE` (ídem pero VENCIDO), `CREDIT_NOTE` (suma negativa de
`creditNoteAmount` de documentos emitidos en el rango). **Este componente opera sobre periodo de
EMISIÓN (`issueDate` dentro de periodos seleccionados), no sobre `cutoffDate`** — spec §4.2, rotular
explícitamente. `totalSales` = suma de `PERIOD_SALES_TOTAL_CLP[periodId]` sobre los periodos
seleccionados — **debe cuadrar exactamente con la suma de segmentos positivos menos notas de
crédito** (test obligatorio, no aspiracional).

Componente: gráfico de cascada horizontal (barras apiladas proporcionales, `div`s con `width:
calc()`, no una librería de charts — mismo enfoque liviano que `ranking-panel`'s mini-barra).
**Mejora #1 (aprobada):** titular grande "{ratio COLLECTED}% de lo vendido ya es caja" + su propia
variación vs. periodo anterior (mismo ratio calculado para el periodo de comparación), ANTES del
desglose de 4 segmentos. Cada segmento clickeable → `collectionsData.setCrossFilter('bridge-'+key,
key)` (dimension string libre, no toca `RankingDimension`). Notas de crédito con formato negativo
(`formatSignedAmount`, rojo/paréntesis). Enlace bidireccional a/desde Ventas: un `routerLink="/"`
(o el que corresponda) con un texto tipo "Ver en Ventas General" — placeholder de navegación real
(sin preservar querystring de filtros en SP2, dejar comentado como follow-up si se complica).

**Acceptance (TDD, caso de prueba obligatorio):** test que arma un escenario con datos mock reales
donde `segments.reduce(sum positivos) - creditNoteAmount === totalSales` (dentro de tolerancia de
redondeo 0); test de que `totalSales` bajo el periodo default coincide EXACTAMENTE con lo que
`PERIOD_SALES_TOTAL_CLP` reporta para esos periodos (ya testeado en SP1 como derivado de
`SALES_FACTS` — este test cierra el círculo confirmando que el puente lee la misma fuente).

- [ ] Tests que fallan (cuadre exacto + segmentos). [ ] Implementar util. [ ] Implementar
  componente. [ ] Build; test; screenshot. Commit.

---

### Task 6: Antigüedad de Cartera

**Files:** Create `src/app/pages/cobranzas-general/aging-chart/aging-chart.ts`+`.html`+`.css`+spec,
`src/app/data/utils/collections-aging.utils.ts`+spec. Read: spec §4.3 y §10.1 (forma del JSON de
referencia, tramos), `collections-history.utils.ts` (Task 1 — usar `documentStateAsOf` al corte
activo para status/daysOverdue reconstruidos), `src/app/pages/ventas-general/hourly-sales-chart/
sales-heatmap/sales-heatmap.ts` (para el patrón de tramos/leyenda si sirve de referencia visual, NO
para copiar heatmap — es un gráfico de barras, no un mapa de calor).

**Qué:** util `buildAgingBuckets(documents, cutoffDate, bucketConfig?): { buckets: {key, label,
overdue: boolean|null, amount, documentCount, counterpartyCount}[] }`. Tramos default (spec §10.1):
`POR_VENCER_0_30`, `POR_VENCER_30_PLUS` (overdue:false), `VENCIDO_1_30`..`VENCIDO_90_PLUS`
(overdue:true), `NO_DUE_DATE` (overdue:null, `dueDate === null`). Cortes parametrizables vía un
`bucketConfig` opcional (default 30/60/90) — no hace falta UI de configuración en SP2, solo que la
función acepte el parámetro (spec: "cortes parametrizables por tenant" — dejar el gancho).

Componente: barras verticales agrupadas en 2 clusters visuales — **Por Vencer** (paleta azul/verde,
p.ej. `var(--dash-blue)`/`var(--dash-indigo)`) separado por un **divisor explícito** (borde o
gap+línea) de **Vencido** (paleta roja/coral, `var(--dash-coral)` en intensidad creciente), más una
nota aparte "Sin vencimiento definido: $X" fuera de ambos clusters (spec: NO es una escala continua
— familias de color distintas, no gradiente). Hover: monto, cantidad de documentos, % de la cartera
total, cantidad de contrapartes (los 4 campos que ya trae `buildAgingBuckets`). Cada barra
clickeable → cross-filter (`collectionsData.setCrossFilter('aging-bucket', bucketKey)`).

**Acceptance:** suma de `amount` de todos los buckets === `saldoTotalFromScope()` bajo el mismo
scope (mismo principio de cuadre que el resto de la pantalla); tramo `NO_DUE_DATE` no vacío en el
mock (SP1 garantizó ≥1 doc sin `dueDate`); overdue:false y overdue:true nunca comparten paleta de
color en el CSS (revisar visualmente).

- [ ] Tests que fallan (cuadre de suma + presencia de NO_DUE_DATE). [ ] Implementar util.
  [ ] Implementar componente. [ ] Build; test; screenshot con divisor/colores distintos. Commit.

---

### Task 7: Composición de la página — reemplazar el placeholder

**Files:** Modify `src/app/pages/cobranzas-general/cobranzas-general.ts`+`.html`+`.css`. Read: el
archivo actual completo (placeholder de SP1 T9), `src/app/pages/ventas-general/ventas-general.html`
(orden de composición: KPIs → fila chart+sidebar → rankings — acá: KPIs → Puente → Antigüedad,
según el orden de preguntas del spec §1).

**Qué:** quitar el `p-card` "Próximamente"; componer `<app-collections-kpi-cards-grid />`,
`<app-venta-caja-bridge />`, `<app-aging-chart />` dentro de `.page-body`, en ese orden (replica la
jerarquía de prioridad del spec: saldo/riesgo primero, luego puente, luego antigüedad). Mantener el
`@if (collectionsData.loading())` skeleton y el footer intactos.

**Acceptance:** `/cobranzas` muestra las 5 KPIs, el puente y la antigüedad con datos reales del mock;
responsive en mobile (scroll vertical normal, sin overflow horizontal); `Detalle de Cartera` sigue
con su propio placeholder (no tocado en este plan).

- [ ] Implementar. [ ] Build; test; screenshot desktop+mobile de `/cobranzas` completo. Commit.

---

## Self-review (post-plan)

- Cobertura: 5 KPIs (con pp/días/dirección/semáforo correctos por métrica), Puente (cuadre exacto +
  mejora #1), Antigüedad (divisor+colores+parametrizable+NO_DUE_DATE) — coincide con spec §4.1-4.3
  + mejora aprobada #1. Proyección/Concentración quedan para SP3 (ya decidido).
- Decisión de arquitectura explícita y justificada (Task 1: `paidDate` + `documentStateAsOf`) para
  no fabricar datos donde el mock de SP1 era insuficiente — mismo principio "ante datos
  insuficientes, texto explícito" ya aplicado en sparklines/proyección.
- Ningún archivo de Ventas tocado en ninguna tarea.
- Todas las tareas nombran archivos exactos, contratos de tipos y criterios de aceptación
  verificables (incluyendo los 2 casos de "cuadre exacto" no negociables del spec).
