import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Chip } from 'primeng/chip';

import { CONTEXT_TREE } from '../../../data/mock/context-tree.mock';
import { DEFAULT_SELECTED_PERIOD_IDS } from '../../../data/mock/periods.mock';
import { SalesDataService } from '../../../services/sales-data.service';

interface TiendaChip {
  id: string;
  label: string;
}

/**
 * Reads only the APPLIED filter state (never a draft) -- one chip for the applied period
 * selection (if non-default) and one chip per Tienda id currently in `sectorMarcaTiendaFilter`.
 * That signal only stores a flat array of Tienda ids, so there's no way to reconstruct which
 * Sector/Marca the user originally checked -- this component doesn't try to fake that context.
 * Lives in GlobalHeaderComponent (which already has its own "Limpiar Filtros" button), so this
 * doesn't duplicate a clear-all action.
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

  /** Null when the applied period selection matches the default (no chip to show). */
  protected readonly periodsChipLabel = computed<string | null>(() => {
    const current = new Set(this.salesData.selectedPeriodIds());
    const defaults = new Set(DEFAULT_SELECTED_PERIOD_IDS);
    const changed =
      current.size !== defaults.size || [...current].some((id) => !defaults.has(id));
    if (!changed) return null;
    return `${current.size} periodo${current.size === 1 ? '' : 's'}`;
  });

  protected readonly tiendaChips = computed<TiendaChip[]>(() => {
    const ids = this.salesData.sectorMarcaTiendaFilter() ?? [];
    return ids.map((id) => ({ id, label: this.tiendaLabelById.get(id) ?? id }));
  });

  resetPeriods(): void {
    this.salesData.selectedPeriodIds.set([...DEFAULT_SELECTED_PERIOD_IDS]);
  }

  removeTienda(tiendaId: string): void {
    const current = this.salesData.sectorMarcaTiendaFilter() ?? [];
    const next = current.filter((id) => id !== tiendaId);
    this.salesData.setSectorMarcaTiendaFilter(next.length > 0 ? next : null);
  }
}
