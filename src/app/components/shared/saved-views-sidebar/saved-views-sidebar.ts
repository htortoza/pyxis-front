import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';

import { CONTEXT_TREE, MARCAS, SECTORES } from '../../../data/mock/context-tree.mock';
import type { SavedView, SavedViewScope } from '../../../data/models/saved-view.model';
import { buildSectorMarcaTiendaTree } from '../../../data/utils/sector-marca-tienda-tree.utils';
import { SavedViewsService } from '../../../services/saved-views.service';

/**
 * Sidebar de Vistas Guardadas del modal de filtros -- extraído de lo que antes vivía embebido
 * en ContextFilterComponent. Lista/aplica/renombra/borra vistas existentes, y en desktop
 * también posee el formulario inline de "Guardar vista actual" -- en mobile ese mismo botón del
 * header del diálogo abre un popover en vez (ver FiltersModalComponent.openSaveViewPopover()),
 * así que este componente NO conoce el draft directamente: solo junta {label, scope} y emite
 * `saveRequested` para que el padre (dueño del draft) haga el guardado real. "Accesos Rápidos"
 * vive en FiltersModalComponent porque en mobile necesita reordenarse independiente de esta
 * sidebar (ver su doc comment).
 *
 * "Aplicar" una vista sigue siendo instantáneo (escribe directo a SalesDataService vía
 * SavedViewsService.applyView, sin pasar por el draft del modal); tras aplicar, emite
 * `viewApplied` para que FiltersModalComponent resincronice sus 8 draft signals.
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

  readonly viewApplied = output<void>();
  /** Parent owns the draft and does the actual SavedViewsService.saveCurrentSelection() call --
   * this component only collects the name/scope choice. */
  readonly saveRequested = output<{ label: string; scope: SavedViewScope }>();

  protected readonly showSaveForm = signal(false);
  protected readonly saveLabel = signal('');
  protected readonly saveScope = signal<SavedViewScope>('personal');

  /** Called externally by FiltersModalComponent (desktop only -- see its openSaveViewPopover)
   * with a suggested name computed from the draft, which this component has no access to. */
  openSaveForm(suggestedLabel: string): void {
    this.saveLabel.set(suggestedLabel);
    this.saveScope.set('personal');
    this.showSaveForm.set(true);
  }

  cancelSaveForm(): void {
    this.showSaveForm.set(false);
  }

  confirmSave(): void {
    const label = this.saveLabel().trim();
    if (!label) return;
    this.saveRequested.emit({ label, scope: this.saveScope() });
    this.showSaveForm.set(false);
    this.saveLabel.set('');
  }

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

  protected readonly warningMessage = signal<string | null>(null);
  protected readonly editingViewId = signal<string | null>(null);
  protected readonly renameDraft = signal('');

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
