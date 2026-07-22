import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Popover } from 'primeng/popover';
import { ToggleSwitch } from 'primeng/toggleswitch';

import type { ComparisonAlignment, ComparisonMode } from '../../../data/models/comparison.model';
import type { IvaMode } from '../../../data/models/iva.model';
import type { PeriodGranularity } from '../../../data/models/period.model';
import type { SavedViewScope } from '../../../data/models/saved-view.model';
import { CONTEXT_TREE, MARCAS, SECTORES } from '../../../data/mock/context-tree.mock';
import { PERIODS_BY_GRANULARITY } from '../../../data/mock/periods.mock';
import { mobileMediaQueryList } from '../../../data/utils/mobile-breakpoint.utils';
import { buildSectorMarcaTiendaTree } from '../../../data/utils/sector-marca-tienda-tree.utils';
import { PERIOD_PRESETS, type PeriodPreset } from '../../../data/utils/period.utils';
import { computeSelectionStates, getEffectiveLeafIds } from '../../../data/utils/tristate.utils';
import { SalesDataService } from '../../../services/sales-data.service';
import { SavedViewsService } from '../../../services/saved-views.service';
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

/** Stands in for the real current date -- same mock constant PeriodPickerComponent uses. */
const TODAY = { year: 2026, month: 7, day: 20 };

/**
 * Modal único de filtros -- reemplaza los 3 popovers + los botones sueltos de IVA que existían
 * antes en el Header Global. Dueño de las 8 señales de draft; un solo Aplicar/Cancelar para
 * las 4 secciones juntas. Aplicar una vista guardada desde el sidebar sigue siendo instantáneo
 * (bypassa el draft, ver SavedViewsSidebarComponent) -- tras aplicar, resincroniza el draft
 * completo desde SalesDataService para que el resto del modal refleje la vista recién aplicada.
 *
 * "Guardar vista actual" y "Accesos Rápidos" viven acá (no en SavedViewsSidebarComponent, que
 * ahora solo lista/aplica/borra vistas existentes) porque ambos operan directamente sobre el
 * draft que este componente ya posee -- guardarlo como vista nueva o saltar a un preset de
 * período no necesita pasar por el sidebar en absoluto.
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
    InputText,
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
  protected readonly savedViews = inject(SavedViewsService);

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
  private readonly saveViewPopover = viewChild<Popover>('saveViewPopoverEl');
  private readonly savedViewsSidebar = viewChild<SavedViewsSidebarComponent>('savedViewsSidebarEl');

  /** "Guardar vista actual" (dialog header) behaves differently per device: mobile opens the
   * popover below; desktop calls into Vistas Guardadas' own inline form instead (its original,
   * pre-popover behavior) -- see openSaveViewPopover(). */
  private readonly isMobile = signal(mobileMediaQueryList()?.matches ?? false);

  constructor() {
    mobileMediaQueryList()?.addEventListener('change', (event) => this.isMobile.set(event.matches));
  }

  /**
   * Accesos rápidos de período -- viven acá (no en PeriodPickerComponent) para ser 1-clic sin
   * abrir el panel plegable de Período. Todos disponibles a la vez (no solo los de la
   * granularidad actualmente elegida), agrupados por granularidad en el orden en que se
   * seleccionan más seguido: Meses, luego Semanas, luego Días.
   */
  protected readonly presetGroups: { label: string; presets: PeriodPreset[] }[] = (
    [
      ['mes', 'Meses'],
      ['semana', 'Semanas'],
      ['dia', 'Días'],
    ] as const
  )
    .map(([granularity, label]) => ({
      label,
      presets: PERIOD_PRESETS.filter((preset) => preset.granularity === granularity),
    }))
    .filter((group) => group.presets.length > 0);

  /** Aplicar un preset también cambia la granularidad a la suya -- ya no está filtrada por la
   * granularidad actual, así que un preset de Semana debe poder aplicarse estando en Mes. */
  applyPreset(preset: PeriodPreset): void {
    this.draftGranularity.set(preset.granularity);
    this.draftPeriodIds.set(new Set(preset.resolve(PERIODS_BY_GRANULARITY[preset.granularity], TODAY)));
  }

  protected readonly saveViewLabel = signal('');
  protected readonly saveViewScope = signal<SavedViewScope>('personal');

  protected readonly suggestedViewLabel = computed(() => {
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
    this.saveViewPopover()?.hide();
    this.savedViewsSidebar()?.cancelSaveForm();
    this.isOpen.set(true);
  }

  /** Dialog-header shortcut, next to the "Filtros" title. Mobile: opens this component's own
   * popover (name + Personal/Equipo + Guardar/Cancelar), anchored to the triggering button.
   * Desktop: delegates to Vistas Guardadas' own inline form instead -- its original,
   * pre-popover behavior, unaffected by the popover added for mobile. */
  openSaveViewPopover(event: Event): void {
    if (!this.isMobile()) {
      this.savedViewsSidebar()?.openSaveForm(this.suggestedViewLabel());
      return;
    }
    this.saveViewLabel.set(this.suggestedViewLabel());
    this.saveViewScope.set('personal');
    this.saveViewPopover()?.toggle(event);
  }

  confirmSaveView(): void {
    const label = this.saveViewLabel().trim();
    if (!label) return;
    this.saveCurrentDraftAsView(label, this.saveViewScope());
    this.saveViewPopover()?.hide();
    this.saveViewLabel.set('');
  }

  /** Desktop's inline form (SavedViewsSidebarComponent) doesn't have the draft, so it emits
   * {label, scope} instead of saving directly -- this is where that request actually lands. */
  onSidebarSaveRequested(request: { label: string; scope: SavedViewScope }): void {
    this.saveCurrentDraftAsView(request.label, request.scope);
  }

  private saveCurrentDraftAsView(label: string, scope: SavedViewScope): void {
    this.savedViews.saveCurrentSelection({
      label,
      scope,
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
