# Vocabulario de dimensiones por tenant (Fase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded Sector/Marca/Tienda dimension labels in `context-filter` and `ranking-panels` with a resolved value from a new `TenantVocabularyService`, backed by a 3-level fallback chain (tenant override → rubro preset → generic technical name), with only the `retail` preset populated.

**Architecture:** A pure resolver function (`resolveDimensionLabel`) implements the fallback chain against plain parameters (testable in isolation, no Angular deps). A thin `TenantVocabularyService` binds that function to the current mock tenant (`CURRENT_USER`) and the `retail` preset (`RUBRO_PRESETS`). Two existing components inject the service and call `labelFor(dimension)` from their templates instead of hardcoding strings.

**Tech Stack:** Angular 21 (standalone components, signals, `inject()`), TypeScript, Jasmine/Karma (`ng test`).

## Global Constraints

- No Tailwind, no utility CSS classes, no inline styles — this plan touches no CSS at all.
- Reuse `FilterNodeType = 'sector' | 'marca' | 'tienda'` from `src/app/data/utils/sector-marca-tienda-tree.utils.ts:4` as the dimension key type — do not declare a duplicate union.
- Do not introduce a `TenantService`/`SessionService`. Tenant identity keeps flowing through `CURRENT_USER` in `src/app/data/mock/mock-user.mock.ts`, exactly like `SavedViewsService` already consumes it.
- The fallback chain must have all 3 rungs implemented (tenant override → rubro preset → generic technical name) even though only the last two are exercised in this phase (no tenant override data exists yet).
- Naming: service class `PascalCase` + `Service` suffix, signals `camelCase`, files `kebab-case` (per project `CLAUDE.md`).
- Out of scope, do not touch: governance tree, Vistas Guardadas tree breadcrumbs, access simulator (none exist in this repo), and the card-visibility rule ("hide when a dimension has exactly 1 distinct value") — not implemented anywhere and not part of this plan.
- For the `retail` tenant, the UI must render the exact same strings as today ("Sectores", "Marcas", "Tiendas") — verifiable by code inspection (no hardcoded literal remains in the migrated files) and by running the app.

---

### Task 1: Tipos y datos del preset "retail"

**Files:**
- Create: `src/app/data/models/tenant-vocabulary.model.ts`
- Modify: `src/app/data/models/mock-user.model.ts`
- Create: `src/app/data/mock/rubro-presets.mock.ts`
- Modify: `src/app/data/mock/mock-user.mock.ts`

**Interfaces:**
- Produces: `RubroId` (type, currently `'retail'` only), `DimensionVocabulary = Record<FilterNodeType, string>`, `MockUser.rubro: RubroId`, `MockUser.vocabularyOverrides?: Partial<DimensionVocabulary>`, `RUBRO_PRESETS: Record<RubroId, DimensionVocabulary>`, `CURRENT_USER.rubro === 'retail'`. Tasks 2–5 depend on all of these exact names.

- [ ] **Step 1: Create the vocabulary model file**

Create `src/app/data/models/tenant-vocabulary.model.ts`:

```typescript
import type { FilterNodeType } from '../utils/sector-marca-tienda-tree.utils';

/** Union of one member today; extend when a second rubro preset ships (e.g. 'gastronomia'). */
export type RubroId = 'retail';

export type DimensionVocabulary = Record<FilterNodeType, string>;
```

- [ ] **Step 2: Extend `MockUser` with the tenant's rubro and override slot**

Modify `src/app/data/models/mock-user.model.ts` — full new content:

```typescript
import type { DimensionVocabulary, RubroId } from './tenant-vocabulary.model';

/**
 * This app has no real authentication yet -- MockUser stands in for whatever a real
 * logged-in user/session object would look like once a backend exists.
 */
export type UserRole = 'HOLDING_ADMIN' | 'CLIENT_ADMIN' | 'VIEWER_ESTRATEGICO';

export interface MockUser {
  id: string;
  name: string;
  role: UserRole;
  tenantId: string;
  /** Which industry-vocabulary preset this tenant uses (see rubro-presets.mock.ts). */
  rubro: RubroId;
  /**
   * Tenant-specific label overrides, layered on top of the rubro preset. Unset in phase 1 --
   * no admin UI writes to this yet, but the resolution chain already reads from it.
   */
  vocabularyOverrides?: Partial<DimensionVocabulary>;
}
```

- [ ] **Step 3: Create the `retail` rubro preset**

Create `src/app/data/mock/rubro-presets.mock.ts`:

```typescript
import type { DimensionVocabulary, RubroId } from '../models/tenant-vocabulary.model';

/**
 * Sector/Marca/Tienda display labels per industry ("rubro"). Only 'retail' is populated today --
 * the same names already hardcoded across the UI. Add a new RubroId + entry here (never a
 * reduced/parallel mechanism) when a tenant with a different vocabulary (e.g. gastronomia) ships.
 */
export const RUBRO_PRESETS: Record<RubroId, DimensionVocabulary> = {
  retail: {
    sector: 'Sectores',
    marca: 'Marcas',
    tienda: 'Tiendas',
  },
};
```

- [ ] **Step 4: Assign the `retail` rubro to the current mock tenant**

Modify `src/app/data/mock/mock-user.mock.ts` — full new content:

```typescript
import type { MockUser } from '../models/mock-user.model';

/**
 * Stand-in for real authentication -- this app has none yet. Defaults to the most
 * permissive role so every saved-views code path (personal + team CRUD) is exercisable
 * without building a role-switcher UI. Same spirit as the TODAY mock-date constant
 * already used in the Period Picker component.
 */
export const CURRENT_USER: MockUser = {
  id: 'user-demo',
  name: 'Usuario Demo',
  role: 'HOLDING_ADMIN',
  tenantId: 'tenant-demo',
  rubro: 'retail',
};

export function canManageTeamViews(role: MockUser['role']): boolean {
  return role === 'HOLDING_ADMIN' || role === 'CLIENT_ADMIN';
}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: no output, exit code 0.

- [ ] **Step 6: Commit**

```bash
git add src/app/data/models/tenant-vocabulary.model.ts src/app/data/models/mock-user.model.ts src/app/data/mock/rubro-presets.mock.ts src/app/data/mock/mock-user.mock.ts
git commit -m "feat: agrega modelo y preset retail de vocabulario de dimensiones"
```

---

### Task 2: Función pura de resolución (fallback chain)

**Files:**
- Create: `src/app/data/utils/tenant-vocabulary.utils.ts`
- Test: `src/app/data/utils/tenant-vocabulary.utils.spec.ts`

**Interfaces:**
- Consumes: `FilterNodeType` from `sector-marca-tienda-tree.utils.ts`, `DimensionVocabulary` from Task 1.
- Produces: `resolveDimensionLabel(dimension: FilterNodeType, overrides: Partial<DimensionVocabulary> | undefined, preset: Partial<DimensionVocabulary>): string`. Task 3's service calls this exact signature.

- [ ] **Step 1: Write the failing test**

Create `src/app/data/utils/tenant-vocabulary.utils.spec.ts`:

```typescript
import { resolveDimensionLabel } from './tenant-vocabulary.utils';

describe('resolveDimensionLabel', () => {
  it('uses the tenant override when present', () => {
    expect(resolveDimensionLabel('sector', { sector: 'Rubros' }, { sector: 'Sectores' })).toBe('Rubros');
  });

  it('falls back to the rubro preset when there is no override', () => {
    expect(resolveDimensionLabel('marca', undefined, { marca: 'Marcas' })).toBe('Marcas');
  });

  it('falls back to the capitalized dimension key when the preset lacks that dimension', () => {
    expect(resolveDimensionLabel('tienda', undefined, {})).toBe('Tienda');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx ng test --watch=false --include='**/tenant-vocabulary.utils.spec.ts'`
Expected: FAIL — `tenant-vocabulary.utils.ts` does not exist / `resolveDimensionLabel` is not defined (module resolution error).

- [ ] **Step 3: Implement the resolver**

Create `src/app/data/utils/tenant-vocabulary.utils.ts`:

```typescript
import type { DimensionVocabulary } from '../models/tenant-vocabulary.model';
import type { FilterNodeType } from './sector-marca-tienda-tree.utils';

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Resolves the display label for a Sector/Marca/Tienda dimension through a 3-level fallback:
 * tenant override -> rubro preset -> capitalized dimension key. The third rung only fires if a
 * rubro preset doesn't define that dimension -- never the case for 'retail' today, but the chain
 * must exist so a future rubro preset can ship incomplete without breaking the UI.
 */
export function resolveDimensionLabel(
  dimension: FilterNodeType,
  overrides: Partial<DimensionVocabulary> | undefined,
  preset: Partial<DimensionVocabulary>,
): string {
  return overrides?.[dimension] ?? preset[dimension] ?? capitalize(dimension);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx ng test --watch=false --include='**/tenant-vocabulary.utils.spec.ts'`
Expected: PASS — 3 specs, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add src/app/data/utils/tenant-vocabulary.utils.ts src/app/data/utils/tenant-vocabulary.utils.spec.ts
git commit -m "feat: agrega resolveDimensionLabel con fallback tenant->rubro->generico"
```

---

### Task 3: `TenantVocabularyService`

**Files:**
- Create: `src/app/services/tenant-vocabulary.service.ts`
- Test: `src/app/services/tenant-vocabulary.service.spec.ts`

**Interfaces:**
- Consumes: `resolveDimensionLabel` (Task 2), `CURRENT_USER` (Task 1's `mock-user.mock.ts`), `RUBRO_PRESETS` (Task 1's `rubro-presets.mock.ts`), `FilterNodeType`.
- Produces: `TenantVocabularyService` (`@Injectable({ providedIn: 'root' })`) with `labelFor(dimension: FilterNodeType): string`. Tasks 4–5 inject this service and call `labelFor` exactly like this.

- [ ] **Step 1: Write the failing test**

Create `src/app/services/tenant-vocabulary.service.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';

import { TenantVocabularyService } from './tenant-vocabulary.service';

describe('TenantVocabularyService', () => {
  let service: TenantVocabularyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantVocabularyService);
  });

  it('resolves the retail preset labels for the current tenant', () => {
    expect(service.labelFor('sector')).toBe('Sectores');
    expect(service.labelFor('marca')).toBe('Marcas');
    expect(service.labelFor('tienda')).toBe('Tiendas');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx ng test --watch=false --include='**/tenant-vocabulary.service.spec.ts'`
Expected: FAIL — `tenant-vocabulary.service.ts` does not exist.

- [ ] **Step 3: Implement the service**

Create `src/app/services/tenant-vocabulary.service.ts`:

```typescript
import { Injectable } from '@angular/core';

import { CURRENT_USER } from '../data/mock/mock-user.mock';
import { RUBRO_PRESETS } from '../data/mock/rubro-presets.mock';
import { resolveDimensionLabel } from '../data/utils/tenant-vocabulary.utils';
import type { FilterNodeType } from '../data/utils/sector-marca-tienda-tree.utils';

/**
 * Resolves Sector/Marca/Tienda display labels for the current tenant. See
 * resolveDimensionLabel (tenant-vocabulary.utils.ts) for the fallback chain itself --
 * this service only binds it to the current mock tenant and the retail preset.
 */
@Injectable({ providedIn: 'root' })
export class TenantVocabularyService {
  /** Mock stand-in for the real logged-in user -- see CURRENT_USER doc comment in mock-user.mock.ts. */
  readonly currentUser = CURRENT_USER;

  labelFor(dimension: FilterNodeType): string {
    return resolveDimensionLabel(
      dimension,
      this.currentUser.vocabularyOverrides,
      RUBRO_PRESETS[this.currentUser.rubro],
    );
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx ng test --watch=false --include='**/tenant-vocabulary.service.spec.ts'`
Expected: PASS — 1 spec, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add src/app/services/tenant-vocabulary.service.ts src/app/services/tenant-vocabulary.service.spec.ts
git commit -m "feat: agrega TenantVocabularyService"
```

---

### Task 4: Migrar `context-filter` a `TenantVocabularyService`

**Files:**
- Modify: `src/app/components/shared/context-filter/context-filter.ts:1-70` (imports + injected field)
- Modify: `src/app/components/shared/context-filter/context-filter.html:65,111,162`

**Interfaces:**
- Consumes: `TenantVocabularyService.labelFor(dimension: FilterNodeType): string` (Task 3).

- [ ] **Step 1: Inject the service**

In `src/app/components/shared/context-filter/context-filter.ts`, add the import alongside the existing service imports (after the `SavedViewsService` import on line 31):

```typescript
import { SavedViewsService } from '../../../services/saved-views.service';
import { TenantVocabularyService } from '../../../services/tenant-vocabulary.service';
```

Then add the injected field right after `protected readonly savedViews = inject(SavedViewsService);` (line 61):

```typescript
  protected readonly salesData = inject(SalesDataService);
  protected readonly savedViews = inject(SavedViewsService);
  protected readonly vocab = inject(TenantVocabularyService);
```

- [ ] **Step 2: Replace the 3 hardcoded column titles**

In `src/app/components/shared/context-filter/context-filter.html`:

Replace line 65:
```html
        <span class="context-filter-column-title">Sectores</span>
```
with:
```html
        <span class="context-filter-column-title">{{ vocab.labelFor('sector') }}</span>
```

Replace line 111:
```html
        <span class="context-filter-column-title">Marcas</span>
```
with:
```html
        <span class="context-filter-column-title">{{ vocab.labelFor('marca') }}</span>
```

Replace line 162:
```html
        <span class="context-filter-column-title">Tiendas</span>
```
with:
```html
        <span class="context-filter-column-title">{{ vocab.labelFor('tienda') }}</span>
```

Leave line 212 (`Vistas Guardadas`) untouched — it's not a Sector/Marca/Tienda dimension label.

- [ ] **Step 3: Verify no hardcoded literal remains for the 3 migrated titles**

Run: `grep -n 'context-filter-column-title">Sectores\|context-filter-column-title">Marcas\|context-filter-column-title">Tiendas' src/app/components/shared/context-filter/context-filter.html`
Expected: no output (no matches).

- [ ] **Step 4: Build to confirm the template compiles**

Run: `npx ng build`
Expected: build succeeds with no new errors/warnings referencing `context-filter`.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/shared/context-filter/context-filter.ts src/app/components/shared/context-filter/context-filter.html
git commit -m "refactor: context-filter resuelve labels de columna via TenantVocabularyService"
```

---

### Task 5: Migrar `ranking-panels` a `TenantVocabularyService`

**Files:**
- Modify: `src/app/pages/ventas-general/ranking-panels/ranking-panels.ts`
- Modify: `src/app/pages/ventas-general/ranking-panels/ranking-panels.html:12-32`

**Interfaces:**
- Consumes: `TenantVocabularyService.labelFor(dimension: FilterNodeType): string` (Task 3).

- [ ] **Step 1: Inject the service**

In `src/app/pages/ventas-general/ranking-panels/ranking-panels.ts`, add the import:

```typescript
import { SalesDataService } from '../../../services/sales-data.service';
import { TenantVocabularyService } from '../../../services/tenant-vocabulary.service';
```

Add the injected field right after `protected readonly salesData = inject(SalesDataService);`:

```typescript
export class RankingPanelsComponent {
  protected readonly salesData = inject(SalesDataService);
  protected readonly vocab = inject(TenantVocabularyService);
```

- [ ] **Step 2: Replace the 3 hardcoded panel titles**

In `src/app/pages/ventas-general/ranking-panels/ranking-panels.html`, replace lines 12-18:

```html
    <app-ranking-panel
      title="Sectores"
      [items]="salesData.rankings().sectores"
      dimension="sector"
      [activeId]="activeIdFor('sector')"
      (itemSelected)="onSelect('sector', $event)"
    />
```
with:
```html
    <app-ranking-panel
      [title]="vocab.labelFor('sector')"
      [items]="salesData.rankings().sectores"
      dimension="sector"
      [activeId]="activeIdFor('sector')"
      (itemSelected)="onSelect('sector', $event)"
    />
```

Replace lines 19-25:
```html
    <app-ranking-panel
      title="Marcas"
      [items]="salesData.rankings().marcas"
      dimension="marca"
      [activeId]="activeIdFor('marca')"
      (itemSelected)="onSelect('marca', $event)"
    />
```
with:
```html
    <app-ranking-panel
      [title]="vocab.labelFor('marca')"
      [items]="salesData.rankings().marcas"
      dimension="marca"
      [activeId]="activeIdFor('marca')"
      (itemSelected)="onSelect('marca', $event)"
    />
```

Replace lines 26-32:
```html
    <app-ranking-panel
      title="Tiendas"
      [items]="salesData.rankings().tiendas"
      dimension="tienda"
      [activeId]="activeIdFor('tienda')"
      (itemSelected)="onSelect('tienda', $event)"
    />
```
with:
```html
    <app-ranking-panel
      [title]="vocab.labelFor('tienda')"
      [items]="salesData.rankings().tiendas"
      dimension="tienda"
      [activeId]="activeIdFor('tienda')"
      (itemSelected)="onSelect('tienda', $event)"
    />
```

Leave the `"Productos"` panel (lines 33-41) untouched — it isn't a Sector/Marca/Tienda dimension.

- [ ] **Step 3: Verify no hardcoded literal remains for the 3 migrated titles**

Run: `grep -n 'title="Sectores"\|title="Marcas"\|title="Tiendas"' src/app/pages/ventas-general/ranking-panels/ranking-panels.html`
Expected: no output (no matches).

- [ ] **Step 4: Build to confirm the template compiles**

Run: `npx ng build`
Expected: build succeeds with no new errors/warnings referencing `ranking-panels`.

- [ ] **Step 5: Commit**

```bash
git add src/app/pages/ventas-general/ranking-panels/ranking-panels.ts src/app/pages/ventas-general/ranking-panels/ranking-panels.html
git commit -m "refactor: ranking-panels resuelve headers de dimension via TenantVocabularyService"
```

---

### Task 6: Verificación final end-to-end

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npx ng test --watch=false`
Expected: all specs pass, including the 4 new ones from Tasks 2–3.

- [ ] **Step 2: Run the full build**

Run: `npx ng build`
Expected: build succeeds, no new warnings.

- [ ] **Step 3: Serve and visually confirm the retail tenant is unchanged**

Run: `npx ng serve`
Open the app, open the Sector/Marca/Tienda filter popover (global header) and the Ranking Comercial panels on Ventas General. Confirm the column titles read "Sectores"/"Marcas"/"Tiendas" and the ranking panel headers read "Sectores"/"Marcas"/"Tiendas"/"Productos" — identical to before this plan.

- [ ] **Step 4: Confirm no hardcoded literals remain anywhere in the two migrated files**

Run: `grep -rn '"Sectores"\|"Marcas"\|"Tiendas"' src/app/components/shared/context-filter/context-filter.html src/app/pages/ventas-general/ranking-panels/ranking-panels.html`
Expected: no output.
