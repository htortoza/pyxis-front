# Cards Tasa de Conversión + Descuentos — Sub-proyecto 2 (parcial) de "Mockup Retail"

## Contexto

Sub-proyecto 2 de la iniciativa "Mockup Retail: Filtros, Comparaciones y Nuevas Cards" (ver [[project_mockup_retail_epic]]) cubre items 5+6+7 (Tasa de Conversión, Descuentos, semáforo graduado). Por pedido explícito del usuario (2026-07-20: "vamos con todo lo que sea visual en un principio"), se pausó el sub-proyecto 1 (Motor de Período y Comparación, Tasks 1-4 de 9 ya hechas) y se adelanta este sub-proyecto. Dentro de él, este documento cubre solo las **2 cards nuevas** (items 5+6) — el semáforo graduado (item 7) queda explícitamente fuera porque depende de que la Meta del sub-proyecto 1 (pausado) esté terminada.

## Objetivo

1. Agregar la card **Tasa de Conversión** a la Franja de Indicadores Clave, en la **primera posición** (jerarquía visual más alta, por encima de Descuentos, según Manuel).
2. Agregar la card **Descuentos Aplicados**, al final de la franja (después de Ticket Promedio), mostrando el descuento aplicado sobre el total de venta.

## Fuera de alcance

- Semáforo graduado de 3+ colores (item 7) — sigue el semáforo simple (good/medium/bad) que ya existe.
- Todo lo demás del sub-proyecto 1 (Motor de Período y Comparación) — sigue pausado. Nota de corrección: al momento de escribir este spec se asumió que `computeKpisAgainstMeta`/`comparison.model.ts` ya existían (Task 6, pausada) — verificado antes de planificar que en realidad Tasks 5 y 6 del sub-proyecto 1 NO se habían empezado todavía, así que no existe ningún código de Meta que actualizar en esta fase. Cuando el sub-proyecto 1 retome la Tarea 6 (Meta), esa tarea deberá incorporar los 2 campos nuevos de `KpiSet` (`descuentos`/`tasaConversion`) a `computeKpisAgainstMeta` en ese momento.
- UI de Meta para estas 2 cards nuevas — no aplica todavía (ver nota arriba).

## Decisiones de diseño

**Tasa de Conversión — valor mock fijo, no reactivo.** No existe ningún concepto de "visitantes"/tráfico en el modelo de datos mock, así que no hay forma honesta de calcularla de `SalesFact`. Se usa un valor de prueba fijo (24.5%) con una serie de tendencia mock fija y un delta fabricado vs. periodo anterior — no reacciona a los filtros de tienda/periodo (fabricar reactividad sobre un dato que no existe sería más engañoso que ser explícito en que es un placeholder).

**Descuentos — calculado de datos reales.** El mock ya tiene hechos de descuento (montos negativos) que alimentan "zDescuentos" en Detalle de Ventas. La card usa `% = |suma de montos negativos| / suma de montos positivos` sobre el mismo scope tienda/periodo que las demás cards, participando en el mismo mecanismo de comparación (delta vs. periodo anterior) que ya existe — es una métrica real, con variabilidad real entre tienda/periodo, necesaria para que el propósito de "detectar anomalías" tenga sentido.

**Orden y grilla.** La franja pasa de 4 a 6 cards: `[Tasa de Conversión] [Ventas Totales] [Transacciones] [Unidades/Transacción] [Ticket Promedio] [Descuentos]`. La grilla CSS pasa de `repeat(4,...)` a `repeat(6,...)`, con un breakpoint nuevo a 3 columnas (además del ya existente a 2 columnas) para que las cards no se aprieten en pantallas medianas.

## Modelo de datos

`KpiSet` (`kpi.model.ts`) gana 2 campos:
```typescript
export interface KpiSet {
  ventasTotales: KpiValue;
  transacciones: KpiValue;
  unidadesPorTransaccion: KpiValue;
  ticketPromedio: KpiValue;
  descuentos: KpiValue;
  tasaConversion: KpiValue;
}
```

Nuevo mock (`data/mock/conversion.mock.ts`) para la Tasa de Conversión:
```typescript
export const TASA_CONVERSION_ACTUAL = 24.5;
export const TASA_CONVERSION_ANTERIOR = 22.7;
export const TASA_CONVERSION_TREND = [21.2, 22.0, 22.7, 23.9, 24.5];
```

`sales-fact.utils.ts` gana:
- `pickDescuentoPct(facts): number` — el cálculo de arriba, reutilizando `sumAmount`.
- `mockTasaConversionKpiValue(): KpiValue` — construye un `KpiValue` fijo a partir de las constantes de `conversion.mock.ts` (mismo `deltaPct` y fórmula que `computeKpiValue`, pero sobre los dos números fijos en vez de facts).
- `computeKpis(...)` agrega `descuentos: build(pickDescuentoPct)` y `tasaConversion: mockTasaConversionKpiValue()` a su objeto de retorno.

## UI

`KpiCardsGridComponent` gana computeds `descuentosValue/Delta/Trend` y `tasaConversionValue/Delta/Trend`, mismo patrón que las 4 existentes (`formatSignedAmount`/`INT_FORMATTER` no aplican — ambas se formatean como porcentaje: `${value.toFixed(1)}%`).

`kpi-cards-grid.html` reordena a 6 `<app-kpi-card>` (Conversión primero, Descuentos al final) y su loading skeleton pasa de 4 a 6 placeholders. `kpi-cards-grid.css` pasa la grilla a 6 columnas con 2 breakpoints (3 columnas / 2 columnas).

## Testing

- `pickDescuentoPct`: casos con solo positivos (0%), con negativos y positivos, con solo negativos (división por 0 → 0, mismo criterio que `pickTicketPromedio`/`pickUnidadesPorTransaccion` ya usan).
- `mockTasaConversionKpiValue`: confirma que devuelve exactamente las constantes de `conversion.mock.ts` y un `deltaPct` calculado correctamente entre ellas.
- Sin tests de componente nuevos para `kpi-cards-grid` — mismo criterio que fases anteriores (template se verifica por build + chequeo visual).

## Criterio de aceptación

- Franja de KPIs muestra 6 cards en el orden especificado, con el tenant retail.
- Tasa de Conversión muestra 24.5% con su sparkline y delta mock, sin cambiar al tocar filtros de tienda/periodo.
- Descuentos muestra un % real, coherente con los hechos de descuento del mock, y cambia según tienda/periodo seleccionados.
- Verificación visual en navegador.
