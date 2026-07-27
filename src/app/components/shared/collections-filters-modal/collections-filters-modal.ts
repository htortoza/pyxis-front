import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { Message } from 'primeng/message';
import { Popover } from 'primeng/popover';
import { ToggleSwitch } from 'primeng/toggleswitch';

import type { ComparisonAlignment, ComparisonMode } from '../../../data/models/comparison.model';
import type { IvaMode } from '../../../data/models/iva.model';
import type { PeriodGranularity } from '../../../data/models/period.model';
import { COUNTERPARTIES } from '../../../data/mock/collections.mock';
import { CONTEXT_TREE, MARCAS, SECTORES } from '../../../data/mock/context-tree.mock';
import { PERIODS_BY_GRANULARITY } from '../../../data/mock/periods.mock';
import { buildCollectionsFilterTree, type CollectionsFilterNode } from '../../../data/utils/collections-filter-tree.utils';
import { CollectionsDataService } from '../../../services/collections-data.service';
import { CollectionsContextFilterComponent } from '../collections-context-filter/collections-context-filter';
import { ComparisonSelectorComponent } from '../comparison-selector/comparison-selector';
import { PeriodPickerComponent } from '../period-picker/period-picker';

const GRANULARITY_LABEL: Record<PeriodGranularity, string> = { dia: 'Día', semana: 'Semana', mes: 'Mes' };
const COMPARISON_MODE_LABEL: Record<ComparisonMode, string> = {
  periodo_anterior: 'Periodo Anterior',
  periodo_especifico: 'Periodo Específico',
  meta: 'Meta',
};

/** Same range `periods.mock.ts` builds its Día/Semana/Mes periods over -- the cutoff picker
 * shouldn't offer a date with no period data behind it. */
const CUTOFF_MIN_ISO = '2024-01-01';
const CUTOFF_MAX_ISO = '2026-12-31';

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
 * p-datepicker reads/writes plain JS `Date` objects using LOCAL getters/setters internally (the
 * calendar grid it renders is built from `.getFullYear()/.getMonth()/.getDate()`, not the UTC
 * equivalents) -- so the conversion here is deliberately LOCAL, not the UTC-based
 * `parseIsoDate`/`toIsoDate` pair in `date.utils.ts` (those serve period-arithmetic elsewhere,
 * where every date must stay anchored to a fixed UTC instant). Using the UTC pair here would
 * shift the displayed/selected day by one in any timezone behind UTC.
 */
function isoToLocalDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function localDateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Modal único de filtros de Cobranzas -- calca la estructura de `FiltersModalComponent` (draft
 * signals + un solo Aplicar/Cancelar), sin las piezas que Cobranzas no tiene todavía (Vistas
 * Guardadas / Accesos Rápidos viven en el header de página, no acá -- ver plan Task 8/9). Cuatro
 * disparadores en la fila superior en vez de tres: Período, **Fecha de corte** (nuevo -- fecha
 * única de stock, rotulada siempre "Saldo al [fecha]"), Comparación, IVA. El cuerpo es
 * `CollectionsContextFilterComponent` (4 columnas: Sector/Marca/Local/Contraparte).
 *
 * `draftCheckedIds` guarda ids del árbol de 4 columnas (`CollectionsFilterNode.id`) tal como los
 * tocó el usuario -- NO ids expandidos a hojas. `apply()` los separa en dos escrituras al
 * servicio recorriendo el árbol una sola vez: cualquier id cuyo nodo tenga `counterpartyId` (una
 * hoja de Contraparte) aporta ese `Counterparty.id` real a `setCounterpartyFilter`; todo el resto
 * (Sector/Marca/Local, o el nodo raíz "Sin asociación comercial") se pasa tal cual a
 * `setSectorMarcaLocalFilter` -- el propio servicio ya sabe expandir esos ids a las contrapartes
 * efectivas (`counterpartyIdsForNodeIds`/`getEffectiveLeafIds`), igual que hace con el cross-filter.
 *
 * `syncDraftFromApplied()` reconstruye `draftCheckedIds` así: `sectorMarcaLocalFilter` se copia
 * literal (esos ids nunca fueron ambiguos). Para `counterpartyFilter` (que guarda
 * `Counterparty.id` reales, no ids de nodo) se recorre el árbol y se marcan como checked TODOS
 * los nodos de Contraparte cuyo `counterpartyId` esté en el filtro aplicado -- una contraparte
 * puede colgar de varios Locales (`commercialNodeIds`), así que puede terminar con más de un nodo
 * marcado a la vez; eso es correcto (el filtro aplicado la incluye sin importar qué Local se esté
 * navegando) y el round-trip apply→open→apply es estable porque el split en `apply()` vuelve a
 * deduplicar por `counterpartyId` real, no por id de nodo.
 */
@Component({
  selector: 'app-collections-filters-modal',
  standalone: true,
  imports: [
    Button,
    DatePicker,
    Dialog,
    FormsModule,
    Message,
    Popover,
    PrimeTemplate,
    ToggleSwitch,
    CollectionsContextFilterComponent,
    ComparisonSelectorComponent,
    PeriodPickerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collections-filters-modal.html',
  styleUrl: './collections-filters-modal.css',
})
export class CollectionsFiltersModalComponent {
  private readonly collectionsData = inject(CollectionsDataService);

  /** Static mock data -- built once, never recomputed reactively. Same tree
   * CollectionsContextFilterComponent/CollectionsDataService build independently -- see doc
   * comment above for why apply()/syncDraftFromApplied() need their own copy to walk. */
  private readonly filterTree: CollectionsFilterNode[] = buildCollectionsFilterTree(
    CONTEXT_TREE,
    MARCAS,
    SECTORES,
    COUNTERPARTIES,
  );
  private readonly nodeById = new Map(this.filterTree.map((node) => [node.id, node]));

  protected readonly isOpen = signal(false);

  protected readonly draftCheckedIds = signal<Set<string>>(new Set());
  protected readonly draftCutoffDate = signal<string>(CUTOFF_MAX_ISO);
  protected readonly draftGranularity = signal<PeriodGranularity>('mes');
  protected readonly draftPeriodIds = signal<Set<string>>(new Set());
  protected readonly draftCompare = signal<boolean>(true);
  protected readonly draftComparisonMode = signal<ComparisonMode>('periodo_anterior');
  protected readonly draftComparisonAlignment = signal<ComparisonAlignment>('calendario');
  protected readonly draftExplicitComparisonPeriodIds = signal<Set<string>>(new Set());
  protected readonly draftIvaMode = signal<IvaMode>('con_iva');

  /** Período/Fecha de corte/Comparación se configuran en popovers propios, anclados a su botón
   * disparador -- cerrados por defecto cada vez que se abre el modal principal. IVA es un toggle
   * simple, sin popover. */
  private readonly periodPopover = viewChild<Popover>('periodPopoverEl');
  private readonly cutoffPopover = viewChild<Popover>('cutoffPopoverEl');
  private readonly comparisonPopover = viewChild<Popover>('comparisonPopoverEl');

  protected readonly periodSummary = computed(() => {
    const count = this.draftPeriodIds().size;
    const countLabel = count === 0 ? 'sin selección' : `${count} periodo${count === 1 ? '' : 's'}`;
    return `${GRANULARITY_LABEL[this.draftGranularity()]} · ${countLabel}`;
  });

  protected readonly cutoffSummary = computed(() => `Saldo al ${formatCutoffDate(this.draftCutoffDate())}`);

  protected readonly comparisonSummary = computed(() => COMPARISON_MODE_LABEL[this.draftComparisonMode()]);

  protected readonly ivaSummary = computed(() => (this.draftIvaMode() === 'con_iva' ? 'Con IVA' : 'Sin IVA'));

  /** p-datepicker bind surface -- see isoToLocalDate/localDateToIso doc comment above. */
  protected readonly cutoffDateValue = computed(() => isoToLocalDate(this.draftCutoffDate()));
  protected readonly cutoffMinDate = isoToLocalDate(CUTOFF_MIN_ISO);
  protected readonly cutoffMaxDate = isoToLocalDate(CUTOFF_MAX_ISO);

  /**
   * Regla de coherencia no negociable (spec §1.4/§3.3): la fecha de corte no puede quedar antes
   * del inicio del período elegido sin que el usuario lo sepa. Computed (no un signal seteado a
   * mano) para que se vea EN VIVO mientras se configura -- Período y Fecha de corte viven en
   * popovers separados, así que sin esto el usuario podría cerrar ambos sin darse cuenta del
   * desfase hasta después de Aplicar. Deliberadamente NO bloquea `apply()` -- "no calcula en
   * silencio" significa avisar visiblemente, no impedir la acción.
   */
  protected readonly coherenceWarning = computed<string | null>(() => {
    const periodIds = this.draftPeriodIds();
    if (periodIds.size === 0) return null;

    const periods = PERIODS_BY_GRANULARITY[this.draftGranularity()].filter((period) => periodIds.has(period.id));
    if (periods.length === 0) return null;

    const earliestStart = periods.reduce(
      (min, period) => (period.startDate < min ? period.startDate : min),
      periods[0].startDate,
    );
    const cutoff = this.draftCutoffDate();
    if (cutoff >= earliestStart) return null;

    return `La fecha de corte (${formatCutoffDate(cutoff)}) es anterior al inicio del período seleccionado (${formatCutoffDate(earliestStart)}) -- el saldo no cubrirá todo el período.`;
  });

  open(): void {
    this.syncDraftFromApplied();
    this.periodPopover()?.hide();
    this.cutoffPopover()?.hide();
    this.comparisonPopover()?.hide();
    this.isOpen.set(true);
  }

  private syncDraftFromApplied(): void {
    this.draftCutoffDate.set(this.collectionsData.cutoffDate());
    this.draftGranularity.set(this.collectionsData.selectedPeriodGranularity());
    this.draftPeriodIds.set(new Set(this.collectionsData.selectedPeriodIds()));
    this.draftCompare.set(this.collectionsData.compareToPrevious());
    this.draftComparisonMode.set(this.collectionsData.comparisonMode());
    this.draftComparisonAlignment.set(this.collectionsData.comparisonAlignment());
    this.draftExplicitComparisonPeriodIds.set(
      new Set(this.collectionsData.explicitComparisonPeriodIds() ?? []),
    );
    this.draftIvaMode.set(this.collectionsData.ivaMode());
    this.draftCheckedIds.set(this.checkedIdsFromApplied());
  }

  /** See class doc comment for why Contraparte round-trips by re-marking every node that shares
   * the applied `counterpartyId`, while Sector/Marca/Local round-trip literally. */
  private checkedIdsFromApplied(): Set<string> {
    const ids = new Set<string>(this.collectionsData.sectorMarcaLocalFilter() ?? []);

    const appliedCounterpartyIds = this.collectionsData.counterpartyFilter();
    if (appliedCounterpartyIds && appliedCounterpartyIds.length > 0) {
      const wanted = new Set(appliedCounterpartyIds);
      for (const node of this.filterTree) {
        if (node.counterpartyId && wanted.has(node.counterpartyId)) {
          ids.add(node.id);
        }
      }
    }

    return ids;
  }

  onCutoffDateChange(date: Date | null): void {
    if (!date) return;
    this.draftCutoffDate.set(localDateToIso(date));
  }

  apply(): void {
    const counterpartyIds = new Set<string>();
    const sectorMarcaLocalIds = new Set<string>();
    for (const id of this.draftCheckedIds()) {
      const counterpartyId = this.nodeById.get(id)?.counterpartyId;
      if (counterpartyId) {
        counterpartyIds.add(counterpartyId);
      } else {
        sectorMarcaLocalIds.add(id);
      }
    }
    this.collectionsData.setCounterpartyFilter(counterpartyIds.size > 0 ? [...counterpartyIds] : null);
    this.collectionsData.setSectorMarcaLocalFilter(
      sectorMarcaLocalIds.size > 0 ? [...sectorMarcaLocalIds] : null,
    );

    this.collectionsData.cutoffDate.set(this.draftCutoffDate());
    this.collectionsData.selectedPeriodGranularity.set(this.draftGranularity());
    this.collectionsData.selectedPeriodIds.set([...this.draftPeriodIds()]);
    this.collectionsData.compareToPrevious.set(this.draftCompare());
    this.collectionsData.comparisonMode.set(this.draftComparisonMode());
    this.collectionsData.comparisonAlignment.set(this.draftComparisonAlignment());
    this.collectionsData.explicitComparisonPeriodIds.set(
      this.draftComparisonMode() === 'periodo_especifico'
        ? [...this.draftExplicitComparisonPeriodIds()]
        : null,
    );
    this.collectionsData.ivaMode.set(this.draftIvaMode());

    this.isOpen.set(false);
  }

  cancel(): void {
    this.isOpen.set(false);
  }
}
