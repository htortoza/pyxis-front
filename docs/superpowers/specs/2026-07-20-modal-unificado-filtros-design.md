# Modal Unificado de Filtros

## Objetivo

Hoy el Header Global tiene 3 popovers independientes (Contexto Sector/Marca/Tienda, Período, Comparación) más 2 botones sueltos de IVA — cada uno con su propio draft/apply, y "Vistas Guardadas" vive escondida dentro del popover de Contexto, guardando solo período + contexto (ni comparación ni IVA). Se unifican los 4 en un solo modal, con un único Aplicar y una sola acción de Guardar que captura la configuración completa.

## Fuera de alcance

- No se agregan filtros nuevos — es una reorganización de UI + extensión del modelo de Vistas Guardadas para cubrir lo que ya existe (comparación, IVA).
- No se toca la lógica de negocio de ningún filtro (cálculo de periodo anterior, escalado de meta, `applyIvaMode`, árbol de contexto) — solo dónde y cómo se editan y se guardan.
- No se cambia el resto de la UI de Ventas General / Detalle de Ventas fuera del header.

## Estado actual (verificado en código)

- `ContextFilterComponent`, `PeriodPickerComponent`, `ComparisonSelectorComponent`: cada uno es un botón trigger + `p-popover` con su propio draft signal, reseteado en `onPopoverShow()` y comprometido en `apply(popover)`.
- IVA: 2 `p-button` sueltos directamente en `global-header.html`, sin draft — escriben `salesData.ivaMode` al instante.
- `SavedView` (`saved-view.model.ts`): `{ id, label, ownerId, ownerName, tenantId, scope, periodIds, compareToPrevious, checkedNodeIds, createdAt, lastUsedAt }`. No incluye granularidad, modo/alineación de comparación, período de comparación explícito, ni IVA.
- `SavedViewsService.saveCurrentSelection`/`applyView` leen/escriben solo esos campos existentes contra `SalesDataService`.
- `saved-views.utils.ts#isSavedView` es un type guard estricto: exige la presencia exacta de los campos actuales al cargar de `localStorage`, o descarta el registro entero (`parsed.filter(isSavedView)`).
- `FilterChipsSummaryComponent`: chip de período (si la selección de `selectedPeriodIds` difiere de `DEFAULT_SELECTED_PERIOD_IDS`) + un chip por Tienda en `sectorMarcaTiendaFilter`. No sabe nada de comparación, granularidad ni IVA.

## Arquitectura

### Header

`global-header.html` reemplaza los 3 triggers + los 2 botones de IVA por un único `p-button` "Filtros" que abre `FiltersModalComponent` (`p-dialog`, no popover — el contenido es demasiado grande para un popover).

### `FiltersModalComponent` (nuevo)

`src/app/components/shared/filters-modal/filters-modal.ts/.html/.css`

Dueño de **todo** el draft state, reseteado en `(onShow)` del `p-dialog` a partir del estado aplicado actual de `SalesDataService`:

```typescript
protected readonly draftCheckedIds = signal<Set<string>>(new Set());           // contexto
protected readonly draftGranularity = signal<PeriodGranularity>('mes');
protected readonly draftPeriodIds = signal<Set<string>>(new Set());
protected readonly draftCompare = signal<boolean>(true);
protected readonly draftComparisonMode = signal<ComparisonMode>('periodo_anterior');
protected readonly draftComparisonAlignment = signal<ComparisonAlignment>('calendario');
protected readonly draftExplicitComparisonPeriodIds = signal<Set<string>>(new Set());
protected readonly draftIvaMode = signal<IvaMode>('con_iva');
```

Un solo `apply()` escribe los 8 valores a `SalesDataService` de una vez y cierra el diálogo; un solo `cancel()` cierra sin tocar nada. Cerrar el `p-dialog` por cualquier otra vía (botón X, ESC, click afuera) se comporta igual que `cancel()` — nunca aplica el draft.

**Layout** (layout C, aprobado): `p-dialog` ancho (~1100px), 2 columnas internas vía CSS grid:
- Columna izquierda angosta, fija: sección Vistas Guardadas (lista + botón "Guardar vista actual").
- Columna derecha, área principal: fila superior con el panel de Contexto a ancho completo; fila inferior con 3 columnas iguales — Período | Comparación | IVA.
- Pie del modal (fuera del grid, ancho completo): botones Cancelar / Aplicar.

### Secciones (de smart+popover a presentacionales)

Los 3 componentes existentes pierden su trigger button y su `p-popover` wrapper — la lógica de navegación/búsqueda interna (transitoria, no parte del draft aplicable) se queda igual, pero el draft que hoy es interno pasa a ser `input()`/`output()` desde `FiltersModalComponent`:

- **`ContextFilterComponent`**: `checkedIds = input.required<Set<string>>()`, `checkedIdsChange = output<Set<string>>()`. Todo lo demás (navSectorId, búsquedas, columnas, badges) se queda igual, ya que opera sobre `checkedIds()` sea cual sea su origen.
- **`PeriodPickerComponent`**: `granularity = input.required<PeriodGranularity>()`, `granularityChange = output<PeriodGranularity>()`, `periodIds = input.required<Set<string>>()`, `periodIdsChange = output<Set<string>>()`, `compare = input.required<boolean>()`, `compareChange = output<boolean>()`.
- **`ComparisonSelectorComponent`**: `granularity = input.required<PeriodGranularity>()` (para decidir si mostrar el toggle de alineación — hoy lee `salesData.selectedPeriodGranularity()` directo, pasa a leer el draft del modal), `mode`/`modeChange`, `alignment`/`alignmentChange`, `explicitPeriodIds`/`explicitPeriodIdsChange`.
- **IVA**: sin componente propio — 2 `p-button` inline en `filters-modal.html`, igual que hoy en el header pero atados a `draftIvaMode`.

La sección de Vistas Guardadas de `context-filter.html`/`.ts` (búsqueda, lista, guardar/renombrar/eliminar/duplicar) se extrae a un componente nuevo:

- **`SavedViewsSidebarComponent`** (`src/app/components/shared/saved-views-sidebar/`): mismo comportamiento que hoy (aplicar una vista escribe **directo** a `SalesDataService` vía `SavedViewsService.applyView`, sin pasar por el draft del modal — igual que hoy), pero después de aplicar, emite un evento `viewApplied` que `FiltersModalComponent` escucha para resincronizar sus 8 draft signals desde `SalesDataService` (mismo patrón que ya usa `context-filter.ts#onApplyView` hoy, generalizado a los 8 campos). El formulario de guardar (`openSaveForm`/`confirmSave`) pasa a leer el **draft** del modal (no el estado ya aplicado), para que "Guardar" capture lo que el usuario está configurando ahora mismo, lo haya aplicado o no todavía.

## Modelo de datos

### `SavedView` extendido

```typescript
export interface SavedView {
  id: string;
  label: string;
  ownerId: string;
  ownerName: string;
  tenantId: string;
  scope: SavedViewScope;
  periodIds: string[];
  granularity: PeriodGranularity;
  compareToPrevious: boolean;
  comparisonMode: ComparisonMode;
  comparisonAlignment: ComparisonAlignment;
  explicitComparisonPeriodIds: string[] | null;
  ivaMode: IvaMode;
  checkedNodeIds: string[];
  createdAt: string;
  lastUsedAt: string;
}
```

### Compatibilidad hacia atrás (localStorage)

Las vistas ya persistidas (creadas antes de este cambio, incluida `seedDefaultViews`) no tienen los 5 campos nuevos. `isSavedView` en `saved-views.utils.ts` deja de exigirlos como presentes: los valida como opcionales y `loadSavedViews` normaliza cada registro cargado rellenando los que falten con los defaults que ya representan su comportamiento actual implícito:

```typescript
granularity: 'mes'                        // todo período pre-granularidad era Mes
comparisonMode: 'periodo_anterior'        // único modo que existía
comparisonAlignment: 'calendario'         // único criterio que existía
explicitComparisonPeriodIds: null         // el modo explícito no existía
ivaMode: 'con_iva'                        // el toggle no existía, monto sin ajustar
```

`seedDefaultViews` se actualiza para incluir los 5 campos explícitamente (mismos valores default de arriba), en vez de depender de la normalización de carga.

### `SavedViewsService`

- `saveCurrentSelection` gana los campos correspondientes en su parámetro `input` y los persiste.
- `applyView` gana la escritura de los 5 signals nuevos a `SalesDataService` (`selectedPeriodGranularity`, `comparisonMode`, `comparisonAlignment`, `explicitComparisonPeriodIds`, `ivaMode`), igual patrón que ya usa para `selectedPeriodIds`/`compareToPrevious`.

## Chips de resumen (`FilterChipsSummaryComponent`)

- Chip de período: se activa si `selectedPeriodIds` difiere de `DEFAULT_SELECTED_PERIOD_IDS` **o** si `selectedPeriodGranularity() !== 'mes'`.
- Chip nuevo de comparación: visible solo si `comparisonMode() !== 'periodo_anterior'`, con label `Comparación: Periodo Específico` o `Comparación: Meta` (reutiliza el mismo texto que `ComparisonSelectorComponent.modeLabel`).
- Chip nuevo de IVA: visible solo si `ivaMode() !== 'con_iva'`, label fijo `Sin IVA`.
- Ninguno de los 2 chips nuevos es removible individualmente (a diferencia de los chips de Tienda) — clickear "Limpiar filtros" ya resetea todo; no se agrega una acción de "quitar solo la comparación" o "quitar solo IVA" por ahora (YAGNI, nadie lo pidió).

## Testing

- `isSavedView`/normalización de carga: un registro con el shape viejo (sin los 5 campos nuevos) se carga con los defaults correctos; un registro con el shape nuevo se carga tal cual; un registro corrupto (falta un campo real, ej. `id`) se sigue descartando.
- `FilterChipsSummaryComponent`: chip de comparación aparece/desaparece según `comparisonMode`; chip de IVA aparece/desaparece según `ivaMode`; chip de período se activa por granularidad no-default aunque la selección de ids sea la default.
- Sin tests de componente nuevos para `FiltersModalComponent`/`SavedViewsSidebarComponent` ni para la conversión de los 3 paneles a `input()`/`output()` — mismo criterio que sub-proyectos anteriores: cambios de template/composición se verifican por build + chequeo visual en navegador.

## Criterio de aceptación

- El header muestra un único botón "Filtros" (sin los 3 triggers ni los botones de IVA sueltos).
- El modal muestra Contexto, Período, Comparación e IVA simultáneamente (sin tabs/acordeón), con Vistas Guardadas en un sidebar fijo a la izquierda.
- Aplicar desde el modal escribe los 8 valores de una vez; Cancelar no toca nada.
- Aplicar una vista guardada desde el sidebar sigue siendo instantáneo (como hoy), y además deja el resto del modal (los paneles de la derecha) reflejando lo que esa vista trae.
- Guardar una vista nueva captura contexto + período + granularidad + comparación (modo, alineación, período explícito si aplica) + IVA, todo junto.
- Las 2 vistas sembradas (`seed-solo-costanera`, `seed-barra-chalaca`) y cualquier vista guardada por el usuario en sesiones anteriores de este mismo navegador se siguen viendo y aplicando correctamente tras el cambio.
- La fila de chips debajo del header refleja período+granularidad, tiendas, comparación (si no es default) e IVA (si no es default).
- Verificación visual en navegador: abrir el modal, configurar cada sección, aplicar, guardar una vista nueva, aplicarla, confirmar que los chips y el resto de la app (KPIs, gráfico, tabla) reflejan el cambio.
