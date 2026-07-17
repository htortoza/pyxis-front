# Detalle de Ventas — Vista Tabla: legibilidad de columnas por mes

## Problema

`SalesDetailTreeTableComponent` (`src/app/pages/detalle-ventas/sales-detail-tree-table/`) genera dos columnas por cada período seleccionado (`{Mes} Total`, `{Mes} Cantidad`), más Consolidado Total/Cantidad. Esto trae dos problemas de UX confirmados con el usuario:

1. **Scroll horizontal innecesario incluso en el caso típico** (1-3 meses seleccionados, que es el uso real casi siempre — los presets de 6/12/36 meses existen pero se usan poco).
2. **Agrupación de mes ilegible**: "Abril Total" y "Abril Cantidad" son dos `<th>` sueltos, sin ningún indicador visual de que pertenecen al mismo mes — se leen como dos meses distintos.

Además, la tabla usa una altura fija (`scrollHeight="600px"`) con su propio scroll interno, anidada dentro de una página que también scrollea → doble scrollbar.

No se pretende que **todos** los ~583 artículos y los 36 períodos posibles quepan sin ningún scroll — eso es físicamente imposible en una pantalla real. El objetivo es: cero ambigüedad de qué columna pertenece a qué mes, y que el caso de uso típico (1-3 meses) no obligue a scrollear horizontalmente.

## Diseño

### 1. Switch Total/Cantidad reemplaza las columnas dobles por mes

Se agrega un `p-selectButton` con dos opciones — **Total** / **Cantidad** (default: `Total`) — ubicado junto al buscador existente, mismo patrón visual que el toggle Vista Tabla/Vista Mapa de `detalle-ventas.html`.

Según la opción activa, `columns()` genera **una sola columna por período seleccionado**, con header = solo el nombre del mes (`"Abril"`, sin sufijo). Esto elimina la ambigüedad de agrupación de raíz: no hay un par de columnas por mes que agrupar visualmente, porque ya no hay un par.

`Consolidado Total` y `Consolidado Cantidad` se mantienen **siempre visibles ambas**, al final, sin verse afectadas por el switch — su header ya es inequívoco (dice "Consolidado", no un nombre de mes).

`cellValue()` sigue devolviendo `total` o `cantidad` según `col.kind`, sin cambios; lo único que cambia es qué columnas arma `columns()`.

### 2. La tabla ocupa el alto disponible

- `scrollHeight="600px"` → `scrollHeight="flex"` (soportado nativamente por `p-treeTable`).
- El wrapper de la tabla (`.detail-tree-table-wrapper` y sus contenedores en `detalle-ventas.html`) pasa a layout flex (`display: flex; flex-direction: column; flex: 1; min-height: 0`) para que la tabla crezca hasta llenar el espacio debajo del buscador.
- Resultado: un solo scrollbar (el de la tabla), no scroll de página + scroll interno.

### 3. Ancho de columnas de período

Con headers cortos (`"Abril"` en vez de `"Abril Total"`), `.detail-tree-amount-col` baja de `9rem` a `7rem` para que entren más meses antes de necesitar scroll horizontal. El scroll horizontal sigue existiendo como fallback razonable cuando se seleccionan muchos meses (6+) — contenido dentro de la tabla, nunca de toda la página.

### Fuera de alcance

- El árbol Familia/Subfamilia/Artículo, la carga progresiva ("cargar más"), el sticky label de Familia/Subfamilia, el buscador con debounce, y el sparkline de tendencia por fila: sin cambios.
- Vista Mapa (treemap): sin cambios, este spec es exclusivo de Vista Tabla.
- No se agrega ningún límite a la cantidad de períodos seleccionables (fuera de alcance, es un cambio en `period-picker`, no en esta tabla).

## Archivos afectados

- `src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.ts` — nuevo signal `metric` (`'total' | 'cantidad'`), `columns()` computed usa `metric()` en vez de generar el par fijo.
- `src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.html` — agrega el `p-selectButton`, ajusta el `scrollHeight`.
- `src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.css` — `scrollHeight="flex"` layout (flex column, `min-height: 0`), `.detail-tree-amount-col` a `7rem`.
- `src/app/pages/detalle-ventas/detalle-ventas.html` / `.css` — el `<main>`/wrapper que contiene `<app-sales-detail-tree-table>` pasa a flex para que `scrollHeight="flex"` tenga un padre con altura real de la cual heredar.

## Testing

Verificación manual en el navegador (`ng serve`, ya corriendo):

- Con la selección default (3 meses): la tabla no debería requerir scroll horizontal en una ventana de laptop estándar (~1440px).
- Cambiar el switch Total ↔ Cantidad: las columnas de mes deben actualizarse sin perder el estado de expansión de filas ni el foco de Familia/Subfamilia compartido con Vista Mapa.
- Seleccionar 12 meses (preset "Año Anterior"): debe aparecer scroll horizontal contenido dentro de la tabla, sin que la página entera se ensanche.
- Expandir una Familia con muchos artículos: la tabla debe scrollear verticalmente dentro de sí misma llenando el alto disponible, sin quedar un espacio vacío fijo de 600px ni un doble scrollbar.
