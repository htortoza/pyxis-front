import { Injectable, computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { delay, map, of, switchMap, tap } from 'rxjs';

import type { ContextNode } from '../data/models/context-node.model';
import type { KpiSet } from '../data/models/kpi.model';
import type { Period } from '../data/models/period.model';
import type { RankingDimension, RankingSet } from '../data/models/ranking.model';
import type { SalesFact } from '../data/models/sales-fact.model';
import { CONTEXT_TREE } from '../data/mock/context-tree.mock';
import { DEFAULT_SELECTED_PERIOD_IDS, PERIODS } from '../data/mock/periods.mock';
import { PRODUCTS } from '../data/mock/products.mock';
import { SALES_FACTS } from '../data/mock/sales-facts.mock';
import {
  buildNodeMap,
  buildStoreAncestryMap,
  getDescendantLeafIds,
  toPrimeNgTreeNodes,
} from '../data/utils/context-tree.utils';
import {
  aggregateRanking,
  buildHeatmapMatrix,
  buildHourlySeries,
  computeKpis,
  filterFacts,
} from '../data/utils/sales-fact.utils';

interface CrossFilter {
  dimension: RankingDimension;
  id: string;
}

interface DashboardData {
  kpis: KpiSet;
  hourlySeries: Record<string, number[]>;
  heatmap: number[][];
  rankings: RankingSet;
}

/**
 * Single source of truth for the "Ventas General" dashboard screen.
 * Owns the filter state (context/period/cross-filter) and derives every
 * chart/KPI/ranking dataset from the local mock data — there is no backend.
 */
@Injectable({ providedIn: 'root' })
export class SalesDataService {
  /** Currently selected node in the context tree (holding/sector/marca/local). */
  readonly selectedContextId = signal<string>('holding');

  /** Currently selected period ids (checkbox multi-select over PERIODS). */
  readonly selectedPeriodIds = signal<string[]>([...DEFAULT_SELECTED_PERIOD_IDS]);

  /** Active drill-down cross-filter coming from a ranking row click, if any. */
  readonly crossFilter = signal<CrossFilter | null>(null);

  /** Static reference data for the header / context-selector component. */
  readonly contextTree: ContextNode[] = CONTEXT_TREE;
  readonly periods: Period[] = PERIODS;
  readonly treeNodes = computed(() => toPrimeNgTreeNodes(CONTEXT_TREE));

  /** True when any filter differs from its default (holding / default periods / no cross-filter). */
  readonly hasActiveFilter = computed(() => {
    const contextChanged = this.selectedContextId() !== 'holding';

    const currentPeriods = new Set(this.selectedPeriodIds());
    const defaultPeriods = new Set(DEFAULT_SELECTED_PERIOD_IDS);
    const periodsChanged =
      currentPeriods.size !== defaultPeriods.size ||
      [...currentPeriods].some((id) => !defaultPeriods.has(id));

    return contextChanged || periodsChanged || this.crossFilter() !== null;
  });

  /** Serialized snapshot of the filter state — recomputing this triggers the loading pipeline. */
  private readonly filterKey = computed(() =>
    JSON.stringify({
      ctx: this.selectedContextId(),
      periods: [...this.selectedPeriodIds()].sort(),
      xf: this.crossFilter(),
    }),
  );

  private readonly _loading = signal(false);
  /** Artificial loading flag so the UI can show a shimmer/skeleton while filters "apply". */
  readonly loading = this._loading.asReadonly();

  /**
   * The actual dashboard data is synchronous (mock data), but the UX spec wants a brief
   * loading state whenever filters change, so this pipes the filter key through an
   * artificial delay before recomputing.
   */
  private readonly dashboardData = toSignal(
    toObservable(this.filterKey).pipe(
      tap(() => this._loading.set(true)),
      switchMap(() => of(null).pipe(delay(400), map(() => this.computeDashboardData()))),
      tap(() => this._loading.set(false)),
    ),
    { initialValue: this.computeDashboardData() },
  );

  readonly kpis = computed(() => this.dashboardData().kpis);
  readonly hourlySeriesByPeriod = computed(() => this.dashboardData().hourlySeries);
  readonly heatmapMatrix = computed(() => this.dashboardData().heatmap);
  readonly rankings = computed(() => this.dashboardData().rankings);

  /** Toggles a ranking-row cross-filter: clicking the active row again clears it. */
  setCrossFilter(dimension: RankingDimension, id: string): void {
    const current = this.crossFilter();
    if (current && current.dimension === dimension && current.id === id) {
      this.crossFilter.set(null);
      return;
    }
    this.crossFilter.set({ dimension, id });
  }

  /** Resets context, periods and cross-filter back to their defaults. */
  clearFilters(): void {
    this.selectedContextId.set('holding');
    this.selectedPeriodIds.set([...DEFAULT_SELECTED_PERIOD_IDS]);
    this.crossFilter.set(null);
  }

  private computeDashboardData(): DashboardData {
    const contextId = this.selectedContextId();
    const periodIds = this.selectedPeriodIds();
    const crossFilter = this.crossFilter();

    const ancestryMap = buildStoreAncestryMap(CONTEXT_TREE);
    const nodeMap = buildNodeMap(CONTEXT_TREE);
    const productNameById = new Map(PRODUCTS.map((product) => [product.id, product.name]));

    // Step 1 + 2: resolve in-scope stores, narrowed by a sector/marca/local cross-filter.
    // A 'producto' cross-filter does NOT narrow the store set — it narrows facts instead (below).
    let scopedStoreIds = getDescendantLeafIds(CONTEXT_TREE, contextId);
    if (crossFilter) {
      if (crossFilter.dimension === 'local') {
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
    const scopedFacts = filterFacts(SALES_FACTS, { storeIds: scopedStoreIds, periodIds });
    const currentFacts =
      crossFilter?.dimension === 'producto'
        ? scopedFacts.filter((fact) => fact.productId === crossFilter.id)
        : scopedFacts;

    // Step 4: previous-period window — same-length window shifted back by the number of
    // selected periods, using Period.order; periods below the available range are skipped.
    const selectedPeriods = PERIODS.filter((period) => periodIds.includes(period.id));
    const shift = selectedPeriods.length;
    const previousOrders = new Set(selectedPeriods.map((period) => period.order - shift));
    const previousPeriodIds = PERIODS.filter((period) => previousOrders.has(period.order)).map(
      (period) => period.id,
    );
    const scopedPreviousFacts = filterFacts(SALES_FACTS, {
      storeIds: scopedStoreIds,
      periodIds: previousPeriodIds,
    });
    const previousFacts =
      crossFilter?.dimension === 'producto'
        ? scopedPreviousFacts.filter((fact) => fact.productId === crossFilter.id)
        : scopedPreviousFacts;

    // Step 5: KPIs (current vs previous).
    const kpis = computeKpis(currentFacts, previousFacts);

    // Step 6: hourly series per selected period, ordered as PERIODS defines them.
    const hourlySeries: Record<string, number[]> = {};
    for (const period of selectedPeriods) {
      const periodFacts = currentFacts.filter((fact: SalesFact) => fact.periodId === period.id);
      hourlySeries[period.id] = buildHourlySeries(periodFacts);
    }

    // Step 7: combined heatmap across all selected periods.
    const heatmap = buildHeatmapMatrix(currentFacts);

    // Step 8: rankings. Sector/marca/local rankings use the store+period scope only (not
    // narrowed by a 'producto' cross-filter) so drilling into a product never empties them.
    // Productos ranking uses the fully narrowed current facts.
    const rankings: RankingSet = {
      sectores: aggregateRanking(
        scopedFacts,
        (fact) => ancestryMap.get(fact.storeId)?.sectorId ?? '',
        (key) => nodeMap.get(key)?.label ?? key,
      ),
      marcas: aggregateRanking(
        scopedFacts,
        (fact) => ancestryMap.get(fact.storeId)?.marcaId ?? '',
        (key) => nodeMap.get(key)?.label ?? key,
      ),
      locales: aggregateRanking(
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
}
