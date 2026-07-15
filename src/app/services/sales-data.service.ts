import { Injectable, computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { delay, map, of, switchMap, tap } from 'rxjs';

import type { ContextNode } from '../data/models/context-node.model';
import type { KpiSet } from '../data/models/kpi.model';
import type { Period } from '../data/models/period.model';
import type { RankingDimension, RankingSet } from '../data/models/ranking.model';
import type { SalesFact } from '../data/models/sales-fact.model';
import { CONTEXT_TREE, MARCAS, SECTORES } from '../data/mock/context-tree.mock';
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
 * Single source of truth for both the "Ventas General" and "Detalle de Ventas" screens.
 * Owns the filter state (context/period/sector-marca-tienda/cross-filter) and derives every
 * chart/KPI/ranking/fact-list dataset from the local mock data — there is no backend.
 * All filters live in the shared GlobalHeaderComponent, so applying one here is instantly
 * reflected -- and editable -- on whichever of the two screens is currently active.
 */
@Injectable({ providedIn: 'root' })
export class SalesDataService {
  /** Currently selected node in the context tree (holding/empresa/tienda). */
  readonly selectedContextId = signal<string>('holding');

  /** Currently selected period ids (checkbox multi-select over PERIODS). */
  readonly selectedPeriodIds = signal<string[]>([...DEFAULT_SELECTED_PERIOD_IDS]);

  /** Active drill-down cross-filter coming from a ranking row click, if any (Ventas General only). */
  readonly crossFilter = signal<CrossFilter | null>(null);

  /** The header's Sector/Marca/Tienda filter -- null means unfiltered. Applies to both screens. */
  readonly sectorMarcaTiendaFilter = signal<string[] | null>(null);

  /** Whether KPI/comparison UI should show the vs-previous-period delta. Defaults to on (matches current always-on behavior). */
  readonly compareToPrevious = signal<boolean>(true);

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

    return (
      contextChanged ||
      periodsChanged ||
      this.crossFilter() !== null ||
      this.sectorMarcaTiendaFilter() !== null
    );
  });

  /** Serialized snapshot of the filter state — recomputing this triggers the loading pipeline. */
  private readonly filterKey = computed(() =>
    JSON.stringify({
      ctx: this.selectedContextId(),
      periods: [...this.selectedPeriodIds()].sort(),
      xf: this.crossFilter(),
      smt: this.sectorMarcaTiendaFilter(),
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

  /**
   * Store+period scoped facts (header context + the Sector/Marca/Tienda filter, but NOT the
   * ranking cross-filter, which is a Ventas General-only drill-down concept). This is the raw
   * fact list Detalle de Ventas' tree-table needs; Ventas General instead reads the aggregated
   * kpis/rankings/etc. above, which apply this same scoping internally (see computeDashboardData).
   */
  readonly scopedFacts = computed(() =>
    filterFacts(SALES_FACTS, {
      storeIds: this.scopedStoreIdsForContext(),
      periodIds: this.selectedPeriodIds(),
    }),
  );

  /** Toggles a ranking-row cross-filter: clicking the active row again clears it. */
  setCrossFilter(dimension: RankingDimension, id: string): void {
    const current = this.crossFilter();
    if (current && current.dimension === dimension && current.id === id) {
      this.crossFilter.set(null);
      return;
    }
    this.crossFilter.set({ dimension, id });
  }

  /** Resets context, periods, cross-filter and the Sector/Marca/Tienda filter to their defaults. */
  clearFilters(): void {
    this.selectedContextId.set('holding');
    this.selectedPeriodIds.set([...DEFAULT_SELECTED_PERIOD_IDS]);
    this.crossFilter.set(null);
    this.sectorMarcaTiendaFilter.set(null);
  }

  setSectorMarcaTiendaFilter(tiendaIds: string[] | null): void {
    this.sectorMarcaTiendaFilter.set(tiendaIds);
  }

  /** Header context (holding/empresa/tienda) narrowed by the Sector/Marca/Tienda filter, if any. */
  private scopedStoreIdsForContext(): string[] {
    let ids = getDescendantLeafIds(CONTEXT_TREE, this.selectedContextId());
    const sectorMarcaTiendaFilter = this.sectorMarcaTiendaFilter();
    if (sectorMarcaTiendaFilter !== null) {
      const allowed = new Set(sectorMarcaTiendaFilter);
      ids = ids.filter((id) => allowed.has(id));
    }
    return ids;
  }

  private computeDashboardData(): DashboardData {
    const periodIds = this.selectedPeriodIds();
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
    const scopedFacts = filterFacts(SALES_FACTS, { storeIds: scopedStoreIds, periodIds });
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

    // Step 5: KPIs (current vs previous) + each metric's sparkline trend points.
    const kpis = computeKpis(currentFacts, previousFacts, trendSourceFacts, PERIODS, periodIds);

    // Step 6: hourly series per selected period, ordered as PERIODS defines them.
    const hourlySeries: Record<string, number[]> = {};
    for (const period of selectedPeriods) {
      const periodFacts = currentFacts.filter((fact: SalesFact) => fact.periodId === period.id);
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
}
