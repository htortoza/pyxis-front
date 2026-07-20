# Cards Tasa de Conversión + Descuentos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new cards to the KPI strip (Ventas General) — Tasa de Conversión (mock, highest visual priority, first position) and Descuentos Aplicados (real, computed from existing mock discount facts, last position).

**Architecture:** `KpiSet` gains 2 fields. Descuentos is computed the same way every other KPI already is (a `pick` function fed through `computeKpiValue`/`buildKpiTrendPoints`, fully reactive to filters/comparison). Tasa de Conversión is a fixed mock value (no underlying data exists to compute it from) built once, not reactive to filters. `KpiCardsGridComponent` and its template/CSS extend from 4 to 6 cards.

**Tech Stack:** Angular 21 (standalone components, signals, `inject()`), TypeScript, Vitest (`ng test`).

## Global Constraints

- No Tailwind, no utility CSS, no inline styles — CSS grid changes follow the existing `minmax(0, 1fr)` + `@container` pattern already in `kpi-cards-grid.css`.
- Tasa de Conversión must NOT react to store/period filters — it's an explicit mock placeholder (no visitor/traffic data exists anywhere in this app), not a fabricated computation.
- Descuentos must be a real computation from `SalesFact.amount` (positive vs negative), fully participating in the existing comparison/filter pipeline like every other KPI.
- Card order in the strip: Tasa de Conversión first, then the 4 existing cards unchanged, then Descuentos last.
- Out of scope: the graduated 3+ color semaphore (a separate, later sub-project depending on the paused Motor de Período y Comparación work), any Meta-mode UI for these 2 cards, and anything else from that paused sub-project.

---

### Task 1: `KpiSet` gana 2 campos; Descuentos y Tasa de Conversión calculados

**Files:**
- Modify: `src/app/data/models/kpi.model.ts`
- Create: `src/app/data/mock/conversion.mock.ts`
- Modify: `src/app/data/utils/sales-fact.utils.ts`
- Test: `src/app/data/utils/sales-fact.utils.spec.ts`

**Interfaces:**
- Produces: `KpiSet.descuentos: KpiValue`, `KpiSet.tasaConversion: KpiValue`, `pickDescuentoPct(facts: SalesFact[]): number`, `mockTasaConversionKpiValue(): KpiValue`. Task 2 depends on these exact names via `SalesDataService.kpis()`.

- [ ] **Step 1: Extend `KpiSet`**

Modify `src/app/data/models/kpi.model.ts` — full new content:

```typescript
/** One historical point for a KPI card's sparkline -- only ever built from real loaded facts. */
export interface TrendPoint {
  periodId: string;
  value: number;
}

export interface KpiValue {
  current: number;
  previous: number;
  deltaPct: number | null; // null when previous is 0 (no meaningful % change, and no real previous-period data)
  /** Candidate sparkline points (see buildKpiTrendPoints) -- NOT yet threshold-checked; the card decides whether trend.length is enough to draw a line. */
  trend: TrendPoint[];
}

export interface KpiSet {
  ventasTotales: KpiValue;
  transacciones: KpiValue;
  unidadesPorTransaccion: KpiValue;
  ticketPromedio: KpiValue;
  descuentos: KpiValue;
  tasaConversion: KpiValue;
}
```

- [ ] **Step 2: Create the mock Tasa de Conversión constants**

Create `src/app/data/mock/conversion.mock.ts`:

```typescript
/**
 * Valores de prueba para la card "Tasa de Conversión" -- no existe ningún concepto de
 * visitantes/tráfico en el modelo de datos mock, así que este KPI no se puede calcular
 * honestamente de SalesFact. Fijo y no reactivo a filtros de tienda/periodo a propósito.
 */
export const TASA_CONVERSION_ACTUAL = 24.5;
export const TASA_CONVERSION_ANTERIOR = 22.7;
export const TASA_CONVERSION_TREND = [21.2, 22.0, 22.7, 23.9, 24.5];
```

- [ ] **Step 3: Write the failing tests**

Modify `src/app/data/utils/sales-fact.utils.spec.ts` — add this import (alongside the existing ones):

```typescript
import { TASA_CONVERSION_ACTUAL, TASA_CONVERSION_ANTERIOR, TASA_CONVERSION_TREND } from '../mock/conversion.mock';
```

and change the existing `sales-fact.utils` import line to also bring in the 2 new functions (the paused Motor de Período y Comparación plan's `computeKpisAgainstMeta`/`scaleMeta` do NOT exist on this branch yet — verified on disk before writing this plan — so they are not part of this import):

```typescript
import {
  buildHeatmapMatrix,
  buildKpiTrendPoints,
  filterFacts,
  mockTasaConversionKpiValue,
  pickDescuentoPct,
} from './sales-fact.utils';
```

Append these tests at the end of the file:

```typescript

describe('pickDescuentoPct', () => {
  it('returns 0 when there are no negative-amount facts', () => {
    expect(pickDescuentoPct([fact({ amount: 1000 }), fact({ amount: 2000 })])).toBe(0);
  });

  it('returns the discount percentage relative to positive sales', () => {
    const facts = [fact({ amount: 1000 }), fact({ amount: -200 })];
    expect(pickDescuentoPct(facts)).toBeCloseTo(20, 5);
  });

  it('returns 0 when there are no positive-amount facts (avoids division by zero)', () => {
    expect(pickDescuentoPct([fact({ amount: -200 })])).toBe(0);
  });
});

describe('mockTasaConversionKpiValue', () => {
  it('returns the fixed mock current/previous/trend values, not derived from any facts', () => {
    const kpi = mockTasaConversionKpiValue();
    expect(kpi.current).toBe(TASA_CONVERSION_ACTUAL);
    expect(kpi.previous).toBe(TASA_CONVERSION_ANTERIOR);
    expect(kpi.deltaPct).toBeCloseTo(
      ((TASA_CONVERSION_ACTUAL - TASA_CONVERSION_ANTERIOR) / TASA_CONVERSION_ANTERIOR) * 100,
      5,
    );
    expect(kpi.trend.map((p) => p.value)).toEqual(TASA_CONVERSION_TREND);
  });
});
```

- [ ] **Step 4: Run the tests to verify they fail**

Run: `npx ng test --watch=false --include='**/sales-fact.utils.spec.ts'`
Expected: FAIL — `pickDescuentoPct`/`mockTasaConversionKpiValue` are not exported yet.

- [ ] **Step 5: Implement `pickDescuentoPct`, `mockTasaConversionKpiValue`, and wire them into `computeKpis`**

Modify `src/app/data/utils/sales-fact.utils.ts` — add this import at the top (alongside the existing ones):

```typescript
import { TASA_CONVERSION_ACTUAL, TASA_CONVERSION_ANTERIOR, TASA_CONVERSION_TREND } from '../mock/conversion.mock';
```

Add these two functions right after `pickTicketPromedio` (before the `MIN_TREND_POINTS` comment):

```typescript
export function pickDescuentoPct(facts: SalesFact[]): number {
  const positive = sumAmount(facts.filter((f) => f.amount > 0));
  const negative = Math.abs(sumAmount(facts.filter((f) => f.amount < 0)));
  return positive === 0 ? 0 : (negative / positive) * 100;
}

/** No hay datos de visitantes/tráfico en este mock -- valor de prueba fijo, no derivado de facts. */
export function mockTasaConversionKpiValue(): KpiValue {
  const current = TASA_CONVERSION_ACTUAL;
  const previous = TASA_CONVERSION_ANTERIOR;
  return {
    current,
    previous,
    deltaPct: ((current - previous) / Math.abs(previous)) * 100,
    trend: TASA_CONVERSION_TREND.map((value, index) => ({ periodId: `mock-${index}`, value })),
  };
}
```

Replace `computeKpis`'s return object:

```typescript
  return {
    ventasTotales: build(sumAmount),
    transacciones: build(countDistinctTransactions),
    unidadesPorTransaccion: build(pickUnidadesPorTransaccion),
    ticketPromedio: build(pickTicketPromedio),
    descuentos: build(pickDescuentoPct),
    tasaConversion: mockTasaConversionKpiValue(),
  };
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx ng test --watch=false --include='**/sales-fact.utils.spec.ts'`
Expected: PASS — all specs in the file, including the 4 new ones.

- [ ] **Step 7: Type-check**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: exactly the same 5 pre-existing errors from the paused Motor de Período y Comparación work (1 in `period-picker.ts:87`, 4 in `sales-data.service.ts:129,195,220,233`) — none of them in files this task touches, and no additional errors beyond these 5. If the count or location differs from this, something in this task's own files is broken; stop and report.

- [ ] **Step 8: Commit**

```bash
git add src/app/data/models/kpi.model.ts src/app/data/mock/conversion.mock.ts src/app/data/utils/sales-fact.utils.ts src/app/data/utils/sales-fact.utils.spec.ts
git commit -m "feat: agrega KpiSet.descuentos y tasaConversion (Tasa de Conversion mock, Descuentos real)"
```

---

### Task 2: `KpiCardsGridComponent` — 6 cards, Conversión primero, Descuentos al final

**Files:**
- Modify: `src/app/pages/ventas-general/kpi-cards-grid/kpi-cards-grid.ts`
- Modify: `src/app/pages/ventas-general/kpi-cards-grid/kpi-cards-grid.html`
- Modify: `src/app/pages/ventas-general/kpi-cards-grid/kpi-cards-grid.css`

**Interfaces:**
- Consumes: `SalesDataService.kpis().descuentos`/`.tasaConversion` (Task 1).

- [ ] **Step 1: Add the two new computed groups**

Modify `src/app/pages/ventas-general/kpi-cards-grid/kpi-cards-grid.ts` — add these computeds right after the existing `ticketPromedio*` block (before the closing `}` of the class):

```typescript
  protected readonly tasaConversionValue = computed(
    () => `${this.salesData.kpis().tasaConversion.current.toFixed(1)}%`,
  );
  protected readonly tasaConversionDelta = computed(() => this.salesData.kpis().tasaConversion.deltaPct);
  protected readonly tasaConversionTrend = computed(() => this.salesData.kpis().tasaConversion.trend);

  protected readonly descuentosValue = computed(
    () => `${this.salesData.kpis().descuentos.current.toFixed(1)}%`,
  );
  protected readonly descuentosDelta = computed(() => this.salesData.kpis().descuentos.deltaPct);
  protected readonly descuentosTrend = computed(() => this.salesData.kpis().descuentos.trend);
```

- [ ] **Step 2: Reorder and extend the template**

Modify `src/app/pages/ventas-general/kpi-cards-grid/kpi-cards-grid.html` — full new content:

```html
@if (salesData.loading()) {
  <div class="kpi-grid">
    <app-loading-skeleton height="90px" />
    <app-loading-skeleton height="90px" />
    <app-loading-skeleton height="90px" />
    <app-loading-skeleton height="90px" />
    <app-loading-skeleton height="90px" />
    <app-loading-skeleton height="90px" />
  </div>
} @else {
  <div class="kpi-grid">
    <app-kpi-card
      label="Tasa de Conversión"
      [value]="tasaConversionValue()"
      [deltaPct]="salesData.compareToPrevious() ? tasaConversionDelta() : null"
      [trendPoints]="salesData.compareToPrevious() ? tasaConversionTrend() : []"
    />
    <app-kpi-card
      label="Ventas Totales"
      [value]="ventasTotalesValue()"
      [deltaPct]="salesData.compareToPrevious() ? ventasTotalesDelta() : null"
      [trendPoints]="salesData.compareToPrevious() ? ventasTotalesTrend() : []"
    />
    <app-kpi-card
      label="Transacciones"
      [value]="transaccionesValue()"
      [deltaPct]="salesData.compareToPrevious() ? transaccionesDelta() : null"
      [trendPoints]="salesData.compareToPrevious() ? transaccionesTrend() : []"
    />
    <app-kpi-card
      label="Unidades por Transacción"
      [value]="unidadesPorTransaccionValue()"
      [deltaPct]="salesData.compareToPrevious() ? unidadesPorTransaccionDelta() : null"
      [trendPoints]="salesData.compareToPrevious() ? unidadesPorTransaccionTrend() : []"
    />
    <app-kpi-card
      label="Ticket Promedio"
      [value]="ticketPromedioValue()"
      [deltaPct]="salesData.compareToPrevious() ? ticketPromedioDelta() : null"
      [trendPoints]="salesData.compareToPrevious() ? ticketPromedioTrend() : []"
    />
    <app-kpi-card
      label="Descuentos"
      [value]="descuentosValue()"
      [deltaPct]="salesData.compareToPrevious() ? descuentosDelta() : null"
      [trendPoints]="salesData.compareToPrevious() ? descuentosTrend() : []"
    />
  </div>
}
```

- [ ] **Step 3: Update the grid CSS for 6 cards**

Modify `src/app/pages/ventas-general/kpi-cards-grid/kpi-cards-grid.css` — full new content:

```css
:host { display: block; }

/* minmax(0, 1fr), not a bare 1fr -- a plain 1fr track's minimum is "auto" (its content's
   own min-content size), so a card that can't shrink further would push the whole grid
   wider than .page-body and overflow past its padding instead of the grid shrinking to
   fit. minmax(0, ...) lets the track (and PrimeNG's Card inside it) actually shrink. */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1rem;
}

/* Queries the actual remaining width after the sidebar (container-type: inline-size is
   set on .page-body, see ventas-general.css) instead of the raw viewport. Two intermediate
   breakpoints now that there are 6 cards instead of 4: 3 columns (2 rows), then 2 columns
   (3 rows), before finally reaching the narrowest layout. */
@container (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@container (max-width: 900px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

- [ ] **Step 4: Type-check and build**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: exactly the same 5 pre-existing errors from the paused Motor de Período y Comparación work (1 in `period-picker.ts:87`, 4 in `sales-data.service.ts:129,195,220,233`), none of them in files this task touches.

Run: `npx ng build`
Expected: build succeeds, no new errors/warnings referencing `kpi-cards-grid`.

- [ ] **Step 5: Commit**

```bash
git add src/app/pages/ventas-general/kpi-cards-grid/kpi-cards-grid.ts src/app/pages/ventas-general/kpi-cards-grid/kpi-cards-grid.html src/app/pages/ventas-general/kpi-cards-grid/kpi-cards-grid.css
git commit -m "feat: agrega cards Tasa de Conversion y Descuentos a la franja de KPIs"
```

---

### Task 3: Verificación final end-to-end

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npx ng test --watch=false`
Expected: all specs pass (the pre-existing `app.spec.ts` `ActivatedRoute` failure is unrelated and stays as-is; if the paused Motor de Período y Comparación work left any of its own tests in a red state, that's expected and not this plan's concern — only confirm nothing THIS plan touched regressed).

- [ ] **Step 2: Run the full build**

Run: `npx ng build`
Expected: build succeeds, no new warnings beyond the pre-existing bundle-size budget warning.

- [ ] **Step 3: Serve and visually confirm**

Run: `npx ng serve`

In the browser, on Ventas General:
- Confirm the KPI strip now shows 6 cards in this order: Tasa de Conversión, Ventas Totales, Transacciones, Unidades por Transacción, Ticket Promedio, Descuentos.
- Confirm Tasa de Conversión shows 24.5% with a sparkline and a delta badge, and does NOT change when switching store/period filters.
- Confirm Descuentos shows a real percentage that DOES change when switching store/period filters (there are hand-authored discount facts in `sales-facts.mock.ts` for `tienda-costanera-center`/`tienda-parque-arauco`/`tienda-vespucio-mall` in 2026-06/07/05 respectively — filtering to one of those stores/periods should show a non-zero, filter-sensitive Descuentos value).
- Resize the browser narrower and confirm the grid reflows to 3 columns, then 2, without any card overflowing its container.

- [ ] **Step 4: Confirm scope discipline**

Run: `grep -rn "graduado\|semaforo.*meta\|KpiMetaMensual" src/app`
Expected: no output — confirms the graduated semaphore and Meta-mode work (out of scope, belongs to the paused sub-project when it resumes) wasn't accidentally started here.
