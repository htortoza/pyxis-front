# Cobranzas — SP3: Cobranzas General (parte inteligente) — Plan de Implementación

> **Para el worker:** implementá tarea por tarea, en orden (cada una depende de la anterior salvo
> que se indique lo contrario). Leé los archivos de referencia nombrados ANTES de escribir código.
> Cada tarea termina con typecheck + build + tests verdes y un commit. Diseño canónico:
> `docs/superpowers/specs/2026-07-26-cobranzas-frontend-design.md`. SP1 (Cimientos) y SP2 (Cobranzas
> General, parte alta) ya construidos y desplegados — ver
> `docs/superpowers/plans/2026-07-26-cobranzas-1-cimientos.md` y
> `docs/superpowers/plans/2026-07-27-cobranzas-2-general-parte-alta.md`.

**Objetivo:** completar `/cobranzas` (Cobranzas General) con los 2 componentes restantes de la
pantalla: **Proyección de Recaudación** (§4.4 del spec funcional) y **Concentración de Cartera**
(§4.5). Con esto, Cobranzas General queda 100% completa; Detalle de Cartera (SP4) sigue aparte.

## Global Constraints (aplican a TODA tarea — idénticas a SP1/SP2, repetidas por completitud)

- Angular 21 **zoneless + signals**; componentes `standalone`, `ChangeDetectionStrategy.OnPush`,
  `inject()`, `input()/output()/model()`, control-flow `@if/@for/@switch`.
- PrimeNG 21; consultar el MCP `@primeng/mcp` antes de un componente nuevo.
- CSS: solo tokens `var(--p-…)`/`var(--dash-…)`; sin utilitarias inventadas; budget ≤24kB
  warn/48kB error por componente. Breakpoint móvil **900px**. Nunca truncar números/títulos.
- Mock determinista: prohibido `Date.now()`/`new Date()` argless/`Math.random()`.
- **Ventas no debe cambiar su comportamiento.** No tocar `SalesDataService`, `kpi-cards-grid`,
  `ranking-panels`, `hourly-sales-chart`, ni ningún archivo de `pages/ventas-general` o
  `pages/detalle-ventas`.
- **`periods.mock.ts`/`PERIODS_BY_GRANULARITY` NO se tocan en este plan** (ver Task 1: la
  Proyección genera sus propios periodos futuros de forma autocontenida, sin depender de ni
  modificar el calendario compartido — evita cualquier riesgo de regresión en Ventas, que depende
  fuertemente de ese archivo).
- Comandos de verificación: `npx tsc --noEmit -p tsconfig.app.json`, `npx ng build`,
  `npx ng test --watch=false`. Correr 2 veces seguidas para confirmar estabilidad (se ha visto
  caché del test runner entre invocaciones consecutivas en tareas anteriores de este proyecto).
  Baseline: 1 fallo preexistente no relacionado (`app.spec.ts` "should render title",
  `ActivatedRoute`) — no cuenta como regresión.
- Formato de importes negativos: entre paréntesis, sin signo, rojo suave (`formatSignedAmount`).
- **Trampa del IVA (crítica en este plan):** la Proyección de Recaudación SIEMPRE opera sobre monto
  BRUTO (con IVA), sin importar el toggle Con/Sin IVA de la pantalla — usar
  `CollectionsDataService.scopedDocumentsGross` (ya existe desde SP1), nunca `scopedDocuments`. Si
  el toggle está en "Sin IVA", el componente lo indica visiblemente (texto tipo "Proyección en
  monto bruto (incluye IVA), independiente del toggle activo"). Concentración de Cartera, en
  cambio, SÍ respeta `ivaMode` (usa `scopedDocuments`, igual que el resto de la pantalla).
- **Degradación por falta de historial (política única, misma que sparklines <3 puntos, ya
  enunciada en SP1/SP2):** ante datos insuficientes, texto explícito antes que visualización
  engañosa. Nunca rellenar con promedio global ni dibujar una serie parcial que el usuario lea
  como completa.
- **Casos de borde no-negociables del spec (§8), relevantes a este plan:**
  - **Sobrepago** (`balance < 0`): esos documentos NO entran en la Proyección (ni en backlog ni en
    periodos futuros) — ya se muestran en KPIs/Antigüedad tal como quedaron en SP1/SP2 (fuera de
    alcance de este plan tocar eso), pero la Proyección los excluye explícitamente.
  - **Documentos sin `dueDate`:** excluidos de la Proyección, monto excluido declarado visible.
    Nunca se asume una fecha de vencimiento por defecto.
  - **Backlog vencido no se proyecta:** columna separada, antes del eje temporal, visualmente
    desconectada de las barras futuras.
  - **Mora negativa** (`avgDaysLate < 0`): la serie ajustada se adelanta respecto a la contractual;
    se representa tal cual, nunca se trunca a 0.

---

### Task 1: Utilidad pura de Proyección de Recaudación (`collections-projection.utils.ts`)

**Files:** Create `src/app/data/utils/collections-projection.utils.ts` + spec. Read:
`src/app/data/models/collections.model.ts` (`ReceivableDocument`, `CounterpartyBehavior`),
`src/app/data/utils/collections-history.utils.ts` (`documentStateAsOf`), `src/app/data/utils/date.utils.ts`
(`addDaysIso`, `daysBetweenIso`), `src/app/services/collections-data.service.ts`
(`scopedDocumentsGross`, ya existe — este util NO se llama todavía desde el servicio en esta tarea,
eso es Task 2).

**Por qué un generador de periodos propio, no `PERIODS_BY_GRANULARITY`:** ese calendario es
compartido con Ventas (`periods.mock.ts`, rango fijo 2024-01-01..2026-12-31) y tocarlo para
garantizar suficientes meses futuros más allá de `TODAY_ISO` arriesga romper algo que Ventas ya
depende de forma pesada. La Proyección necesita periodos **hacia adelante desde un `cutoffIso`
arbitrario** (no calendario fijo) — un concepto distinto a "periodo seleccionable en el picker".
Se genera un array de "buckets" futuros autocontenido, sin tocar `periods.mock.ts`.

**Qué:**

1. Tipos y constantes:
   ```ts
   export type ProjectionGranularity = 'semana' | 'mes';

   export interface ProjectionBucket {
     /** ISO, primer día del bucket (inclusive). */
     startDate: string;
     /** ISO, último día del bucket (inclusive). */
     endDate: string;
     /** "S1".."S13" para semanas; "Agosto"/"Septiembre"/... para meses. */
     label: string;
     contractual: number;
     adjusted: number;
   }

   export interface RecaudacionProjection {
     cutoffIso: string;
     granularity: ProjectionGranularity;
     /** Monto bruto de documentos VENCIDO al corte -- no se proyecta, columna separada. */
     backlogOverdue: number;
     /** Monto bruto de documentos POR_VENCER sin `dueDate` -- excluidos, declarado visible. */
     excludedNoDueDate: number;
     /** Proporción del monto proyectado cuya contraparte tiene historial suficiente
      * (`closedDocumentCount >= MIN_CLOSED_DOCS_FOR_ADJUSTED`) para el ajuste por comportamiento.
      * Ver `adjustedSeriesAvailable`. */
     adjustedCoverageRatio: number;
     /** `false` cuando `adjustedCoverageRatio < ADJUSTED_COVERAGE_RATIO_THRESHOLD` -- el caller
      * NUNCA dibuja `bucket.adjusted` en ese caso (aunque el número siga viniendo calculado acá
      * adentro con lo poco que hay, por eso `adjusted` no es null en `ProjectionBucket` -- la
      * decisión de mostrarlo u ocultarlo es pura responsabilidad del componente, leyendo este
      * flag; el util nunca "miente" ocultando el número él mismo, pero tampoco lo recomienda). */
     adjustedSeriesAvailable: boolean;
     buckets: ProjectionBucket[];
   }

   /** Mínimo de documentos cerrados para que `avgDaysLate` de una contraparte sea estadísticamente
    * publicable -- mismo umbral (~6) que ya usa el generador del mock (`closedDocCountFor`,
    * `collections.mock.ts`) para decidir qué contrapartes caen "naturalmente" bajo el mínimo. */
   export const MIN_CLOSED_DOCS_FOR_ADJUSTED = 6;

   /** Umbral de `adjustedCoverageRatio` bajo el cual se suprime la serie ajustada COMPLETA (spec
    * §4.4: "si la cobertura ... cae bajo un umbral configurable"). Sin UI de configuración por
    * tenant en SP3 -- constante, mismo patrón de "gancho parametrizable" que
    * `AgingBucketConfig` en SP2 Task 6. */
   export const ADJUSTED_COVERAGE_RATIO_THRESHOLD = 0.7;

   export const HORIZON_WEEKS = 13;
   export const HORIZON_MONTHS = 6;
   ```

2. Generador de buckets futuros (privado, sin exportar):
   ```ts
   function buildWeekBuckets(cutoffIso: string, count: number): Array<{ startDate: string; endDate: string; label: string }> {
     const buckets = [];
     let cursor = addDaysIso(cutoffIso, 1); // el bucket 1 arranca el día siguiente al corte
     for (let i = 1; i <= count; i++) {
       const endDate = addDaysIso(cursor, 6);
       buckets.push({ startDate: cursor, endDate, label: `S${i}` });
       cursor = addDaysIso(cursor, 7);
     }
     return buckets;
   }
   ```
   Para meses: 6 buckets, cada uno un mes calendario COMPLETO, empezando por el mes calendario
   INMEDIATAMENTE siguiente al mes de `cutoffIso` (nunca un mes parcial). P.ej. corte 25 de julio →
   bucket 1 = Agosto completo (01-08 al 31-08), bucket 2 = Septiembre, ..., bucket 6 = Enero.
   Etiqueta: nombre del mes en español, capitalizado (`'Agosto'`, `'Septiembre'`, ...) -- podés
   reusar el array `MONTH_LABELS_ES` de `periods.mock.ts` **solo como referencia de los 12 nombres
   a copiar como constante local** (NO importar `periods.mock.ts` en este archivo — mantener el
   util 100% autocontenido, sin dependencia del calendario compartido). Usá `addDaysIso`/aritmética
   manual de año/mes (sin `Date` nativo) para calcular el primer/último día de cada mes siguiente
   (mismo patrón `daysInMonth` que ya existe en `date.utils.ts` -- import reusable, es un util
   genérico de calendario, no específico de `periods.mock.ts`).

3. Función pública principal:
   ```ts
   export function buildRecaudacionProjection(
     documentsGross: ReceivableDocument[], // scopedDocumentsGross del servicio -- YA cutoff-filtrado, YA dimension-scoped, SIEMPRE bruto
     cutoffIso: string,
     granularity: ProjectionGranularity,
     behaviors: CounterpartyBehavior[],
   ): RecaudacionProjection
   ```
   Algoritmo:
   - `behaviorByCounterparty = new Map(behaviors.map(b => [b.counterpartyId, b]))`.
   - Generar los N buckets vacíos (13 si `granularity==='semana'`, 6 si `'mes'`), cada uno con
     `contractual: 0, adjusted: 0`.
   - `backlogOverdue = 0`, `excludedNoDueDate = 0`, `projectedGrossTotal = 0` (denominador de
     `adjustedCoverageRatio`), `coveredGrossTotal = 0` (numerador).
   - Para cada `doc` en `documentsGross`:
     - Si `doc.balance <= 0` → **skip completo** (sobrepago, spec §8.A: "no entra en la
       proyección" -- ni backlog ni buckets ni excluido).
     - Si `doc.status === 'VENCIDO'` → `backlogOverdue += doc.balance`; continue (no se proyecta).
     - (acá `doc.status === 'POR_VENCER'`, por construcción de `scopedDocumentsGross`, que solo
       contiene documentos con `documentStateAsOf(...) !== null`, o sea abiertos al corte).
     - Si `doc.dueDate === null` → `excludedNoDueDate += doc.balance`; continue.
     - `projectedGrossTotal += doc.balance`.
     - **Contractual:** encontrar el bucket cuyo `[startDate, endDate]` contiene `doc.dueDate`
       (`doc.dueDate >= bucket.startDate && doc.dueDate <= bucket.endDate`). Si ninguno lo
       contiene (fuera de horizonte -- p.ej. `dueDate` muy lejano), usar el ÚLTIMO bucket como
       clamp (documentar esto como simplificación deliberada: "fuera del horizonte visible, se
       agrupa en el último tramo en vez de desaparecer silenciosamente" -- mismo espíritu que
       "nunca ocultar en silencio" del resto del spec). Si `doc.dueDate < primer bucket.startDate`
       (no debería pasar nunca: `doc.status==='POR_VENCER'` implica `dueDate >= cutoffIso`, y el
       primer bucket empieza en `cutoffIso+1` -- un `dueDate === cutoffIso` exacto cae ANTES del
       primer bucket por 1 día; clampeá también ese caso al PRIMER bucket). Sumar `doc.balance` a
       `bucket.contractual`.
     - **Ajustada:** buscar `behaviorByCounterparty.get(doc.counterpartyId)`. Si no existe, o
       `behavior.closedDocumentCount < MIN_CLOSED_DOCS_FOR_ADJUSTED` → este documento NO aporta a
       ningún `bucket.adjusted` (degradación por-documento; sigue aportando a `contractual`
       arriba). Si sí existe y tiene historial suficiente: `coveredGrossTotal += doc.balance`;
       calcular `adjustedDueIso = addDaysIso(doc.dueDate, Math.round(behavior.avgDaysLate))`
       (`avgDaysLate` puede ser negativo -- spec §8.F, no truncar a 0); encontrar el bucket que
       contiene `adjustedDueIso` con el MISMO criterio de búsqueda/clamp que contractual (incluido
       el clamp hacia el PRIMER bucket si `adjustedDueIso` cae antes del horizonte -- un cliente
       que paga muy anticipado igual debe verse en la primera barra visible, no desaparecer).
       Sumar `doc.balance` a `bucket.adjusted`.
   - `adjustedCoverageRatio = projectedGrossTotal === 0 ? 1 : coveredGrossTotal / projectedGrossTotal`
     (convención: sin nada que proyectar, cobertura "completa" vacuamente -- evita `0/0`).
   - `adjustedSeriesAvailable = adjustedCoverageRatio >= ADJUSTED_COVERAGE_RATIO_THRESHOLD`.
   - Devolver `{ cutoffIso, granularity, backlogOverdue, excludedNoDueDate, adjustedCoverageRatio, adjustedSeriesAvailable, buckets }`.

**Acceptance (TDD):**
- Con datos mock reales (`RECEIVABLE_DOCUMENTS` filtrados a mano por `documentStateAsOf` al
  `TODAY_ISO` default, replicando lo que `scopedDocumentsGross` produciría bajo el scope default —
  podés instanciar `CollectionsDataService` vía `TestBed` para obtener el array real en vez de
  reconstruirlo a mano): `backlogOverdue + excludedNoDueDate + suma-de-contractual-de-todos-los-buckets`
  debe ser `<=` a la suma de `balance` de documentos POR_VENCER/VENCIDO en scope con `balance > 0`
  (igualdad exacta salvo el caso de clamp fuera-de-horizonte, que no debería activarse bajo el
  horizonte de 13 semanas con los datos default — test que además verifica que NO se activó el
  clamp en el caso default, confirmando igualdad exacta ahí).
- Test de degradación: armá 2-3 documentos a mano con contrapartes SIN entrada en `behaviors` (o
  con `closedDocumentCount` bajo el mínimo) — confirmá que sí aportan a `contractual` pero NO a
  ningún `adjusted`, y que `adjustedCoverageRatio` refleja la proporción correcta.
- Test de `adjustedSeriesAvailable`: un escenario con cobertura por debajo de
  `ADJUSTED_COVERAGE_RATIO_THRESHOLD` da `false`; uno con cobertura alta da `true`.
- Test de mora negativa (§8.F): contraparte con `avgDaysLate: -10` en un documento con
  `dueDate` conocido — el bucket ajustado correspondiente es ANTERIOR (o igual, si cae en el mismo
  bucket) al bucket contractual para ese mismo documento, nunca posterior, y el monto no se trunca.
- Test de buckets: `granularity: 'semana'` devuelve 13 buckets etiquetados `S1`..`S13`,
  consecutivos sin huecos (`bucket[i].endDate + 1 día === bucket[i+1].startDate`);
  `granularity: 'mes'` devuelve 6 buckets con nombres de mes correctos y consecutivos, empezando
  en el mes calendario siguiente al de `cutoffIso` (nunca un mes parcial).
- Test de sobrepago (§8.A): un documento con `balance < 0` armado a mano no aporta a
  `backlogOverdue`, `excludedNoDueDate`, ni ningún bucket.

- [ ] Tests que fallan primero. [ ] Implementar. [ ] Verde, suite completa sin regresión. Commit.

---

### Task 2: Utilidad pura de Concentración de Cartera (`collections-concentration.utils.ts`)

**Files:** Create `src/app/data/utils/collections-concentration.utils.ts` + spec. Read:
`src/app/data/models/collections.model.ts` (`Counterparty`, `CounterpartyBehavior`,
`ReceivableDocument`), `src/app/data/mock/collections.mock.ts` (`COUNTERPARTIES`,
`COUNTERPARTY_BEHAVIORS`), `src/app/pages/ventas-general/ranking-panels/ranking-panel/ranking-panel.ts`
(patrón `pctAbove`/`comparisonTooltip` a replicar, NO importar de ahí -- `RankingItem`/
`RankingDimension` son tipos de Ventas, ver [[feedback-backend-contract-is-fixed]], esta tarea
redeclara su propio tipo `ConcentrationRow` independiente).

**Qué:**

```ts
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

export function buildConcentrationRows(
  documents: ReceivableDocument[], // scopedDocuments del servicio (SÍ respeta ivaMode, a diferencia de Proyección)
  counterparties: Counterparty[],
  behaviors: CounterpartyBehavior[],
  sortMode: ConcentrationSortMode,
): ConcentrationResult
```

Algoritmo:
- Agrupar `documents` por `counterpartyId`: `saldo = suma balance`, `saldoVencido = suma balance
  donde status==='VENCIDO'`. Solo contrapartes con AL MENOS 1 documento en `documents` generan una
  fila (una contraparte sin cartera en el scope activo no aparece en la lista).
- `utilizacionPct`: buscar la `Counterparty` por id en `counterparties`; si `creditLimit === null`
  → `null`; si no, `saldo / creditLimit` (puede superar 1 -- sobre-límite es un estado real, no se
  clampea a 1).
- `avgDaysLate`: buscar en `behaviors`; `null` si no existe entrada.
- Label: `counterparties.find(...)?.label ?? 'Contraparte no mapeada'` (spec §8.C -- documentos que
  apuntan a una contraparte no mapeada se agrupan bajo esa etiqueta visible, nunca se descartan;
  usar `UNMAPPED_COUNTERPARTY_ID`/lo que ya exista del mock de SP1 para ese caso, si aplica -- leé
  `collections.mock.ts` para confirmar cómo SP1 ya maneja este caso antes de reinventar el patrón).
- Orden: `'saldo'` desc por `saldo`; `'saldoVencido'` desc por `saldoVencido`; `'utilizacion'` desc
  por `utilizacionPct`, con las filas de `utilizacionPct === null` SIEMPRE al final (nunca
  intercaladas), conservando entre ellas el orden por `saldo` desc como criterio secundario.
- `highestRisk`: filtrar filas con `utilizacionPct !== null && utilizacionPct > 1 &&
  avgDaysLate !== null && avgDaysLate > 0`; de esas, la de mayor `saldo`; `null` si el filtro da
  vacío.

**Acceptance (TDD):**
- Con datos mock reales bajo el scope default: `rows.length` coincide con la cantidad de
  contrapartes DISTINTAS presentes en `documents` (ninguna de más, ninguna de menos).
- Suma de `saldo` de todas las filas === suma de `balance` de `documents` (mismo principio de
  cuadre que el resto de la pantalla).
- Test de ordenamiento: los 3 `sortMode` producen listas correctamente ordenadas (verificar
  monotonía descendente en el campo correspondiente); `'utilizacion'` empuja las filas
  `utilizacionPct: null` al final, verificado con un escenario armado a mano con 2-3 contrapartes
  donde una tiene `creditLimit: null`.
- Test de `highestRisk`: escenario armado a mano con 3 contrapartes (una sobre-límite y con mora
  positiva pero saldo bajo; otra sobre-límite y mora positiva con saldo alto; otra con saldo aún
  más alto pero SIN mora o SIN sobre-límite) -- confirmá que gana la de mayor saldo ENTRE las que
  cumplen las 3 condiciones, no la de saldo absoluto más alto de todas.
- Test de `highestRisk: null` cuando ninguna contraparte cumple las 3 condiciones simultáneamente.
- Test de contraparte no mapeada (§8.C): un documento con un `counterpartyId` que no existe en
  `counterparties` genera una fila con label "Contraparte no mapeada" (o el patrón exacto que ya
  use SP1 -- confirmalo leyendo el mock antes de escribir este test).

- [ ] Tests que fallan. [ ] Implementar. [ ] Verde. Commit.

---

### Task 3: Componente Proyección de Recaudación

**Files:** Create `src/app/pages/cobranzas-general/recaudacion-projection/recaudacion-projection.ts`
+`.html`+`.css`+spec. Read: spec funcional §4.4 (backlog no se proyecta, degradación, monto
excluido, mejora #2), `src/app/data/utils/collections-projection.utils.ts` (Task 1),
`src/app/services/collections-data.service.ts` (`scopedDocumentsGross`, `cutoffDate`, `ivaMode`),
`src/app/data/mock/collections.mock.ts` (`COUNTERPARTY_BEHAVIORS`), `src/app/pipes/signed-amount.ts`
(`formatSignedAmount`).

**Qué:** selector `app-recaudacion-projection`, standalone, `ChangeDetectionStrategy.OnPush`,
`inject(CollectionsDataService)`. Sin wiring nuevo de servicio -- consume `scopedDocumentsGross()`/
`cutoffDate()`/`ivaMode()` directo, con un `horizonMode` signal LOCAL al componente (`signal<'13_semanas'|'6_meses'>('13_semanas')`,
no persiste en `DefaultCollectionsFilterView`, se resetea en cada carga de página -- mismo criterio
que otros toggles de vista puramente visuales en Detalle de Ventas).

```ts
protected readonly horizonMode = signal<'13_semanas' | '6_meses'>('13_semanas');
protected readonly projection = computed(() =>
  buildRecaudacionProjection(
    this.collectionsData.scopedDocumentsGross(),
    this.collectionsData.cutoffDate(),
    this.horizonMode() === '13_semanas' ? 'semana' : 'mes',
    COUNTERPARTY_BEHAVIORS,
  ),
);
```

**Mejora #2 (aprobada, no opcional):** titular con la brecha explícita ANTES del gráfico --
"el comportamiento real corre tu caja ~N semanas/meses y ~$X vs. lo pactado". Calculá esto
comparando, bucket a bucket, en qué punto la suma ACUMULADA de `contractual` alcanza el 50% del
total contractual proyectado, contra en qué punto la suma acumulada de `adjusted` alcanza ese mismo
50% -- la diferencia en cantidad de buckets es el "~N semanas/meses" corrido, y la diferencia entre
`contractual` acumulado y `adjusted` acumulado EN el bucket donde contractual llega al 50% es el
"~$X" de brecha en ese punto. (Si `adjustedSeriesAvailable` es `false`, el titular de brecha NO se
muestra -- no hay con qué comparar; mostrar en su lugar el placeholder de degradación, ver abajo).
Documentá la fórmula exacta elegida con un comentario que referencie esta sección del plan.

**Estructura visual:**
1. Título "Proyección de Recaudación" + subtítulo indicando el horizonte activo.
2. Si `ivaMode() === 'sin_iva'`: nota visible "Proyección en monto bruto (incluye IVA), independiente
   del toggle activo" (trampa del IVA, Global Constraint).
3. Titular de brecha (mejora #2) -- solo si `projection().adjustedSeriesAvailable`.
4. Toggle 13 semanas / 6 meses (dos botones o un `p-selectbutton`/`p-toggleswitch` -- consultá MCP
   PrimeNG para el patrón más liviano; mismo espíritu que el toggle Total/Cantidad ya usado en
   Detalle de Ventas, referenciado en el spec).
5. Columna de **backlog vencido**, SEPARADA visualmente del eje temporal (borde/gap+línea, mismo
   criterio de "divisor explícito" que el cluster Por Vencer/Vencido de Antigüedad, SP2 Task 6) --
   `formatSignedAmount(projection().backlogOverdue)`.
6. Gráfico de barras: 2 series por bucket (contractual siempre; ajustada SOLO si
   `adjustedSeriesAvailable`) -- mismo enfoque liviano de `div`s con `height: calc()`/`%` que
   Antigüedad (SP2 Task 6), NO una librería de charts. Ejes: barras contractual (color sólido) +
   ajustada (patrón distinto -- p.ej. borde punteado o textura, ya que ambas coexisten en el mismo
   bucket, no pueden ser solo "otro color" o se confunden con dos tramos separados) por bucket, eje
   X con los `label`s (`S1`..`S13` o nombres de mes).
7. Si `!projection().adjustedSeriesAvailable`: placeholder de texto explícito reemplazando la serie
   ajustada (política de degradación, Global Constraint) -- algo como "Historial insuficiente para
   proyectar comportamiento de pago en este alcance. Se muestra solo la proyección contractual."
   La serie contractual SIGUE mostrándose siempre, con o sin la ajustada.
8. Monto excluido declarado: "Excluye $X sin fecha de vencimiento" (spec: "declarado visiblemente
   junto al gráfico") -- `formatSignedAmount(projection().excludedNoDueDate)`, solo si > 0.
9. Loading: `@if (collectionsData.loading())` con `<app-loading-skeleton height="280px" />`.

**CSS:** solo tokens `var(--p-…)`, budget ≤24kB/48kB. Responsive: a ≤900px, si 13 barras no caben,
usar el patrón ya establecido en Ventas para gráficos anchos -- **eje fijo + scroll horizontal
dentro del propio gráfico** (mejora #4 aprobada del spec: "eje fijo + scroll horizontal en
gráficos" ya afinado en Ventas), nunca comprimir las barras hasta ilegibilidad ni truncar montos.

**Acceptance:** con datos mock reales bajo el default, el componente renderiza sin NaN/Infinity;
cambiar el toggle 13 semanas ↔ 6 meses recalcula `projection()` sin errores; con `ivaMode` en
`sin_iva` aparece la nota de monto bruto; screenshot desktop+mobile si podés levantar/reusar un
`ng serve` ya corriendo (no lances uno nuevo si no hay ninguno).

- [ ] Implementar. [ ] Build; test. Commit.

---

### Task 4: Componente Concentración de Cartera

**Files:** Create `src/app/pages/cobranzas-general/concentracion-cartera/concentracion-cartera.ts`
+`.html`+`.css`+spec. Read: spec funcional §4.5, `src/app/data/utils/collections-concentration.utils.ts`
(Task 2), `src/app/pages/ventas-general/ranking-panels/ranking-panel/ranking-panel.ts`+`.html`+`.css`
(patrón de fila clickeable + tooltip par-a-par a REPLICAR, no importar), `src/app/services/tenant-vocabulary.service.ts`
(`labelFor('contraparte')` para el título del panel, spec §2.3: "Toda etiqueta de esta dimensión...
título del panel de concentración... debe resolverse por este mecanismo, nunca escribirse literal").

**Qué:** selector `app-concentracion-cartera`, standalone, `ChangeDetectionStrategy.OnPush`,
`inject(CollectionsDataService)`, `inject(TenantVocabularyService)`. Sin wiring nuevo de servicio --
`collectionsData.setCrossFilter('contraparte', counterpartyId)` ya existe y ya está soportado
correctamente por `scopedCounterpartyIds()` desde SP1 (dimensión `'contraparte'` es la rama
original, no la del fix de Task 5 de SP2).

```ts
protected readonly sortMode = signal<ConcentrationSortMode>('saldo');
protected readonly result = computed(() =>
  buildConcentrationRows(
    this.collectionsData.scopedDocuments(),
    COUNTERPARTIES,
    COUNTERPARTY_BEHAVIORS,
    this.sortMode(),
  ),
);
/** Spec §4.5 "Regla de visibilidad": el panel entero se oculta cuando hay exactamente 1
 * contraparte distinta en el alcance activo -- no tiene sentido un ranking de una fila. */
protected readonly isVisible = computed(() => this.result().rows.length !== 1);
```

**Estructura visual:**
1. Título usando `vocab.labelFor('contraparte')` (p.ej. "Concentración de Recaudador" en preset
   retail, no "Concentración de Contraparte" hardcodeado).
2. Selector de ordenamiento en el encabezado: Saldo / Saldo vencido / % de utilización de límite
   (`p-select`, mismo patrón que `ranking-panels.ts`'s `Select`+`FormsModule`).
3. Filas: rank + label + mini-barra proporcional (ancho relativo al máximo del campo activo de
   `sortMode` entre las filas visibles -- mismo enfoque de barra que Antigüedad/Puente, `div` con
   `[style.width.%]`) + monto/porcentaje formateado según `sortMode` (Saldo/SaldoVencido en
   `formatSignedAmount`; utilización como `%` con 1 decimal, o guion si `utilizacionPct === null`).
4. Hover con comparación par-a-par contra vecinos inmediatos EN LA LISTA ORDENADA actual (mismo
   patrón `pctAbove`/`comparisonTooltip` de `ranking-panel.ts`, adaptado: "concentra X% más/menos
   que [vecino]" en vez de "Vendió X% más/menos que" -- comparando el campo activo de `sortMode`,
   no siempre `saldo`).
5. Fila de **"mayor riesgo" destacada** (mejora #3): si `result().highestRisk !== null`, un
   callout/realce visualmente distinto (borde/fondo distintivo, `var(--p-red-...)` sutil) sobre esa
   contraparte, con texto explícito sintetizando las 3 condiciones -- p.ej. "⚠ Mayor riesgo: [label]
   concentra el mayor saldo entre las contrapartes sobre su límite de crédito y con historial de
   pago tardío." No es un componente nuevo, es un realce dentro de este mismo panel (spec: "no es
   un componente nuevo; es un realce dentro del panel de concentración") -- si `highestRisk` está
   también en la lista principal (probable), NO la dupliques como fila aparte fuera de su posición
   de ranking; el realce es un estilo/badge sobre su fila existente, más un texto de síntesis
   arriba o al costado del panel.
6. Cross-filter al clic en cualquier fila -> `setCrossFilter('contraparte', row.counterpartyId)`,
   con estado activo (`[class.is-active]`) cuando coincide con `crossFilter()`.
7. Loading: `@if (collectionsData.loading())` con `<app-loading-skeleton height="240px" />`.
8. Si `!isVisible()`: el componente no renderiza NADA visible (ni siquiera un card vacío) -- `@if`
   envolvente en el template raíz.

**CSS:** solo tokens `var(--p-…)`, budget ≤24kB/48kB. Responsive ≤900px: mismo patrón ya usado por
`ranking-panel.css` (wrap de fila, monto en su propia línea, sin truncar).

**Acceptance:** con datos mock reales bajo el default (que tiene múltiples contrapartes, así que
`isVisible()` es `true`), renderiza la lista completa sin NaN; cambiar `sortMode` reordena
correctamente; clic en una fila aplica el cross-filter y un segundo clic en la misma lo limpia
(toggle, mismo patrón que Puente/Antigüedad); si armás un test con un scope artificialmente
reducido a 1 sola contraparte (vía `setCounterpartyFilter([id])`), el panel deja de renderizar
contenido.

- [ ] Implementar. [ ] Build; test. Commit.

---

### Task 5: Composición de la página — Proyección + Concentración

**Files:** Modify `src/app/pages/cobranzas-general/cobranzas-general.ts`+`.html`. Read: el archivo
actual completo (compuesto en SP2 Task 7 con KPIs→Puente→Antigüedad).

**Qué:** agregar `<app-recaudacion-projection />` y `<app-concentracion-cartera />` al final del
bloque `@else` de `.page-body`, EN ESE ORDEN, después de `<app-aging-chart />` (orden de prioridad
de preguntas del spec §1: Saldo/riesgo → Puente → Antigüedad → Proyección → Concentración). Registrar
`RecaudacionProjectionComponent`/`ConcentracionCarteraComponent` en el array `imports` del
`@Component`. No tocar nada de lo ya compuesto (KPIs/Puente/Antigüedad quedan intactos).

**Acceptance:** `/cobranzas` muestra las 5 secciones completas con datos reales del mock; responsive
en mobile sin overflow horizontal fuera de los gráficos con scroll propio (Proyección); `Detalle de
Cartera` sigue con su placeholder (SP4, fuera de este plan).

- [ ] Implementar. [ ] Build; test; screenshot desktop+mobile si hay `ng serve` disponible. Commit.

---

## Self-review (post-plan)

- Cobertura: Proyección (2 series, backlog separado, horizonte 13sem/6meses, degradación, monto
  excluido, trampa IVA, mejora #2 brecha) + Concentración (mini-barra+%, 3 ordenamientos, hover
  par-a-par, cross-filter, regla de visibilidad por valor único, mejora #3 mayor riesgo) — coincide
  con spec funcional §4.4-4.5 completo + las 2 mejoras aprobadas correspondientes a este SP.
  Casos de borde del spec §8 cubiertos donde aplican a estos 2 componentes (A sobrepago, B sin
  `dueDate`, C contraparte no mapeada, F mora negativa); D (pagos parciales individuales) y E
  (cartera vacía a nivel de pantalla completa) no son responsabilidad de estos 2 componentes
  específicos.
  E (cartera vacía) queda para cuando `/cobranzas` complete su tratamiento de estado vacío
  transversal (no específico de Proyección/Concentración) -- fuera de alcance de este plan.
- Decisión de arquitectura explícita y justificada (Task 1: generador de periodos futuros
  autocontenido, sin tocar `periods.mock.ts`) para no arriesgar el calendario compartido con
  Ventas.
- Ningún archivo de Ventas tocado en ninguna tarea.
- Todas las tareas nombran archivos exactos, contratos de tipos y criterios de aceptación
  verificables (incluidos los cuadres de reconciliación no-negociables del spec).
