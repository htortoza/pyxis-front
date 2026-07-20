# Motor de Período y Comparación Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Día/Semana period granularity, an explicit 3-mode comparison mechanism (periodo anterior con alineación configurable / periodo específico / meta), all as mock-data-driven frontend, with zero behavior change for the Mes-granularity, calendar-aligned, previous-period flow that exists today.

**Architecture:** `SalesFact` gains a real calendar `date` (replacing the independent random `dayOfWeek`); `Period` gains `granularity`/`startDate`/`endDate` and is generated in 3 families (Día/Semana/Mes) sharing one date-range-based fact-filtering path. `SalesDataService` gains granularity + 3-mode comparison state, feeding the same `computeDashboardData()` pipeline every consumer already reads — no component other than the period/comparison pickers changes how it reads KPI/chart/table data.

**Tech Stack:** Angular 21 (standalone components, signals, `inject()`), TypeScript, Vitest (`ng test`, Jasmine-style `describe`/`it`/`expect`).

## Global Constraints

- No Tailwind, no utility CSS, no inline styles — new CSS follows the existing `var(--p-...)` token pattern (see `period-picker.css` for the reference style).
- No `Date.now()`/`Math.random()`/argless `new Date()` — all date math takes explicit ISO string inputs, deterministic.
- Mes granularity behavior (existing 6 presets, year-grid UI, calendar-aligned previous-period calc) must be byte-identical to today — every new granularity/mode is additive.
- Meta comparison applies **only** to KPI cards — the distribution chart and Detalle de Ventas table never show a "meta" comparison; when the global mode is `'meta'`, chart/table keep using the periodo-anterior calculation.
- The alignment selector (`calendario` / `dia_semana`) is only meaningful, and only shown, when mode is `periodo_anterior` **and** granularity is `dia` or `semana` — never for `mes`.
- Naming: PascalCase types/classes, camelCase signals/functions, kebab-case files (per project `CLAUDE.md`).
- Out of scope, do not touch: new KPI cards (Tasa de Conversión, Descuentos), the graduated 3+ color semaphore, the "por día" chart view, IVA toggle, Corner dimension — separate sub-projects.

---

### Task 1: Utilidades de fecha determinísticas

**Files:**
- Create: `src/app/data/utils/date.utils.ts`
- Test: `src/app/data/utils/date.utils.spec.ts`

**Interfaces:**
- Produces: `toIsoDate(date: Date): string`, `parseIsoDate(iso: string): Date`, `addDaysIso(iso: string, days: number): string`, `getDayOfWeek(iso: string): number` (0=domingo..6=sábado, mismo criterio que el `dayOfWeek` que hoy existe en `SalesFact`), `daysBetweenIso(fromIso: string, toIso: string): number`. Tasks 2-6 dependen de estas firmas exactas.

- [ ] **Step 1: Write the failing tests**

Create `src/app/data/utils/date.utils.spec.ts`:

```typescript
import { addDaysIso, daysBetweenIso, getDayOfWeek, parseIsoDate, toIsoDate } from './date.utils';

describe('date.utils', () => {
  it('toIsoDate formats a Date as YYYY-MM-DD', () => {
    expect(toIsoDate(new Date('2026-07-20T00:00:00Z'))).toBe('2026-07-20');
  });

  it('parseIsoDate round-trips through toIsoDate', () => {
    expect(toIsoDate(parseIsoDate('2026-01-05'))).toBe('2026-01-05');
  });

  it('addDaysIso adds days, including across a month boundary', () => {
    expect(addDaysIso('2026-07-20', 1)).toBe('2026-07-21');
    expect(addDaysIso('2026-07-31', 1)).toBe('2026-08-01');
  });

  it('addDaysIso subtracts days with a negative offset', () => {
    expect(addDaysIso('2026-08-01', -1)).toBe('2026-07-31');
  });

  it('getDayOfWeek returns 0 for a known Sunday and 1 for a known Monday', () => {
    expect(getDayOfWeek('2026-07-19')).toBe(0); // domingo
    expect(getDayOfWeek('2026-07-20')).toBe(1); // lunes
  });

  it('daysBetweenIso returns the number of days between two dates', () => {
    expect(daysBetweenIso('2026-07-01', '2026-07-08')).toBe(7);
    expect(daysBetweenIso('2026-07-08', '2026-07-01')).toBe(-7);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx ng test --watch=false --include='**/date.utils.spec.ts'`
Expected: FAIL — `date.utils.ts` does not exist.

- [ ] **Step 3: Implement the date utilities**

Create `src/app/data/utils/date.utils.ts`:

```typescript
const MS_PER_DAY = 86_400_000;

export function toIsoDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function addDaysIso(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}

/** 0 = domingo .. 6 = sábado, mismo criterio que usaba el campo SalesFact.dayOfWeek. */
export function getDayOfWeek(iso: string): number {
  return parseIsoDate(iso).getUTCDay();
}

export function daysBetweenIso(fromIso: string, toIso: string): number {
  return Math.round((parseIsoDate(toIso).getTime() - parseIsoDate(fromIso).getTime()) / MS_PER_DAY);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx ng test --watch=false --include='**/date.utils.spec.ts'`
Expected: PASS — 6 specs, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add src/app/data/utils/date.utils.ts src/app/data/utils/date.utils.spec.ts
git commit -m "feat: agrega utilidades de fecha determinísticas (date.utils)"
```

---

### Task 2: `Period` gana granularidad; periodos Día/Semana/Mes

**Files:**
- Modify: `src/app/data/models/period.model.ts`
- Modify: `src/app/data/mock/periods.mock.ts`
- Modify: `src/app/data/utils/period.utils.ts`
- Test: `src/app/data/mock/periods.mock.spec.ts`
- Test: `src/app/data/utils/period.utils.spec.ts`

**Interfaces:**
- Consumes: `addDaysIso` (Task 1).
- Produces: `PeriodGranularity = 'dia' | 'semana' | 'mes'`, `Period` con `granularity`/`startDate`/`endDate`, `PERIODS_DIA`/`PERIODS_SEMANA`/`PERIODS_MES`/`PERIODS_BY_GRANULARITY: Record<PeriodGranularity, Period[]>` (más el alias legacy `PERIODS = PERIODS_MES`), `DEFAULT_SELECTED_GRANULARITY: PeriodGranularity`, `PeriodPreset.granularity`. Tasks 3, 5, 7, 8 dependen de estos nombres exactos.

- [ ] **Step 1: Extend the `Period` model**

Modify `src/app/data/models/period.model.ts` — full new content:

```typescript
export type PeriodGranularity = 'dia' | 'semana' | 'mes';

export interface Period {
  id: string;
  label: string;
  granularity: PeriodGranularity;
  /** Calendar year, e.g. 2025. */
  year: number;
  /** Calendar month, 1-12 -- el mes en que cae (día) o empieza (semana) el periodo. */
  month: number;
  /** Monotonic dentro de su propia granularidad -- NO comparable entre granularidades distintas. */
  order: number;
  /** ISO 'YYYY-MM-DD', límite inferior real del periodo. */
  startDate: string;
  /** ISO 'YYYY-MM-DD', límite superior real del periodo (inclusive). */
  endDate: string;
}
```

- [ ] **Step 2: Write the failing test for `periods.mock.ts`**

Create `src/app/data/mock/periods.mock.spec.ts`:

```typescript
import { PERIODS_DIA, PERIODS_MES, PERIODS_SEMANA } from './periods.mock';

describe('periods.mock', () => {
  it('PERIODS_MES spans 2024-01 through 2026-12 with the existing order formula', () => {
    expect(PERIODS_MES.length).toBe(36);
    expect(PERIODS_MES[0].id).toBe('2024-01');
    expect(PERIODS_MES[0].order).toBe(2024 * 12 + 1);
    expect(PERIODS_MES[0].startDate).toBe('2024-01-01');
    expect(PERIODS_MES[0].endDate).toBe('2024-01-31');
    expect(PERIODS_MES.at(-1)?.id).toBe('2026-12');
    expect(PERIODS_MES.at(-1)?.endDate).toBe('2026-12-31');
  });

  it('PERIODS_DIA covers every day from 2024-01-01 to 2026-12-31 with sequential order', () => {
    expect(PERIODS_DIA[0]).toEqual(
      jasmine.objectContaining({ id: '2024-01-01', granularity: 'dia', order: 1, startDate: '2024-01-01', endDate: '2024-01-01' }),
    );
    expect(PERIODS_DIA[1].order).toBe(2);
    expect(PERIODS_DIA.at(-1)?.id).toBe('2026-12-31');
  });

  it('PERIODS_SEMANA groups days into consecutive non-overlapping 7-day windows', () => {
    expect(PERIODS_SEMANA[0]).toEqual(
      jasmine.objectContaining({ granularity: 'semana', order: 1, startDate: '2024-01-01', endDate: '2024-01-07' }),
    );
    expect(PERIODS_SEMANA[1].startDate).toBe('2024-01-08');
    expect(PERIODS_SEMANA[1].endDate).toBe('2024-01-14');
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx ng test --watch=false --include='**/periods.mock.spec.ts'`
Expected: FAIL — `periods.mock.ts` doesn't export `PERIODS_DIA`/`PERIODS_SEMANA` yet.

- [ ] **Step 4: Rewrite `periods.mock.ts`**

Modify `src/app/data/mock/periods.mock.ts` — full new content:

```typescript
import type { Period, PeriodGranularity } from '../models/period.model';
import { addDaysIso } from '../utils/date.utils';

/** Fully static/deterministic -- no Date.now()/new Date() here, hardcode the loop bounds. */
const START_DATE = '2024-01-01';
const END_DATE = '2026-12-31';
const START_YEAR = 2024;
const END_YEAR = 2026;

const MONTH_LABELS_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

function isoParts(iso: string): { year: number; month: number; day: number } {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month, day };
}

function shortLabel(iso: string): string {
  const { month, day } = isoParts(iso);
  return `${day} de ${MONTH_LABELS_ES[month - 1]}`;
}

function buildDailyPeriods(): Period[] {
  const periods: Period[] = [];
  let cursor = START_DATE;
  let order = 1;
  while (cursor <= END_DATE) {
    const { year, month } = isoParts(cursor);
    periods.push({
      id: cursor,
      label: shortLabel(cursor),
      granularity: 'dia',
      year,
      month,
      order,
      startDate: cursor,
      endDate: cursor,
    });
    order++;
    cursor = addDaysIso(cursor, 1);
  }
  return periods;
}

function buildWeeklyPeriods(): Period[] {
  const periods: Period[] = [];
  let cursor = START_DATE;
  let order = 1;
  while (cursor <= END_DATE) {
    const weekEnd = addDaysIso(cursor, 6);
    const { year, month } = isoParts(cursor);
    periods.push({
      id: `week-${cursor}`,
      label: `Semana del ${shortLabel(cursor)} al ${shortLabel(weekEnd)}`,
      granularity: 'semana',
      year,
      month,
      order,
      startDate: cursor,
      endDate: weekEnd,
    });
    order++;
    cursor = addDaysIso(cursor, 7);
  }
  return periods;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function buildMonthlyPeriods(): Period[] {
  const periods: Period[] = [];
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    for (let month = 1; month <= 12; month++) {
      const id = `${year}-${String(month).padStart(2, '0')}`;
      const lastDay = String(daysInMonth(year, month)).padStart(2, '0');
      periods.push({
        id,
        label: MONTH_LABELS_ES[month - 1],
        granularity: 'mes',
        year,
        month,
        order: year * 12 + month, // preserva exactamente la fórmula ya usada hoy en toda comparación de periodo anterior
        startDate: `${id}-01`,
        endDate: `${id}-${lastDay}`,
      });
    }
  }
  return periods;
}

export const PERIODS_DIA: Period[] = buildDailyPeriods();
export const PERIODS_SEMANA: Period[] = buildWeeklyPeriods();
export const PERIODS_MES: Period[] = buildMonthlyPeriods();

export const PERIODS_BY_GRANULARITY: Record<PeriodGranularity, Period[]> = {
  dia: PERIODS_DIA,
  semana: PERIODS_SEMANA,
  mes: PERIODS_MES,
};

/** Alias legacy -- código no migrado a granularidad sigue viendo exactamente los periodos de Mes. */
export const PERIODS: Period[] = PERIODS_MES;

export const DEFAULT_SELECTED_PERIOD_IDS = ['2026-05', '2026-06', '2026-07'];
export const DEFAULT_SELECTED_GRANULARITY: PeriodGranularity = 'mes';
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx ng test --watch=false --include='**/periods.mock.spec.ts'`
Expected: PASS — 3 specs, 0 failures.

- [ ] **Step 6: Write the failing test for the new presets**

Create `src/app/data/utils/period.utils.spec.ts`:

```typescript
import { PERIODS_SEMANA } from '../mock/periods.mock';
import { PERIOD_PRESETS } from './period.utils';

describe('PERIOD_PRESETS', () => {
  const TODAY = { year: 2026, month: 7, day: 20 };

  it('has the 6 existing Mes presets plus 2 new Semana presets', () => {
    expect(PERIOD_PRESETS.filter((p) => p.granularity === 'mes').length).toBe(6);
    expect(PERIOD_PRESETS.filter((p) => p.granularity === 'semana').map((p) => p.key)).toEqual([
      'ultimas-3-semanas',
      'ultimas-12-semanas',
    ]);
  });

  it('"ultimas-3-semanas" resolves to exactly 3 weeks ending on the week containing today', () => {
    const preset = PERIOD_PRESETS.find((p) => p.key === 'ultimas-3-semanas')!;
    const ids = preset.resolve(PERIODS_SEMANA, TODAY);
    expect(ids.length).toBe(3);
    const currentWeek = PERIODS_SEMANA.find((p) => p.startDate <= '2026-07-20' && '2026-07-20' <= p.endDate)!;
    expect(ids).toContain(currentWeek.id);
  });

  it('"ultimas-12-semanas" resolves to exactly 12 weeks', () => {
    const preset = PERIOD_PRESETS.find((p) => p.key === 'ultimas-12-semanas')!;
    expect(preset.resolve(PERIODS_SEMANA, TODAY).length).toBe(12);
  });
});
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `npx ng test --watch=false --include='**/period.utils.spec.ts'`
Expected: FAIL — `PERIOD_PRESETS` entries have no `granularity` field yet, and the two new presets don't exist.

- [ ] **Step 8: Add `granularity` to `PeriodPreset` and the 2 new Semana presets**

Modify `src/app/data/utils/period.utils.ts` — full new content:

```typescript
import type { Period, PeriodGranularity } from '../models/period.model';

export function groupPeriodsByYear(periods: Period[]): Map<number, Period[]> {
  const map = new Map<number, Period[]>();
  for (const period of periods) {
    const yearPeriods = map.get(period.year) ?? [];
    yearPeriods.push(period);
    map.set(period.year, yearPeriods);
  }
  return map;
}

export interface PeriodPreset {
  key: string;
  label: string;
  granularity: PeriodGranularity;
  /** Given the full period list (of this preset's own granularity) and "today", returns matching period ids. */
  resolve: (periods: Period[], today: { year: number; month: number; day: number }) => string[];
}

function toOrder(today: { year: number; month: number }): number {
  return today.year * 12 + today.month;
}

function toIso(today: { year: number; month: number; day: number }): string {
  return `${today.year}-${String(today.month).padStart(2, '0')}-${String(today.day).padStart(2, '0')}`;
}

function currentWeek(periods: Period[], today: { year: number; month: number; day: number }): Period | undefined {
  const todayIso = toIso(today);
  return periods.find((p) => p.startDate <= todayIso && todayIso <= p.endDate);
}

export const PERIOD_PRESETS: PeriodPreset[] = [
  {
    key: 'mes-actual',
    label: 'Mes Actual',
    granularity: 'mes',
    resolve: (periods, today) => {
      const todayOrder = toOrder(today);
      return periods.filter((p) => p.order === todayOrder).map((p) => p.id);
    },
  },
  {
    key: 'ultimo-trimestre',
    label: 'Último Trimestre',
    granularity: 'mes',
    resolve: (periods, today) => {
      const todayOrder = toOrder(today);
      return periods.filter((p) => p.order > todayOrder - 3 && p.order <= todayOrder).map((p) => p.id);
    },
  },
  {
    key: 'ultimos-6-meses',
    label: 'Últimos 6 Meses',
    granularity: 'mes',
    resolve: (periods, today) => {
      const todayOrder = toOrder(today);
      return periods.filter((p) => p.order > todayOrder - 6 && p.order <= todayOrder).map((p) => p.id);
    },
  },
  {
    key: 'ano-actual',
    label: 'Año en Curso',
    granularity: 'mes',
    resolve: (periods, today) =>
      periods.filter((p) => p.year === today.year && p.month <= today.month).map((p) => p.id),
  },
  {
    key: 'ano-anterior',
    label: 'Año Anterior',
    granularity: 'mes',
    resolve: (periods, today) => periods.filter((p) => p.year === today.year - 1).map((p) => p.id),
  },
  {
    key: 'ultimos-3-anos',
    label: 'Últimos 3 Años',
    granularity: 'mes',
    resolve: (periods, today) =>
      periods.filter((p) => p.year >= today.year - 2 && p.year <= today.year).map((p) => p.id),
  },
  {
    key: 'ultimas-3-semanas',
    label: 'Últimas 3 Semanas',
    granularity: 'semana',
    resolve: (periods, today) => {
      const week = currentWeek(periods, today);
      if (!week) return [];
      return periods.filter((p) => p.order > week.order - 3 && p.order <= week.order).map((p) => p.id);
    },
  },
  {
    key: 'ultimas-12-semanas',
    label: 'Últimas 12 Semanas',
    granularity: 'semana',
    resolve: (periods, today) => {
      const week = currentWeek(periods, today);
      if (!week) return [];
      return periods.filter((p) => p.order > week.order - 12 && p.order <= week.order).map((p) => p.id);
    },
  },
];
```

- [ ] **Step 9: Run the tests to verify they pass**

Run: `npx ng test --watch=false --include='**/period.utils.spec.ts' --include='**/periods.mock.spec.ts'`
Expected: PASS — 6 specs total, 0 failures.

- [ ] **Step 10: Type-check and commit**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: no output, exit 0 (there will be pre-existing errors in files this task hasn't touched yet — `period-picker.ts` reading the old `Period` shape and `sales-data.service.ts` reading `PERIODS`/`compareToPrevious` — ignore those here, Tasks 5 and 7 fix them; only check that `periods.mock.ts`/`period.utils.ts`/`period.model.ts` themselves compile without new errors introduced by this task).

```bash
git add src/app/data/models/period.model.ts src/app/data/mock/periods.mock.ts src/app/data/mock/periods.mock.spec.ts src/app/data/utils/period.utils.ts src/app/data/utils/period.utils.spec.ts
git commit -m "feat: agrega granularidad Dia/Semana/Mes a Period y sus periodos mock"
```

---

### Task 3: `SalesFact` gana fecha real; se regenera el mock

**Files:**
- Modify: `src/app/data/models/sales-fact.model.ts`
- Modify: `src/app/data/mock/sales-facts.mock.ts`

**Interfaces:**
- Consumes: `addDaysIso` (Task 1), `PERIODS_MES` (Task 2).
- Produces: `SalesFact.date: string` (reemplaza `dayOfWeek`/`periodId`). Tasks 4-5 dependen de este campo.

- [ ] **Step 1: Update the `SalesFact` model**

Modify `src/app/data/models/sales-fact.model.ts` — full new content:

```typescript
export interface SalesFact {
  transactionId: string;
  /** ISO 'YYYY-MM-DD' -- fuente de verdad; dayOfWeek se deriva de acá vía date.utils.getDayOfWeek. */
  date: string;
  storeId: string;
  productId: string;
  hour: number; // 0-23 raw clock hour
  amount: number; // CLP, can be negative (discounts/mermas)
  quantity: number;
}
```

- [ ] **Step 2: Regenerate the mock facts with real dates**

Modify `src/app/data/mock/sales-facts.mock.ts` — full new content:

```typescript
import type { Product } from '../models/product.model';
import type { SalesFact } from '../models/sales-fact.model';
import { addDaysIso } from '../utils/date.utils';
import { CONTEXT_TREE } from './context-tree.mock';
import { PERIODS_MES } from './periods.mock';
import { PRODUCTS } from './products.mock';

/** Deterministic 32-bit PRNG (mulberry32) so the mock dataset is stable across reloads. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Zipf-like weight per product (rank-based, exponent 0.8) so a handful of products dominate
 * sales and most trail off into a long tail -- needed to exercise Detalle de Ventas' treemap
 * long-tail grouping (items <1% of their level) and its table's progressive-loading threshold
 * with real, non-zero rows rather than mostly-empty ones. Ranks are shuffled (not literal
 * array position) so "who sells well" doesn't just track familia order in products.mock.ts.
 */
function buildProductWeights(products: Product[], rng: () => number): number[] {
  const ranks = products.map((_, i) => i);
  for (let i = ranks.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [ranks[i], ranks[j]] = [ranks[j], ranks[i]];
  }
  const weights = new Array<number>(products.length);
  for (let i = 0; i < products.length; i++) {
    weights[ranks[i]] = 1 / Math.pow(i + 1, 0.8);
  }
  const cumulative: number[] = [];
  let sum = 0;
  for (const w of weights) {
    sum += w;
    cumulative.push(sum);
  }
  return cumulative;
}

function pickWeightedProduct(products: Product[], cumulative: number[], rng: () => number) {
  const target = rng() * cumulative[cumulative.length - 1];
  let lo = 0;
  let hi = cumulative.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (cumulative[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return products[lo];
}

function daysInPeriod(period: { startDate: string; endDate: string }): number {
  return Number(period.endDate.slice(-2)) - Number(period.startDate.slice(-2)) + 1;
}

function generateSalesFacts(): SalesFact[] {
  const rng = mulberry32(20260714);
  const tiendaNodes = CONTEXT_TREE.filter((node) => node.type === 'TIENDA');
  const productWeights = buildProductWeights(PRODUCTS, rng);
  const facts: SalesFact[] = [];
  let txCounter = 0;

  for (const period of PERIODS_MES) {
    const totalDays = daysInPeriod(period);
    for (const tienda of tiendaNodes) {
      const transactionCount = 380 + Math.floor(rng() * 60); // dense enough that most of the
      // ~500-product catalog gets real (non-zero) sales within any 3-period window, not just
      // the top sellers -- see buildProductWeights' doc comment above.
      for (let t = 0; t < transactionCount; t++) {
        txCounter++;
        const transactionId = `tx-${txCounter}`;
        const date = addDaysIso(period.startDate, Math.floor(rng() * totalDays));
        const hour = Math.floor(rng() * 24);
        const lineItemCount = 1 + Math.floor(rng() * 3); // 1-3 line items

        for (let li = 0; li < lineItemCount; li++) {
          const product = pickWeightedProduct(PRODUCTS, productWeights, rng);
          const quantity = 1 + Math.floor(rng() * 3);
          const basePerUnit = 8000 + rng() * 8000; // 8000-16000 CLP per unit
          const multiplier = 0.8 + rng() * 0.6; // 0.8-1.4
          const amount = Math.round(basePerUnit * quantity * multiplier);

          facts.push({
            transactionId,
            date,
            storeId: tienda.id,
            productId: product.id,
            hour,
            amount,
            quantity,
          });
        }
      }
    }
  }

  // Hand-authored negative rows (discounts/mermas) so the negative-amount formatting path
  // has real data to render.
  facts.push(
    {
      transactionId: 'tx-descuento-1',
      date: '2026-06-18',
      storeId: 'tienda-costanera-center',
      productId: 'prod-lomo-saltado',
      hour: 13,
      amount: -6500,
      quantity: -1,
    },
    {
      transactionId: 'tx-descuento-2',
      date: '2026-07-24',
      storeId: 'tienda-parque-arauco',
      productId: 'prod-coca-cola-z',
      hour: 20,
      amount: -3200,
      quantity: -1,
    },
    {
      transactionId: 'tx-descuento-3',
      date: '2026-05-04',
      storeId: 'tienda-vespucio-mall',
      productId: 'prod-filete-250',
      hour: 19,
      amount: -12000,
      quantity: -1,
    },
  );

  return facts;
}

export const SALES_FACTS: SalesFact[] = generateSalesFacts();
```

- [ ] **Step 3: Verify the app still builds with this data shape**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: errors only in `sales-fact.utils.ts` and `sales-data.service.ts` (they still reference `fact.periodId`/`fact.dayOfWeek` — fixed in Task 4). No errors in `sales-fact.model.ts` or `sales-facts.mock.ts` themselves.

- [ ] **Step 4: Commit**

```bash
git add src/app/data/models/sales-fact.model.ts src/app/data/mock/sales-facts.mock.ts
git commit -m "feat: SalesFact gana fecha real, reemplaza dayOfWeek/periodId derivados"
```

---

### Task 4: `sales-fact.utils.ts` — filtrado por rango de fecha, heatmap vía fecha

**Files:**
- Modify: `src/app/data/utils/sales-fact.utils.ts`
- Test: `src/app/data/utils/sales-fact.utils.spec.ts`

**Interfaces:**
- Consumes: `getDayOfWeek` (Task 1), `SalesFact.date` (Task 3), `Period` (Task 2).
- Produces: `filterFacts(facts, { storeIds, periods }): SalesFact[]` (cambia `periodIds: string[]` por `periods: Period[]`). Task 5 depende de esta firma exacta.

- [ ] **Step 1: Write the failing tests**

Create `src/app/data/utils/sales-fact.utils.spec.ts`:

```typescript
import type { Period } from '../models/period.model';
import type { SalesFact } from '../models/sales-fact.model';
import { buildHeatmapMatrix, filterFacts } from './sales-fact.utils';

function fact(overrides: Partial<SalesFact>): SalesFact {
  return {
    transactionId: 'tx-1',
    date: '2026-07-01',
    storeId: 'tienda-a',
    productId: 'prod-1',
    hour: 10,
    amount: 1000,
    quantity: 1,
    ...overrides,
  };
}

function period(overrides: Partial<Period>): Period {
  return {
    id: 'p-1',
    label: 'p',
    granularity: 'mes',
    year: 2026,
    month: 7,
    order: 1,
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    ...overrides,
  };
}

describe('filterFacts', () => {
  it('keeps a fact whose store matches and whose date falls inside a selected period range', () => {
    const facts = [fact({ storeId: 'tienda-a', date: '2026-07-15' })];
    const result = filterFacts(facts, { storeIds: ['tienda-a'], periods: [period({})] });
    expect(result.length).toBe(1);
  });

  it('drops a fact whose date falls outside every selected period range', () => {
    const facts = [fact({ storeId: 'tienda-a', date: '2026-08-01' })];
    const result = filterFacts(facts, { storeIds: ['tienda-a'], periods: [period({})] });
    expect(result.length).toBe(0);
  });

  it('drops a fact whose store is not in scope even if the date matches', () => {
    const facts = [fact({ storeId: 'tienda-b', date: '2026-07-15' })];
    const result = filterFacts(facts, { storeIds: ['tienda-a'], periods: [period({})] });
    expect(result.length).toBe(0);
  });

  it('keeps a fact matching any one of multiple selected period ranges', () => {
    const facts = [fact({ storeId: 'tienda-a', date: '2026-01-05' })];
    const periods = [period({ startDate: '2026-07-01', endDate: '2026-07-31' }), period({ startDate: '2026-01-01', endDate: '2026-01-31' })];
    const result = filterFacts(facts, { storeIds: ['tienda-a'], periods });
    expect(result.length).toBe(1);
  });
});

describe('buildHeatmapMatrix', () => {
  it('buckets a fact into the day-of-week row derived from its date, not a stored field', () => {
    const facts = [fact({ date: '2026-07-19', hour: 6, amount: 500 })]; // domingo
    const matrix = buildHeatmapMatrix(facts);
    expect(matrix[0][0]).toBe(500); // fila domingo (0), primera hora operacional (6)
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx ng test --watch=false --include='**/sales-fact.utils.spec.ts'`
Expected: FAIL — `filterFacts` still expects `periodIds`, not `periods`; `TypeScript` compile error in the spec (wrong argument shape) or wrong runtime filtering result.

- [ ] **Step 3: Update `filterFacts` and `buildHeatmapMatrix`**

Modify `src/app/data/utils/sales-fact.utils.ts` — replace lines 1-17 (imports + `filterFacts`) with:

```typescript
import { getDayOfWeek } from './date.utils';
import type { SalesFact } from '../models/sales-fact.model';
import type { KpiSet, KpiValue, TrendPoint } from '../models/kpi.model';
import type { Period } from '../models/period.model';
import type { RankingItem } from '../models/ranking.model';

export const OPERATIONAL_HOURS: number[] = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5,
];

export function filterFacts(
  facts: SalesFact[],
  opts: { storeIds: string[]; periods: Period[] },
): SalesFact[] {
  const storeIdSet = new Set(opts.storeIds);
  const ranges = opts.periods.map((period) => ({ start: period.startDate, end: period.endDate }));
  return facts.filter(
    (f) =>
      storeIdSet.has(f.storeId) &&
      ranges.some((range) => f.date >= range.start && f.date <= range.end),
  );
}
```

Then replace the `buildHeatmapMatrix` function (previously reading `fact.dayOfWeek`) with:

```typescript
export function buildHeatmapMatrix(facts: SalesFact[]): number[][] {
  const matrix: number[][] = Array.from({ length: 7 }, () =>
    new Array<number>(OPERATIONAL_HOURS.length).fill(0),
  );
  const hourToIndex = new Map<number, number>();
  OPERATIONAL_HOURS.forEach((hour, index) => hourToIndex.set(hour, index));

  for (const fact of facts) {
    const hourIndex = hourToIndex.get(fact.hour);
    if (hourIndex === undefined) {
      continue;
    }
    matrix[getDayOfWeek(fact.date)][hourIndex] += fact.amount;
  }

  return matrix;
}
```

Every other function in this file (`computeKpiValue`, `sumAmount`, `countDistinctTransactions`, `sumQuantity`, `pickUnidadesPorTransaccion`, `pickTicketPromedio`, `buildKpiTrendPoints`, `computeKpis`, `buildHourlySeries`, `aggregateRanking`) is unchanged — none of them read `periodId` or `dayOfWeek` directly.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx ng test --watch=false --include='**/sales-fact.utils.spec.ts'`
Expected: PASS — 5 specs, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add src/app/data/utils/sales-fact.utils.ts src/app/data/utils/sales-fact.utils.spec.ts
git commit -m "feat: filterFacts filtra por rango de fecha, heatmap deriva dia-de-semana"
```

---

### Task 5: `SalesDataService` — granularidad + modo de comparación (Periodo Anterior / Periodo Específico)

**Files:**
- Create: `src/app/data/models/comparison.model.ts`
- Modify: `src/app/services/sales-data.service.ts`
- Test: `src/app/services/sales-data.service.spec.ts`

**Interfaces:**
- Consumes: `PERIODS_BY_GRANULARITY`, `DEFAULT_SELECTED_GRANULARITY` (Task 2), `filterFacts(facts, { storeIds, periods })` (Task 4).
- Produces: `ComparisonMode = 'periodo_anterior' | 'periodo_especifico' | 'meta'`, `ComparisonAlignment = 'calendario' | 'dia_semana'`, `previousPeriodWindow(selectedPeriods, alignment, granularity, allPeriods): Period[]` (pure, en `period.utils.ts`), `SalesDataService.selectedPeriodGranularity: WritableSignal<PeriodGranularity>`, `.comparisonMode: WritableSignal<ComparisonMode>`, `.comparisonAlignment: WritableSignal<ComparisonAlignment>`, `.explicitComparisonPeriodIds: WritableSignal<string[] | null>`. Tasks 6, 7, 8 dependen de estos nombres exactos. (Task 6 agrega el modo `'meta'` a `computeDashboardData` — este task deja ese branch preparado pero no implementado con datos reales de meta.)

- [ ] **Step 1: Create the comparison model**

Create `src/app/data/models/comparison.model.ts`:

```typescript
export type ComparisonMode = 'periodo_anterior' | 'periodo_especifico' | 'meta';
export type ComparisonAlignment = 'calendario' | 'dia_semana';
```

- [ ] **Step 2: Write the failing tests for `previousPeriodWindow`**

Modify `src/app/data/utils/period.utils.spec.ts` — append at the end of the file:

```typescript

import { PERIODS_DIA, PERIODS_MES, PERIODS_SEMANA } from '../mock/periods.mock';
import { previousPeriodWindow } from './period.utils';

describe('previousPeriodWindow', () => {
  it('calendario alignment shifts back by the exact selected-period count for Mes', () => {
    const selected = PERIODS_MES.filter((p) => ['2026-05', '2026-06', '2026-07'].includes(p.id));
    const previous = previousPeriodWindow(selected, 'calendario', 'mes', PERIODS_MES);
    expect(previous.map((p) => p.id).sort()).toEqual(['2026-02', '2026-03', '2026-04']);
  });

  it('calendario alignment for a single Dia shifts back exactly 1 day', () => {
    const selected = PERIODS_DIA.filter((p) => p.id === '2026-07-20');
    const previous = previousPeriodWindow(selected, 'calendario', 'dia', PERIODS_DIA);
    expect(previous.map((p) => p.id)).toEqual(['2026-07-19']);
  });

  it('dia_semana alignment for a single Dia shifts back exactly 7 days (same weekday)', () => {
    const selected = PERIODS_DIA.filter((p) => p.id === '2026-07-20'); // lunes
    const previous = previousPeriodWindow(selected, 'dia_semana', 'dia', PERIODS_DIA);
    expect(previous.map((p) => p.id)).toEqual(['2026-07-13']); // lunes anterior
  });

  it('dia_semana alignment for 8 selected Dias shifts back 14 days (next multiple of 7)', () => {
    const selected = PERIODS_DIA.filter((p) => p.id >= '2026-07-13' && p.id <= '2026-07-20');
    expect(selected.length).toBe(8);
    const previous = previousPeriodWindow(selected, 'dia_semana', 'dia', PERIODS_DIA);
    expect(previous.length).toBe(8);
    expect(previous[0].id).toBe('2026-06-29');
    expect(previous.at(-1)?.id).toBe('2026-07-06');
  });

  it('dia_semana alignment for Semana gives the same result as calendario (spec: a full week already aligns weekdays)', () => {
    const selected = PERIODS_SEMANA.slice(10, 11);
    const viaCalendario = previousPeriodWindow(selected, 'calendario', 'semana', PERIODS_SEMANA);
    const viaDiaSemana = previousPeriodWindow(selected, 'dia_semana', 'semana', PERIODS_SEMANA);
    expect(viaDiaSemana).toEqual(viaCalendario);
  });

  it('returns an empty array when nothing is selected', () => {
    expect(previousPeriodWindow([], 'calendario', 'mes', PERIODS_MES)).toEqual([]);
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx ng test --watch=false --include='**/period.utils.spec.ts'`
Expected: FAIL — `previousPeriodWindow` is not exported by `period.utils.ts` yet.

- [ ] **Step 4: Implement `previousPeriodWindow` as a pure, exported function**

Modify `src/app/data/utils/period.utils.ts` — add this import at the top:

```typescript
import type { ComparisonAlignment } from '../models/comparison.model';
```

Append at the end of the file:

```typescript

/**
 * Ventana de periodo anterior. Alineación calendario: mismo tamaño de ventana, inmediatamente
 * antes, por `order` (funciona igual para las 3 granularidades porque `order` es monotónico
 * dentro de cada una). Alineación día de semana: solo produce un resultado distinto a calendario
 * cuando la granularidad es Día -- se desplaza en múltiplos de 7 para que cada día caiga en el
 * mismo día de semana que su contraparte seleccionada (para Semana, una ventana de N semanas
 * completas ya alinea día-a-día por sí sola, así que ambos criterios coinciden).
 */
export function previousPeriodWindow(
  selectedPeriods: Period[],
  alignment: ComparisonAlignment,
  granularity: PeriodGranularity,
  allPeriods: Period[],
): Period[] {
  if (selectedPeriods.length === 0) return [];
  const shift =
    alignment === 'dia_semana' && granularity === 'dia'
      ? 7 * Math.ceil(selectedPeriods.length / 7)
      : selectedPeriods.length;
  const previousOrders = new Set(selectedPeriods.map((period) => period.order - shift));
  return allPeriods.filter((period) => previousOrders.has(period.order));
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx ng test --watch=false --include='**/period.utils.spec.ts'`
Expected: PASS — 12 specs total (6 from Task 2 + 6 new), 0 failures.

- [ ] **Step 6: Write the failing integration test for `SalesDataService`**

Create `src/app/services/sales-data.service.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';

import { SalesDataService } from './sales-data.service';

describe('SalesDataService - comparison', () => {
  let service: SalesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesDataService);
  });

  it('defaults to Mes granularity and periodo_anterior/calendario mode', () => {
    expect(service.selectedPeriodGranularity()).toBe('mes');
    expect(service.comparisonMode()).toBe('periodo_anterior');
    expect(service.comparisonAlignment()).toBe('calendario');
  });

  it('computes KPIs without error across Dia granularity with dia_semana alignment', () => {
    service.selectedPeriodGranularity.set('dia');
    service.selectedPeriodIds.set(['2026-07-20']);
    service.comparisonAlignment.set('dia_semana');
    expect(service.kpis().ventasTotales).toBeDefined();
  });

  it('periodo_especifico uses explicitComparisonPeriodIds instead of the auto-inferred previous window', () => {
    service.selectedPeriodGranularity.set('mes');
    service.selectedPeriodIds.set(['2026-07']);
    service.comparisonMode.set('periodo_especifico');
    service.explicitComparisonPeriodIds.set(['2024-01']);
    // 2024-01 no tiene ventas registradas para el alcance por defecto -- "previous" cae a 0,
    // confirmando que el servicio usó el periodo explícito y no el periodo anterior automático.
    expect(service.kpis().ventasTotales.previous).toBe(0);
  });
});
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `npx ng test --watch=false --include='**/sales-data.service.spec.ts'`
Expected: FAIL — `selectedPeriodGranularity`/`comparisonMode`/`comparisonAlignment`/`explicitComparisonPeriodIds` don't exist yet on `SalesDataService`.

- [ ] **Step 8: Rewire `SalesDataService`**

Modify `src/app/services/sales-data.service.ts`. Replace the imports block (lines 1-26) with:

```typescript
import { Injectable, computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { delay, map, of, switchMap, tap } from 'rxjs';

import type { ComparisonAlignment, ComparisonMode } from '../data/models/comparison.model';
import type { ContextNode } from '../data/models/context-node.model';
import type { KpiSet } from '../data/models/kpi.model';
import type { Period, PeriodGranularity } from '../data/models/period.model';
import type { RankingDimension, RankingSet } from '../data/models/ranking.model';
import type { SalesFact } from '../data/models/sales-fact.model';
import { CONTEXT_TREE, MARCAS, SECTORES } from '../data/mock/context-tree.mock';
import {
  DEFAULT_SELECTED_GRANULARITY,
  DEFAULT_SELECTED_PERIOD_IDS,
  PERIODS_BY_GRANULARITY,
} from '../data/mock/periods.mock';
import { PRODUCTS } from '../data/mock/products.mock';
import { SALES_FACTS } from '../data/mock/sales-facts.mock';
import {
  buildNodeMap,
  buildStoreAncestryMap,
  getDescendantLeafIds,
  toPrimeNgTreeNodes,
} from '../data/utils/context-tree.utils';
import { previousPeriodWindow } from '../data/utils/period.utils';
import {
  aggregateRanking,
  buildHeatmapMatrix,
  buildHourlySeries,
  computeKpis,
  filterFacts,
} from '../data/utils/sales-fact.utils';
```

Replace the `compareToPrevious` signal (line 62 of the original) with:

```typescript
  /** Granularidad activa (Día/Semana/Mes) -- determina qué familia de PERIODS se usa. */
  readonly selectedPeriodGranularity = signal<PeriodGranularity>(DEFAULT_SELECTED_GRANULARITY);

  /** Modo de comparación activo: uno a la vez. */
  readonly comparisonMode = signal<ComparisonMode>('periodo_anterior');
  /** Solo relevante en modo periodo_anterior + granularidad Día/Semana. */
  readonly comparisonAlignment = signal<ComparisonAlignment>('calendario');
  /** Periodos elegidos a mano en modo periodo_especifico; null si no se ha elegido ninguno. */
  readonly explicitComparisonPeriodIds = signal<string[] | null>(null);
```

Replace the `readonly periods: Period[] = PERIODS;` line with:

```typescript
  readonly periods = computed<Period[]>(() => PERIODS_BY_GRANULARITY[this.selectedPeriodGranularity()]);
```

Replace `hasActiveFilter`'s body to also account for granularity:

```typescript
  readonly hasActiveFilter = computed(() => {
    const contextChanged = this.selectedContextId() !== 'holding';
    const granularityChanged = this.selectedPeriodGranularity() !== DEFAULT_SELECTED_GRANULARITY;

    const currentPeriods = new Set(this.selectedPeriodIds());
    const defaultPeriods = new Set(DEFAULT_SELECTED_PERIOD_IDS);
    const periodsChanged =
      currentPeriods.size !== defaultPeriods.size ||
      [...currentPeriods].some((id) => !defaultPeriods.has(id));

    return (
      contextChanged ||
      granularityChanged ||
      periodsChanged ||
      this.crossFilter() !== null ||
      this.sectorMarcaTiendaFilter() !== null
    );
  });
```

Replace `filterKey` to also depend on the new comparison state:

```typescript
  private readonly filterKey = computed(() =>
    JSON.stringify({
      ctx: this.selectedContextId(),
      granularity: this.selectedPeriodGranularity(),
      periods: [...this.selectedPeriodIds()].sort(),
      xf: this.crossFilter(),
      smt: this.sectorMarcaTiendaFilter(),
      cmpMode: this.comparisonMode(),
      cmpAlign: this.comparisonAlignment(),
      cmpExplicit: this.explicitComparisonPeriodIds(),
    }),
  );
```

Replace the body of `computeDashboardData()` from `const periodIds = this.selectedPeriodIds();` through the `previousFacts` computation (Step 4 comment block) with:

```typescript
  private computeDashboardData(): DashboardData {
    const granularity = this.selectedPeriodGranularity();
    const allPeriods = PERIODS_BY_GRANULARITY[granularity];
    const periodIds = this.selectedPeriodIds();
    const selectedPeriods = allPeriods.filter((period) => periodIds.includes(period.id));
    const crossFilter = this.crossFilter();

    const ancestryMap = buildStoreAncestryMap(CONTEXT_TREE);
    const nodeMap = buildNodeMap(CONTEXT_TREE);
    const marcaNameById = new Map(MARCAS.map((marca) => [marca.id, marca.label]));
    const sectorNameById = new Map(SECTORES.map((sector) => [sector.id, sector.label]));
    const productNameById = new Map(PRODUCTS.map((product) => [product.id, product.name]));

    // Step 1 + 2: resolve in-scope stores (header context + Sector/Marca/Tienda filter),
    // narrowed further by a sector/marca/tienda ranking cross-filter. A 'producto' cross-filter
    // does NOT narrow the store set — it narrows facts instead (below).
    let scopedStoreIds = this.scopedStoreIdsForContext();
    if (crossFilter) {
      if (crossFilter.dimension === 'tienda') {
        scopedStoreIds = scopedStoreIds.filter((id) => id === crossFilter.id);
      } else if (crossFilter.dimension === 'sector') {
        scopedStoreIds = scopedStoreIds.filter(
          (id) => ancestryMap.get(id)?.sectorId === crossFilter.id,
        );
      } else if (crossFilter.dimension === 'marca') {
        scopedStoreIds = scopedStoreIds.filter(
          (id) => ancestryMap.get(id)?.marcaId === crossFilter.id,
        );
      }
    }

    // Step 3: store+period scoped facts (before any 'producto' fact-level narrowing).
    const scopedFacts = filterFacts(SALES_FACTS, { storeIds: scopedStoreIds, periods: selectedPeriods });
    const currentFacts =
      crossFilter?.dimension === 'producto'
        ? scopedFacts.filter((fact) => fact.productId === crossFilter.id)
        : scopedFacts;

    // Store-scoped facts across ALL periods (not just the selected ones) -- feeds the KPI
    // sparklines, which need to look at periods outside the current selection.
    const scopedStoreIdSet = new Set(scopedStoreIds);
    const storeScopedAllPeriodFacts = SALES_FACTS.filter((fact) => scopedStoreIdSet.has(fact.storeId));
    const trendSourceFacts =
      crossFilter?.dimension === 'producto'
        ? storeScopedAllPeriodFacts.filter((fact) => fact.productId === crossFilter.id)
        : storeScopedAllPeriodFacts;

    // Step 4: comparison baseline for the CHART and TABLE (and for KPI cards, unless mode is
    // 'meta' -- Task 6 overrides the KPI baseline in that case). 'meta' has no chart/table
    // concept of its own, so it falls back to the periodo_anterior window, same as if the user
    // hadn't picked an explicit comparison period.
    const mode = this.comparisonMode();
    let previousFacts: SalesFact[];
    if (mode === 'periodo_especifico') {
      const explicitIds = this.explicitComparisonPeriodIds() ?? [];
      const explicitPeriods = allPeriods.filter((period) => explicitIds.includes(period.id));
      const explicitFacts = filterFacts(SALES_FACTS, { storeIds: scopedStoreIds, periods: explicitPeriods });
      previousFacts =
        crossFilter?.dimension === 'producto'
          ? explicitFacts.filter((fact) => fact.productId === crossFilter.id)
          : explicitFacts;
    } else {
      const previousPeriods = previousPeriodWindow(
        selectedPeriods,
        this.comparisonAlignment(),
        granularity,
        allPeriods,
      );
      const previousWindowFacts = filterFacts(SALES_FACTS, { storeIds: scopedStoreIds, periods: previousPeriods });
      previousFacts =
        crossFilter?.dimension === 'producto'
          ? previousWindowFacts.filter((fact) => fact.productId === crossFilter.id)
          : previousWindowFacts;
    }

    // Step 5: KPIs (current vs previous) + each metric's sparkline trend points.
    const kpis = computeKpis(currentFacts, previousFacts, trendSourceFacts, allPeriods, periodIds);

    // Step 6: hourly series per selected period (date-range membership, not periodId string match).
    const hourlySeries: Record<string, number[]> = {};
    for (const period of selectedPeriods) {
      const periodFacts = currentFacts.filter(
        (fact) => fact.date >= period.startDate && fact.date <= period.endDate,
      );
      hourlySeries[period.id] = buildHourlySeries(periodFacts);
    }

    // Step 7: combined heatmap across all selected periods.
    const heatmap = buildHeatmapMatrix(currentFacts);

    // Step 8: rankings. Sector/marca/tienda rankings use the store+period scope only (not
    // narrowed by a 'producto' cross-filter) so drilling into a product never empties them.
    // Productos ranking uses the fully narrowed current facts.
    const rankings: RankingSet = {
      sectores: aggregateRanking(
        scopedFacts,
        (fact) => ancestryMap.get(fact.storeId)?.sectorId ?? '',
        (key) => sectorNameById.get(key) ?? key,
      ),
      marcas: aggregateRanking(
        scopedFacts,
        (fact) => ancestryMap.get(fact.storeId)?.marcaId ?? '',
        (key) => marcaNameById.get(key) ?? key,
      ),
      tiendas: aggregateRanking(
        scopedFacts,
        (fact) => fact.storeId,
        (key) => nodeMap.get(key)?.label ?? key,
      ),
      productos: aggregateRanking(
        currentFacts,
        (fact) => fact.productId,
        (key) => productNameById.get(key) ?? key,
      ),
    };

    return { kpis, hourlySeries, heatmap, rankings };
  }
```

- [ ] **Step 9: Run the tests to verify they pass**

Run: `npx ng test --watch=false --include='**/sales-data.service.spec.ts'`
Expected: PASS — 3 specs, 0 failures.

- [ ] **Step 10: Full type-check**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: errors only in `period-picker.ts` (still reads the removed `compareToPrevious` and the old `PERIODS`-shaped grid logic) — fixed in Task 7. No errors anywhere else.

- [ ] **Step 11: Commit**

```bash
git add src/app/data/models/comparison.model.ts src/app/data/utils/period.utils.ts src/app/data/utils/period.utils.spec.ts src/app/services/sales-data.service.ts src/app/services/sales-data.service.spec.ts
git commit -m "feat: SalesDataService soporta granularidad y modo de comparacion explicito"
```

---

### Task 6: Comparación contra Meta

**Files:**
- Modify: `src/app/data/models/comparison.model.ts`
- Create: `src/app/data/mock/kpi-metas.mock.ts`
- Modify: `src/app/data/utils/sales-fact.utils.ts`
- Modify: `src/app/services/sales-data.service.ts`
- Test: `src/app/data/utils/sales-fact.utils.spec.ts`

**Interfaces:**
- Consumes: `KpiValue`/`KpiSet` (`kpi.model.ts`), `buildKpiTrendPoints`/`sumAmount`/`countDistinctTransactions`/`pickUnidadesPorTransaccion`/`pickTicketPromedio` (ya existen en `sales-fact.utils.ts`).
- Produces: `KpiMetaMensual`, `scaleMeta(monthlyMeta, granularity, selectedPeriodCount): number`, `computeKpisAgainstMeta(...): KpiSet`. Modifica `SalesDataService.computeDashboardData` para usarlos cuando `comparisonMode() === 'meta'`.

- [ ] **Step 1: Add `KpiMetaMensual` to the comparison model**

Modify `src/app/data/models/comparison.model.ts` — append:

```typescript

export interface KpiMetaMensual {
  ventasTotales: number;
  transacciones: number;
  unidadesPorTransaccion: number;
  ticketPromedio: number;
}
```

- [ ] **Step 2: Create the mock metas**

Create `src/app/data/mock/kpi-metas.mock.ts`:

```typescript
import type { KpiMetaMensual } from '../models/comparison.model';

/** Metas mensuales de prueba para el mockup -- valores de referencia, no reales del cliente. */
export const KPI_METAS_MENSUALES: KpiMetaMensual = {
  ventasTotales: 150_000_000,
  transacciones: 2_800,
  unidadesPorTransaccion: 4.2,
  ticketPromedio: 53_000,
};
```

- [ ] **Step 3: Write the failing tests for `scaleMeta`/`computeKpisAgainstMeta`**

Modify `src/app/data/utils/sales-fact.utils.spec.ts` — append at the end of the file:

```typescript

describe('scaleMeta', () => {
  it('scales a monthly meta by the number of selected months for Mes granularity', () => {
    expect(scaleMeta(150_000_000, 'mes', 3)).toBe(450_000_000);
  });

  it('scales a monthly meta down proportionally for Semana granularity', () => {
    expect(scaleMeta(150_000_000, 'semana', 1)).toBeCloseTo(150_000_000 / 4.35, 0);
  });

  it('scales a monthly meta down proportionally for Dia granularity', () => {
    expect(scaleMeta(150_000_000, 'dia', 1)).toBeCloseTo(150_000_000 / 30.44, 0);
  });
});

describe('computeKpisAgainstMeta', () => {
  it('computes deltaPct as % distance from the scaled meta, not from a previous period', () => {
    const facts: SalesFact[] = [fact({ amount: 200_000_000, date: '2026-07-15' })];
    const kpis = computeKpisAgainstMeta(
      facts,
      facts,
      [period({ id: '2026-07', order: 2026 * 12 + 7 })],
      ['2026-07'],
      { ventasTotales: 150_000_000, transacciones: 1, unidadesPorTransaccion: 1, ticketPromedio: 1 },
      'mes',
    );
    expect(kpis.ventasTotales.current).toBe(200_000_000);
    expect(kpis.ventasTotales.previous).toBe(150_000_000);
    expect(kpis.ventasTotales.deltaPct).toBeCloseTo(((200_000_000 - 150_000_000) / 150_000_000) * 100, 5);
  });
});
```

Add the missing import at the top of the same spec file (alongside the existing `filterFacts`/`buildHeatmapMatrix` import):

```typescript
import { buildHeatmapMatrix, computeKpisAgainstMeta, filterFacts, scaleMeta } from './sales-fact.utils';
```

- [ ] **Step 4: Run the tests to verify they fail**

Run: `npx ng test --watch=false --include='**/sales-fact.utils.spec.ts'`
Expected: FAIL — `scaleMeta`/`computeKpisAgainstMeta` don't exist yet.

- [ ] **Step 5: Implement `scaleMeta` and `computeKpisAgainstMeta`**

Modify `src/app/data/utils/sales-fact.utils.ts` — add this import to the top (alongside the existing `Period`/`KpiSet` imports):

```typescript
import type { KpiMetaMensual } from '../models/comparison.model';
import type { PeriodGranularity } from '../models/period.model';
```

Append at the end of the file (after `aggregateRanking`):

```typescript

/** Promedios de calendario usados para prorratear una meta mensual a Día/Semana. */
const AVG_DAYS_PER_MONTH = 30.44;
const AVG_WEEKS_PER_MONTH = 4.35;

export function scaleMeta(monthlyMeta: number, granularity: PeriodGranularity, selectedPeriodCount: number): number {
  if (granularity === 'mes') return monthlyMeta * selectedPeriodCount;
  if (granularity === 'semana') return (monthlyMeta / AVG_WEEKS_PER_MONTH) * selectedPeriodCount;
  return (monthlyMeta / AVG_DAYS_PER_MONTH) * selectedPeriodCount;
}

export function computeKpisAgainstMeta(
  currentFacts: SalesFact[],
  trendSourceFacts: SalesFact[],
  allPeriods: Period[],
  selectedPeriodIds: string[],
  metas: KpiMetaMensual,
  granularity: PeriodGranularity,
): KpiSet {
  const selectedCount = selectedPeriodIds.length;

  const build = (pick: (facts: SalesFact[]) => number, monthlyMeta: number): KpiValue => {
    const current = pick(currentFacts);
    const target = scaleMeta(monthlyMeta, granularity, selectedCount);
    const deltaPct = target === 0 ? null : ((current - target) / Math.abs(target)) * 100;
    return {
      current,
      previous: target,
      deltaPct,
      trend: buildKpiTrendPoints(trendSourceFacts, allPeriods, selectedPeriodIds, pick),
    };
  };

  return {
    ventasTotales: build(sumAmount, metas.ventasTotales),
    transacciones: build(countDistinctTransactions, metas.transacciones),
    unidadesPorTransaccion: build(pickUnidadesPorTransaccion, metas.unidadesPorTransaccion),
    ticketPromedio: build(pickTicketPromedio, metas.ticketPromedio),
  };
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx ng test --watch=false --include='**/sales-fact.utils.spec.ts'`
Expected: PASS — 9 specs total, 0 failures.

- [ ] **Step 7: Wire Meta mode into `computeDashboardData`**

Modify `src/app/services/sales-data.service.ts` — add to the imports (alongside the other `sales-fact.utils` import):

```typescript
import { KPI_METAS_MENSUALES } from '../data/mock/kpi-metas.mock';
```

and change the `sales-fact.utils` import line to also bring in `computeKpisAgainstMeta`:

```typescript
import {
  aggregateRanking,
  buildHeatmapMatrix,
  buildHourlySeries,
  computeKpis,
  computeKpisAgainstMeta,
  filterFacts,
} from '../data/utils/sales-fact.utils';
```

Replace the "Step 5: KPIs" line in `computeDashboardData`:

```typescript
    // Step 5: KPIs. 'meta' mode overrides the KPI-card baseline to the scaled meta target;
    // chart/table always use previousFacts computed above (meta doesn't apply to them, per spec).
    const kpis =
      mode === 'meta'
        ? computeKpisAgainstMeta(currentFacts, trendSourceFacts, allPeriods, periodIds, KPI_METAS_MENSUALES, granularity)
        : computeKpis(currentFacts, previousFacts, trendSourceFacts, allPeriods, periodIds);
```

- [ ] **Step 8: Full type-check and test suite**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: errors only in `period-picker.ts` (Task 7 fixes it).

Run: `npx ng test --watch=false --include='**/sales-fact.utils.spec.ts' --include='**/sales-data.service.spec.ts'`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/app/data/models/comparison.model.ts src/app/data/mock/kpi-metas.mock.ts src/app/data/utils/sales-fact.utils.ts src/app/data/utils/sales-fact.utils.spec.ts src/app/services/sales-data.service.ts
git commit -m "feat: agrega comparacion contra Meta (tercer modo de comparacion)"
```

---

### Task 7: Period Picker — 3 granularidades, se retira el toggle de comparación

**Files:**
- Modify: `src/app/components/shared/period-picker/period-picker.ts`
- Modify: `src/app/components/shared/period-picker/period-picker.html`
- Modify: `src/app/components/shared/period-picker/period-picker.css`

**Interfaces:**
- Consumes: `PERIODS_BY_GRANULARITY`, `PeriodGranularity`, `PERIOD_PRESETS` con `.granularity` (Task 2), `SalesDataService.selectedPeriodGranularity` (Task 5).

- [ ] **Step 1: Rewrite `period-picker.ts`**

Modify `src/app/components/shared/period-picker/period-picker.ts` — full new content:

```typescript
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Popover } from 'primeng/popover';

import type { Period, PeriodGranularity } from '../../../data/models/period.model';
import { PERIODS_BY_GRANULARITY } from '../../../data/mock/periods.mock';
import { groupPeriodsByYear, PERIOD_PRESETS, type PeriodPreset } from '../../../data/utils/period.utils';
import { SalesDataService } from '../../../services/sales-data.service';

/** Stands in for the real current date -- this is a mock-data app with no live clock dependency. */
const TODAY = { year: 2026, month: 7, day: 20 };

@Component({
  selector: 'app-period-picker',
  standalone: true,
  imports: [Button, Checkbox, FormsModule, Popover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './period-picker.html',
  styleUrl: './period-picker.css',
})
export class PeriodPickerComponent {
  protected readonly salesData = inject(SalesDataService);

  protected readonly draftGranularity = signal<PeriodGranularity>('mes');
  protected readonly draftPeriodIds = signal<Set<string>>(new Set());

  protected readonly presets = computed<PeriodPreset[]>(() =>
    PERIOD_PRESETS.filter((preset) => preset.granularity === this.draftGranularity()),
  );

  private readonly activePeriods = computed<Period[]>(() => PERIODS_BY_GRANULARITY[this.draftGranularity()]);
  private readonly periodsByYear = computed(() => groupPeriodsByYear(this.activePeriods()));
  private readonly minYear = computed(() => Math.min(...this.activePeriods().map((period) => period.year)));
  private readonly maxYear = computed(() => Math.max(...this.activePeriods().map((period) => period.year)));

  /** Persists across popover open/close -- only the draft selection resets on (onShow). */
  protected readonly viewedYear = signal<number>(2026);

  protected readonly viewedYearPeriods = computed<Period[]>(() =>
    (this.periodsByYear().get(this.viewedYear()) ?? []).slice().sort((a, b) => a.order - b.order),
  );

  protected readonly canGoPrevYear = computed(() => this.viewedYear() > this.minYear());
  protected readonly canGoNextYear = computed(() => this.viewedYear() < this.maxYear());

  /** Live summary of the applied (not draft) selection shown on the trigger button. */
  protected readonly summaryLabel = computed(() => {
    const granularity = this.salesData.selectedPeriodGranularity();
    const selectedIds = new Set(this.salesData.selectedPeriodIds());
    const selected = PERIODS_BY_GRANULARITY[granularity].filter((period) => selectedIds.has(period.id));
    if (selected.length === 0) return 'Seleccionar periodos';

    const years = selected.map((period) => period.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearLabel = minYear === maxYear ? `${minYear}` : `${minYear}–${maxYear}`;
    return `${selected.length} periodos · ${yearLabel}`;
  });

  /** Reseeds the draft from the last-applied state every time the popover opens. */
  onPopoverShow(): void {
    this.draftGranularity.set(this.salesData.selectedPeriodGranularity());
    this.draftPeriodIds.set(new Set(this.salesData.selectedPeriodIds()));
    this.viewedYear.set(2026);
  }

  /** Cambiar de granularidad resetea la selección -- un id de Día no tiene sentido en Semana. */
  setGranularity(granularity: PeriodGranularity): void {
    if (granularity === this.draftGranularity()) return;
    this.draftGranularity.set(granularity);
    this.draftPeriodIds.set(new Set());
  }

  isDraftSelected(periodId: string): boolean {
    return this.draftPeriodIds().has(periodId);
  }

  toggleDraftPeriod(periodId: string): void {
    const next = new Set(this.draftPeriodIds());
    if (next.has(periodId)) {
      next.delete(periodId);
    } else {
      next.add(periodId);
    }
    this.draftPeriodIds.set(next);
  }

  goPrevYear(): void {
    if (this.canGoPrevYear()) this.viewedYear.update((year) => year - 1);
  }

  goNextYear(): void {
    if (this.canGoNextYear()) this.viewedYear.update((year) => year + 1);
  }

  applyPreset(preset: PeriodPreset): void {
    this.draftPeriodIds.set(new Set(preset.resolve(this.activePeriods(), TODAY)));
  }

  apply(popover: Popover): void {
    this.salesData.selectedPeriodGranularity.set(this.draftGranularity());
    this.salesData.selectedPeriodIds.set([...this.draftPeriodIds()]);
    popover.hide();
  }

  cancel(popover: Popover): void {
    popover.hide();
  }
}
```

- [ ] **Step 2: Rewrite `period-picker.html`**

Modify `src/app/components/shared/period-picker/period-picker.html` — full new content:

```html
<p-button
  class="period-picker-trigger"
  [label]="summaryLabel()"
  severity="secondary"
  [outlined]="true"
  (onClick)="op.toggle($event)"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
</p-button>

<p-popover #op (onShow)="onPopoverShow()">
  <div class="period-picker-panel">
    <div class="period-picker-section period-picker-granularity">
      <p-button label="Día" size="small" severity="secondary" [outlined]="draftGranularity() !== 'dia'" (onClick)="setGranularity('dia')" />
      <p-button label="Semana" size="small" severity="secondary" [outlined]="draftGranularity() !== 'semana'" (onClick)="setGranularity('semana')" />
      <p-button label="Mes" size="small" severity="secondary" [outlined]="draftGranularity() !== 'mes'" (onClick)="setGranularity('mes')" />
    </div>

    @if (presets().length > 0) {
      <div class="period-picker-section">
        <span class="period-picker-section-label">Accesos Rápidos</span>
        <div class="period-picker-preset-list">
          @for (preset of presets(); track preset.key) {
            <p-button
              [label]="preset.label"
              size="small"
              severity="secondary"
              [outlined]="true"
              (onClick)="applyPreset(preset)"
            />
          }
        </div>
      </div>
    }

    <div class="period-picker-section">
      <div class="period-picker-year-nav">
        <p-button severity="secondary" [text]="true" [rounded]="true" [disabled]="!canGoPrevYear()" (onClick)="goPrevYear()" ariaLabel="Año anterior">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </p-button>
        <span class="period-picker-year-label">{{ viewedYear() }}</span>
        <p-button severity="secondary" [text]="true" [rounded]="true" [disabled]="!canGoNextYear()" (onClick)="goNextYear()" ariaLabel="Año siguiente">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </p-button>
      </div>

      @if (draftGranularity() === 'mes') {
        <div class="period-picker-month-grid">
          @for (period of viewedYearPeriods(); track period.id) {
            <label class="period-chip" [class.is-active]="isDraftSelected(period.id)">
              <p-checkbox
                class="period-chip-input"
                [binary]="true"
                [ngModel]="isDraftSelected(period.id)"
                (onChange)="toggleDraftPeriod(period.id)"
              />
              @if (isDraftSelected(period.id)) {
                <svg class="period-chip-check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              }
              <span class="period-chip-label">{{ period.label }}</span>
            </label>
          }
        </div>
      } @else {
        <div class="period-picker-period-list">
          @for (period of viewedYearPeriods(); track period.id) {
            <label class="period-picker-list-row" [class.is-active]="isDraftSelected(period.id)">
              <p-checkbox
                [binary]="true"
                [ngModel]="isDraftSelected(period.id)"
                (onChange)="toggleDraftPeriod(period.id)"
              />
              <span>{{ period.label }}</span>
            </label>
          } @empty {
            <p class="period-picker-empty">Sin periodos</p>
          }
        </div>
      }
    </div>

    <div class="period-picker-actions">
      <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="cancel(op)" />
      <p-button label="Aplicar" (onClick)="apply(op)" />
    </div>
  </div>
</p-popover>
```

- [ ] **Step 3: Update `period-picker.css`**

Modify `src/app/components/shared/period-picker/period-picker.css` — remove the `.period-picker-compare`/`.period-picker-compare-label` rules (lines 117-129 of the original) and add these new rules right before `.period-picker-actions`:

```css
.period-picker-granularity {
  flex-direction: row;
  gap: 0.5rem;
}

.period-picker-period-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 14rem;
  overflow-y: auto;
}

.period-picker-list-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  color: var(--p-text-color);
  cursor: pointer;
}

.period-picker-list-row:hover {
  background: var(--p-surface-100);
}

.period-picker-list-row.is-active {
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
}

.period-picker-empty {
  font-size: 0.8125rem;
  color: var(--p-text-muted-color);
  margin: 0;
}
```

- [ ] **Step 4: Type-check and build**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: no output, exit 0.

Run: `npx ng build`
Expected: build succeeds, no new errors/warnings referencing `period-picker`.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/shared/period-picker/period-picker.ts src/app/components/shared/period-picker/period-picker.html src/app/components/shared/period-picker/period-picker.css
git commit -m "refactor: period-picker soporta granularidad Dia/Semana/Mes, retira toggle de comparacion"
```

---

### Task 8: `ComparisonSelectorComponent` (nuevo) y su lugar en el Header Global

**Files:**
- Create: `src/app/components/shared/comparison-selector/comparison-selector.ts`
- Create: `src/app/components/shared/comparison-selector/comparison-selector.html`
- Create: `src/app/components/shared/comparison-selector/comparison-selector.css`
- Modify: `src/app/components/shared/global-header/global-header.ts`
- Modify: `src/app/components/shared/global-header/global-header.html`

**Interfaces:**
- Consumes: `SalesDataService.comparisonMode/.comparisonAlignment/.explicitComparisonPeriodIds/.selectedPeriodGranularity` (Task 5), `PERIODS_BY_GRANULARITY`, `groupPeriodsByYear` (Task 2).

- [ ] **Step 1: Create the component class**

Create `src/app/components/shared/comparison-selector/comparison-selector.ts`:

```typescript
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Popover } from 'primeng/popover';

import type { ComparisonAlignment, ComparisonMode } from '../../../data/models/comparison.model';
import type { Period } from '../../../data/models/period.model';
import { PERIODS_BY_GRANULARITY } from '../../../data/mock/periods.mock';
import { groupPeriodsByYear } from '../../../data/utils/period.utils';
import { SalesDataService } from '../../../services/sales-data.service';

@Component({
  selector: 'app-comparison-selector',
  standalone: true,
  imports: [Button, Checkbox, FormsModule, Popover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comparison-selector.html',
  styleUrl: './comparison-selector.css',
})
export class ComparisonSelectorComponent {
  protected readonly salesData = inject(SalesDataService);

  protected readonly draftMode = signal<ComparisonMode>('periodo_anterior');
  protected readonly draftAlignment = signal<ComparisonAlignment>('calendario');
  protected readonly draftExplicitPeriodIds = signal<Set<string>>(new Set());

  /** El toggle de alineación solo tiene sentido en modo periodo_anterior y granularidad Día/Semana. */
  protected readonly showAlignment = computed(
    () => this.draftMode() === 'periodo_anterior' && this.salesData.selectedPeriodGranularity() !== 'mes',
  );
  protected readonly showExplicitPicker = computed(() => this.draftMode() === 'periodo_especifico');

  private readonly activePeriods = computed<Period[]>(
    () => PERIODS_BY_GRANULARITY[this.salesData.selectedPeriodGranularity()],
  );
  private readonly periodsByYear = computed(() => groupPeriodsByYear(this.activePeriods()));
  private readonly minYear = computed(() => Math.min(...this.activePeriods().map((period) => period.year)));
  private readonly maxYear = computed(() => Math.max(...this.activePeriods().map((period) => period.year)));

  protected readonly viewedYear = signal<number>(2026);
  protected readonly viewedYearPeriods = computed<Period[]>(() =>
    (this.periodsByYear().get(this.viewedYear()) ?? []).slice().sort((a, b) => a.order - b.order),
  );
  protected readonly canGoPrevYear = computed(() => this.viewedYear() > this.minYear());
  protected readonly canGoNextYear = computed(() => this.viewedYear() < this.maxYear());

  protected readonly modeLabel = computed(() => {
    switch (this.salesData.comparisonMode()) {
      case 'periodo_anterior':
        return 'Periodo Anterior';
      case 'periodo_especifico':
        return 'Periodo Específico';
      case 'meta':
        return 'Meta';
    }
  });

  onPopoverShow(): void {
    this.draftMode.set(this.salesData.comparisonMode());
    this.draftAlignment.set(this.salesData.comparisonAlignment());
    this.draftExplicitPeriodIds.set(new Set(this.salesData.explicitComparisonPeriodIds() ?? []));
    this.viewedYear.set(2026);
  }

  setMode(mode: ComparisonMode): void {
    this.draftMode.set(mode);
  }

  setAlignment(alignment: ComparisonAlignment): void {
    this.draftAlignment.set(alignment);
  }

  goPrevYear(): void {
    if (this.canGoPrevYear()) this.viewedYear.update((year) => year - 1);
  }

  goNextYear(): void {
    if (this.canGoNextYear()) this.viewedYear.update((year) => year + 1);
  }

  isExplicitSelected(periodId: string): boolean {
    return this.draftExplicitPeriodIds().has(periodId);
  }

  toggleExplicitPeriod(periodId: string): void {
    const next = new Set(this.draftExplicitPeriodIds());
    if (next.has(periodId)) {
      next.delete(periodId);
    } else {
      next.add(periodId);
    }
    this.draftExplicitPeriodIds.set(next);
  }

  apply(popover: Popover): void {
    this.salesData.comparisonMode.set(this.draftMode());
    this.salesData.comparisonAlignment.set(this.draftAlignment());
    this.salesData.explicitComparisonPeriodIds.set(
      this.draftMode() === 'periodo_especifico' ? [...this.draftExplicitPeriodIds()] : null,
    );
    popover.hide();
  }

  cancel(popover: Popover): void {
    popover.hide();
  }
}
```

- [ ] **Step 2: Create the template**

Create `src/app/components/shared/comparison-selector/comparison-selector.html`:

```html
<p-button
  class="comparison-selector-trigger"
  [label]="modeLabel()"
  severity="secondary"
  [outlined]="true"
  (onClick)="op.toggle($event)"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 3 4 7l4 4"></path>
    <path d="M4 7h16"></path>
    <path d="M16 21l4-4-4-4"></path>
    <path d="M20 17H4"></path>
  </svg>
</p-button>

<p-popover #op (onShow)="onPopoverShow()">
  <div class="comparison-selector-panel">
    <div class="comparison-selector-section">
      <span class="comparison-selector-section-label">Comparar contra</span>
      <div class="comparison-selector-mode-list">
        <p-button label="Periodo Anterior" size="small" severity="secondary" [outlined]="draftMode() !== 'periodo_anterior'" (onClick)="setMode('periodo_anterior')" />
        <p-button label="Periodo Específico" size="small" severity="secondary" [outlined]="draftMode() !== 'periodo_especifico'" (onClick)="setMode('periodo_especifico')" />
        <p-button label="Meta" size="small" severity="secondary" [outlined]="draftMode() !== 'meta'" (onClick)="setMode('meta')" />
      </div>
    </div>

    @if (showAlignment()) {
      <div class="comparison-selector-section">
        <span class="comparison-selector-section-label">Alinear por</span>
        <div class="comparison-selector-mode-list">
          <p-button label="Fecha calendario" size="small" severity="secondary" [outlined]="draftAlignment() !== 'calendario'" (onClick)="setAlignment('calendario')" />
          <p-button label="Día de semana" size="small" severity="secondary" [outlined]="draftAlignment() !== 'dia_semana'" (onClick)="setAlignment('dia_semana')" />
        </div>
      </div>
    }

    @if (showExplicitPicker()) {
      <div class="comparison-selector-section">
        <div class="period-picker-year-nav">
          <p-button severity="secondary" [text]="true" [rounded]="true" [disabled]="!canGoPrevYear()" (onClick)="goPrevYear()" ariaLabel="Año anterior">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </p-button>
          <span class="period-picker-year-label">{{ viewedYear() }}</span>
          <p-button severity="secondary" [text]="true" [rounded]="true" [disabled]="!canGoNextYear()" (onClick)="goNextYear()" ariaLabel="Año siguiente">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </p-button>
        </div>
        <div class="comparison-selector-period-list">
          @for (period of viewedYearPeriods(); track period.id) {
            <label class="comparison-selector-list-row" [class.is-active]="isExplicitSelected(period.id)">
              <p-checkbox
                [binary]="true"
                [ngModel]="isExplicitSelected(period.id)"
                (onChange)="toggleExplicitPeriod(period.id)"
              />
              <span>{{ period.label }}</span>
            </label>
          } @empty {
            <p class="comparison-selector-empty">Sin periodos</p>
          }
        </div>
      </div>
    }

    <div class="comparison-selector-actions">
      <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="cancel(op)" />
      <p-button label="Aplicar" (onClick)="apply(op)" />
    </div>
  </div>
</p-popover>
```

- [ ] **Step 3: Create the stylesheet**

Create `src/app/components/shared/comparison-selector/comparison-selector.css`:

```css
:host { display: block; }

.comparison-selector-panel {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  width: 18rem;
}

.comparison-selector-section {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.comparison-selector-section-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

.comparison-selector-mode-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.period-picker-year-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.period-picker-year-label {
  min-width: 3.5rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.comparison-selector-period-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 12rem;
  overflow-y: auto;
}

.comparison-selector-list-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  color: var(--p-text-color);
  cursor: pointer;
}

.comparison-selector-list-row:hover {
  background: var(--p-surface-100);
}

.comparison-selector-list-row.is-active {
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
}

.comparison-selector-empty {
  font-size: 0.8125rem;
  color: var(--p-text-muted-color);
  margin: 0;
}

.comparison-selector-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
```

- [ ] **Step 4: Wire it into the Global Header**

Modify `src/app/components/shared/global-header/global-header.ts` — add the import and register it:

```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';

import { SalesDataService } from '../../../services/sales-data.service';
import { ComparisonSelectorComponent } from '../comparison-selector/comparison-selector';
import { ContextFilterComponent } from '../context-filter/context-filter';
import { FilterChipsSummaryComponent } from '../filter-chips-summary/filter-chips-summary';
import { PeriodPickerComponent } from '../period-picker/period-picker';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [
    Toolbar,
    Button,
    PrimeTemplate,
    RouterLink,
    RouterLinkActive,
    ComparisonSelectorComponent,
    ContextFilterComponent,
    PeriodPickerComponent,
    FilterChipsSummaryComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.html',
  styleUrl: './global-header.css',
})
export class GlobalHeaderComponent {
  protected readonly salesData = inject(SalesDataService);
}
```

Modify `src/app/components/shared/global-header/global-header.html` — add `<app-comparison-selector />` right after `<app-period-picker />`:

```html
<div class="header-accent"></div>

<p-toolbar class="global-header-toolbar">
  <ng-template pTemplate="start">
    <div class="global-header-start">
      <app-context-filter />
      <app-period-picker />
      <app-comparison-selector />
    </div>
  </ng-template>

  <ng-template pTemplate="end">
    <nav class="global-header-tabs">
      <a routerLink="/" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: true }" class="global-header-nav-link">
        Ventas General
      </a>
      <a routerLink="/detalle-ventas" routerLinkActive="is-active" class="global-header-nav-link">
        Detalle de Ventas
      </a>
    </nav>
  </ng-template>
</p-toolbar>

@if (salesData.hasActiveFilter()) {
  <div class="global-header-chips-scroll">
    <app-filter-chips-summary />
    <p-button
      label="Limpiar filtros"
      severity="secondary"
      [text]="true"
      size="small"
      class="global-header-clear-sticky"
      (onClick)="salesData.clearFilters()"
    />
  </div>
}
```

- [ ] **Step 5: Type-check and build**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: no output, exit 0.

Run: `npx ng build`
Expected: build succeeds, no new errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/components/shared/comparison-selector src/app/components/shared/global-header/global-header.ts src/app/components/shared/global-header/global-header.html
git commit -m "feat: agrega ComparisonSelectorComponent al Header Global"
```

---

### Task 9: Verificación final end-to-end

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npx ng test --watch=false`
Expected: all specs pass, including the new ones from Tasks 1-6 (the single pre-existing `app.spec.ts` `ActivatedRoute` failure is unrelated and stays as-is).

- [ ] **Step 2: Run the full build**

Run: `npx ng build`
Expected: build succeeds, no new warnings beyond the pre-existing bundle-size budget warning.

- [ ] **Step 3: Serve and visually confirm all 3 granularities and all 3 comparison modes**

Run: `npx ng serve`

In the browser:
- Open the Period Picker: confirm Día/Semana/Mes are selectable, Mes still shows the exact same year-grid as before, Semana shows "Últimas 3 Semanas"/"Últimas 12 Semanas" presets and a scrollable week list, Día shows a scrollable day list.
- Open the new comparison selector next to it: confirm the 3 modes (Periodo Anterior / Periodo Específico / Meta), that the alignment toggle only appears in Periodo Anterior + Día/Semana (not Mes), and that Periodo Específico shows a period picker to choose the comparison baseline manually.
- Switch to Meta mode: confirm KPI cards show a % vs. a scaled target instead of vs. previous period, using the same color semaphore as today.
- Confirm Ventas General's chart and Detalle de Ventas' table still render with Mes granularity + Periodo Anterior (the default), unchanged from before this plan.

- [ ] **Step 4: Confirm no regression in default (Mes + Periodo Anterior) behavior**

Run: `grep -rn "compareToPrevious" src/app`
Expected: no output (the old boolean toggle is fully removed, nothing still references it).
