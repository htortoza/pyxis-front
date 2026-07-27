# Cobranzas — SP1: Cimientos — Plan de Implementación

> **Para el worker:** implementá tarea por tarea. Cada tarea nombra los archivos de referencia
> que DEBÉS leer antes de escribir código (el objetivo es calcar patrones existentes). Cada tarea
> termina con typecheck + build + tests verdes y un commit. Diseño canónico:
> `docs/superpowers/specs/2026-07-26-cobranzas-frontend-design.md`.

**Objetivo:** dejar navegable `/cobranzas` con estado, filtros (4 dimensiones + fecha de corte +
periodo + IVA + comparación), chips, vistas guardadas, sidebar y cáscaras de página. Sin
visualizaciones aún (esas son SP2–SP4).

**Arquitectura:** `CollectionsDataService` propio (calca `SalesDataService`); header module-aware por
proyección de contenido; contraparte como dimensión de vocabulario desacoplada de `FilterNodeType`.

## Global Constraints (aplican a TODA tarea)

- Angular 21 **zoneless + signals**; componentes `standalone`, `ChangeDetectionStrategy.OnPush`,
  `inject()`, `input()/output()/model()`, control-flow `@if/@for/@switch`. Nada de `ngOnInit`/`ngZone`/`CommonModule`.
- PrimeNG 21 como design system; consultar el MCP `@primeng/mcp` antes de usar un componente nuevo.
- CSS: solo tokens `var(--p-…)`/`var(--dash-…)`; sin Tailwind/PrimeFlex/clases utilitarias inventadas;
  budget por componente ≤ 24kB warn / 48kB error. Breakpoint móvil **900px** (mismo que todo el resto).
  Nunca truncar números/títulos (wrap o achicar fuente).
- Mock determinista: **prohibido** `Date.now()`/`new Date()` argless/`Math.random()`. Usar mulberry32
  con semilla literal y `TODAY_ISO='2026-07-25'` local.
- **Ventas no debe cambiar su comportamiento.** Todo cambio a código compartido es aditivo y con
  defaults que preservan la conducta actual. Los tests existentes deben seguir verdes.
- Comandos de verificación: `npx tsc --noEmit -p tsconfig.app.json`, `npx ng build`,
  `npx ng test --watch=false`. Baseline actual: 77/78 (1 fallo preexistente no relacionado en
  `app.spec.ts` "should render title" por `ActivatedRoute` — NO cuenta como regresión).

---

### Task 1: Modelos de datos

**Files:** Create `src/app/data/models/collections.model.ts`.

**Qué:** los tipos EXACTOS del spec §2.5: `CounterpartyType` (union de 6), `DocumentStatus`
(`'POR_VENCER'|'VENCIDO'|'PAGADO'`), `Counterparty`, `ReceivableDocument`, `CounterpartyBehavior`,
`CollectionTarget`. Copiar los campos y comentarios de intención del spec (JSDoc en cada interface
explicando el *por qué* de los campos ambiguos: `dueDate:null`, `creditLimit:null`, `balance` derivado,
`appliedAmount` soporta parcial, `creditNoteAmount`).

**Acceptance:** `npx tsc --noEmit` limpio. Son tipos puros → sin test.

- [ ] Leer `src/app/data/models/sales-fact.model.ts` y `ranking.model.ts` para el estilo.
- [ ] Escribir el archivo con los 6 tipos + JSDoc.
- [ ] `npx tsc --noEmit -p tsconfig.app.json` → limpio. Commit.

---

### Task 2: Desacople de vocabulario + dimensión `contraparte`

**Files:** Modify `src/app/data/models/tenant-vocabulary.model.ts`,
`src/app/data/utils/tenant-vocabulary.utils.ts`, `src/app/data/mock/rubro-presets.mock.ts`,
`src/app/data/utils/tenant-vocabulary.utils.spec.ts`. Read: `tenant-vocabulary.service.ts`,
`sector-marca-tienda-tree.utils.ts` (la def de `FilterNodeType`).

**Qué:** desacoplar el vocabulario de `FilterNodeType` para poder agregar `contraparte` SIN tocar ese
union.
- `DimensionKey = FilterNodeType | 'contraparte'` (nuevo tipo exportado en tenant-vocabulary.model.ts).
  `DimensionVocabulary` pasa de `Record<FilterNodeType,string>` a `Partial<Record<DimensionKey,string>>`
  (Partial para que los presets no estén obligados a definir todas las claves de todos los módulos).
- `resolveDimensionLabel(dimension: DimensionKey, overrides, preset): string` — misma cadena de
  fallback (`overrides?.[d] ?? preset[d] ?? capitalize(d)`). `capitalize('contraparte')→'Contraparte'`.
- `RUBRO_PRESETS.retail` agrega `contraparte: 'Recaudador'` (preset retail del spec §2.3). Mantener
  `sector/marca/tienda` como están.
- `TenantVocabularyService.labelFor(dimension: DimensionKey)` acepta ahora la clave ampliada.

**Acceptance:** Ventas sigue resolviendo sector/marca/tienda igual; `labelFor('contraparte')` →
`'Recaudador'` (o el override del tenant si existiera). Tests existentes verdes + nuevos casos.

- [ ] Escribir test que falle: `resolveDimensionLabel('contraparte', undefined, RETAIL_PRESET)` → `'Recaudador'`; y con override → el override; y sin preset → `'Contraparte'`.
- [ ] Verlo fallar (`ng test --watch=false`).
- [ ] Implementar el desacople (Partial + DimensionKey), agregar `contraparte` al preset.
- [ ] Tests verdes (incl. los preexistentes de sector/marca/tienda). Commit.

---

### Task 3: Extensión aditiva de `kpi-card` (pp / días / dirección / sensibilidad)

**Files:** Modify `src/app/components/shared/kpi-card/kpi-card.ts` (+`.html` si hace falta),
`src/app/pipes/signed-amount.ts`. Read: current `kpi-card.ts`/`.html`/`.css`, `signed-amount.ts`
(`comparisonBand`/`cumplimientoBand`/`bandSeverity`), `kpi-cards-grid.ts` (cómo se consumen).

**Qué (todo aditivo, defaults = conducta actual de Ventas):**
- `kpi-card` nuevos inputs: `deltaUnit = input<'pct'|'pp'|'dias'>('pct')`,
  `deltaDirection = input<'higher-good'|'lower-good'>('higher-good')`,
  `deltaSensitivityPct = input<number>(0)`.
- Render del badge: `'pct'` → `Math.abs(pct).toFixed(1)+'%'` (actual); `'pp'` →
  `Math.abs(pct).toFixed(1)+' pp'`; `'dias'` → `Math.abs(pct).toFixed(0)+' d'`. (El valor numérico que
  llega en `deltaPct` ya viene en la unidad correcta calculado por el caller; el card solo formatea el
  sufijo.)
- Banda: extender `comparisonBand(deltaPct, direction='higher-good', sensitivityPct=0)` en
  `signed-amount.ts` → si `direction==='lower-good'` invierte el signo antes de clasificar; si
  `|deltaPct| <= sensitivityPct` → `'medium'` (no colorear alza/baja leve; para DSO). Firma vieja
  sigue funcionando (params opcionales con defaults actuales).
- `kpi-card` usa `comparisonBand(deltaPct(), deltaDirection(), deltaSensitivityPct())` cuando
  `!isMetaMode()`. `isPositive` (flecha ↑/↓) sigue reflejando el signo crudo del delta (la flecha
  muestra dirección del cambio; el color muestra si es bueno/malo).

**Acceptance:** los KPI de Ventas se ven idénticos (defaults). Nuevos: unit tests de `comparisonBand`
con dirección/sensibilidad; snapshot mental: `%vencido` con `+6 deltaPct, lower-good` → banda `bad`;
DSO `+2 deltaPct, lower-good, sensitivity=5` → `medium`.

- [ ] Test que falle en `signed-amount.spec.ts`: casos de dirección y sensibilidad.
- [ ] Verlo fallar.
- [ ] Implementar la extensión de `comparisonBand` + inputs del card + formato de sufijo.
- [ ] Tests verdes; build; verificar visualmente que un KPI de Ventas no cambió. Commit.

---

### Task 4: Mock de cartera (`collections.mock.ts`)

**Files:** Create `src/app/data/mock/collections.mock.ts` + `collections.mock.spec.ts`. Read:
`sales-facts.mock.ts` (mulberry32, Zipf, estilo), `context-tree.mock.ts` (CONTEXT_TREE/MARCAS/SECTORES
para vincular `societaryNodeId`/`commercialNodeIds`), `periods.mock.ts` (para historia multi-año),
`date.utils.ts` (`addDaysIso`), `collections.model.ts`.

**Qué:** generador determinista (mulberry32, semilla literal, `TODAY_ISO='2026-07-25'`) que exporta:
`COUNTERPARTIES: Counterparty[]`, `RECEIVABLE_DOCUMENTS: ReceivableDocument[]`,
`COUNTERPARTY_BEHAVIORS: CounterpartyBehavior[]`, `COLLECTION_TARGETS: CollectionTarget[]`, y una
constante `PERIOD_SALES_TOTAL_CLP: Record<string, number>` (venta bruta por periodId) que **debe
derivarse del mismo criterio que Ventas** para el cuadre del puente (documentarlo).
Requisitos de forma (ver design §4): saldo Zipf-sesgado (concentración visible), mezcla de estados y
tramos de antigüedad, pagos parciales, notas de crédito imputadas, **≥1 doc sin `dueDate`**, **≥1
sobrepago** (`appliedAmount>grossAmount`→`balance<0`), **≥1 contraparte "no mapeada"** (documento cuyo
`counterpartyId` no está en `COUNTERPARTIES`), historia multi-año de docs cerrados para CEI/mora,
mezcla de los 6 `counterpartyType`, algunas contrapartes con `commercialNodeIds` vacío y algunas con
`creditLimit=null`/`dueDate=null`. `balance = gross - applied - creditNote` en el generador.

**Acceptance / tests (`collections.mock.spec.ts`):**
- Determinismo: importar dos veces / recomputar → arrays byte-idénticos (o: un hash estable).
- `balance === grossAmount - appliedAmount - creditNoteAmount` para todo doc.
- Existe ≥1 doc con `dueDate===null`, ≥1 con `balance<0`, ≥1 con `counterpartyId` no presente en `COUNTERPARTIES`.
- Concentración: la contraparte de mayor saldo ≥ ~1.5× la segunda.
- Historia: ≥1 contraparte con `closedDocumentCount>=` el mínimo publicable.

- [ ] Escribir specs (que fallan sin el mock).
- [ ] Implementar el generador.
- [ ] Tests verdes; commit.

---

### Task 5: Árbol de filtro de cartera (4 dimensiones)

**Files:** Create `src/app/data/utils/collections-filter-tree.utils.ts` + spec. Read:
`sector-marca-tienda-tree.utils.ts` (patrón del árbol plano parent-linked), `tristate.utils.ts`
(las funciones que van a consumir el árbol: `computeSelectionStates`/`toggleNode`/`getEffectiveLeafIds`),
`context-tree.mock.ts`, `collections.mock.ts`.

**Qué:** `CollectionsFilterNode { id; parentId: string|null; label; type: string; counterpartyId?: string }`
(type genérico string, NO `FilterNodeType` — dimensiones `'sector'|'marca'|'local'|'contraparte'`).
`buildCollectionsFilterTree(contextTree, marcas, sectores, counterparties): CollectionsFilterNode[]` —
Sector > Marca > Local (calca `buildSectorMarcaTiendaTree`) y agrega un 4º nivel Contraparte colgando
donde corresponda por `societaryNodeId`/`commercialNodeIds`; las contrapartes sin `commercialNodeIds`
cuelgan de un nodo raíz de contraparte independiente (para que el caso "sin asociación comercial" no
rompa nada). El árbol debe ser compatible con `computeSelectionStates`/`toggleNode`/`getEffectiveLeafIds`
(mismos campos `id`/`parentId`).

**Acceptance:** `getEffectiveLeafIds` sobre el árbol devuelve ids de contraparte resolvibles; probar que
`toggleNode` propaga tristate. Test de que una contraparte sin `commercialNodeIds` sigue apareciendo.

- [ ] Spec que falla. [ ] Implementar. [ ] Verde; commit.

---

### Task 6: `CollectionsDataService` + default-view util

**Files:** Create `src/app/services/collections-data.service.ts` + `.spec.ts`,
`src/app/data/utils/default-collections-view.utils.ts` + spec. Read: `sales-data.service.ts` (FULL,
es el patrón), `default-view.utils.ts`, `collections.mock.ts`, `collections-filter-tree.utils.ts`,
`iva.model.ts`, `comparison.model.ts`, `period.model.ts`.

**Qué:** calcar el esqueleto de `SalesDataService`:
- `DefaultCollectionsFilterView` (en default-collections-view.utils.ts): `{ cutoffDate: string;
  periodIds: string[]; granularity: PeriodGranularity; counterpartyIds: string[]|null;
  sectorMarcaLocalFilter: string[]|null; compareToPrevious; comparisonMode; comparisonAlignment;
  explicitComparisonPeriodIds: string[]|null; ivaMode }`. `loadDefaultCollectionsView(tenantId)` /
  `persistDefaultCollectionsView(tenantId, view)` con clave `pyxis:default-view-cobranzas:{tenantId}`
  (mismo guardado defensivo que default-view.utils). `buildHardcodedDefaultCollectionsView()`:
  cutoff = `'2026-07-25'`, periodos default = `DEFAULT_SELECTED_PERIOD_IDS`, sin filtros de dimensión.
- `CollectionsDataService` (`providedIn:'root'`): `activeDefaultView` (signal, primero); signals
  `cutoffDate`, `selectedPeriodIds`, `selectedPeriodGranularity`, `counterpartyFilter:signal<string[]|null>`,
  `sectorMarcaLocalFilter:signal<string[]|null>`, `crossFilter:signal<CollectionsCrossFilter|null>`
  (`{dimension:string; id:string}`), `compareToPrevious`, `comparisonMode`, `comparisonAlignment`,
  `explicitComparisonPeriodIds`, `ivaMode`; `_loading`/`loading`. `filterKey` computed (JSON.stringify de
  todo). `dashboardData` vía `toSignal(toObservable(filterKey).pipe(tap loading, switchMap(of(null).pipe(
  delay(400), map(()=>computeCollectionsData()))), tap loading))`. `scopedDocuments` computed (docs
  no-PAGADO a la fecha de corte, dentro de contexto+counterparty+sectorMarcaLocal filters, con IVA
  aplicado según `ivaMode`, PERO exponer también `scopedDocumentsGross` para la proyección). `saldoTotal`
  computed (suma de `balance` de `scopedDocuments`). Métodos `setCrossFilter`/`clearFilters`/
  `saveAsDefault`/`hasActiveFilter`/`setCounterpartyFilter`/`setSectorMarcaLocalFilter`.
  `computeCollectionsData()` por ahora puede devolver `{ saldoTotal }` mínimo (las agregaciones pesadas
  —aging/bridge/projection/concentration/kpis— llegan en SP2/SP3; dejar el hook listo).

**Acceptance:** service instanciable; cambiar cutoff/periodo/filtros dispara loading→datos; `clearFilters`
resetea a default; `saveAsDefault` persiste; `hasActiveFilter` correcto; `scopedDocuments` respeta cutoff
+ scope + IVA; `saldoTotal` = suma esperada del mock bajo default.

- [ ] Specs que fallan (default-view roundtrip; scopedDocuments/saldoTotal bajo default; clearFilters).
- [ ] Implementar. [ ] Verde; commit.

---

### Task 7: Header module-aware (shell) + migración de Ventas

**Files:** Modify `src/app/components/shared/global-header/global-header.ts`/`.html`/`.css`,
`src/app/pages/ventas-general/ventas-general.html`, `src/app/pages/detalle-ventas/detalle-ventas.html`.
Read: current global-header (todo), `ventas-general.ts`/`.html`, `detalle-ventas.ts`/`.html`.

**Qué:** convertir `GlobalHeaderComponent` en un **shell** genérico:
- `input()` `tabs: {label:string; route:string; exact?:boolean}[]` → reemplaza los 2 `<a>` hardcodeados.
- Proyección de contenido con `<ng-content select="[filters-trigger]">`, `[chips]`, `[actions]` para el
  stack específico del módulo. El shell aporta el `p-toolbar` (logo móvil, slot filters-trigger, tabs,
  hamburguesa) y la fila `.global-header-chips-scroll` (slot chips + slot actions). Ya NO inyecta
  `SalesDataService` (las acciones Limpiar/Guardar viven en el contenido proyectado por cada módulo).
- Migrar Ventas: `ventas-general.html` y `detalle-ventas.html` usan `<app-global-header [tabs]="…">`
  proyectando su `<app-filters-modal filters-trigger/>`, `<app-filter-chips-summary chips/>` y sus
  botones Limpiar/Guardar (actions). Definir el array `tabs` de Ventas (General `/` exact, Detalle
  `/detalle-ventas`).

**Acceptance (crítico): Ventas se ve y se comporta EXACTAMENTE igual** (tabs, chips, limpiar, guardar
con toast, responsive, burger). Build + tests verdes (incl. app.spec baseline).

- [ ] Implementar el shell + proyección. [ ] Migrar Ventas. [ ] Build; test; verificación visual de
  Ventas en desktop+móvil (screenshot). Commit.

---

### Task 8: Stack de filtros de Cobranzas (propio, ligado a `CollectionsDataService`)

**Files:** Create `src/app/components/shared/collections-context-filter/*` (4 columnas),
`src/app/components/shared/collections-filters-modal/*`,
`src/app/components/shared/collections-filter-chips-summary/*`. Read: `context-filter.ts`/`.html`
(patrón 3 columnas + tristate + búsquedas + breadcrumb), `filters-modal.ts`/`.html` (draft + apply),
`filter-chips-summary.ts`, `tristate.utils.ts`, `collections-filter-tree.utils.ts`,
`collections-data.service.ts`, `period-picker`/`comparison-selector` (reusar tal cual),
`calendar-period-picker`/`month-period-picker` (para el nuevo control Fecha de corte — fecha única).

**Qué:**
- `collections-context-filter`: calca `context-filter` pero con **4 columnas**
  (Sector/Marca/Local/Contraparte), reusando `tristate.utils` y `TenantVocabularyService.labelFor`
  (usa `'contraparte'` para el header de la 4ª). Columna Contraparte con búsqueda propia + **carga
  progresiva** (rinde con miles). `checkedIds = model.required<Set<string>>()`.
- `collections-filters-modal`: calca `filters-modal` con draft signals que agregan **`draftCutoffDate`**
  y **`draftCounterpartyIds`**; top-row con 4 triggers: Periodo, **Fecha de corte** (popover con selector
  de fecha única, rotula "Saldo al [fecha]"), Comparación, IVA. Cuerpo: `collections-context-filter`.
  `apply()` escribe a `CollectionsDataService`; valida coherencia corte≥inicio-de-periodo → si no,
  muestra advertencia (no calcula en silencio). En móvil, FAB (mismo patrón que Ventas).
- `collections-filter-chips-summary`: chips de periodo, **"Saldo al [fecha]"** (corte), comparación,
  IVA y dimensiones aplicadas; cada chip removible; "Limpiar" visible solo con algún filtro.

**Acceptance:** abrir modal → filtrar por las 4 dims + corte + periodo + IVA en ≤3 clics; Aplicar
refleja chips; remover chip individual; advertencia de coherencia corte/periodo; responsive.

- [ ] Implementar (subtareas en orden: context-filter 4col → filters-modal → chips). [ ] Build; test;
  verificación visual. Commit (puede ser 1 commit por subcomponente).

---

### Task 9: Routing + sidebar + cáscaras de página + footer

**Files:** Modify `src/app/app.routes.ts`, `src/app/components/shared/sidebar/sidebar.ts`. Create
`src/app/pages/cobranzas-general/*` (cáscara) y `src/app/pages/detalle-cartera/*` (cáscara).
Read: `app.routes.ts`, `sidebar.ts` (MENU_MODEL), `ventas-general.ts`/`.html`/`.css`,
`detalle-ventas.ts`/`.html`, footer de Ventas si existe (buscarlo).

**Qué:**
- Rutas lazy `/cobranzas`→`CobranzasGeneralComponent`, `/cobranzas/cartera`→`DetalleCarteraComponent`.
- Sidebar: entrada `Cobranzas`, icono Tabler `ti-file-invoice` (verificar cómo se declaran los iconos
  en `MENU_MODEL`; usar el patrón existente), **activa** (no `Pronto`), `routerLink:'/cobranzas'`.
  Verificar no-truncamiento contra las etiquetas largas (`Gobernanza y permisos`).
- `CobranzasGeneralComponent` y `DetalleCarteraComponent`: cáscara con `<app-global-header [tabs]="…">`
  (tabs: Cobranzas General `/cobranzas` exact, Detalle de Cartera `/cobranzas/cartera`) proyectando el
  stack de Cobranzas (Task 8); `.page-body` (mismo layout que Ventas); estado de carga skeleton; footer
  que distingue **fecha de última carga** vs **fecha de corte seleccionada** (spec §7.5). Contenido
  principal: placeholder "Próximamente" (los componentes llegan en SP2–SP4). Estado vacío que distingue
  "sin cartera" vs "sin datos".

**Acceptance:** navego por sidebar a `/cobranzas`, veo las 2 tabs de Cobranzas, el header con filtros de
Cobranzas funcionando, footer con ambas fechas, cáscara responsive. Ventas intacto. Build+test verdes.

- [ ] Implementar. [ ] Build; test; verificación visual desktop+móvil. Commit.

---

## Self-review (post-plan)

- Cobertura del spec para "cimientos": estado, 4 dims + corte + periodo + IVA + comparación, chips,
  vistas guardadas (base), sidebar, routing, footer, casos de borde de datos en el mock. ✔ (las
  visualizaciones y sus reglas finas son SP2–SP4).
- Sin placeholders de código: cada task nombra archivos, firmas exactas y acceptance. Los workers leen
  las referencias y escriben el código.
- Consistencia de tipos: `DimensionKey`, `CollectionsFilterNode.type: string`,
  `DefaultCollectionsFilterView`, `CollectionsCrossFilter` usados coherentemente entre tasks.
- Riesgo concentrado en Task 7 (header) — es el único que toca Ventas de forma no trivial; review
  estricto de que Ventas no cambió.
