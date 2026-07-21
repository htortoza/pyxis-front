# Modal Unificado de Filtros — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar los 3 popovers del Header Global (Contexto, Período, Comparación) + los 2 botones sueltos de IVA por un único botón "Filtros" que abre un modal con las 4 secciones visibles a la vez (sin tabs/acordeón) y un sidebar de Vistas Guardadas que cubre la configuración completa.

**Architecture:** `ContextFilterComponent`/`PeriodPickerComponent`/`ComparisonSelectorComponent` pierden su trigger+popover y se convierten en paneles presentacionales (`model()`/`input()`/`output()`). Se extrae `SavedViewsSidebarComponent` de la lógica de vistas guardadas hoy embebida en `ContextFilterComponent`. Un nuevo `FiltersModalComponent` (`p-dialog`) orquesta el draft compartido de las 4 secciones + el sidebar, con un solo Aplicar/Cancelar. `SavedView` se extiende con 5 campos nuevos, con normalización tolerante para vistas ya persistidas en `localStorage`.

**Tech Stack:** Angular 21 standalone + Signals (`model()`/`input()`/`output()`), PrimeNG 21 (`p-dialog` en vez de `p-popover`), sin librerías nuevas.

## Global Constraints

- Sin tabs ni acordeón dentro del modal — las 4 secciones (Contexto, Período, Comparación, IVA) están visibles simultáneamente.
- Layout: sidebar fijo izquierdo (Vistas Guardadas) + área principal a la derecha (Contexto arriba a ancho completo, Período/Comparación/IVA en fila de 3 columnas debajo).
- Un solo Aplicar/Cancelar para las 4 secciones juntas. Cerrar el diálogo por cualquier otra vía (X, ESC, click afuera) equivale a Cancelar — nunca escribe el draft.
- Aplicar una vista guardada desde el sidebar sigue siendo instantáneo (escribe directo a `SalesDataService`, sin pasar por Aplicar), igual que hoy.
- Guardar una vista nueva captura el **draft** del modal (lo que el usuario está configurando ahora), no el estado ya aplicado.
- Vistas ya persistidas en `localStorage` (creadas antes de este cambio) deben seguir cargando y aplicándose correctamente, con defaults para los 5 campos nuevos: `granularity: 'mes'`, `comparisonMode: 'periodo_anterior'`, `comparisonAlignment: 'calendario'`, `explicitComparisonPeriodIds: null`, `ivaMode: 'con_iva'`.
- No se agregan dependencias nuevas. No se toca la lógica de negocio de ningún filtro, solo dónde/cómo se edita y se guarda.

---

### Task 1: Extender `SavedView` + normalización tolerante

**Files:**
- Modify: `src/app/data/models/saved-view.model.ts`
- Modify: `src/app/data/utils/saved-views.utils.ts`
- Create: `src/app/data/utils/saved-views.utils.spec.ts`

**Interfaces:**
- Produces: `SavedView` con 5 campos nuevos (`granularity`, `comparisonMode`, `comparisonAlignment`, `explicitComparisonPeriodIds`, `ivaMode`); `normalizeSavedView(raw: SavedView): SavedView` exportado desde `saved-views.utils.ts`.

- [ ] **Step 1: Extender el modelo**

Reemplazar el contenido completo de `src/app/data/models/saved-view.model.ts`:

```typescript
import type { ComparisonAlignment, ComparisonMode } from './comparison.model';
import type { IvaMode } from './iva.model';
import type { PeriodGranularity } from './period.model';

export type SavedViewScope = 'personal' | 'equipo';

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
  /** FilterTreeNode ids (Sector/Marca/Tienda filter tree, from sector-marca-tienda-tree.utils). */
  checkedNodeIds: string[];
  createdAt: string; // ISO timestamp
  lastUsedAt: string; // ISO timestamp, bumped every time the view is applied -- drives "most recently used" sort
}

export interface ApplyViewResult {
  view: SavedView;
  /** Node ids from view.checkedNodeIds that were dropped because they're outside the current allowed scope. Empty = applied fully clean. */
  droppedNodeIds: string[];
}
```

- [ ] **Step 2: Escribir el test de normalización (falla primero)**

Crear `src/app/data/utils/saved-views.utils.spec.ts`:

```typescript
import type { SavedView } from '../models/saved-view.model';
import { normalizeSavedView, seedDefaultViews } from './saved-views.utils';

function legacyRawView(overrides: Partial<SavedView> = {}): SavedView {
  // Simula un registro persistido ANTES de que existieran los 5 campos nuevos --
  // JSON.parse de localStorage no los tendría, así que se castea a partir de un
  // objeto que literalmente no los incluye.
  const legacy = {
    id: 'v1',
    label: 'Vista Vieja',
    ownerId: 'user-demo',
    ownerName: 'Usuario Demo',
    tenantId: 'tenant-demo',
    scope: 'personal',
    periodIds: ['2026-01'],
    compareToPrevious: true,
    checkedNodeIds: ['sector-costanera'],
    createdAt: '2026-01-01T00:00:00.000Z',
    lastUsedAt: '2026-01-01T00:00:00.000Z',
  } as SavedView;
  return { ...legacy, ...overrides };
}

describe('normalizeSavedView', () => {
  it('fills the 5 new fields with their implicit legacy defaults when absent', () => {
    const result = normalizeSavedView(legacyRawView());
    expect(result.granularity).toBe('mes');
    expect(result.comparisonMode).toBe('periodo_anterior');
    expect(result.comparisonAlignment).toBe('calendario');
    expect(result.explicitComparisonPeriodIds).toBeNull();
    expect(result.ivaMode).toBe('con_iva');
  });

  it('leaves already-present new fields untouched', () => {
    const result = normalizeSavedView(
      legacyRawView({
        granularity: 'semana',
        comparisonMode: 'meta',
        comparisonAlignment: 'dia_semana',
        explicitComparisonPeriodIds: ['2026-W10'],
        ivaMode: 'sin_iva',
      }),
    );
    expect(result.granularity).toBe('semana');
    expect(result.comparisonMode).toBe('meta');
    expect(result.comparisonAlignment).toBe('dia_semana');
    expect(result.explicitComparisonPeriodIds).toEqual(['2026-W10']);
    expect(result.ivaMode).toBe('sin_iva');
  });

  it('preserves the core fields unchanged', () => {
    const result = normalizeSavedView(legacyRawView());
    expect(result.id).toBe('v1');
    expect(result.checkedNodeIds).toEqual(['sector-costanera']);
  });
});

describe('seedDefaultViews', () => {
  it('includes explicit values for the 5 new fields on every seeded view', () => {
    const seeded = seedDefaultViews('tenant-demo', 'user-demo', 'Usuario Demo');
    for (const view of seeded) {
      expect(view.granularity).toBe('mes');
      expect(view.comparisonMode).toBe('periodo_anterior');
      expect(view.comparisonAlignment).toBe('calendario');
      expect(view.explicitComparisonPeriodIds).toBeNull();
      expect(view.ivaMode).toBe('con_iva');
    }
  });
});
```

- [ ] **Step 3: Correr el test y verificar que falla**

Run: `npx ng test --watch=false --include='**/saved-views.utils.spec.ts'`
Expected: FAIL — `normalizeSavedView` no existe todavía.

- [ ] **Step 4: Implementar `normalizeSavedView` + actualizar `seedDefaultViews`/`loadSavedViews`**

En `src/app/data/utils/saved-views.utils.ts`:

Agregar imports al principio del archivo:

```typescript
import type { ComparisonAlignment, ComparisonMode } from '../models/comparison.model';
import type { IvaMode } from '../models/iva.model';
import type { PeriodGranularity } from '../models/period.model';
```

Agregar después de `isSavedView` (antes de `loadSavedViews`):

```typescript
const DEFAULT_GRANULARITY: PeriodGranularity = 'mes';
const DEFAULT_COMPARISON_MODE: ComparisonMode = 'periodo_anterior';
const DEFAULT_COMPARISON_ALIGNMENT: ComparisonAlignment = 'calendario';
const DEFAULT_IVA_MODE: IvaMode = 'con_iva';

/**
 * Vistas persistidas antes de que existieran granularidad/comparación/IVA no tienen estos 5
 * campos en el JSON guardado -- se completan con los valores que esas vistas ya representaban
 * implícitamente (única granularidad = Mes, único modo de comparación = Periodo Anterior,
 * único criterio = calendario, sin IVA toggle = con IVA), en vez de descartar el registro
 * entero por no calzar con el shape nuevo.
 */
export function normalizeSavedView(raw: SavedView): SavedView {
  return {
    ...raw,
    granularity: raw.granularity ?? DEFAULT_GRANULARITY,
    comparisonMode: raw.comparisonMode ?? DEFAULT_COMPARISON_MODE,
    comparisonAlignment: raw.comparisonAlignment ?? DEFAULT_COMPARISON_ALIGNMENT,
    explicitComparisonPeriodIds: raw.explicitComparisonPeriodIds ?? null,
    ivaMode: raw.ivaMode ?? DEFAULT_IVA_MODE,
  };
}
```

Modificar `loadSavedViews` para normalizar cada registro cargado (cambiar la última línea del `try`):

```typescript
    return parsed.filter(isSavedView).map(normalizeSavedView);
```

Actualizar `seedDefaultViews` agregando los 5 campos a cada uno de los 2 objetos literales (`seed-solo-costanera`, `seed-barra-chalaca`), inmediatamente después de `compareToPrevious: true,` en cada uno:

```typescript
      compareToPrevious: true,
      granularity: 'mes',
      comparisonMode: 'periodo_anterior',
      comparisonAlignment: 'calendario',
      explicitComparisonPeriodIds: null,
      ivaMode: 'con_iva',
```

- [ ] **Step 5: Correr el test y verificar que pasa**

Run: `npx ng test --watch=false --include='**/saved-views.utils.spec.ts'`
Expected: PASS (6/6)

- [ ] **Step 6: Commit**

```bash
git add src/app/data/models/saved-view.model.ts src/app/data/utils/saved-views.utils.ts src/app/data/utils/saved-views.utils.spec.ts
git commit -m "feat: SavedView incluye granularidad, comparacion e IVA con normalizacion retrocompatible"
```

---

### Task 2: Extender `SavedViewsService`

**Files:**
- Modify: `src/app/services/saved-views.service.ts`

**Interfaces:**
- Consumes: `SavedView` extendido (Task 1), `SalesDataService.selectedPeriodGranularity/comparisonMode/comparisonAlignment/explicitComparisonPeriodIds/ivaMode` (ya existen).
- Produces: `saveCurrentSelection(input)` con firma extendida; `applyView` escribe los 5 signals nuevos.

- [ ] **Step 1: Actualizar imports**

En `src/app/services/saved-views.service.ts`, agregar:

```typescript
import type { ComparisonAlignment, ComparisonMode } from '../data/models/comparison.model';
import type { IvaMode } from '../data/models/iva.model';
import type { PeriodGranularity } from '../data/models/period.model';
```

- [ ] **Step 2: Extender `saveCurrentSelection`**

Reemplazar el método completo (firma + cuerpo) por:

```typescript
  /** Guarda el DRAFT que el usuario está configurando en el modal (aplicado o no) como una vista nueva. */
  saveCurrentSelection(input: {
    label: string;
    scope: SavedViewScope;
    checkedNodeIds: string[];
    periodIds: string[];
    granularity: PeriodGranularity;
    compareToPrevious: boolean;
    comparisonMode: ComparisonMode;
    comparisonAlignment: ComparisonAlignment;
    explicitComparisonPeriodIds: string[] | null;
    ivaMode: IvaMode;
  }): void {
    const now = new Date().toISOString();
    const view: SavedView = {
      id: crypto.randomUUID(),
      label: input.label,
      ownerId: this.currentUser.id,
      ownerName: this.currentUser.name,
      tenantId: this.currentUser.tenantId,
      scope: input.scope,
      periodIds: [...input.periodIds],
      granularity: input.granularity,
      compareToPrevious: input.compareToPrevious,
      comparisonMode: input.comparisonMode,
      comparisonAlignment: input.comparisonAlignment,
      explicitComparisonPeriodIds: input.explicitComparisonPeriodIds
        ? [...input.explicitComparisonPeriodIds]
        : null,
      ivaMode: input.ivaMode,
      checkedNodeIds: [...input.checkedNodeIds],
      createdAt: now,
      lastUsedAt: now,
    };

    const next = [...this._views(), view];
    this.persistAndSet(next);

    if (view.scope === 'equipo') {
      logAudit({
        entity: 'saved_view',
        entityId: view.id,
        entityLabel: view.label,
        action: 'create',
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        tenantId: this.currentUser.tenantId,
      });
    }
  }
```

- [ ] **Step 3: Extender `applyView`**

En el método `applyView`, reemplazar estas 2 líneas:

```typescript
    this.salesData.selectedPeriodIds.set([...result.view.periodIds]);
    this.salesData.compareToPrevious.set(result.view.compareToPrevious);
```

por:

```typescript
    this.salesData.selectedPeriodIds.set([...result.view.periodIds]);
    this.salesData.selectedPeriodGranularity.set(result.view.granularity);
    this.salesData.compareToPrevious.set(result.view.compareToPrevious);
    this.salesData.comparisonMode.set(result.view.comparisonMode);
    this.salesData.comparisonAlignment.set(result.view.comparisonAlignment);
    this.salesData.explicitComparisonPeriodIds.set(
      result.view.explicitComparisonPeriodIds ? [...result.view.explicitComparisonPeriodIds] : null,
    );
    this.salesData.ivaMode.set(result.view.ivaMode);
```

- [ ] **Step 4: Verificar que el proyecto sigue compilando**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: errores en `context-filter.ts` (todavía llama `saveCurrentSelection` con la firma vieja) — **esperado**, se resuelve en Task 5. Confirmar que no hay errores en `saved-views.service.ts` mismo.

- [ ] **Step 5: Commit**

```bash
git add src/app/services/saved-views.service.ts
git commit -m "feat: SavedViewsService persiste y restaura granularidad, comparacion e IVA"
```

---

### Task 3: `SalesDataService.clearFilters()` resetea también granularidad/comparación/IVA

**Files:**
- Modify: `src/app/services/sales-data.service.ts`

- [ ] **Step 1: Extender `clearFilters()`**

Ubicar el método (línea ~190) y reemplazar:

```typescript
  clearFilters(): void {
    this.selectedContextId.set('holding');
    this.selectedPeriodIds.set([...DEFAULT_SELECTED_PERIOD_IDS]);
    this.crossFilter.set(null);
    this.sectorMarcaTiendaFilter.set(null);
  }
```

por:

```typescript
  clearFilters(): void {
    this.selectedContextId.set('holding');
    this.selectedPeriodIds.set([...DEFAULT_SELECTED_PERIOD_IDS]);
    this.selectedPeriodGranularity.set(DEFAULT_SELECTED_GRANULARITY);
    this.crossFilter.set(null);
    this.sectorMarcaTiendaFilter.set(null);
    this.compareToPrevious.set(true);
    this.comparisonMode.set('periodo_anterior');
    this.comparisonAlignment.set('calendario');
    this.explicitComparisonPeriodIds.set(null);
    this.ivaMode.set('con_iva');
  }
```

`DEFAULT_SELECTED_GRANULARITY` ya está importado en este archivo (se usa para el valor inicial de `selectedPeriodGranularity`) — confirmar con `grep -n "DEFAULT_SELECTED_GRANULARITY" src/app/services/sales-data.service.ts` antes de asumirlo; si no está importado, agregar `DEFAULT_SELECTED_GRANULARITY` al import existente de `'../data/mock/periods.mock'`.

- [ ] **Step 2: Verificar compilación**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: mismos errores pendientes de Task 2 (context-filter.ts), ninguno nuevo en `sales-data.service.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/app/services/sales-data.service.ts
git commit -m "fix: clearFilters resetea tambien granularidad, comparacion e IVA"
```

---

### Task 4: Extraer `SavedViewsSidebarComponent`

**Files:**
- Create: `src/app/components/shared/saved-views-sidebar/saved-views-sidebar.ts`
- Create: `src/app/components/shared/saved-views-sidebar/saved-views-sidebar.html`
- Create: `src/app/components/shared/saved-views-sidebar/saved-views-sidebar.css`

**Interfaces:**
- Consumes: `SavedViewsService` (Task 2), `SalesDataService`, `computeSelectionStates` (`tristate.utils.ts`), `buildSectorMarcaTiendaTree` (`sector-marca-tienda-tree.utils.ts`), `CONTEXT_TREE`/`MARCAS`/`SECTORES` (`context-tree.mock.ts`).
- Produces: `<app-saved-views-sidebar>` con 8 `input.required()` de draft (`draftCheckedIds`, `draftGranularity`, `draftPeriodIds`, `draftCompare`, `draftComparisonMode`, `draftComparisonAlignment`, `draftExplicitComparisonPeriodIds`, `draftIvaMode`) y `output<void>() viewApplied`.

- [ ] **Step 1: Crear el componente**

`src/app/components/shared/saved-views-sidebar/saved-views-sidebar.ts`:

```typescript
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';

import type { ComparisonAlignment, ComparisonMode } from '../../../data/models/comparison.model';
import type { IvaMode } from '../../../data/models/iva.model';
import type { PeriodGranularity } from '../../../data/models/period.model';
import { CONTEXT_TREE, MARCAS, SECTORES } from '../../../data/mock/context-tree.mock';
import type { SavedView, SavedViewScope } from '../../../data/models/saved-view.model';
import { buildSectorMarcaTiendaTree } from '../../../data/utils/sector-marca-tienda-tree.utils';
import { computeSelectionStates } from '../../../data/utils/tristate.utils';
import { SavedViewsService } from '../../../services/saved-views.service';

/**
 * Sidebar de Vistas Guardadas del modal de filtros -- extraído de lo que antes vivía embebido
 * en ContextFilterComponent. "Aplicar" una vista sigue siendo instantáneo (escribe directo a
 * SalesDataService vía SavedViewsService.applyView, sin pasar por el draft del modal); tras
 * aplicar, emite `viewApplied` para que FiltersModalComponent resincronice sus 8 draft signals.
 * "Guardar vista actual" captura el DRAFT (los 8 inputs de este componente), no el estado ya
 * aplicado, para que refleje exactamente lo que el usuario está configurando ahora mismo.
 */
@Component({
  selector: 'app-saved-views-sidebar',
  standalone: true,
  imports: [Button, FormsModule, IconField, InputIcon, InputText, Message],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './saved-views-sidebar.html',
  styleUrl: './saved-views-sidebar.css',
})
export class SavedViewsSidebarComponent {
  protected readonly savedViews = inject(SavedViewsService);

  readonly draftCheckedIds = input.required<Set<string>>();
  readonly draftGranularity = input.required<PeriodGranularity>();
  readonly draftPeriodIds = input.required<Set<string>>();
  readonly draftCompare = input.required<boolean>();
  readonly draftComparisonMode = input.required<ComparisonMode>();
  readonly draftComparisonAlignment = input.required<ComparisonAlignment>();
  readonly draftExplicitComparisonPeriodIds = input.required<Set<string>>();
  readonly draftIvaMode = input.required<IvaMode>();

  readonly viewApplied = output<void>();

  private readonly filterTree = buildSectorMarcaTiendaTree(CONTEXT_TREE, MARCAS, SECTORES);

  private readonly search = (() => {
    const raw = signal('');
    const debounced = toSignal(toObservable(raw).pipe(debounceTime(300)), { initialValue: '' });
    return { raw, debounced };
  })();

  protected readonly filteredSavedViews = computed(() => {
    const query = this.search.debounced().trim().toLowerCase();
    const views = this.savedViews.visibleViews();
    if (!query) return views;
    return views.filter((view) => view.label.toLowerCase().includes(query));
  });

  protected readonly canSaveCurrent = computed(() => this.draftCheckedIds().size > 0);

  protected readonly suggestedLabel = computed(() => {
    const states = computeSelectionStates(this.filterTree, this.draftCheckedIds());
    const topChecked = this.filterTree
      .filter((node) => node.parentId === null)
      .filter((node) => {
        const state = states.get(node.id);
        return state === 'checked' || state === 'indeterminate';
      })
      .slice(0, 3)
      .map((node) => node.label);

    const base = topChecked.length > 0 ? topChecked.join(' · ') : 'Selección personalizada';
    const periodCount = this.draftPeriodIds().size;
    return `${base} · ${periodCount} periodo${periodCount === 1 ? '' : 's'}`;
  });

  protected readonly warningMessage = signal<string | null>(null);
  protected readonly editingViewId = signal<string | null>(null);
  protected readonly renameDraft = signal('');
  protected readonly showSaveForm = signal(false);
  protected readonly saveLabel = signal('');
  protected readonly saveScope = signal<SavedViewScope>('personal');

  canEditOrDeleteView(view: SavedView): boolean {
    return (
      view.ownerId === this.savedViews.currentUser.id ||
      (view.scope === 'equipo' && this.savedViews.canCreateTeamViews())
    );
  }

  onApplyView(viewId: string): void {
    const result = this.savedViews.applyView(viewId, null, this.filterTree);
    this.warningMessage.set(
      result && result.droppedNodeIds.length > 0
        ? 'Algunos elementos de esta vista ya no están disponibles y no se aplicaron.'
        : null,
    );
    this.viewApplied.emit();
  }

  onDeleteView(viewId: string): void {
    this.savedViews.deleteView(viewId);
  }

  startRename(view: SavedView): void {
    this.editingViewId.set(view.id);
    this.renameDraft.set(view.label);
  }

  confirmRename(viewId: string): void {
    const label = this.renameDraft().trim();
    if (label) {
      this.savedViews.renameView(viewId, label);
    }
    this.editingViewId.set(null);
  }

  cancelRename(): void {
    this.editingViewId.set(null);
  }

  onDuplicateView(view: SavedView): void {
    this.savedViews.duplicateAsPersonal(view.id, `${view.label} (copia)`);
  }

  openSaveForm(): void {
    this.saveLabel.set(this.suggestedLabel());
    this.saveScope.set('personal');
    this.showSaveForm.set(true);
  }

  cancelSaveForm(): void {
    this.showSaveForm.set(false);
  }

  confirmSave(): void {
    const label = this.saveLabel().trim();
    if (!label) return;
    this.savedViews.saveCurrentSelection({
      label,
      scope: this.saveScope(),
      checkedNodeIds: [...this.draftCheckedIds()],
      periodIds: [...this.draftPeriodIds()],
      granularity: this.draftGranularity(),
      compareToPrevious: this.draftCompare(),
      comparisonMode: this.draftComparisonMode(),
      comparisonAlignment: this.draftComparisonAlignment(),
      explicitComparisonPeriodIds:
        this.draftComparisonMode() === 'periodo_especifico'
          ? [...this.draftExplicitComparisonPeriodIds()]
          : null,
      ivaMode: this.draftIvaMode(),
    });
    this.showSaveForm.set(false);
    this.saveLabel.set('');
  }

  dismissWarning(): void {
    this.warningMessage.set(null);
  }

  protected setSearch(value: string): void {
    this.search.raw.set(value);
  }

  protected get searchValue(): string {
    return this.search.raw();
  }
}
```

- [ ] **Step 2: Crear el template**

`src/app/components/shared/saved-views-sidebar/saved-views-sidebar.html` (markup de Vistas Guardadas trasplantado de `context-filter.html`, con `[ngModel]`/`(ngModelChange)` de búsqueda cambiados a `searchValue`/`setSearch`):

```html
<div class="saved-views-sidebar">
  <div class="saved-views-sidebar-header">
    <span class="saved-views-sidebar-title">Vistas Guardadas</span>
    <p-button
      label="Guardar vista actual"
      size="small"
      [text]="true"
      [disabled]="!canSaveCurrent()"
      (onClick)="openSaveForm()"
    />
  </div>

  @if (showSaveForm()) {
    <div class="saved-views-sidebar-save-form">
      <input
        pInputText
        type="text"
        placeholder="Nombre de la vista"
        [ngModel]="saveLabel()"
        (ngModelChange)="saveLabel.set($event)"
      />
      <div class="saved-views-sidebar-save-scope">
        <p-button label="Personal" size="small" [outlined]="saveScope() !== 'personal'" (onClick)="saveScope.set('personal')" />
        @if (savedViews.canCreateTeamViews()) {
          <p-button label="Equipo" size="small" [outlined]="saveScope() !== 'equipo'" (onClick)="saveScope.set('equipo')" />
        }
      </div>
      <div class="saved-views-sidebar-save-actions">
        <p-button label="Cancelar" severity="secondary" [text]="true" size="small" (onClick)="cancelSaveForm()" />
        <p-button label="Guardar" size="small" (onClick)="confirmSave()" />
      </div>
    </div>
  }

  @if (warningMessage(); as warning) {
    <p-message severity="warn" [closable]="true" (onClose)="dismissWarning()">{{ warning }}</p-message>
  }

  <p-iconfield class="saved-views-sidebar-search">
    <p-inputicon>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </p-inputicon>
    <input
      pInputText
      type="text"
      placeholder="Buscar vistas..."
      [ngModel]="searchValue"
      (ngModelChange)="setSearch($event)"
    />
  </p-iconfield>

  <div class="saved-views-sidebar-list">
    @for (view of filteredSavedViews(); track view.id) {
      <div class="saved-views-sidebar-row">
        @if (editingViewId() === view.id) {
          <input
            pInputText
            type="text"
            class="saved-views-sidebar-rename-input"
            [ngModel]="renameDraft()"
            (ngModelChange)="renameDraft.set($event)"
            (keydown.enter)="confirmRename(view.id)"
            (keydown.escape)="cancelRename()"
          />
          <p-button [text]="true" size="small" ariaLabel="Confirmar" (onClick)="confirmRename(view.id)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </p-button>
        } @else {
          <button type="button" class="saved-views-sidebar-label" (click)="onApplyView(view.id)">
            <span class="saved-views-sidebar-name">{{ view.label }}</span>
            @if (view.scope === 'equipo') {
              <span class="saved-views-sidebar-owner">· de {{ view.ownerName }}</span>
            }
          </button>

          <div class="saved-views-sidebar-actions">
            @if (canEditOrDeleteView(view)) {
              <p-button [text]="true" size="small" ariaLabel="Renombrar" (onClick)="startRename(view)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"></path>
                </svg>
              </p-button>
              <p-button [text]="true" size="small" severity="danger" ariaLabel="Eliminar" (onClick)="onDeleteView(view.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </p-button>
            } @else {
              <p-button [text]="true" size="small" ariaLabel="Duplicar" (onClick)="onDuplicateView(view)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </p-button>
            }
          </div>
        }
      </div>
    } @empty {
      <p class="saved-views-sidebar-empty">Sin vistas guardadas</p>
    }
  </div>
</div>
```

- [ ] **Step 3: Crear el CSS**

`src/app/components/shared/saved-views-sidebar/saved-views-sidebar.css` (trasplantado de `context-filter.css`, sin el `padding-left`/`border-left` que existían para separarlo del árbol -- ahora es una columna de grid propia):

```css
:host { display: block; }

.saved-views-sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  min-width: 0;
}

.saved-views-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 2rem;
}

.saved-views-sidebar-title {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

.saved-views-sidebar-header .p-button-text {
  color: var(--p-primary-color);
  padding: 0.125rem 0.375rem;
}

.saved-views-sidebar-save-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.625rem;
  border-radius: var(--p-border-radius-md);
  background: var(--p-surface-50);
}

.saved-views-sidebar-save-scope {
  display: flex;
  gap: 0.5rem;
}

.saved-views-sidebar-save-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.saved-views-sidebar-search {
  width: 100%;
}

.saved-views-sidebar-search input {
  width: 100%;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  font-size: 0.875rem;
}

.saved-views-sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 28rem;
  overflow-y: auto;
}

.saved-views-sidebar-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.5rem;
  border-radius: var(--p-border-radius-sm);
}

.saved-views-sidebar-row:hover {
  background: var(--p-surface-100);
}

.saved-views-sidebar-label {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 0.125rem 0;
  font-size: 0.8125rem;
  color: var(--p-text-color);
  cursor: pointer;
  text-align: left;
}

.saved-views-sidebar-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.saved-views-sidebar-owner {
  flex-shrink: 0;
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
}

.saved-views-sidebar-actions {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  flex-shrink: 0;
}

.saved-views-sidebar-rename-input {
  flex: 1;
  min-width: 0;
}

.saved-views-sidebar-empty {
  margin: 0;
  padding: 0.5rem;
  font-size: 0.8125rem;
  color: var(--p-text-muted-color);
  text-align: center;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/components/shared/saved-views-sidebar/
git commit -m "feat: extrae SavedViewsSidebarComponent del panel de Contexto"
```

---

### Task 5: Convertir `ContextFilterComponent` en panel presentacional

**Files:**
- Modify: `src/app/components/shared/context-filter/context-filter.ts`
- Modify: `src/app/components/shared/context-filter/context-filter.html`
- Modify: `src/app/components/shared/context-filter/context-filter.css`

**Interfaces:**
- Produces: `<app-context-filter>` con `checkedIds = model.required<Set<string>>()`. Ya no depende de `SalesDataService`, `SavedViewsService` ni `TenantVocabularyService`... (nota: `TenantVocabularyService` SÍ se mantiene, es independiente de este refactor).

- [ ] **Step 1: Reemplazar `context-filter.ts`**

```typescript
import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, inject, model, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';

import { CONTEXT_TREE, MARCAS, SECTORES } from '../../../data/mock/context-tree.mock';
import {
  buildSectorMarcaTiendaTree,
  type FilterNodeType,
  type FilterTreeNode,
} from '../../../data/utils/sector-marca-tienda-tree.utils';
import {
  computeSelectionStates,
  filterVisibleNodeIds,
  getDescendantIds,
  getEffectiveLeafIds,
  highlightMatch,
  toggleNode,
  type SelectionState,
} from '../../../data/utils/tristate.utils';
import { TenantVocabularyService } from '../../../services/tenant-vocabulary.service';

interface DebouncedSearch {
  raw: WritableSignal<string>;
  debounced: Signal<string>;
}

/** Same debounce-via-rxjs-interop pattern SalesDataService already uses for its filter pipeline. */
function createDebouncedSearch(): DebouncedSearch {
  const raw = signal('');
  const debounced = toSignal(toObservable(raw).pipe(debounceTime(300)), { initialValue: '' });
  return { raw, debounced };
}

/**
 * Panel presentacional de Sector/Marca/Tienda -- sin trigger ni popover propios, se embebe
 * dentro de FiltersModalComponent. La selección es un `model()` bidireccional; el padre decide
 * cuándo/si se aplica (FiltersModalComponent.apply()) y cuándo se guarda como vista
 * (SavedViewsSidebarComponent, que la recibe como draft). Vistas Guardadas ya no vive aquí --
 * ver SavedViewsSidebarComponent.
 */
@Component({
  selector: 'app-context-filter',
  standalone: true,
  imports: [Checkbox, FormsModule, IconField, InputIcon, InputText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './context-filter.html',
  styleUrl: './context-filter.css',
})
export class ContextFilterComponent {
  protected readonly vocab = inject(TenantVocabularyService);

  readonly checkedIds = model.required<Set<string>>();

  /** Static mock data -- built once, never recomputed reactively. */
  protected readonly filterTree: FilterTreeNode[] = buildSectorMarcaTiendaTree(
    CONTEXT_TREE,
    MARCAS,
    SECTORES,
  );
  private readonly nodeById = new Map(this.filterTree.map((node) => [node.id, node]));
  private readonly labelOf = (id: string): string => this.nodeById.get(id)?.label ?? '';

  protected readonly selectionStates = computed(() =>
    computeSelectionStates(this.filterTree, this.checkedIds()),
  );

  /** Navigation state (which sector/marca column 2/3 are currently showing) -- separate from selection. */
  protected readonly navSectorId = signal<string | null>(null);
  protected readonly navMarcaId = signal<string | null>(null);

  protected readonly sectorSearch = createDebouncedSearch();
  protected readonly marcaSearch = createDebouncedSearch();
  protected readonly tiendaSearch = createDebouncedSearch();
  protected readonly globalSearch = createDebouncedSearch();

  private readonly visibleSectorIds = computed(() =>
    filterVisibleNodeIds(this.filterTree, this.labelOf, this.sectorSearch.debounced()),
  );
  private readonly visibleMarcaIds = computed(() =>
    filterVisibleNodeIds(this.filterTree, this.labelOf, this.marcaSearch.debounced()),
  );
  private readonly visibleTiendaIds = computed(() =>
    filterVisibleNodeIds(this.filterTree, this.labelOf, this.tiendaSearch.debounced()),
  );

  protected readonly sectorRows = computed(() =>
    this.filterTree.filter((node) => node.type === 'sector' && this.visibleSectorIds().has(node.id)),
  );

  protected readonly marcaRows = computed(() => {
    const sectorId = this.navSectorId();
    if (!sectorId) return [];
    const visible = this.visibleMarcaIds();
    return this.filterTree.filter(
      (node) => node.type === 'marca' && node.parentId === sectorId && visible.has(node.id),
    );
  });

  protected readonly tiendaRows = computed(() => {
    const marcaId = this.navMarcaId();
    if (!marcaId) return [];
    const visible = this.visibleTiendaIds();
    return this.filterTree.filter(
      (node) => node.type === 'tienda' && node.parentId === marcaId && visible.has(node.id),
    );
  });

  /** Direct label hits only (not ancestor-of-a-match) -- used for the global search results list. */
  protected readonly globalResults = computed(() => {
    const query = this.globalSearch.debounced().trim().toLowerCase();
    if (!query) return [];
    return this.filterTree.filter((node) => node.label.toLowerCase().includes(query));
  });

  protected readonly breadcrumbSectorLabel = computed(() => {
    const id = this.navSectorId();
    return id ? this.labelOf(id) : null;
  });
  protected readonly breadcrumbMarcaLabel = computed(() => {
    const id = this.navMarcaId();
    return id ? this.labelOf(id) : null;
  });

  protected readonly summaryText = computed(() => {
    const states = this.selectionStates();
    const countActive = (type: FilterNodeType) =>
      this.filterTree
        .filter((node) => node.type === type)
        .filter((node) => {
          const state = states.get(node.id);
          return state === 'checked' || state === 'indeterminate';
        }).length;

    const sectores = countActive('sector');
    const marcas = countActive('marca');
    const tiendas = getEffectiveLeafIds(this.filterTree, this.checkedIds()).length;

    const parts: string[] = [];
    if (sectores > 0) parts.push(`${sectores} sector${sectores === 1 ? '' : 'es'}`);
    if (marcas > 0) parts.push(`${marcas} marca${marcas === 1 ? '' : 's'}`);
    if (tiendas > 0) {
      parts.push(`${tiendas} tienda${tiendas === 1 ? '' : 's'} seleccionada${tiendas === 1 ? '' : 's'}`);
    }

    return parts.length > 0 ? parts.join(' · ') : 'Sin selección';
  });

  nodeState(nodeId: string): SelectionState {
    return this.selectionStates().get(nodeId) ?? 'unchecked';
  }

  isChecked(nodeId: string): boolean {
    return this.nodeState(nodeId) === 'checked';
  }

  isIndeterminate(nodeId: string): boolean {
    return this.nodeState(nodeId) === 'indeterminate';
  }

  toggleCheckbox(nodeId: string): void {
    const wasChecked = this.checkedIds().has(nodeId);
    this.checkedIds.set(toggleNode(this.filterTree, nodeId, this.checkedIds()));

    if (wasChecked) {
      return;
    }
    const node = this.nodeById.get(nodeId);
    if (node?.type === 'sector') {
      this.navigateToSector(node);
    } else if (node?.type === 'marca') {
      this.navigateToMarca(node);
    }
  }

  descendantBadge(nodeId: string): { checked: number; total: number } {
    const effective = new Set(getEffectiveLeafIds(this.filterTree, this.checkedIds()));
    const leafIds = getDescendantIds(this.filterTree, nodeId).filter(
      (id) => this.nodeById.get(id)?.type === 'tienda',
    );
    const checked = leafIds.filter((id) => effective.has(id)).length;
    return { checked, total: leafIds.length };
  }

  highlight(label: string, query: string) {
    return highlightMatch(label, query);
  }

  pathFor(node: FilterTreeNode): string {
    const parts: string[] = [];
    let current: FilterTreeNode | undefined = node;
    while (current) {
      parts.unshift(current.label);
      current = current.parentId ? this.nodeById.get(current.parentId) : undefined;
    }
    return parts.join(' / ');
  }

  navigateToSector(node: FilterTreeNode): void {
    this.navSectorId.set(node.id);
    this.navMarcaId.set(null);
  }

  navigateToMarca(node: FilterTreeNode): void {
    this.navMarcaId.set(node.id);
  }

  navigateToResult(node: FilterTreeNode): void {
    if (node.type === 'sector') {
      this.navSectorId.set(node.id);
      this.navMarcaId.set(null);
    } else if (node.type === 'marca') {
      this.navSectorId.set(node.parentId);
      this.navMarcaId.set(node.id);
    } else {
      const marca = node.parentId ? this.nodeById.get(node.parentId) : undefined;
      this.navSectorId.set(marca?.parentId ?? null);
      this.navMarcaId.set(node.parentId);
    }
  }

  resetToAllSectors(): void {
    this.navSectorId.set(null);
    this.navMarcaId.set(null);
  }

  resetToSector(): void {
    this.navMarcaId.set(null);
  }
}
```

- [ ] **Step 2: Reemplazar `context-filter.html`**

Igual al archivo actual, pero eliminando: el `<p-button class="context-filter-trigger">` inicial, el wrapper `<p-popover #op (onShow)="onPopoverShow()">`, el `<div class="context-filter-body">`/`<div class="context-filter-main">` (ya no hace falta el grid de 2 columnas -- todo pasa a ser una sola columna), el bloque `<div class="context-filter-saved-views">...</div>` completo, y el `<div class="context-filter-actions">` final (Cancelar/Aplicar). El resultado:

```html
<div class="context-filter-panel">
  <span class="context-filter-title">Contexto</span>

  <p-iconfield class="context-filter-global-search">
    <p-inputicon>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </p-inputicon>
    <input
      pInputText
      type="text"
      placeholder="Buscar sector, marca o tienda..."
      [ngModel]="globalSearch.raw()"
      (ngModelChange)="globalSearch.raw.set($event)"
    />
  </p-iconfield>

  @if (globalSearch.debounced().length > 0) {
    <div class="context-filter-global-results">
      @if (globalResults().length === 0) {
        <p class="context-filter-empty">Sin resultados</p>
      } @else {
        @for (result of globalResults(); track result.id) {
          <button type="button" class="context-filter-global-result" (click)="navigateToResult(result)">
            <span class="context-filter-result-path">{{ pathFor(result) }}</span>
          </button>
        }
      }
    </div>
  }

  <div class="context-filter-breadcrumb">
    <button type="button" class="context-filter-breadcrumb-item" (click)="resetToAllSectors()">
      Todos los sectores
    </button>
    @if (breadcrumbSectorLabel(); as sectorLabel) {
      <span class="context-filter-breadcrumb-sep">›</span>
      <button type="button" class="context-filter-breadcrumb-item" (click)="resetToSector()">
        {{ sectorLabel }}
      </button>
    }
    @if (breadcrumbMarcaLabel(); as marcaLabel) {
      <span class="context-filter-breadcrumb-sep">›</span>
      <span class="context-filter-breadcrumb-item is-current">{{ marcaLabel }}</span>
    }
  </div>

  <div class="context-filter-columns">
    <div class="context-filter-column">
      <span class="context-filter-column-title">{{ vocab.labelFor('sector') }}</span>
      <p-iconfield class="context-filter-column-search">
        <p-inputicon>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </p-inputicon>
        <input
          pInputText
          type="text"
          placeholder="Buscar sector..."
          [ngModel]="sectorSearch.raw()"
          (ngModelChange)="sectorSearch.raw.set($event)"
        />
      </p-iconfield>
      <div class="context-filter-column-list">
        @for (node of sectorRows(); track node.id) {
          <div class="context-filter-row">
            <p-checkbox
              [binary]="true"
              [ngModel]="isChecked(node.id)"
              [indeterminate]="isIndeterminate(node.id)"
              (onChange)="toggleCheckbox(node.id)"
            />
            <button
              type="button"
              class="context-filter-row-label"
              [class.is-active]="navSectorId() === node.id"
              (click)="navigateToSector(node)"
            >
              @if (highlight(node.label, sectorSearch.debounced()); as h) {
                <span class="context-filter-row-text">{{ h.before }}<mark>{{ h.match }}</mark>{{ h.after }}</span>
              } @else {
                <span class="context-filter-row-text">{{ node.label }}</span>
              }
              <span class="context-filter-row-badge">{{ descendantBadge(node.id).checked }}/{{ descendantBadge(node.id).total }}</span>
            </button>
          </div>
        } @empty {
          <p class="context-filter-empty">Sin resultados</p>
        }
      </div>
    </div>

    <div class="context-filter-column">
      <span class="context-filter-column-title">{{ vocab.labelFor('marca') }}</span>
      <p-iconfield class="context-filter-column-search">
        <p-inputicon>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </p-inputicon>
        <input
          pInputText
          type="text"
          placeholder="Buscar marca..."
          [disabled]="!navSectorId()"
          [ngModel]="marcaSearch.raw()"
          (ngModelChange)="marcaSearch.raw.set($event)"
        />
      </p-iconfield>
      <div class="context-filter-column-list">
        @if (!navSectorId()) {
          <p class="context-filter-empty">Selecciona un sector</p>
        } @else {
          @for (node of marcaRows(); track node.id) {
            <div class="context-filter-row">
              <p-checkbox
                [binary]="true"
                [ngModel]="isChecked(node.id)"
                [indeterminate]="isIndeterminate(node.id)"
                (onChange)="toggleCheckbox(node.id)"
              />
              <button
                type="button"
                class="context-filter-row-label"
                [class.is-active]="navMarcaId() === node.id"
                (click)="navigateToMarca(node)"
              >
                @if (highlight(node.label, marcaSearch.debounced()); as h) {
                  <span class="context-filter-row-text">{{ h.before }}<mark>{{ h.match }}</mark>{{ h.after }}</span>
                } @else {
                  <span class="context-filter-row-text">{{ node.label }}</span>
                }
                <span class="context-filter-row-badge">{{ descendantBadge(node.id).checked }}/{{ descendantBadge(node.id).total }}</span>
              </button>
            </div>
          } @empty {
            <p class="context-filter-empty">Sin resultados</p>
          }
        }
      </div>
    </div>

    <div class="context-filter-column">
      <span class="context-filter-column-title">{{ vocab.labelFor('tienda') }}</span>
      <p-iconfield class="context-filter-column-search">
        <p-inputicon>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </p-inputicon>
        <input
          pInputText
          type="text"
          placeholder="Buscar tienda..."
          [disabled]="!navMarcaId()"
          [ngModel]="tiendaSearch.raw()"
          (ngModelChange)="tiendaSearch.raw.set($event)"
        />
      </p-iconfield>
      <div class="context-filter-column-list">
        @if (!navMarcaId()) {
          <p class="context-filter-empty">Selecciona una marca</p>
        } @else {
          @for (node of tiendaRows(); track node.id) {
            <div class="context-filter-row">
              <p-checkbox
                [binary]="true"
                [ngModel]="isChecked(node.id)"
                [indeterminate]="isIndeterminate(node.id)"
                (onChange)="toggleCheckbox(node.id)"
              />
              <span class="context-filter-row-label context-filter-row-label--static">
                @if (highlight(node.label, tiendaSearch.debounced()); as h) {
                  <span class="context-filter-row-text">{{ h.before }}<mark>{{ h.match }}</mark>{{ h.after }}</span>
                } @else {
                  <span class="context-filter-row-text">{{ node.label }}</span>
                }
              </span>
            </div>
          } @empty {
            <p class="context-filter-empty">Sin resultados</p>
          }
        }
      </div>
    </div>
  </div>

  <div class="context-filter-summary">{{ summaryText() }}</div>
</div>
```

- [ ] **Step 3: Reemplazar `context-filter.css`**

Igual al archivo actual, pero: `.context-filter-panel` pasa a `width: 100%` (sin `72rem`/`max-width`), se elimina `.context-filter-body`/`.context-filter-main` (ya no existen esos elementos), se elimina todo el bloque `.context-filter-saved-views*` (movido a `saved-views-sidebar.css`) y `.context-filter-actions` (ya no existe ese botón). Se agrega `.context-filter-title`:

```css
:host { display: block; }

.context-filter-panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.context-filter-title {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

.context-filter-global-search,
.context-filter-column-search {
  width: 100%;
}

.context-filter-global-search input,
.context-filter-column-search input {
  width: 100%;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
  font-size: 0.875rem;
}

.context-filter-global-results {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 10rem;
  overflow-y: auto;
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-border-radius-md);
  padding: 0.375rem;
}

.context-filter-global-result {
  display: block;
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  padding: 0.375rem 0.5rem;
  border-radius: var(--p-border-radius-sm);
  cursor: pointer;
  font-size: 0.8125rem;
  color: var(--p-text-color);
}

.context-filter-global-result:hover {
  background: var(--p-surface-100);
}

.context-filter-result-path {
  color: var(--p-text-color);
}

.context-filter-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.context-filter-breadcrumb-item {
  border: none;
  background: transparent;
  padding: 0.125rem 0.25rem;
  font-size: 0.8125rem;
  color: var(--p-text-muted-color);
  cursor: pointer;
  border-radius: var(--p-border-radius-sm);
}

.context-filter-breadcrumb-item:not(.is-current):hover {
  background: var(--p-surface-100);
  color: var(--p-text-color);
}

.context-filter-breadcrumb-item.is-current {
  color: var(--p-text-color);
  font-weight: 600;
  cursor: default;
}

.context-filter-breadcrumb-sep {
  color: var(--p-text-muted-color);
  font-size: 0.75rem;
}

.context-filter-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.context-filter-column {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  min-width: 0;
}

.context-filter-column-title {
  display: flex;
  align-items: center;
  height: 2rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

.context-filter-column-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  height: 16rem;
  overflow-y: auto;
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-border-radius-md);
  padding: 0.5rem;
}

.context-filter-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.625rem;
  border-radius: var(--p-border-radius-sm);
}

.context-filter-row:hover {
  background: var(--p-surface-100);
}

.context-filter-row-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--p-text-color);
  cursor: pointer;
  text-align: left;
}

.context-filter-row-label--static {
  cursor: default;
}

.context-filter-row-label.is-active {
  color: var(--p-primary-color);
  font-weight: 600;
}

.context-filter-row-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.context-filter-row-text mark {
  background: var(--p-yellow-200);
  color: inherit;
  border-radius: 2px;
}

.context-filter-row-badge {
  flex-shrink: 0;
  font-size: 0.6875rem;
  color: var(--p-text-muted-color);
}

.context-filter-empty {
  margin: 0;
  padding: 0.5rem;
  font-size: 0.8125rem;
  color: var(--p-text-muted-color);
  text-align: center;
}

.context-filter-summary {
  padding: 0.5rem 0.75rem;
  border-radius: var(--p-border-radius-md);
  background: var(--p-surface-100);
  font-size: 0.8125rem;
  color: var(--p-text-color);
}
```

(Nota: `.context-filter-column-list` bajó de `height: 19rem` a `16rem` porque ahora convive en la misma fila que Período/Comparación/IVA, dentro del modal -- ajustar en Task 8 si el layout final pide otra altura.)

- [ ] **Step 4: Commit**

```bash
git add src/app/components/shared/context-filter/
git commit -m "refactor: ContextFilterComponent pasa a ser panel presentacional (sin trigger/popover)"
```

---

### Task 6: Convertir `PeriodPickerComponent` en panel presentacional

**Files:**
- Modify: `src/app/components/shared/period-picker/period-picker.ts`
- Modify: `src/app/components/shared/period-picker/period-picker.html`
- Modify: `src/app/components/shared/period-picker/period-picker.css`

**Interfaces:**
- Produces: `<app-period-picker>` con `granularity = model.required<PeriodGranularity>()`, `periodIds = model.required<Set<string>>()`, `compare = model.required<boolean>()`. Ya no depende de `SalesDataService`.

- [ ] **Step 1: Reemplazar `period-picker.ts`**

```typescript
import { ChangeDetectionStrategy, Component, computed, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { ToggleSwitch } from 'primeng/toggleswitch';

import type { Period, PeriodGranularity } from '../../../data/models/period.model';
import { PERIODS_BY_GRANULARITY } from '../../../data/mock/periods.mock';
import { groupPeriodsByYear, PERIOD_PRESETS, type PeriodPreset } from '../../../data/utils/period.utils';

/** Stands in for the real current date -- this is a mock-data app with no live clock dependency. */
const TODAY = { year: 2026, month: 7, day: 20 };

/** Panel presentacional -- sin trigger ni popover propios, embebido en FiltersModalComponent. */
@Component({
  selector: 'app-period-picker',
  standalone: true,
  imports: [Button, Checkbox, FormsModule, ToggleSwitch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './period-picker.html',
  styleUrl: './period-picker.css',
})
export class PeriodPickerComponent {
  readonly granularity = model.required<PeriodGranularity>();
  readonly periodIds = model.required<Set<string>>();
  readonly compare = model.required<boolean>();

  protected readonly presets = computed<PeriodPreset[]>(() =>
    PERIOD_PRESETS.filter((preset) => preset.granularity === this.granularity()),
  );

  private readonly activePeriods = computed<Period[]>(() => PERIODS_BY_GRANULARITY[this.granularity()]);
  private readonly periodsByYear = computed(() => groupPeriodsByYear(this.activePeriods()));
  private readonly minYear = computed(() => Math.min(...this.activePeriods().map((period) => period.year)));
  private readonly maxYear = computed(() => Math.max(...this.activePeriods().map((period) => period.year)));

  protected readonly viewedYear = signal<number>(2026);

  protected readonly viewedYearPeriods = computed<Period[]>(() =>
    (this.periodsByYear().get(this.viewedYear()) ?? []).slice().sort((a, b) => a.order - b.order),
  );

  protected readonly canGoPrevYear = computed(() => this.viewedYear() > this.minYear());
  protected readonly canGoNextYear = computed(() => this.viewedYear() < this.maxYear());

  /** Cambiar de granularidad resetea la selección -- un id de Día no tiene sentido en Semana. */
  setGranularity(granularity: PeriodGranularity): void {
    if (granularity === this.granularity()) return;
    this.granularity.set(granularity);
    this.periodIds.set(new Set());
  }

  isSelected(periodId: string): boolean {
    return this.periodIds().has(periodId);
  }

  togglePeriod(periodId: string): void {
    const next = new Set(this.periodIds());
    if (next.has(periodId)) {
      next.delete(periodId);
    } else {
      next.add(periodId);
    }
    this.periodIds.set(next);
  }

  goPrevYear(): void {
    if (this.canGoPrevYear()) this.viewedYear.update((year) => year - 1);
  }

  goNextYear(): void {
    if (this.canGoNextYear()) this.viewedYear.update((year) => year + 1);
  }

  applyPreset(preset: PeriodPreset): void {
    this.periodIds.set(new Set(preset.resolve(this.activePeriods(), TODAY)));
  }
}
```

- [ ] **Step 2: Reemplazar `period-picker.html`**

Igual al actual, quitando el `<p-button class="period-picker-trigger">` y el wrapper `<p-popover>`/`(onShow)`, agregando un título, renombrando `draftGranularity`→`granularity`, `isDraftSelected`→`isSelected`, `toggleDraftPeriod`→`togglePeriod`, `draftCompare`→`compare`, y quitando el `<div class="period-picker-actions">` final:

```html
<div class="period-picker-panel">
  <span class="period-picker-title">Período</span>

  <div class="period-picker-section period-picker-granularity">
    <p-button label="Día" size="small" severity="secondary" [outlined]="granularity() !== 'dia'" (onClick)="setGranularity('dia')" />
    <p-button label="Semana" size="small" severity="secondary" [outlined]="granularity() !== 'semana'" (onClick)="setGranularity('semana')" />
    <p-button label="Mes" size="small" severity="secondary" [outlined]="granularity() !== 'mes'" (onClick)="setGranularity('mes')" />
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

    @if (granularity() === 'mes') {
      <div class="period-picker-month-grid">
        @for (period of viewedYearPeriods(); track period.id) {
          <label class="period-chip" [class.is-active]="isSelected(period.id)">
            <p-checkbox
              class="period-chip-input"
              [binary]="true"
              [ngModel]="isSelected(period.id)"
              (onChange)="togglePeriod(period.id)"
            />
            @if (isSelected(period.id)) {
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
          <label class="period-picker-list-row" [class.is-active]="isSelected(period.id)">
            <p-checkbox
              [binary]="true"
              [ngModel]="isSelected(period.id)"
              (onChange)="togglePeriod(period.id)"
            />
            <span>{{ period.label }}</span>
          </label>
        } @empty {
          <p class="period-picker-empty">Sin periodos</p>
        }
      </div>
    }
  </div>

  <div class="period-picker-section period-picker-compare">
    <label class="period-picker-compare-label" for="period-picker-compare-toggle">
      Mostrar comparación
    </label>
    <p-toggleswitch
      inputId="period-picker-compare-toggle"
      [ngModel]="compare()"
      (onChange)="compare.set($event.checked)"
    />
  </div>
</div>
```

- [ ] **Step 3: Reemplazar `period-picker.css`**

Igual al actual, cambiando `.period-picker-panel { width: 22rem; }` a `width: 100%;` y agregando `.period-picker-title` (mismo estilo que `.period-picker-section-label` pero visualmente el título raíz del panel):

```css
:host { display: block; }

.period-picker-panel {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  width: 100%;
}

.period-picker-title {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

.period-picker-section {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.period-picker-section-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

.period-picker-preset-list {
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

.period-picker-month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.period-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--p-content-border-color);
  background: var(--p-surface-0);
  color: var(--p-text-color);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  user-select: none;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease-out;
}

.period-chip:active {
  transform: scale(0.96);
}

.period-chip-check {
  flex-shrink: 0;
}

.period-chip:hover {
  background: var(--p-surface-100);
  border-color: var(--p-primary-color);
}

.period-chip.is-active {
  background: var(--p-primary-color);
  border-color: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
}

.period-chip.is-active:hover {
  background: var(--p-primary-hover-color);
  border-color: var(--p-primary-hover-color);
}

.period-chip:focus-within {
  outline: 2px solid var(--p-primary-color);
  outline-offset: 2px;
}

.period-chip-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

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

.period-picker-compare {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.25rem;
  border-top: 1px solid var(--p-content-border-color);
}

.period-picker-compare-label {
  font-size: 0.875rem;
  color: var(--p-text-color);
  cursor: pointer;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/components/shared/period-picker/
git commit -m "refactor: PeriodPickerComponent pasa a ser panel presentacional (sin trigger/popover)"
```

---

### Task 7: Convertir `ComparisonSelectorComponent` en panel presentacional

**Files:**
- Modify: `src/app/components/shared/comparison-selector/comparison-selector.ts`
- Modify: `src/app/components/shared/comparison-selector/comparison-selector.html`
- Modify: `src/app/components/shared/comparison-selector/comparison-selector.css`

**Interfaces:**
- Consumes: `granularity = input.required<PeriodGranularity>()` (viene del draft de granularidad del modal, de solo lectura para este panel).
- Produces: `<app-comparison-selector>` con `mode`/`alignment`/`explicitPeriodIds` como `model.required()`. Ya no depende de `SalesDataService`.

- [ ] **Step 1: Reemplazar `comparison-selector.ts`**

```typescript
import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';

import type { ComparisonAlignment, ComparisonMode } from '../../../data/models/comparison.model';
import type { Period, PeriodGranularity } from '../../../data/models/period.model';
import { PERIODS_BY_GRANULARITY } from '../../../data/mock/periods.mock';
import { groupPeriodsByYear } from '../../../data/utils/period.utils';

/** Panel presentacional -- sin trigger ni popover propios, embebido en FiltersModalComponent. */
@Component({
  selector: 'app-comparison-selector',
  standalone: true,
  imports: [Button, Checkbox, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comparison-selector.html',
  styleUrl: './comparison-selector.css',
})
export class ComparisonSelectorComponent {
  /** Granularidad activa en el draft del modal -- de solo lectura acá, la dueña es PeriodPickerComponent. */
  readonly granularity = input.required<PeriodGranularity>();

  readonly mode = model.required<ComparisonMode>();
  readonly alignment = model.required<ComparisonAlignment>();
  readonly explicitPeriodIds = model.required<Set<string>>();

  /** El toggle de alineación solo tiene sentido en modo periodo_anterior y granularidad Día/Semana. */
  protected readonly showAlignment = computed(
    () => this.mode() === 'periodo_anterior' && this.granularity() !== 'mes',
  );
  protected readonly showExplicitPicker = computed(() => this.mode() === 'periodo_especifico');

  private readonly activePeriods = computed<Period[]>(() => PERIODS_BY_GRANULARITY[this.granularity()]);
  private readonly periodsByYear = computed(() => groupPeriodsByYear(this.activePeriods()));
  private readonly minYear = computed(() => Math.min(...this.activePeriods().map((period) => period.year)));
  private readonly maxYear = computed(() => Math.max(...this.activePeriods().map((period) => period.year)));

  protected readonly viewedYear = signal<number>(2026);
  protected readonly viewedYearPeriods = computed<Period[]>(() =>
    (this.periodsByYear().get(this.viewedYear()) ?? []).slice().sort((a, b) => a.order - b.order),
  );
  protected readonly canGoPrevYear = computed(() => this.viewedYear() > this.minYear());
  protected readonly canGoNextYear = computed(() => this.viewedYear() < this.maxYear());

  goPrevYear(): void {
    if (this.canGoPrevYear()) this.viewedYear.update((year) => year - 1);
  }

  goNextYear(): void {
    if (this.canGoNextYear()) this.viewedYear.update((year) => year + 1);
  }

  isExplicitSelected(periodId: string): boolean {
    return this.explicitPeriodIds().has(periodId);
  }

  toggleExplicitPeriod(periodId: string): void {
    const next = new Set(this.explicitPeriodIds());
    if (next.has(periodId)) {
      next.delete(periodId);
    } else {
      next.add(periodId);
    }
    this.explicitPeriodIds.set(next);
  }
}
```

- [ ] **Step 2: Reemplazar `comparison-selector.html`**

Igual al actual, quitando el trigger + `<p-popover>`/`(onShow)`, agregando título, renombrando `draftMode`→`mode`, `setMode(x)`→`mode.set(x)` directo, `draftAlignment`→`alignment`, `setAlignment(x)`→`alignment.set(x)` directo, y quitando `<div class="comparison-selector-actions">`:

```html
<div class="comparison-selector-panel">
  <span class="comparison-selector-title">Comparación</span>

  <div class="comparison-selector-section">
    <span class="comparison-selector-section-label">Comparar contra</span>
    <div class="comparison-selector-mode-list">
      <p-button label="Periodo Anterior" size="small" severity="secondary" [outlined]="mode() !== 'periodo_anterior'" (onClick)="mode.set('periodo_anterior')" />
      <p-button label="Periodo Específico" size="small" severity="secondary" [outlined]="mode() !== 'periodo_especifico'" (onClick)="mode.set('periodo_especifico')" />
      <p-button label="Meta" size="small" severity="secondary" [outlined]="mode() !== 'meta'" (onClick)="mode.set('meta')" />
    </div>
  </div>

  @if (showAlignment()) {
    <div class="comparison-selector-section">
      <span class="comparison-selector-section-label">Alinear por</span>
      <div class="comparison-selector-mode-list">
        <p-button label="Fecha calendario" size="small" severity="secondary" [outlined]="alignment() !== 'calendario'" (onClick)="alignment.set('calendario')" />
        <p-button label="Día de semana" size="small" severity="secondary" [outlined]="alignment() !== 'dia_semana'" (onClick)="alignment.set('dia_semana')" />
      </div>
    </div>
  }

  @if (showExplicitPicker()) {
    <div class="comparison-selector-section">
      <div class="comparison-selector-year-nav">
        <p-button severity="secondary" [text]="true" [rounded]="true" [disabled]="!canGoPrevYear()" (onClick)="goPrevYear()" ariaLabel="Año anterior">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </p-button>
        <span class="comparison-selector-year-label">{{ viewedYear() }}</span>
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
</div>
```

- [ ] **Step 3: Reemplazar `comparison-selector.css`**

Igual al actual, cambiando `.comparison-selector-panel { width: 18rem; }` a `width: 100%;` y agregando `.comparison-selector-title`:

```css
:host { display: block; }

.comparison-selector-panel {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  width: 100%;
}

.comparison-selector-title {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
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

.comparison-selector-year-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.comparison-selector-year-label {
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
```

- [ ] **Step 4: Commit**

```bash
git add src/app/components/shared/comparison-selector/
git commit -m "refactor: ComparisonSelectorComponent pasa a ser panel presentacional (sin trigger/popover)"
```

---

### Task 8: Crear `FiltersModalComponent`

**Files:**
- Create: `src/app/components/shared/filters-modal/filters-modal.ts`
- Create: `src/app/components/shared/filters-modal/filters-modal.html`
- Create: `src/app/components/shared/filters-modal/filters-modal.css`

**Interfaces:**
- Consumes: `ContextFilterComponent` (Task 5), `PeriodPickerComponent` (Task 6), `ComparisonSelectorComponent` (Task 7), `SavedViewsSidebarComponent` (Task 4), `SalesDataService`.
- Produces: `<app-filters-modal>`, sin inputs/outputs -- self-contained (renderiza su propio botón trigger + `p-dialog`), igual patrón que los 3 componentes originales antes de este refactor.

- [ ] **Step 1: Crear el componente**

```typescript
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

import type { ComparisonAlignment, ComparisonMode } from '../../../data/models/comparison.model';
import type { IvaMode } from '../../../data/models/iva.model';
import type { PeriodGranularity } from '../../../data/models/period.model';
import { CONTEXT_TREE, MARCAS, SECTORES } from '../../../data/mock/context-tree.mock';
import { buildSectorMarcaTiendaTree } from '../../../data/utils/sector-marca-tienda-tree.utils';
import { getEffectiveLeafIds } from '../../../data/utils/tristate.utils';
import { SalesDataService } from '../../../services/sales-data.service';
import { ComparisonSelectorComponent } from '../comparison-selector/comparison-selector';
import { ContextFilterComponent } from '../context-filter/context-filter';
import { PeriodPickerComponent } from '../period-picker/period-picker';
import { SavedViewsSidebarComponent } from '../saved-views-sidebar/saved-views-sidebar';

/**
 * Modal único de filtros -- reemplaza los 3 popovers + los botones sueltos de IVA que existían
 * antes en el Header Global. Dueño de las 8 señales de draft; un solo Aplicar/Cancelar para
 * las 4 secciones juntas. Aplicar una vista guardada desde el sidebar sigue siendo instantáneo
 * (bypassa el draft, ver SavedViewsSidebarComponent) -- tras aplicar, resincroniza el draft
 * completo desde SalesDataService para que el resto del modal refleje la vista recién aplicada.
 *
 * `draftCheckedIds` guarda ids del árbol de filtro (FilterTreeNode.id, ej.
 * 'sector-costanera::marca-x::tienda-y'), NO tiendaContextId directamente -- por eso apply()
 * construye su propio filterTree/nodeById (mismo patrón que ContextFilterComponent) para
 * convertir la selección a tiendaContextId antes de escribirla en SalesDataService, igual que
 * hacía el ContextFilterComponent original antes de este refactor.
 */
@Component({
  selector: 'app-filters-modal',
  standalone: true,
  imports: [Button, Dialog, ComparisonSelectorComponent, ContextFilterComponent, PeriodPickerComponent, SavedViewsSidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filters-modal.html',
  styleUrl: './filters-modal.css',
})
export class FiltersModalComponent {
  private readonly salesData = inject(SalesDataService);

  /** Static mock data -- built once, never recomputed reactively. Same tree ContextFilterComponent builds independently -- see doc comment above. */
  private readonly filterTree = buildSectorMarcaTiendaTree(CONTEXT_TREE, MARCAS, SECTORES);
  private readonly nodeById = new Map(this.filterTree.map((node) => [node.id, node]));

  protected readonly isOpen = signal(false);

  protected readonly draftCheckedIds = signal<Set<string>>(new Set());
  protected readonly draftGranularity = signal<PeriodGranularity>('mes');
  protected readonly draftPeriodIds = signal<Set<string>>(new Set());
  protected readonly draftCompare = signal<boolean>(true);
  protected readonly draftComparisonMode = signal<ComparisonMode>('periodo_anterior');
  protected readonly draftComparisonAlignment = signal<ComparisonAlignment>('calendario');
  protected readonly draftExplicitComparisonPeriodIds = signal<Set<string>>(new Set());
  protected readonly draftIvaMode = signal<IvaMode>('con_iva');

  open(): void {
    this.syncDraftFromApplied();
    this.isOpen.set(true);
  }

  /** También sirve para resincronizar tras aplicar una vista guardada (bypassa el draft). */
  onViewApplied(): void {
    this.syncDraftFromApplied();
  }

  private syncDraftFromApplied(): void {
    this.draftCheckedIds.set(new Set(this.salesData.sectorMarcaTiendaFilter() ?? []));
    this.draftGranularity.set(this.salesData.selectedPeriodGranularity());
    this.draftPeriodIds.set(new Set(this.salesData.selectedPeriodIds()));
    this.draftCompare.set(this.salesData.compareToPrevious());
    this.draftComparisonMode.set(this.salesData.comparisonMode());
    this.draftComparisonAlignment.set(this.salesData.comparisonAlignment());
    this.draftExplicitComparisonPeriodIds.set(new Set(this.salesData.explicitComparisonPeriodIds() ?? []));
    this.draftIvaMode.set(this.salesData.ivaMode());
  }

  apply(): void {
    if (this.draftCheckedIds().size === 0) {
      this.salesData.setSectorMarcaTiendaFilter(null);
    } else {
      const effectiveLeafIds = getEffectiveLeafIds(this.filterTree, this.draftCheckedIds());
      const tiendaContextIds = effectiveLeafIds
        .map((id) => this.nodeById.get(id)?.tiendaContextId)
        .filter((id): id is string => !!id);
      this.salesData.setSectorMarcaTiendaFilter(tiendaContextIds);
    }
    this.salesData.selectedPeriodGranularity.set(this.draftGranularity());
    this.salesData.selectedPeriodIds.set([...this.draftPeriodIds()]);
    this.salesData.compareToPrevious.set(this.draftCompare());
    this.salesData.comparisonMode.set(this.draftComparisonMode());
    this.salesData.comparisonAlignment.set(this.draftComparisonAlignment());
    this.salesData.explicitComparisonPeriodIds.set(
      this.draftComparisonMode() === 'periodo_especifico'
        ? [...this.draftExplicitComparisonPeriodIds()]
        : null,
    );
    this.salesData.ivaMode.set(this.draftIvaMode());
    this.isOpen.set(false);
  }

  cancel(): void {
    this.isOpen.set(false);
  }
}
```

- [ ] **Step 2: Crear el template**

```html
<p-button
  class="filters-modal-trigger"
  label="Filtros"
  severity="secondary"
  [outlined]="true"
  (onClick)="open()"
>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
</p-button>

<p-dialog header="Filtros" [(visible)]="isOpen" [modal]="true" [style]="{ width: '69rem', maxWidth: '95vw' }">
  <div class="filters-modal-body">
    <app-saved-views-sidebar
      class="filters-modal-sidebar"
      [draftCheckedIds]="draftCheckedIds()"
      [draftGranularity]="draftGranularity()"
      [draftPeriodIds]="draftPeriodIds()"
      [draftCompare]="draftCompare()"
      [draftComparisonMode]="draftComparisonMode()"
      [draftComparisonAlignment]="draftComparisonAlignment()"
      [draftExplicitComparisonPeriodIds]="draftExplicitComparisonPeriodIds()"
      [draftIvaMode]="draftIvaMode()"
      (viewApplied)="onViewApplied()"
    />

    <div class="filters-modal-main">
      <app-context-filter [(checkedIds)]="draftCheckedIds" />

      <div class="filters-modal-row">
        <app-period-picker
          [(granularity)]="draftGranularity"
          [(periodIds)]="draftPeriodIds"
          [(compare)]="draftCompare"
        />

        <app-comparison-selector
          [granularity]="draftGranularity()"
          [(mode)]="draftComparisonMode"
          [(alignment)]="draftComparisonAlignment"
          [(explicitPeriodIds)]="draftExplicitComparisonPeriodIds"
        />

        <div class="filters-modal-iva">
          <span class="filters-modal-iva-title">IVA</span>
          <div class="filters-modal-iva-buttons">
            <p-button label="Con IVA" size="small" severity="secondary" [outlined]="draftIvaMode() !== 'con_iva'" (onClick)="draftIvaMode.set('con_iva')" />
            <p-button label="Sin IVA" size="small" severity="secondary" [outlined]="draftIvaMode() !== 'sin_iva'" (onClick)="draftIvaMode.set('sin_iva')" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="filters-modal-actions">
    <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="cancel()" />
    <p-button label="Aplicar" (onClick)="apply()" />
  </div>
</p-dialog>
```

- [ ] **Step 3: Crear el CSS**

```css
:host { display: block; }

.filters-modal-body {
  display: grid;
  grid-template-columns: 14rem 1fr;
  gap: 1.5rem;
  align-items: start;
}

.filters-modal-sidebar {
  border-right: 1px solid var(--p-content-border-color);
  padding-right: 1.25rem;
}

.filters-modal-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.filters-modal-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.filters-modal-iva {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.filters-modal-iva-title {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--p-text-muted-color);
}

.filters-modal-iva-buttons {
  display: flex;
  gap: 0.5rem;
}

.filters-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 1rem;
  margin-top: 1.5rem;
  border-top: 1px solid var(--p-content-border-color);
}
```

- [ ] **Step 4: Verificar compilación**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: sin errores nuevos relacionados a `filters-modal.ts`. Pueden quedar errores en `global-header.ts`/`.html` (se resuelven en Task 9).

- [ ] **Step 5: Commit**

```bash
git add src/app/components/shared/filters-modal/
git commit -m "feat: agrega FiltersModalComponent, modal unico de Contexto+Periodo+Comparacion+IVA"
```

---

### Task 9: Actualizar `GlobalHeaderComponent`

**Files:**
- Modify: `src/app/components/shared/global-header/global-header.ts`
- Modify: `src/app/components/shared/global-header/global-header.html`
- Modify: `src/app/components/shared/global-header/global-header.css`

- [ ] **Step 1: Actualizar `global-header.ts`**

Reemplazar imports/decorator para usar `FiltersModalComponent` en vez de los 3 componentes viejos:

```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';

import { SalesDataService } from '../../../services/sales-data.service';
import { FilterChipsSummaryComponent } from '../filter-chips-summary/filter-chips-summary';
import { FiltersModalComponent } from '../filters-modal/filters-modal';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [Toolbar, Button, PrimeTemplate, RouterLink, RouterLinkActive, FiltersModalComponent, FilterChipsSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.html',
  styleUrl: './global-header.css',
})
export class GlobalHeaderComponent {
  protected readonly salesData = inject(SalesDataService);
}
```

- [ ] **Step 2: Actualizar `global-header.html`**

Reemplazar el `<div class="global-header-start">` (líneas 5-25 del archivo actual) por:

```html
    <div class="global-header-start">
      <app-filters-modal />
    </div>
```

(El resto del archivo -- `pTemplate="end"` con los tabs, y la fila de chips -- no cambia.)

- [ ] **Step 3: Limpiar `global-header.css`**

Eliminar la regla `.global-header-iva-toggle` (ya no hay ningún elemento con esa clase).

- [ ] **Step 4: Verificar compilación**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: 0 errores.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/shared/global-header/
git commit -m "feat: Header Global usa el boton unico Filtros en vez de 3 popovers + toggle IVA suelto"
```

---

### Task 10: Extender `FilterChipsSummaryComponent`

**Files:**
- Modify: `src/app/components/shared/filter-chips-summary/filter-chips-summary.ts`
- Modify: `src/app/components/shared/filter-chips-summary/filter-chips-summary.html`
- Create: `src/app/components/shared/filter-chips-summary/filter-chips-summary.spec.ts`

**Interfaces:**
- Produces: `comparisonChipLabel = computed<string | null>()`, `ivaChipLabel = computed<string | null>()`; `periodsChipLabel` ahora también se activa por granularidad no-default; `resetPeriods()` también resetea la granularidad.

- [ ] **Step 1: Escribir tests (fallan primero)**

Crear `src/app/components/shared/filter-chips-summary/filter-chips-summary.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing';
import { FilterChipsSummaryComponent } from './filter-chips-summary';
import { SalesDataService } from '../../../services/sales-data.service';

describe('FilterChipsSummaryComponent', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [FilterChipsSummaryComponent] });
    const fixture = TestBed.createComponent(FilterChipsSummaryComponent);
    const salesData = TestBed.inject(SalesDataService);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance as any, salesData };
  }

  it('shows no comparison chip when comparisonMode is periodo_anterior (default)', () => {
    const { component } = setup();
    expect(component.comparisonChipLabel()).toBeNull();
  });

  it('shows a comparison chip when comparisonMode is meta', () => {
    const { component, salesData, fixture } = setup();
    salesData.comparisonMode.set('meta');
    fixture.detectChanges();
    expect(component.comparisonChipLabel()).toBe('Comparación: Meta');
  });

  it('shows a comparison chip when comparisonMode is periodo_especifico', () => {
    const { component, salesData, fixture } = setup();
    salesData.comparisonMode.set('periodo_especifico');
    fixture.detectChanges();
    expect(component.comparisonChipLabel()).toBe('Comparación: Periodo Específico');
  });

  it('shows no IVA chip when ivaMode is con_iva (default)', () => {
    const { component } = setup();
    expect(component.ivaChipLabel()).toBeNull();
  });

  it('shows an IVA chip when ivaMode is sin_iva', () => {
    const { component, salesData, fixture } = setup();
    salesData.ivaMode.set('sin_iva');
    fixture.detectChanges();
    expect(component.ivaChipLabel()).toBe('Sin IVA');
  });

  it('shows a periods chip when granularity is non-default even if period ids match defaults for that granularity', () => {
    const { component, salesData, fixture } = setup();
    salesData.selectedPeriodGranularity.set('semana');
    fixture.detectChanges();
    expect(component.periodsChipLabel()).not.toBeNull();
  });
});
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npx ng test --watch=false --include='**/filter-chips-summary.spec.ts'`
Expected: FAIL — `comparisonChipLabel`/`ivaChipLabel` no existen todavía.

- [ ] **Step 3: Implementar en `filter-chips-summary.ts`**

Agregar import al principio:

```typescript
import { DEFAULT_SELECTED_GRANULARITY, DEFAULT_SELECTED_PERIOD_IDS } from '../../../data/mock/periods.mock';
```

(reemplaza el import existente de `DEFAULT_SELECTED_PERIOD_IDS`, que pasa a incluir también `DEFAULT_SELECTED_GRANULARITY`).

Reemplazar `periodsChipLabel` y `resetPeriods`:

```typescript
  /** Null when the applied period selection AND granularity both match the default (no chip to show). */
  protected readonly periodsChipLabel = computed<string | null>(() => {
    const current = new Set(this.salesData.selectedPeriodIds());
    const defaults = new Set(DEFAULT_SELECTED_PERIOD_IDS);
    const selectionChanged =
      current.size !== defaults.size || [...current].some((id) => !defaults.has(id));
    const granularityChanged = this.salesData.selectedPeriodGranularity() !== DEFAULT_SELECTED_GRANULARITY;
    if (!selectionChanged && !granularityChanged) return null;
    return `${current.size} periodo${current.size === 1 ? '' : 's'}`;
  });

  protected readonly comparisonChipLabel = computed<string | null>(() => {
    const mode = this.salesData.comparisonMode();
    if (mode === 'periodo_anterior') return null;
    return mode === 'meta' ? 'Comparación: Meta' : 'Comparación: Periodo Específico';
  });

  protected readonly ivaChipLabel = computed<string | null>(() =>
    this.salesData.ivaMode() === 'sin_iva' ? 'Sin IVA' : null,
  );
```

Reemplazar `resetPeriods`:

```typescript
  resetPeriods(): void {
    this.salesData.selectedPeriodGranularity.set(DEFAULT_SELECTED_GRANULARITY);
    this.salesData.selectedPeriodIds.set([...DEFAULT_SELECTED_PERIOD_IDS]);
  }
```

- [ ] **Step 4: Actualizar el template**

En `filter-chips-summary.html`, agregar 2 chips no removibles después del chip de período (antes del `@for` de tiendas):

```html
  @if (periodsChipLabel(); as label) {
    <p-chip [label]="label" [removable]="true" (onRemove)="resetPeriods()" />
  }

  @if (comparisonChipLabel(); as label) {
    <p-chip [label]="label" />
  }

  @if (ivaChipLabel(); as label) {
    <p-chip [label]="label" />
  }

  @for (chip of tiendaChips(); track chip.id) {
```

- [ ] **Step 5: Correr los tests y verificar que pasan**

Run: `npx ng test --watch=false --include='**/filter-chips-summary.spec.ts'`
Expected: PASS (6/6)

- [ ] **Step 6: Commit**

```bash
git add src/app/components/shared/filter-chips-summary/
git commit -m "feat: chips de resumen incluyen comparacion, IVA y granularidad de periodo"
```

---

### Task 11: Verificación final

**Files:** ninguno (solo comandos)

- [ ] **Step 1: Typecheck completo**

Run: `npx tsc --noEmit -p tsconfig.app.json`
Expected: 0 errores.

- [ ] **Step 2: Build**

Run: `npx ng build`
Expected: build exitoso (los warnings de presupuesto de bundle preexistentes son aceptables, ningún error nuevo).

- [ ] **Step 3: Test suite completo**

Run: `npx ng test --watch=false`
Expected: todos los tests pasan salvo la falla preexistente y no relacionada de `app.spec.ts` (`ActivatedRoute`), presente desde antes de este plan.

- [ ] **Step 4: Verificación visual en navegador**

Con `ng serve` corriendo (puerto 4300 u otro libre):
1. Abrir la app, confirmar que el header muestra un único botón "Filtros" (sin los 3 botones viejos ni los 2 de IVA sueltos).
2. Abrir el modal: confirmar que se ven las 4 secciones a la vez (Contexto arriba, Período/Comparación/IVA en fila debajo) y el sidebar de Vistas Guardadas a la izquierda, sin tabs/acordeón.
3. Configurar Contexto + Período (granularidad Semana) + Comparación (modo Meta) + Sin IVA, click Aplicar. Confirmar que la fila de chips debajo del header ahora muestra: chip de período, chip "Comparación: Meta", chip "Sin IVA", y los chips de tienda correspondientes.
4. Reabrir el modal, click "Guardar vista actual", darle un nombre, guardar. Confirmar que aparece en el sidebar.
5. Click "Limpiar filtros" en la fila de chips. Confirmar que todos los chips desaparecen y el modal, al reabrirse, muestra el estado default (granularidad Mes, Periodo Anterior, Con IVA).
6. Aplicar la vista guardada en el paso 4 desde el sidebar. Confirmar que se aplica al instante (sin necesidad de click en Aplicar) y que el resto del modal (Contexto/Período/Comparación/IVA) refleja lo guardado.
7. Confirmar que las 2 vistas sembradas (`Solo Costanera`, `Barra Chalaca`) siguen apareciendo y aplicándose correctamente.
8. Navegar a Detalle de Ventas y confirmar que también refleja los filtros aplicados (el header es compartido).

- [ ] **Step 5: Reportar resultado**

Si todo lo anterior pasa, el plan está completo. Si algo falla, volver al task correspondiente y corregir antes de continuar.
