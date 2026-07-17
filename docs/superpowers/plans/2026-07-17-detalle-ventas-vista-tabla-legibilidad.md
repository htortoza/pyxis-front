# Detalle de Ventas — Vista Tabla: legibilidad de columnas por mes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el par de columnas `{Mes} Total`/`{Mes} Cantidad` de la Vista Tabla de Detalle de Ventas por una sola columna por mes (con un switch Total/Cantidad), y hacer que la tabla use el alto disponible del viewport en vez de un bloque fijo de 600px con doble scroll.

**Architecture:** Cambios acotados a `SalesDetailTreeTableComponent` (único componente que arma las columnas y renderiza la tabla). Sin cambios a `sales-detail-tree.utils.ts` (los datos ya vienen con `total`/`cantidad` por período — el cambio es puramente de qué columnas se piden), sin cambios a Vista Mapa, sin cambios a `app.css`/`.page-body` global.

**Tech Stack:** Angular 21 standalone + Signals, PrimeNG 21 (`p-selectButton`, `p-treeTable`).

## Global Constraints

- Sin Tailwind/utilidades custom — solo CSS semántico con `var(--p-...)` (CLAUDE.md).
- Sin `ngOnInit`/`ngOnDestroy` — usar `signal`/`computed`/`effect`/`DestroyRef` (CLAUDE.md, zoneless).
- Este proyecto no tiene cultura de tests unitarios de componentes (solo existe el `app.spec.ts` por defecto de `ng new`) — la verificación de cada tarea es manual en el navegador (`ng serve` ya corriendo en `http://localhost:4200/`), consistente con cómo se verificó el resto de "Detalle de Ventas". No se inventan specs Karma nuevos para esto.
- Spec de referencia: `docs/superpowers/specs/2026-07-17-detalle-ventas-vista-tabla-legibilidad-design.md`.

---

### Task 1: Switch Total/Cantidad reemplaza el par de columnas por mes

**Files:**
- Modify: `src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.ts:1-42, 248-260`
- Modify: `src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.html:1-39`
- Modify: `src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.css:58-63`

**Interfaces:**
- Produces: `protected readonly metric: WritableSignal<'total' | 'cantidad'>` (default `'total'`), `protected readonly metricOptions: MetricOption[]`. Task 2 does not touch either.
- Consumes: nothing new from elsewhere — `DetailColumn`, `cellValue()`, `columns()` already exist (`sales-detail-tree-table.ts:36-42, 248-260, 385-394`); this task changes `columns()`'s body only, not its return type or `cellValue()`.

- [ ] **Step 1: Add the `SelectButton` import and the metric type/options**

In `src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.ts`, add the import alongside the other PrimeNG imports (after line 21, `import { TreeTableModule } from 'primeng/treetable';`):

```typescript
import { SelectButton } from 'primeng/selectbutton';
```

Then, right after the `DetailColumn` interface (after line 42, before `interface LoadMoreRowData`), add:

```typescript
type Metric = 'total' | 'cantidad';

interface MetricOption {
  label: string;
  value: Metric;
}

const METRIC_OPTIONS: MetricOption[] = [
  { label: 'Total', value: 'total' },
  { label: 'Cantidad', value: 'cantidad' },
];
```

- [ ] **Step 2: Register `SelectButton` in the component's `imports` array**

In the `@Component` decorator's `imports` array (line 186-195), add `SelectButton` next to `InputText`:

```typescript
  imports: [
    FormsModule,
    PrimeTemplate,
    IconField,
    InputIcon,
    InputText,
    SelectButton,
    TreeTableModule,
    SignedAmountPipe,
    MiniSparklineComponent,
  ],
```

- [ ] **Step 3: Add the `metric` signal and `metricOptions` field**

Right after `protected readonly searchDebounced = ...` (after line 224, before `private readonly visibleCounts = signal<ReadonlyMap<string, number>>(new Map());`), add:

```typescript
  protected readonly metric = signal<Metric>('total');
  protected readonly metricOptions = METRIC_OPTIONS;
```

- [ ] **Step 4: Rewrite `columns()` to emit one column per period, driven by `metric()`**

Replace the existing `columns` computed (lines 248-260):

```typescript
  protected readonly columns = computed<DetailColumn[]>(() => {
    const selected = new Set(this.selectedPeriodIds());
    const orderedPeriods = this.periods().filter((period) => selected.has(period.id));

    const cols: DetailColumn[] = [];
    for (const period of orderedPeriods) {
      cols.push({ field: `total_${period.id}`, header: `${period.label} Total`, kind: 'total', periodId: period.id });
      cols.push({ field: `cantidad_${period.id}`, header: `${period.label} Cantidad`, kind: 'cantidad', periodId: period.id });
    }
    cols.push({ field: 'consolidadoTotal', header: 'Consolidado Total', kind: 'total', periodId: null });
    cols.push({ field: 'consolidadoCantidad', header: 'Consolidado Cantidad', kind: 'cantidad', periodId: null });
    return cols;
  });
```

with:

```typescript
  protected readonly columns = computed<DetailColumn[]>(() => {
    const selected = new Set(this.selectedPeriodIds());
    const orderedPeriods = this.periods().filter((period) => selected.has(period.id));
    const metric = this.metric();

    const cols: DetailColumn[] = orderedPeriods.map((period) => ({
      field: `${metric}_${period.id}`,
      header: period.label,
      kind: metric,
      periodId: period.id,
    }));
    cols.push({ field: 'consolidadoTotal', header: 'Consolidado Total', kind: 'total', periodId: null });
    cols.push({ field: 'consolidadoCantidad', header: 'Consolidado Cantidad', kind: 'cantidad', periodId: null });
    return cols;
  });
```

`cellValue()` (lines 385-394) needs no change — it already branches on `col.kind` and `col.periodId`, both of which still exist with the same meaning.

- [ ] **Step 5: Add the metric toggle to the template, above the table**

In `src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.html`, wrap the existing search field and the new toggle in a shared row. Replace lines 1-15:

```html
<p-iconfield class="detail-tree-search">
  <p-inputicon>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  </p-inputicon>
  <input
    pInputText
    type="text"
    placeholder="Buscar familia, subfamilia o artículo..."
    [ngModel]="searchRaw()"
    (ngModelChange)="searchRaw.set($event)"
  />
</p-iconfield>
```

with:

```html
<div class="detail-tree-toolbar">
  <p-iconfield class="detail-tree-search">
    <p-inputicon>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </p-inputicon>
    <input
      pInputText
      type="text"
      placeholder="Buscar familia, subfamilia o artículo..."
      [ngModel]="searchRaw()"
      (ngModelChange)="searchRaw.set($event)"
    />
  </p-iconfield>

  <p-selectButton
    class="detail-tree-metric-toggle"
    [options]="metricOptions"
    optionLabel="label"
    optionValue="value"
    [ngModel]="metric()"
    (onChange)="metric.set($event.value)"
  />
</div>
```

- [ ] **Step 6: Add `.detail-tree-toolbar` layout CSS and narrow the amount column**

In `src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.css`, replace the existing `.detail-tree-search` rule (lines 5-9):

```css
.detail-tree-search {
  display: block;
  max-width: 22rem;
  margin-bottom: 1rem;
}
```

with:

```css
.detail-tree-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-tree-search {
  display: block;
  max-width: 22rem;
  flex: 1;
}
```

Then narrow the amount column now that headers are short month names instead of `"{Mes} Total"` (replace lines 58-63):

```css
.detail-tree-amount-col {
  width: 9rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
```

with:

```css
.detail-tree-amount-col {
  width: 7rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
```

- [ ] **Step 7: Verify in the browser**

The dev server is already running at `http://localhost:4200/`. Navigate to Detalle de Ventas → Vista Tabla.

Expected:
- A "Total | Cantidad" toggle appears to the right of the search box, defaulting to "Total".
- Each period column header shows only the month name (e.g. "Julio"), not "Julio Total".
- Clicking "Cantidad" swaps every period column to show quantities instead, without collapsing any expanded row or losing the search filter.
- "Consolidado Total" and "Consolidado Cantidad" stay visible at the end regardless of the toggle.
- With the default 3-month selection, the table should need noticeably less (or no) horizontal scroll compared to before.

- [ ] **Step 8: Commit**

```bash
git add src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.ts src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.html src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.css
git commit -m "feat: switch Total/Cantidad reemplaza columnas dobles por mes en Detalle de Ventas"
```

---

### Task 2: La tabla usa el alto disponible del viewport (un solo scroll)

**Files:**
- Modify: `src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.ts:1-12, 200-330`
- Modify: `src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.html` (the `p-treeTable` tag)

**Interfaces:**
- Produces: `protected readonly scrollHeight: Signal<string>` — a CSS height string (`"calc(100vh - Npx)"`), bound to `p-treeTable`'s `[scrollHeight]`.
- Consumes: `this.elementRef` (already injected, line 218), the existing `afterNextRender` block (lines 265-287) — this task extends it rather than adding a second one.

**Rationale for the mechanism:** `.app-content` (`src/app/app.css:20-28`) is deliberately `min-height: 100vh` with no `overflow` set, so the *real page* scrolls and `GlobalHeaderComponent`'s `position: sticky` sticks to it — changing that to a bounded-height flex shell (which `scrollHeight="flex"` would need) breaks that sticky behavior app-wide. Instead, this task measures the tree-table wrapper's real top offset at runtime (same technique already used for `stickyLabelTop`) and sets `scrollHeight` to `calc(100vh - <that offset>px - 32px)` (32px = `.page-body`'s own bottom padding, `detalle-ventas.css:18-26`) — the table fills the rest of the viewport without touching `.app-content`, `.page-body`, or the global header at all.

- [ ] **Step 1: Add a `scrollHeight` signal and a measurement function**

In `sales-detail-tree-table.ts`, add near the other layout-measurement signals (right after `protected readonly stickyLabelTop = signal('0px');`, before line 240's `protected readonly displayTree`):

```typescript
  /** CSS height string for p-treeTable's own [scrollHeight] -- computed from the wrapper's
   * real top offset (same technique as stickyLabelTop above) so the table fills the rest of
   * the viewport instead of a fixed guessed pixel value. 600px is only the pre-measurement
   * fallback for the very first paint. */
  protected readonly scrollHeight = signal('600px');
```

Then add the measurement function as a private method (near `updateStickyLabel`, after line 330):

```typescript
  /** .page-body's own bottom padding (detalle-ventas.css) -- kept as a named constant here
   * since this component has no dependency on that page's CSS to read it from. */
  private static readonly PAGE_BOTTOM_PADDING_PX = 32;

  private updateScrollHeight(): void {
    const wrapper = this.elementRef.nativeElement.querySelector<HTMLElement>('.detail-tree-table-wrapper');
    if (!wrapper) return;
    const top = wrapper.getBoundingClientRect().top;
    this.scrollHeight.set(`calc(100vh - ${top}px - ${SalesDetailTreeTableComponent.PAGE_BOTTOM_PADDING_PX}px)`);
  }
```

- [ ] **Step 2: Call it after first render and on window resize, with cleanup via `DestroyRef`**

Add `DestroyRef` to the imports from `@angular/core` (line 1-12):

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
```

Inject it alongside `elementRef` (after line 218, `private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);`):

```typescript
  private readonly destroyRef = inject(DestroyRef);
```

In the constructor's existing `afterNextRender(() => { ... })` block (lines 265-287), add the initial measurement and the resize listener right after the existing sticky-header-height measurement (after the `if (header) { ... }` block, before `let rafPending = false;`):

```typescript
      this.updateScrollHeight();

      const onResize = () => this.updateScrollHeight();
      window.addEventListener('resize', onResize);
      this.destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));
```

- [ ] **Step 3: Bind `[scrollHeight]` in the template instead of the hardcoded string**

In `sales-detail-tree-table.html`, replace:

```html
    scrollHeight="600px"
```

with:

```html
    [scrollHeight]="scrollHeight()"
```

- [ ] **Step 4: Verify in the browser**

Reload `http://localhost:4200/` on Detalle de Ventas → Vista Tabla.

Expected:
- The table's own scrollable area now extends close to the bottom of the viewport (not a small fixed 600px box with empty page space below it on a tall screen).
- Only one scrollbar is visible for the page (the table's internal one) — the outer page should not also scroll when the table's content is short.
- Resizing the browser window (drag it shorter/taller) updates the table's height live.
- Expanding a Familia with many artículos scrolls inside the table, not the page.

- [ ] **Step 5: Commit**

```bash
git add src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.ts src/app/pages/detalle-ventas/sales-detail-tree-table/sales-detail-tree-table.html
git commit -m "feat: la tabla de Detalle de Ventas usa el alto disponible del viewport"
```

---

## Self-Review Notes

- **Spec coverage:** §1 (switch Total/Cantidad) → Task 1. §2 (alto flexible) → Task 2 (mechanism changed from `scrollHeight="flex"` to a measured `calc(100vh - ...)`, for the documented sticky-header reason above — same UX outcome). §3 (ancho 7rem) → Task 1, Step 6. "Fuera de alcance" items are untouched by both tasks.
- **Placeholder scan:** none found — every step has literal code.
- **Type consistency:** `Metric` (Task 1) is only used inside `sales-detail-tree-table.ts`; `DetailColumn.kind` was already typed `'total' | 'cantidad'` (line 39), so `Metric` is structurally identical and assignable without a cast. `scrollHeight` (Task 2) is a plain `Signal<string>`, consumed once in the template.
