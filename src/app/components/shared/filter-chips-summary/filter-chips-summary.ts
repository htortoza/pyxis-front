import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Chip } from 'primeng/chip';

import { CONTEXT_TREE } from '../../../data/mock/context-tree.mock';
import { SalesDataService } from '../../../services/sales-data.service';

interface TiendaChip {
  id: string;
  label: string;
}

/**
 * Reads only the APPLIED filter state (never a draft) -- an always-visible chip naming the
 * applied period selection (so it's never ambiguous what's currently loaded, even at the
 * default), plus one chip per Tienda id currently in `sectorMarcaTiendaFilter`. That signal
 * only stores a flat array of Tienda ids, so there's no way to reconstruct which Sector/Marca
 * the user originally checked -- this component doesn't try to fake that context.
 * Lives in GlobalHeaderComponent (which already has its own "Limpiar Filtros"/"Guardar"
 * buttons), so this doesn't duplicate a clear-all/save action.
 */
@Component({
  selector: 'app-filter-chips-summary',
  standalone: true,
  imports: [Chip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-chips-summary.html',
  styleUrl: './filter-chips-summary.css',
})
export class FilterChipsSummaryComponent {
  protected readonly salesData = inject(SalesDataService);

  private readonly tiendaLabelById = new Map(CONTEXT_TREE.map((node) => [node.id, node.label]));

  /** Always shows the applied period(s) by name (e.g. "Mayo, Junio, Julio 2026") -- unlike the
   * other chips below, this isn't gated on "differs from default": the whole point is that the
   * user can always see what's currently loaded, not just when it's non-default. */
  protected readonly periodsChipLabel = computed<string>(() => {
    const granularity = this.salesData.selectedPeriodGranularity();
    const selectedIds = new Set(this.salesData.selectedPeriodIds());
    const selected = this.salesData
      .periods()
      .filter((period) => selectedIds.has(period.id))
      .sort((a, b) => a.order - b.order);
    if (selected.length === 0) return 'Sin período seleccionado';

    if (granularity !== 'mes') {
      // Día/semana labels already carry their own date ("Semana del ...", "12 jul") -- no year to append.
      return selected.map((period) => period.label).join(', ');
    }
    const names = selected.map((period) => period.label).join(', ');
    const sameYear = selected.every((period) => period.year === selected[0].year);
    return sameYear ? `${names} ${selected[0].year}` : selected.map((period) => `${period.label} ${period.year}`).join(', ');
  });

  protected readonly comparisonChipLabel = computed<string | null>(() => {
    const mode = this.salesData.comparisonMode();
    if (mode === this.salesData.defaultView().comparisonMode) return null;
    if (mode === 'periodo_anterior') return 'Comparación: Periodo Anterior';
    return mode === 'meta' ? 'Comparación: Meta' : 'Comparación: Periodo Específico';
  });

  protected readonly ivaChipLabel = computed<string | null>(() => {
    const ivaMode = this.salesData.ivaMode();
    if (ivaMode === this.salesData.defaultView().ivaMode) return null;
    return ivaMode === 'sin_iva' ? 'Sin IVA' : 'Con IVA';
  });

  protected readonly tiendaChips = computed<TiendaChip[]>(() => {
    const ids = this.salesData.sectorMarcaTiendaFilter() ?? [];
    return ids.map((id) => ({ id, label: this.tiendaLabelById.get(id) ?? id }));
  });

  resetPeriods(): void {
    const defaultView = this.salesData.defaultView();
    this.salesData.selectedPeriodGranularity.set(defaultView.granularity);
    this.salesData.selectedPeriodIds.set([...defaultView.periodIds]);
  }

  removeTienda(tiendaId: string): void {
    const current = this.salesData.sectorMarcaTiendaFilter() ?? [];
    const next = current.filter((id) => id !== tiendaId);
    this.salesData.setSectorMarcaTiendaFilter(next.length > 0 ? next : null);
  }
}
