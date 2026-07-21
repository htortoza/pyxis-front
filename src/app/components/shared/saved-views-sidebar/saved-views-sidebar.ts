import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, signal } from '@angular/core';
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
import type { Period, PeriodGranularity } from '../../../data/models/period.model';
import { CONTEXT_TREE, MARCAS, SECTORES } from '../../../data/mock/context-tree.mock';
import { PERIODS_BY_GRANULARITY } from '../../../data/mock/periods.mock';
import type { SavedView, SavedViewScope } from '../../../data/models/saved-view.model';
import { buildSectorMarcaTiendaTree } from '../../../data/utils/sector-marca-tienda-tree.utils';
import { PERIOD_PRESETS, type PeriodPreset } from '../../../data/utils/period.utils';
import { computeSelectionStates } from '../../../data/utils/tristate.utils';
import { SavedViewsService } from '../../../services/saved-views.service';

/** Stands in for the real current date -- same mock constant PeriodPickerComponent uses. */
const TODAY = { year: 2026, month: 7, day: 20 };

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
  readonly draftGranularity = model.required<PeriodGranularity>();
  readonly draftPeriodIds = model.required<Set<string>>();
  readonly draftCompare = input.required<boolean>();
  readonly draftComparisonMode = input.required<ComparisonMode>();
  readonly draftComparisonAlignment = input.required<ComparisonAlignment>();
  readonly draftExplicitComparisonPeriodIds = input.required<Set<string>>();
  readonly draftIvaMode = input.required<IvaMode>();

  readonly viewApplied = output<void>();

  private readonly filterTree = buildSectorMarcaTiendaTree(CONTEXT_TREE, MARCAS, SECTORES);

  private readonly searchRaw = signal('');
  private readonly searchDebounced = toSignal(toObservable(this.searchRaw).pipe(debounceTime(300)), {
    initialValue: '',
  });

  protected readonly filteredSavedViews = computed(() => {
    const query = this.searchDebounced().trim().toLowerCase();
    const views = this.savedViews.visibleViews();
    if (!query) return views;
    return views.filter((view) => view.label.toLowerCase().includes(query));
  });

  /** Accesos rápidos de período -- viven acá (no en PeriodPickerComponent) para ser 1-clic sin abrir el panel plegable de Período. */
  protected readonly presets = computed<PeriodPreset[]>(() =>
    PERIOD_PRESETS.filter((preset) => preset.granularity === this.draftGranularity()),
  );

  private readonly activePeriods = computed<Period[]>(() => PERIODS_BY_GRANULARITY[this.draftGranularity()]);

  applyPreset(preset: PeriodPreset): void {
    this.draftPeriodIds.set(new Set(preset.resolve(this.activePeriods(), TODAY)));
  }

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

  protected get searchValue(): string {
    return this.searchRaw();
  }

  protected setSearch(value: string): void {
    this.searchRaw.set(value);
  }
}
