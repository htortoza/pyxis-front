import { Injectable, computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { delay, map, of, switchMap, tap } from 'rxjs';

import type { ComparisonAlignment, ComparisonMode } from '../data/models/comparison.model';
import type { ReceivableDocument } from '../data/models/collections.model';
import type { IvaMode } from '../data/models/iva.model';
import type { Period, PeriodGranularity } from '../data/models/period.model';
import { COUNTERPARTIES, RECEIVABLE_DOCUMENTS } from '../data/mock/collections.mock';
import { CONTEXT_TREE, MARCAS, SECTORES } from '../data/mock/context-tree.mock';
import { CURRENT_USER } from '../data/mock/mock-user.mock';
import { PERIODS_BY_GRANULARITY } from '../data/mock/periods.mock';
import {
  buildCollectionsFilterTree,
  type CollectionsFilterNode,
} from '../data/utils/collections-filter-tree.utils';
import {
  buildHardcodedDefaultCollectionsView,
  loadDefaultCollectionsView,
  persistDefaultCollectionsView,
  type DefaultCollectionsFilterView,
} from '../data/utils/default-collections-view.utils';
import { sameStringArrayOrNull } from '../data/utils/default-view.utils';
import { getEffectiveLeafIds } from '../data/utils/tristate.utils';

/** Drill-down cross-filter coming from a future Cobranzas visualization (Puente/Antigüedad/
 * Concentración, SP2-SP3) clicking a Sector/Marca/Local/Contraparte segment. `dimension` is a
 * plain string (not `RankingDimension`) for the same reason `CollectionsFilterNode.type` is --
 * `contraparte` must exist here without joining Ventas' shared union
 * (see [[feedback-backend-contract-is-fixed]]). By convention, when `dimension === 'contraparte'`
 * `id` is the real `Counterparty.id` (documents key directly on it); for the other 3 dimensions
 * `id` is the corresponding `CollectionsFilterNode.id` in the tree below, resolved the same way
 * `sectorMarcaLocalFilter` is. */
export interface CollectionsCrossFilter {
  dimension: string;
  id: string;
}

interface CollectionsDashboardData {
  /** Placeholder shape for SP1 -- the heavy aggregations (aging/bridge/projection/concentration/
   * kpis) land in SP2-SP3. Kept behind the same toSignal(toObservable(filterKey)...) pipeline as
   * SalesDataService from day 1 so those facets can be added here later without re-plumbing the
   * loading UX. */
  saldoTotal: number;
}

function intersect(a: Set<string>, b: Set<string>): Set<string> {
  return new Set([...a].filter((id) => b.has(id)));
}

/**
 * Con IVA es la base (grossAmount/balance ya representan el monto final). Sin IVA escala el
 * balance por la propia razón netAmount/grossAmount YA redondeada del documento (ver
 * collections.mock.ts: `netAmount = Math.round(grossAmount / 1.19)`) en vez de aplicar una
 * segunda división independiente con su propio redondeo -- así toda cifra "neta" es trazable a un
 * único monto neto por documento, nunca a dos números netos que podrían divergir por redondeo.
 */
function toScopedBalance(doc: ReceivableDocument, ivaMode: IvaMode): number {
  if (ivaMode === 'con_iva' || doc.grossAmount === 0) {
    return doc.balance;
  }
  return doc.balance * (doc.netAmount / doc.grossAmount);
}

/**
 * Cobranzas' analogue of SalesDataService -- same skeleton (activeDefaultView first, filter
 * signals, crossFilter, filterKey, artificial-loading dashboardData, scoped-facts-equivalent,
 * clearFilters/saveAsDefault/hasActiveFilter), a completely separate service and mock universe
 * (`collections.mock.ts`) so nothing here can ever change Ventas' behavior.
 */
@Injectable({ providedIn: 'root' })
export class CollectionsDataService {
  /** The view that loads on a fresh page load and that "Limpiar filtros" resets back to. Declared
   * first on purpose -- every signal below reads its initial value from this one. */
  private readonly activeDefaultView = signal<DefaultCollectionsFilterView>(
    loadDefaultCollectionsView(CURRENT_USER.tenantId) ?? buildHardcodedDefaultCollectionsView(),
  );

  /** "Saldo al [fecha]" -- stock cutoff, single ISO date. Never summed across cutoffs (spec §1.4):
   * every aggregation downstream reads a single cutoffDate at a time. */
  readonly cutoffDate = signal<string>(this.activeDefaultView().cutoffDate);

  readonly selectedPeriodIds = signal<string[]>([...this.activeDefaultView().periodIds]);
  readonly selectedPeriodGranularity = signal<PeriodGranularity>(this.activeDefaultView().granularity);

  /** Explicit Contraparte selection (4th filter column) -- null means unfiltered. */
  readonly counterpartyFilter = signal<string[] | null>(this.activeDefaultView().counterpartyIds);
  /** Sector/Marca/Local selection (first 3 filter columns) -- null means unfiltered. */
  readonly sectorMarcaLocalFilter = signal<string[] | null>(this.activeDefaultView().sectorMarcaLocalFilter);

  /** Active drill-down cross-filter from a visualization row click, if any (SP2-SP3). */
  readonly crossFilter = signal<CollectionsCrossFilter | null>(null);

  readonly compareToPrevious = signal<boolean>(this.activeDefaultView().compareToPrevious);
  readonly comparisonMode = signal<ComparisonMode>(this.activeDefaultView().comparisonMode);
  readonly comparisonAlignment = signal<ComparisonAlignment>(this.activeDefaultView().comparisonAlignment);
  readonly explicitComparisonPeriodIds = signal<string[] | null>(
    this.activeDefaultView().explicitComparisonPeriodIds,
  );

  /** Con IVA es la base. La Proyección de Recaudación (SP3) SIEMPRE opera sobre bruto sin importar
   * este toggle (regla no negociable, spec §6) -- por eso `scopedDocumentsGross` existe aparte. */
  readonly ivaMode = signal<IvaMode>(this.activeDefaultView().ivaMode);

  /** Static 4-column filter tree (Sector/Marca/Local/Contraparte) -- built once from the mock
   * universe, doesn't depend on any signal, so it's a plain field rather than a computed. */
  private readonly collectionsFilterTree: CollectionsFilterNode[] = buildCollectionsFilterTree(
    CONTEXT_TREE,
    MARCAS,
    SECTORES,
    COUNTERPARTIES,
  );

  readonly periods = computed<Period[]>(() => PERIODS_BY_GRANULARITY[this.selectedPeriodGranularity()]);

  /** Read-only view of the active default -- chips-summary/filters-modal diff against this instead
   * of the hardcoded constants, so a saved default's own choices don't show up as "changed". */
  readonly defaultView = this.activeDefaultView.asReadonly();

  /** True when ANY filter signal differs from the active default, or a cross-filter is active. */
  readonly hasActiveFilter = computed(() => {
    const defaultView = this.activeDefaultView();

    const cutoffChanged = this.cutoffDate() !== defaultView.cutoffDate;
    const granularityChanged = this.selectedPeriodGranularity() !== defaultView.granularity;

    const currentPeriods = new Set(this.selectedPeriodIds());
    const defaultPeriods = new Set(defaultView.periodIds);
    const periodsChanged =
      currentPeriods.size !== defaultPeriods.size ||
      [...currentPeriods].some((id) => !defaultPeriods.has(id));

    const counterpartyFilterChanged = !sameStringArrayOrNull(
      this.counterpartyFilter(),
      defaultView.counterpartyIds,
    );
    const sectorMarcaLocalFilterChanged = !sameStringArrayOrNull(
      this.sectorMarcaLocalFilter(),
      defaultView.sectorMarcaLocalFilter,
    );
    const compareToPreviousChanged = this.compareToPrevious() !== defaultView.compareToPrevious;
    const comparisonModeChanged = this.comparisonMode() !== defaultView.comparisonMode;
    const comparisonAlignmentChanged = this.comparisonAlignment() !== defaultView.comparisonAlignment;
    const explicitComparisonChanged = !sameStringArrayOrNull(
      this.explicitComparisonPeriodIds(),
      defaultView.explicitComparisonPeriodIds,
    );
    const ivaModeChanged = this.ivaMode() !== defaultView.ivaMode;

    return (
      cutoffChanged ||
      granularityChanged ||
      periodsChanged ||
      this.crossFilter() !== null ||
      counterpartyFilterChanged ||
      sectorMarcaLocalFilterChanged ||
      compareToPreviousChanged ||
      comparisonModeChanged ||
      comparisonAlignmentChanged ||
      explicitComparisonChanged ||
      ivaModeChanged
    );
  });

  /**
   * Non-PAGADO documents in scope (Contraparte + Sector/Marca/Local filters + cross-filter) as of
   * `cutoffDate`, with the IVA toggle applied to `balance`. "As of cutoffDate" for SP1 means
   * "existed by that date" (`issueDate <= cutoffDate`) -- the mock bakes `status`/`daysOverdue`
   * relative to a single fixed TODAY_ISO snapshot (no per-payment history to replay), so
   * recomputing status/aging for an arbitrary historical cutoff is deferred to when the Antigüedad
   * component (SP2) actually needs it. At the default cutoff (== TODAY_ISO) this is exact.
   *
   * Declared before `filterKey`/`dashboardData` on purpose -- class fields initialize in
   * declaration order, and `dashboardData`'s `initialValue` calls `computeCollectionsData()`
   * synchronously during construction, which reads `saldoTotalFromScope` below, which reads this.
   */
  readonly scopedDocuments = computed<ReceivableDocument[]>(() => {
    const ivaMode = this.ivaMode();
    return this.filteredDocuments().map((doc) => ({ ...doc, balance: toScopedBalance(doc, ivaMode) }));
  });

  /** Same scope as `scopedDocuments`, but ALWAYS gross balances -- the Proyección de Recaudación
   * (SP3) must operate on bruto regardless of the IVA toggle (non-negotiable rule, spec §6). */
  readonly scopedDocumentsGross = computed<ReceivableDocument[]>(() => this.filteredDocuments());

  /** Suma de `balance` sobre `scopedDocuments` -- debe cuadrar siempre con la fila de totales de la
   * tabla de Cartera (SP4) y con el KPI Saldo por Cobrar (SP2), ambos derivados de esta misma
   * fuente para que nunca puedan divergir (spec §6). */
  readonly saldoTotalFromScope = computed(() =>
    this.scopedDocuments().reduce((sum, doc) => sum + doc.balance, 0),
  );

  /** Serialized snapshot of the filter state -- recomputing this triggers the loading pipeline. */
  private readonly filterKey = computed(() =>
    JSON.stringify({
      cutoff: this.cutoffDate(),
      granularity: this.selectedPeriodGranularity(),
      periods: [...this.selectedPeriodIds()].sort(),
      cp: this.counterpartyFilter(),
      sml: this.sectorMarcaLocalFilter(),
      xf: this.crossFilter(),
      cmpMode: this.comparisonMode(),
      cmpAlign: this.comparisonAlignment(),
      cmpExplicit: this.explicitComparisonPeriodIds(),
      iva: this.ivaMode(),
    }),
  );

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  /** Same artificial-loading shape as SalesDataService.dashboardData -- data itself is synchronous
   * mock data, but the UX spec wants a brief loading state whenever a filter changes. */
  private readonly dashboardData = toSignal(
    toObservable(this.filterKey).pipe(
      tap(() => this._loading.set(true)),
      switchMap(() => of(null).pipe(delay(400), map(() => this.computeCollectionsData()))),
      tap(() => this._loading.set(false)),
    ),
    { initialValue: this.computeCollectionsData() },
  );

  /** Exposed for parity with SalesDataService.kpis/etc.; SP1 only needs saldoTotal, more facets
   * join `CollectionsDashboardData` in SP2-SP3 without touching this wiring. */
  readonly saldoTotal = computed(() => this.dashboardData().saldoTotal);

  /** Toggles a drill-down cross-filter: clicking the active segment again clears it. */
  setCrossFilter(dimension: string, id: string): void {
    const current = this.crossFilter();
    if (current && current.dimension === dimension && current.id === id) {
      this.crossFilter.set(null);
      return;
    }
    this.crossFilter.set({ dimension, id });
  }

  setCounterpartyFilter(counterpartyIds: string[] | null): void {
    this.counterpartyFilter.set(counterpartyIds);
  }

  setSectorMarcaLocalFilter(nodeIds: string[] | null): void {
    this.sectorMarcaLocalFilter.set(nodeIds);
  }

  /** Resets every filter to the active default (see activeDefaultView above). */
  clearFilters(): void {
    const defaultView = this.activeDefaultView();
    this.cutoffDate.set(defaultView.cutoffDate);
    this.selectedPeriodIds.set([...defaultView.periodIds]);
    this.selectedPeriodGranularity.set(defaultView.granularity);
    this.counterpartyFilter.set(defaultView.counterpartyIds);
    this.sectorMarcaLocalFilter.set(defaultView.sectorMarcaLocalFilter);
    this.crossFilter.set(null);
    this.compareToPrevious.set(defaultView.compareToPrevious);
    this.comparisonMode.set(defaultView.comparisonMode);
    this.comparisonAlignment.set(defaultView.comparisonAlignment);
    this.explicitComparisonPeriodIds.set(defaultView.explicitComparisonPeriodIds);
    this.ivaMode.set(defaultView.ivaMode);
  }

  /** Captures the CURRENT filter state as the new default: persisted so it survives a reload, and
   * applied immediately (hasActiveFilter recomputes to false). */
  saveAsDefault(): void {
    const view: DefaultCollectionsFilterView = {
      cutoffDate: this.cutoffDate(),
      periodIds: [...this.selectedPeriodIds()],
      granularity: this.selectedPeriodGranularity(),
      counterpartyIds: this.counterpartyFilter() ? [...this.counterpartyFilter()!] : null,
      sectorMarcaLocalFilter: this.sectorMarcaLocalFilter() ? [...this.sectorMarcaLocalFilter()!] : null,
      compareToPrevious: this.compareToPrevious(),
      comparisonMode: this.comparisonMode(),
      comparisonAlignment: this.comparisonAlignment(),
      explicitComparisonPeriodIds: this.explicitComparisonPeriodIds()
        ? [...this.explicitComparisonPeriodIds()!]
        : null,
      ivaMode: this.ivaMode(),
    };
    persistDefaultCollectionsView(CURRENT_USER.tenantId, view);
    this.activeDefaultView.set(view);
  }

  /** Resolves a set of `CollectionsFilterNode` ids (Sector/Marca/Local, or a single such id from a
   * cross-filter) down to the real `Counterparty.id`s hanging underneath them in the filter tree. */
  private counterpartyIdsForNodeIds(nodeIds: string[]): Set<string> {
    const leafIds = getEffectiveLeafIds(this.collectionsFilterTree, new Set(nodeIds));
    const nodeById = new Map(this.collectionsFilterTree.map((node) => [node.id, node]));
    const result = new Set<string>();
    for (const leafId of leafIds) {
      const counterpartyId = nodeById.get(leafId)?.counterpartyId;
      if (counterpartyId) {
        result.add(counterpartyId);
      }
    }
    return result;
  }

  /** Combines the 3 independent scope narrowings (explicit Contraparte filter, Sector/Marca/Local
   * filter, cross-filter) into a single allow-list. `null` means "no restriction" -- kept distinct
   * from an empty Set (which would mean "matches nothing"). */
  private scopedCounterpartyIds(): Set<string> | null {
    let allowed: Set<string> | null = null;

    const counterpartyFilter = this.counterpartyFilter();
    if (counterpartyFilter !== null) {
      allowed = new Set(counterpartyFilter);
    }

    const sectorMarcaLocalFilter = this.sectorMarcaLocalFilter();
    if (sectorMarcaLocalFilter !== null) {
      const fromDimension = this.counterpartyIdsForNodeIds(sectorMarcaLocalFilter);
      allowed = allowed === null ? fromDimension : intersect(allowed, fromDimension);
    }

    const crossFilter = this.crossFilter();
    if (crossFilter !== null) {
      const fromCross =
        crossFilter.dimension === 'contraparte'
          ? new Set([crossFilter.id])
          : this.counterpartyIdsForNodeIds([crossFilter.id]);
      allowed = allowed === null ? fromCross : intersect(allowed, fromCross);
    }

    return allowed;
  }

  /** Non-PAGADO, cutoff-scoped, dimension-scoped documents, gross balances (IVA toggle not yet
   * applied) -- shared base for both `scopedDocuments` and `scopedDocumentsGross`. */
  private filteredDocuments(): ReceivableDocument[] {
    const cutoffDate = this.cutoffDate();
    const allowedCounterpartyIds = this.scopedCounterpartyIds();

    return RECEIVABLE_DOCUMENTS.filter((doc) => {
      if (doc.status === 'PAGADO') {
        return false;
      }
      if (doc.issueDate > cutoffDate) {
        return false;
      }
      if (allowedCounterpartyIds !== null && !allowedCounterpartyIds.has(doc.counterpartyId)) {
        return false;
      }
      return true;
    });
  }

  private computeCollectionsData(): CollectionsDashboardData {
    return { saldoTotal: this.saldoTotalFromScope() };
  }
}
