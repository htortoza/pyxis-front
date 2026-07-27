# Cobranzas (Collections) — Diseño de Frontend (mockup)

> **Fuente de verdad de features:** el spec funcional del usuario (Cobranzas General + Detalle de
> Cartera + Proyección de Recaudación). Este documento NO lo reemplaza: captura la **arquitectura**,
> el **mapeo de reutilización** contra Ventas, las **mejoras de criterio senior** aprobadas, el
> **modelo de datos**, el **plan de mock** y la **descomposición en sub-proyectos**. Ante conflicto
> de comportamiento de un componente, manda el spec funcional.

**Alcance:** solo frontend, datos mock deterministas, sin backend. Angular 21 (zoneless + signals),
PrimeNG 21. Se calca la arquitectura de Ventas donde aplica y se mejora donde un C-Level lo necesita.

---

## 1. Decisiones de arquitectura (aprobadas por el usuario)

1. **Estado propio:** `CollectionsDataService` (`providedIn: 'root'`), independiente de
   `SalesDataService`. Mismo esqueleto: `activeDefaultView` primero → signals de filtro →
   `crossFilter` → `filterKey` (computed) → `_loading`/`loading` → `dashboardData` vía
   `toSignal(toObservable(filterKey).pipe(delay(400)…))` → facetas públicas + `scopedDocuments`
   (análogo a `scopedFacts`). Métodos `setCrossFilter` / `clearFilters` / `saveAsDefault` /
   `hasActiveFilter` / `setCounterpartyFilter`.
2. **Rutas:** `/cobranzas` (General) y `/cobranzas/cartera` (Detalle), lazy, igual que Ventas.
3. **Header module-aware:** se evoluciona `GlobalHeaderComponent` a un **shell** con `input()` de
   `tabs` (label+route) y **proyección de contenido** (`ng-content`) para los controles de filtro
   específicos del módulo (filters-modal, chips, acciones). Ventas proyecta su stack; Cobranzas el
   suyo. El shell aporta toolbar/tabs/hamburguesa/fila-de-chips. Riesgo: refactor tocado por Ventas
   → se valida con cuidado en review; **la conducta de Ventas no debe cambiar**.
4. **Doble control temporal:** además de **Periodo** (flujo), Cobranzas suma **Fecha de corte**
   (stock, fecha única), rotulada SIEMPRE como **"Saldo al [fecha]"**. Regla innegociable: los saldos
   nunca se suman entre cortes; si hay más de un corte → serie comparativa, nunca acumulado. Coherencia:
   la fecha de corte no puede ser anterior al inicio del periodo → advertencia explícita.
5. **Contraparte = 4ª columna del filtro en cascada** (Sector/Marca/Local/Contraparte), NO un tipo de
   contexto. Carga progresiva (puede tener miles de ítems; la columna debe rendir igual con 20 que con
   20.000). `counterpartyType` es **dato** (dimensión), nunca rama de lógica.
6. **Vocabulario de `contraparte` sin tocar `FilterNodeType`:** hoy `DimensionVocabulary =
   Record<FilterNodeType,string>` y `resolveDimensionLabel(dimension: FilterNodeType, …)` están
   acoplados al union de Ventas. Se **desacopla** a una clave de dimensión genérica (`string`), de
   modo que `contraparte` sea un término de vocabulario universal **sin** aparecer en
   `FilterNodeType`/`RankingDimension` (respeta [[feedback-backend-contract-is-fixed]]: no se agrega
   un concepto estructural al union compartido). Cambio aditivo y retrocompatible para Ventas. Se
   agrega `contraparte` al preset `retail` de `RUBRO_PRESETS`.

## 2. Estrategia de reutilización

- **Reusar tal cual:** `mini-sparkline`, `loading-skeleton`, `period-picker`, `comparison-selector`,
  `tristate.utils` (arity-agnóstico), `sales-detail-treemap.utils` (`squarify`), `signed-amount`
  (`formatSignedAmount` + `SignedAmountPipe`), `mobile-breakpoint.utils`, `mobile-nav.service`, PrimeNG.
- **Extender (aditivo, retrocompatible — Ventas conserva su conducta por defecto):**
  - `kpi-card`: agregar inputs opcionales `deltaUnit` (`'pct'|'pp'|'dias'`, default `'pct'`),
    `deltaDirection` (`'higher-good'|'lower-good'`, default `'higher-good'`) y `deltaSensitivityPct`
    (umbral para no colorear alza leve — DSO). Extender `comparisonBand`/`cumplimientoBand` en
    `signed-amount.ts` para respetar dirección y unidad. Ventas no pasa nada nuevo → idéntico.
  - Vocabulario: desacople descrito en §1.6.
  - `GlobalHeaderComponent`: shell module-aware (§1.3).
- **Nuevo, ligado a `CollectionsDataService` (calca patrones de Ventas):** el servicio, el árbol de
  filtro de cartera (`buildCollectionsFilterTree`), el filtro en cascada de 4 columnas (se
  **generaliza `ContextFilterComponent`** a columnas configurables por config; los utils tristate ya
  lo soportan — decisión final en el plan, con fallback a copia Cobranzas si el review detecta riesgo
  de regresión en Ventas), la filters-modal de Cobranzas (agrega Fecha de corte + Contraparte), su
  chips-summary, sus vistas guardadas (agrega `cutoffDate` en modo relativo/absoluto + `counterpartyIds`),
  las dos páginas y todos sus componentes de visualización.

## 3. Modelo de datos (tipos nuevos)

`src/app/data/models/collections.model.ts` (tipos exactos del spec §2.5): `CounterpartyType`,
`DocumentStatus`, `Counterparty`, `ReceivableDocument`, `CounterpartyBehavior`, `CollectionTarget`.

Notas de imputación:
- `balance = grossAmount - appliedAmount - creditNoteAmount` (viene "calculado del backend" → en mock
  se calcula en el generador, no en el navegador).
- **Notas de crédito** = categoría transversal (como `zDescuento`/`zMermas` en Ventas): atributo del
  documento y segmento propio del puente; **nunca** una contraparte en la columna de filtro.
- Casos de borde tipados: `dueDate: string | null`, `creditLimit: number | null`,
  `creditTermDays: number | null`, sobrepago (`balance < 0`), contraparte no mapeada.

## 4. Plan de mock (`data/mock/collections.mock.ts`)

Generador determinista estilo `sales-facts.mock.ts`: **mulberry32** con semilla literal, sin
`Date.now()`/`Math.random()`; fechas vía `addDaysIso` sobre un `TODAY_ISO` local (`'2026-07-25'`,
la "fecha de corte por defecto = última carga"). Debe producir cartera realista:
- Saldo **sesgado** entre contrapartes (Zipf) → concentración visible (la #1 casi duplica a la #2).
- Mezcla de estados/tramos de antigüedad (por vencer 0-30/30+, vencido 1-30/31-60/61-90/90+, sin
  vencimiento), pagos parciales (`appliedAmount` intermedio), notas de crédito imputadas, ≥1 doc
  **sin `dueDate`**, ≥1 **sobrepago** (`appliedAmount > grossAmount`), ≥1 **contraparte no mapeada**.
- Historia multi-año (documentos cerrados) suficiente para **CEI**, **mora promedio por contraparte**
  y **sparklines** (≥3 puntos, ideal 6-12) — reutiliza `PERIODS_BY_GRANULARITY`.
- `counterpartyType` variado (los 6 tipos) para probar que todo funciona con 1 o con 6.
- Vincula cada contraparte a una `societaryNodeId` (nodo de `CONTEXT_TREE`) y opcionalmente a
  `commercialNodeIds` (algunas vacías, para probar el caso de columnas Sector/Marca/Local sin efecto).
- **Cuadre del puente (caso de prueba obligatorio):** `totalSales` del Puente Venta→Caja para el
  periodo se **deriva del mismo número** que Ventas expone para ese periodo/filtros/IVA. En mock se
  logra derivando el total de ventas del periodo desde la misma fuente/константa que
  `SalesDataService`, de modo que el segmento "Venta del periodo" == KPI Ventas Totales de Ventas.

## 5. Mejoras de criterio senior (aprobadas — las 4)

1. **Puente lidera con el % ya cobrado:** titular grande "62% de lo vendido ya es caja" + su tendencia
   vs periodo anterior (¿converjo más rápido/lento?), por encima del desglose de segmentos.
2. **Proyección lidera con la brecha:** número/callout explícito — *"el comportamiento real corre tu
   caja ~N semanas y ~$X vs lo pactado"* — en lugar de dejar al usuario estimar mirando dos líneas.
3. **"Mayor riesgo" en Concentración:** realce (fila destacada/callout) que sintetiza quién concentra
   más **y** está sobre su límite **y** paga tarde, a la vez. No es un componente nuevo; es un realce
   dentro del panel de concentración.
4. **Mobile-first desde el día 1:** cada componente se construye responsive con los patrones ya
   afinados en Ventas (eje fijo + scroll horizontal en gráficos, grilla KPI 2-col, filtros como
   modal, FAB, sin truncar textos/números — ver [[feedback-no-text-truncation]]). Evita el retrofit.

## 6. Reglas transversales críticas (no negociables)

- **Trampa del IVA:** el toggle Con/Sin IVA afecta KPIs de saldo, antigüedad y tabla (vista neta),
  PERO la **Proyección SIEMPRE opera sobre monto bruto (con IVA)**, y cuando el toggle está en Sin IVA
  la proyección lo indica visiblemente. Es el detalle que un dev "arregla por consistencia" y rompe.
- **Cuadre de reconciliación:** (a) el 1er segmento del Puente == KPI Ventas Totales de Ventas mismos
  filtros; (b) la **fila de totales de la tabla de Cartera == KPI Saldo por Cobrar** mismos filtros.
  Ambos derivados de una sola fuente para que no puedan divergir. La tabla de Cartera **sí** tiene fila
  de totales fija al pie (Detalle de Ventas no la tenía — fue el reclamo del stakeholder). Columnas
  límite/%util/plazo **no se totalizan** (guion); mora total = promedio ponderado por saldo.
- **pp vs %:** métricas que ya son porcentaje (%Vencido, CEI, %Utilización) → variación en **puntos
  porcentuales**; montos y días → **% relativo**. (Extensión `deltaUnit` del kpi-card.)
- **Banda direccional:** para %Vencido y DSO un **alza es mala**; para CEI y Recuperado un alza es
  buena. (Extensión `deltaDirection`.) DSO usa umbral de sensibilidad más alto (no colorea alza leve).
- **DSO nunca solo:** DSO y CEI viven juntos en la franja; si se reduce, se quitan/conservan juntos.
- **Backlog vencido NO se proyecta:** columna separada antes del eje temporal, desconectada de las
  barras. Docs sin `dueDate` se excluyen de la proyección y el **monto excluido se declara** visible.
- **Degradación por falta de historial (política única, misma que sparklines <3 puntos):** si
  `adjustedCoverageRatio` < umbral o la contraparte no tiene mínimo de docs cerrados → **no** se dibuja
  serie ajustada parcial ni se rellena con promedio global; se muestra solo la contractual + texto
  placeholder. Enunciar idéntico en ambos lugares (sparkline y proyección) para tener UNA política.
- **Antigüedad:** "por vencer" y "vencido" separados por divisor explícito y **familias de color
  distintas** (no una escala continua — son estados cualitativos distintos, no grados). Tramos
  parametrizables por tenant (30/60/90 default, pero 15/120 posibles).
- **Formato negativos:** entre paréntesis, sin signo, rojo suave (`formatSignedAmount`).
- **Ocultar filas sin saldo:** en Cobranzas es un **toggle visible** (en Ventas era incondicional).
- **Estados vacíos distinguen dos causas:** "no hay cartera en este alcance" vs "no hay datos
  cargados". Contraparte no mapeada / sobrepago se **muestran** (no se descartan en silencio).
- **Footer:** distingue **fecha de última carga** vs **fecha de corte seleccionada**.

## 7. Descomposición en 4 sub-proyectos (cada uno entregable y testeable)

**SP1 — Cimientos.** Modelos (`collections.model.ts`), mock (`collections.mock.ts`),
`CollectionsDataService` (+ `default-collections-view.utils.ts`, clave `pyxis:default-view-cobranzas:`),
desacople de vocabulario + `contraparte` en preset, extensión aditiva de `kpi-card`/banding,
`buildCollectionsFilterTree`, header module-aware (shell + proyección), filtro cascada 4 columnas,
filters-modal Cobranzas (Fecha de corte + Contraparte), chips-summary Cobranzas, routing, entrada de
sidebar (`Cobranzas`, `ti-file-invoice`, activa), páginas cáscara con estado de carga y footer.
*Entregable:* navegás a `/cobranzas`, filtrás por las 4 dimensiones + fecha de corte + periodo + IVA,
ves chips, guardás/limpiás filtros; las páginas están vacías salvo cáscara. Todo cuadra el pipeline.

**SP2 — Cobranzas General (parte alta).** Composición de la página + 5 KPIs (Saldo, %Vencido, DSO,
CEI, Recuperado) con pp/días/dirección/semáforo + sparklines; **Puente Venta→Caja** (cascada, cuadra
con Ventas Totales, cross-filter, deep-link bidireccional, mejora #1); **Antigüedad de Cartera**
(por-vencer vs vencido separados, hover con 4 métricas, cross-filter, tramos parametrizables).

**SP3 — Cobranzas General (parte inteligente).** **Proyección de Recaudación** (contractual +
ajustada + backlog separado + toggle 13sem/6meses + degradación + monto excluido + trampa IVA +
mejora #2 brecha); **Concentración de Cartera** (patrón Ranking: mini-barra + %, 3 ordenamientos,
hover par-a-par, cross-filter, regla de ocultamiento por dimensión de valor único + mejora #3 mayor
riesgo).

**SP4 — Detalle de Cartera.** Doble vista Tabla/Mapa (calca Detalle de Ventas): **Tabla** de
reconciliación (Contraparte→documentos, columnas de aging + Saldo/Límite/%Util/Mora, orden default por
saldo vencido, todas ordenables, buscador inline con auto-expand, carga progresiva ~20, headers
adhesivos, **fila de totales fija que cuadra con KPI Saldo**, toggle ocultar-sin-saldo, señalización de
límite/`null`→guion); **Mapa** treemap de exposición por contraparte (tamaño ∝ saldo, color ∝ mora,
hover sin clic, long-tail buscable). Foco compartido `focusedCounterpartyId` entre ambas vistas.

## 8. Orquestación

Opus = arquitecto (plan por tareas, dispatch, review spec+calidad entre tareas, build/deploy).
Subagentes **Sonnet** = implementación (uno por tarea, TDD/typecheck/build). Deploy automático a
GitHub Pages tras cada sub-proyecto (preferencia [[feedback-always-deploy-after-commit]]).

## 9. Riesgos

- El shell module-aware y (posible) generalización de `ContextFilterComponent` tocan código que Ventas
  usa → mayor cuidado en review; criterio de aceptación: **Ventas no cambia su comportamiento**.
- El cuadre Puente↔Ventas y Totales↔KPI son casos de prueba obligatorios; derivar de una sola fuente.
- La proyección ajustada por comportamiento es el componente más novedoso; su valor es la brecha, no la
  precisión — presentarla como rango, nunca como certeza.
