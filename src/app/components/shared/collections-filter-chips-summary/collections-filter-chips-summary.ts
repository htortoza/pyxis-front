import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Chip } from 'primeng/chip';

import { COUNTERPARTIES } from '../../../data/mock/collections.mock';
import { CONTEXT_TREE, MARCAS, SECTORES } from '../../../data/mock/context-tree.mock';
import { buildCollectionsFilterTree } from '../../../data/utils/collections-filter-tree.utils';
import { CollectionsDataService } from '../../../services/collections-data.service';

interface DimensionChip {
  id: string;
  label: string;
}

const CUTOFF_DATE_FORMATTER = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatCutoffDate(iso: string): string {
  return CUTOFF_DATE_FORMATTER.format(new Date(`${iso}T00:00:00Z`));
}

/**
 * Cobranzas' analogue of FilterChipsSummaryComponent -- same "reads only the APPLIED state, never
 * a draft" contract, injecting CollectionsDataService directly instead of SalesDataService. Two
 * chips are always visible regardless of default (periods, same as Ventas, plus cutoff): "Saldo al
 * [fecha]" is central to Cobranzas (spec §1.4) -- the user must always see which stock date the
 * numbers on screen represent, not just when it's non-default. Comparison/IVA/dimension chips
 * follow the same "differs from default" gating as Ventas. Lives inside the module content
 * projected into GlobalHeaderComponent, which owns "Limpiar filtros"/"Guardar" -- no clear-all
 * action duplicated here.
 */
@Component({
  selector: 'app-collections-filter-chips-summary',
  standalone: true,
  imports: [Chip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collections-filter-chips-summary.html',
  styleUrl: './collections-filter-chips-summary.css',
})
export class CollectionsFilterChipsSummaryComponent {
  protected readonly collectionsData = inject(CollectionsDataService);

  private readonly counterpartyLabelById = new Map(COUNTERPARTIES.map((cp) => [cp.id, cp.label]));

  /** Built locally (not read off the service, which keeps its own tree private) -- same mock
   * universe and utility the service uses internally, so ids resolve to the identical labels. */
  private readonly dimensionLabelById = new Map(
    buildCollectionsFilterTree(CONTEXT_TREE, MARCAS, SECTORES, COUNTERPARTIES).map((node) => [
      node.id,
      node.label,
    ]),
  );

  /** Always shows the applied period(s) by name -- mirrors FilterChipsSummaryComponent exactly. */
  protected readonly periodsChipLabel = computed<string>(() => {
    const granularity = this.collectionsData.selectedPeriodGranularity();
    const selectedIds = new Set(this.collectionsData.selectedPeriodIds());
    const selected = this.collectionsData
      .periods()
      .filter((period) => selectedIds.has(period.id))
      .sort((a, b) => a.order - b.order);
    if (selected.length === 0) return 'Sin período seleccionado';

    if (granularity !== 'mes') {
      return selected.map((period) => period.label).join(', ');
    }
    const names = selected.map((period) => period.label).join(', ');
    const sameYear = selected.every((period) => period.year === selected[0].year);
    return sameYear ? `${names} ${selected[0].year}` : selected.map((period) => `${period.label} ${period.year}`).join(', ');
  });

  /** Always visible, regardless of default -- the cutoff date is central to Cobranzas (spec §1.4):
   * the user must always know which stock snapshot the numbers reflect. */
  protected readonly cutoffChipLabel = computed<string>(
    () => `Saldo al ${formatCutoffDate(this.collectionsData.cutoffDate())}`,
  );

  protected readonly comparisonChipLabel = computed<string | null>(() => {
    const mode = this.collectionsData.comparisonMode();
    if (mode === this.collectionsData.defaultView().comparisonMode) return null;
    if (mode === 'periodo_anterior') return 'Comparación: Periodo Anterior';
    return mode === 'meta' ? 'Comparación: Meta' : 'Comparación: Periodo Específico';
  });

  protected readonly ivaChipLabel = computed<string | null>(() => {
    const ivaMode = this.collectionsData.ivaMode();
    if (ivaMode === this.collectionsData.defaultView().ivaMode) return null;
    return ivaMode === 'sin_iva' ? 'Sin IVA' : 'Con IVA';
  });

  protected readonly counterpartyChips = computed<DimensionChip[]>(() => {
    const ids = this.collectionsData.counterpartyFilter() ?? [];
    return ids.map((id) => ({ id, label: this.counterpartyLabelById.get(id) ?? id }));
  });

  protected readonly dimensionChips = computed<DimensionChip[]>(() => {
    const ids = this.collectionsData.sectorMarcaLocalFilter() ?? [];
    return ids.map((id) => ({ id, label: this.dimensionLabelById.get(id) ?? id }));
  });

  resetPeriods(): void {
    const defaultView = this.collectionsData.defaultView();
    this.collectionsData.selectedPeriodGranularity.set(defaultView.granularity);
    this.collectionsData.selectedPeriodIds.set([...defaultView.periodIds]);
  }

  resetCutoff(): void {
    this.collectionsData.cutoffDate.set(this.collectionsData.defaultView().cutoffDate);
  }

  resetComparison(): void {
    const defaultView = this.collectionsData.defaultView();
    this.collectionsData.comparisonMode.set(defaultView.comparisonMode);
    this.collectionsData.comparisonAlignment.set(defaultView.comparisonAlignment);
    this.collectionsData.explicitComparisonPeriodIds.set(defaultView.explicitComparisonPeriodIds);
  }

  resetIva(): void {
    this.collectionsData.ivaMode.set(this.collectionsData.defaultView().ivaMode);
  }

  removeCounterparty(counterpartyId: string): void {
    const current = this.collectionsData.counterpartyFilter() ?? [];
    const next = current.filter((id) => id !== counterpartyId);
    this.collectionsData.setCounterpartyFilter(next.length > 0 ? next : null);
  }

  removeDimension(nodeId: string): void {
    const current = this.collectionsData.sectorMarcaLocalFilter() ?? [];
    const next = current.filter((id) => id !== nodeId);
    this.collectionsData.setSectorMarcaLocalFilter(next.length > 0 ? next : null);
  }
}
