# Motor de Período y Comparación — Sub-proyecto 1 de "Mockup Retail: Filtros, Comparaciones y Nuevas Cards"

## Contexto: iniciativa mayor

Esta instrucción ("Mockup Retail: Filtros, Comparaciones y Nuevas Cards") describe 10 items para validar con el cliente de retail antes de comprometer fechas de integración real (mockup con datos de prueba, sin fuente de datos real). Por su tamaño y dependencias cruzadas, se descompuso en 5 sub-proyectos, cada uno con su propio spec/plan/implementación:

1. **Motor de Período y Comparación** (items 1+2+3+4) — este documento.
2. Cards nuevas + Semáforo graduado (items 5+6+7) — depende de que la Meta (parte de #1) exista.
3. Vista "por día" en gráfico de distribución (item 8) — depende de la fecha calendario real que este sub-proyecto introduce.
4. Toggle IVA/Sin IVA (item 9) — independiente.
5. Corner como subdivisión de Tienda (item 10) — independiente; no es una migración de vocabulario, es un nodo real nuevo en la jerarquía.

## Objetivo de este sub-proyecto

Items 1, 2, 3 y 4 de la instrucción original:
1. Granularidad Día y Semana en el Period Picker, conviviendo con Mes, con presets para Semana ("últimas 3 semanas", "últimas 12 semanas").
2. Selección explícita del periodo de comparación (en vez de que el sistema siempre infiera "el anterior").
3. Criterio de alineación configurable para "periodo anterior": fecha calendario vs. día de semana, transversal a KPI cards, gráfico de distribución y tabla de Detalle de Ventas.
4. Comparación contra Metas, como tercer mecanismo de comparación, con valores de meta de prueba.

## Fuera de alcance (explícito)

- Cards nuevas (Tasa de Conversión, Descuentos) — sub-proyecto 2.
- Semáforo graduado de 3+ colores — sub-proyecto 2. En este sub-proyecto, el modo "Meta" reusa el semáforo binario-ish que ya existe hoy (`comparisonBand` en `signed-amount.ts`: good/medium/bad por distancia porcentual), aplicado a % de cumplimiento en vez de % delta vs. periodo anterior.
- Vista "por día" del gráfico de Ventas por Hora — sub-proyecto 3.
- IVA/Sin IVA — sub-proyecto 4.
- Corner — sub-proyecto 5.
- Meta aplica **solo a KPI cards** (no al gráfico de distribución ni a la tabla de Detalle de Ventas) — la instrucción original dice "comparar KPIs contra una meta", a diferencia del punto 3 que sí es explícitamente transversal.

## Estado actual (verificado en código)

- `Period` (`period.model.ts`): `{ id, label, year, month, order }`, una sola granularidad (mes), generado para 2024-2026 en `periods.mock.ts`. 6 presets ya existen (`PERIOD_PRESETS` en `period.utils.ts`): Mes Actual, Último Trimestre, Últimos 6 Meses, Año en Curso, Año Anterior, Últimos 3 Años.
- `SalesFact` (`sales-fact.model.ts`): tiene `periodId` (mes) + `dayOfWeek` (0-6) + `hour`, sin fecha calendario real.
- Comparación hoy: `SalesDataService.compareToPrevious` es un toggle on/off; el periodo anterior se calcula desplazando `Period.order` hacia atrás la misma cantidad de periodos seleccionados (`sales-data.service.ts:210-221`). No existe alineación por día de semana ni concepto de meta en ningún lado.
- Semáforo hoy: `comparisonBand(deltaPct)` en `signed-amount.ts` (good/medium/bad, ≥0/≤-5%/entre medio), consumido por `kpi-card.ts`. Está atado a delta vs. periodo anterior, no a % de cumplimiento de meta — este sub-proyecto lo reutiliza pasándole el % de distancia a meta en vez del delta.
- Gráfico de Ventas por Hora: vistas "Gráfico de Barras" (por hora) y "Gráfico de Calor" (día de semana × hora) — ninguna agrega por fecha calendario real.

## Modelo de datos

### `SalesFact` gana fecha real

```typescript
export interface SalesFact {
  date: string; // ISO 'YYYY-MM-DD', fuente de verdad para día/semana/mes y día-de-semana
  periodId: string; // derivable de date (year-month), se mantiene por compatibilidad con el resto del código
  hour: number;
  // ... campos existentes (storeId, productId, amount, quantity, etc.)
}
```

`dayOfWeek` deja de guardarse como campo propio y pasa a derivarse de `date` vía un nuevo util (`getDayOfWeek(date)`), eliminando la posibilidad de que ambos campos queden inconsistentes. `sales-heatmap.ts` y `sales-fact.utils.ts` (los 2 únicos consumidores de `dayOfWeek` hoy) pasan a llamar ese util en vez de leer un campo. `sales-facts.mock.ts` genera `date` determinísticamente dentro del mes de cada hecho (misma semilla que ya usa hoy para amounts/quantities — no random en cada carga).

### `Period` gana granularidad

```typescript
export type PeriodGranularity = 'dia' | 'semana' | 'mes';

export interface Period {
  id: string; // 'YYYY-MM-DD' | 'YYYY-Www' | 'YYYY-MM' (como hoy, para 'mes')
  label: string;
  granularity: PeriodGranularity;
  order: number; // monotonic dentro de su propia granularidad, para el cálculo de periodo anterior
  startDate: string; // ISO, límite inferior real del periodo (para escalar meta y para alinear por día de semana)
  endDate: string; // ISO, límite superior real del periodo
}
```

Se generan 3 familias de periodos para 2024-2026 (`periods.mock.ts`): ~1095 Días, ~156 Semanas, 36 Meses (el `Period` de Mes existente se adapta a esta forma, con `startDate`/`endDate` agregados). El Period Picker gana un selector de granularidad (Día | Semana | Mes); cambiar de granularidad resetea la selección de periodos. Los 2 presets nuevos ("últimas 3 semanas", "últimas 12 semanas") se agregan a `PERIOD_PRESETS`, filtrados por granularidad igual que ya se filtran los existentes por Mes.

## Comparación: 3 modos, uno a la vez

```typescript
export type ComparisonMode = 'periodo_anterior' | 'periodo_especifico' | 'meta';
export type ComparisonAlignment = 'calendario' | 'dia_semana';
```

`SalesDataService` gana:
- `comparisonMode: Signal<ComparisonMode>` (default `'periodo_anterior'`, preserva el comportamiento actual).
- `comparisonAlignment: Signal<ComparisonAlignment>` (default `'calendario'`, solo relevante en modo `periodo_anterior` y granularidad Día/Semana).
- `explicitComparisonPeriodIds: Signal<string[] | null>` (los periodos elegidos a mano en modo `periodo_especifico`).

Cálculo del periodo anterior:
- **Alineación calendario** (comportamiento actual, generalizado a los 3 niveles de granularidad): mismo tamaño de ventana, inmediatamente antes, por `order`.
- **Alineación día de semana**: desplaza la ventana hacia atrás en múltiplos de 7 días (`startDate`/`endDate`) para que cada día de la ventana de comparación caiga en el mismo día de semana que su contraparte en la ventana seleccionada. Solo se ofrece (el toggle es visible) cuando la granularidad activa es Día o Semana — en Semana el resultado coincide siempre con el calendario (una semana completa ya alinea día-a-día), así que el toggle en Semana es más una confirmación visual que un cambio real de cálculo; en Mes el selector de alineación no se muestra porque un mes no tiene un único día de semana.

Componente nuevo `ComparisonSelectorComponent` (`src/app/components/shared/comparison-selector/`), ubicado junto al Period Picker en el Header Global:
- Selector de modo (3 botones/tabs): Periodo Anterior | Periodo Específico | Meta.
- Toggle de alineación, condicional (solo modo Periodo Anterior + granularidad Día/Semana).
- Trigger de "elegir periodo de comparación", condicional (solo modo Periodo Específico) — abre un picker de periodos independiente de la selección principal, misma granularidad activa.

KPI cards, gráfico de distribución y tabla de Detalle de Ventas siguen leyendo "cuál es el delta a mostrar" de la misma forma que hoy (un signal computado en `SalesDataService`) — cambia de dónde sale ese delta, no cómo se consume.

## Meta

```typescript
export interface KpiMetaMensual {
  ventasTotales: number;
  transacciones: number;
  unidadesPorTransaccion: number;
  ticketPromedio: number;
}
```

Valores mock fijos, mensuales, en un nuevo `kpi-metas.mock.ts`. Al seleccionar un rango, la meta comparada escala: meta mensual × (cantidad de meses equivalentes al rango seleccionado) — para Mes es directo (× cantidad de meses); para Semana y Día se escala proporcionalmente (meta mensual ÷ semanas-promedio-por-mes × semanas seleccionadas; meta mensual ÷ días-promedio-por-mes × días seleccionados). En modo "Meta", cada KPI card muestra el % de cumplimiento contra ese valor escalado, coloreado con el `comparisonBand` binario-ish existente (good/medium/bad) — el semáforo de 3+ colores graduado es del sub-proyecto 2.

## Testing

- Generación de periodos por granularidad: cantidad correcta de periodos por familia, ids con el formato esperado, `startDate`/`endDate` consistentes.
- `getDayOfWeek(date)`: casos conocidos (una fecha de cada día de la semana).
- Cálculo de periodo anterior: alineación calendario vs. día de semana, para Día/Semana/Mes, incluyendo el caso "Semana con cualquier alineación da el mismo resultado".
- Escalado de meta: 1 mes, 3 meses, N semanas, N días.
- Sin tests de componente nuevos para `ComparisonSelectorComponent` ni para los cambios de `PeriodPickerComponent` — mismo criterio que fases anteriores: cambios de template se verifican por build + chequeo visual.

## Criterio de aceptación

- Con el tenant retail y datos mock, se puede seleccionar Día, Semana o Mes en el Period Picker, con los presets de Semana disponibles.
- Se puede elegir modo de comparación (Periodo Anterior / Periodo Específico / Meta) y ver el delta correspondiente reflejado en KPI cards; Periodo Anterior y su alineación (cuando aplica) también se reflejan en el gráfico de distribución y la tabla de Detalle de Ventas.
- En modo Meta, las KPI cards muestran % de cumplimiento contra un valor de meta escalado al rango seleccionado, usando el semáforo binario-ish existente.
- Verificación visual en navegador de los 3 modos y las 3 granularidades.
