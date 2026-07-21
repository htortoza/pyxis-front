import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Popover } from 'primeng/popover';
import { ToggleSwitch } from 'primeng/toggleswitch';

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

const GRANULARITY_LABEL: Record<PeriodGranularity, string> = { dia: 'Día', semana: 'Semana', mes: 'Mes' };
const COMPARISON_MODE_LABEL: Record<ComparisonMode, string> = {
  periodo_anterior: 'Periodo Anterior',
  periodo_especifico: 'Periodo Específico',
  meta: 'Meta',
};

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
  imports: [
    Button,
    Dialog,
    FormsModule,
    Popover,
    PrimeTemplate,
    ToggleSwitch,
    ComparisonSelectorComponent,
    ContextFilterComponent,
    PeriodPickerComponent,
    SavedViewsSidebarComponent,
  ],
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

  /** Período y Comparación se configuran en popovers propios (anclados a su botón disparador,
   * no dialogs centrados) -- cerrados por defecto cada vez que se abre el modal principal. IVA
   * es un toggle simple, sin popover -- no hay nada que configurar más allá de encendido/apagado. */
  private readonly periodPopover = viewChild<Popover>('periodPopoverEl');
  private readonly comparisonPopover = viewChild<Popover>('comparisonPopoverEl');
  private readonly savedViewsSidebar = viewChild<SavedViewsSidebarComponent>('savedViewsSidebarEl');

  /** p-dialog doesn't render its content until `visible` turns true, so the sidebar's
   * viewChild is still undefined the instant openToSaveView() sets isOpen -- this flag plus
   * the effect below waits for the sidebar to actually exist before opening its save form. */
  private readonly pendingOpenSaveForm = signal(false);

  constructor() {
    effect(() => {
      const sidebar = this.savedViewsSidebar();
      if (sidebar && this.pendingOpenSaveForm()) {
        sidebar.openSaveForm();
        this.pendingOpenSaveForm.set(false);
      }
    });
  }

  protected readonly periodSummary = computed(() => {
    const count = this.draftPeriodIds().size;
    const countLabel = count === 0 ? 'sin selección' : `${count} periodo${count === 1 ? '' : 's'}`;
    return `${GRANULARITY_LABEL[this.draftGranularity()]} · ${countLabel}`;
  });

  protected readonly comparisonSummary = computed(() => COMPARISON_MODE_LABEL[this.draftComparisonMode()]);

  protected readonly ivaSummary = computed(() => (this.draftIvaMode() === 'con_iva' ? 'Con IVA' : 'Sin IVA'));

  open(): void {
    this.syncDraftFromApplied();
    this.periodPopover()?.hide();
    this.comparisonPopover()?.hide();
    this.isOpen.set(true);
  }

  /** Header shortcut ("Guardar vista actual", global-header.html) -- opens straight to the
   * save-name form instead of the browsing view, so saving doesn't require first navigating
   * to Vistas Guardadas inside the modal. */
  openToSaveView(): void {
    this.open();
    this.pendingOpenSaveForm.set(true);
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
