import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { Tooltip } from 'primeng/tooltip';

import { CollectionsFilterChipsSummaryComponent } from '../../components/shared/collections-filter-chips-summary/collections-filter-chips-summary';
import { CollectionsFiltersModalComponent } from '../../components/shared/collections-filters-modal/collections-filters-modal';
import { CollectionsFooterComponent } from '../../components/shared/collections-footer/collections-footer';
import { GlobalHeaderComponent, type GlobalHeaderTab } from '../../components/shared/global-header/global-header';
import { LoadingSkeletonComponent } from '../../components/shared/loading-skeleton/loading-skeleton';
import { CollectionsDataService } from '../../services/collections-data.service';
import { CollectionsDetailTreeTableComponent } from './collections-detail-tree-table/collections-detail-tree-table';
import { CollectionsDetailTreemapComponent } from './collections-detail-treemap/collections-detail-treemap';

type ViewMode = 'tabla' | 'mapa';

interface ViewModeOption {
  label: string;
  value: ViewMode;
}

const VIEW_MODE_OPTIONS: ViewModeOption[] = [
  { label: 'Tabla', value: 'tabla' },
  { label: 'Mapa', value: 'mapa' },
];

const HEADER_TABS: GlobalHeaderTab[] = [
  { label: 'Cobranzas General', route: '/cobranzas', exact: true },
  { label: 'Detalle de Cartera', route: '/cobranzas/cartera' },
];

/**
 * Composition root for "Detalle de Cartera" -- SP4 wires the dual Vista Tabla/Vista Mapa
 * (calca Detalle de Ventas' viewMode/p-selectButton pattern) on top of the SP1 shell
 * (filters, loading, footer). Both views read `CollectionsDataService.scopedDocuments()`
 * directly and derive their own tree/band internally (Task 1/2 utils are cheap over a
 * few hundred documents, no need to hoist that computation up here like Ventas does).
 */
@Component({
  selector: 'app-detalle-cartera',
  standalone: true,
  imports: [
    FormsModule,
    SelectButton,
    GlobalHeaderComponent,
    CollectionsFiltersModalComponent,
    CollectionsFilterChipsSummaryComponent,
    CollectionsFooterComponent,
    LoadingSkeletonComponent,
    CollectionsDetailTreeTableComponent,
    CollectionsDetailTreemapComponent,
    Button,
    Tooltip,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-cartera.html',
  styleUrl: './detalle-cartera.css',
})
export class DetalleCarteraComponent {
  protected readonly collectionsData = inject(CollectionsDataService);
  private readonly messageService = inject(MessageService);

  protected readonly headerTabs = HEADER_TABS;

  protected readonly viewModeOptions = VIEW_MODE_OPTIONS;
  protected readonly viewMode = signal<ViewMode>('tabla');
  protected readonly focusedCounterpartyId = signal<string | null>(null);

  protected onViewModeChange(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  /** CollectionsDataService.saveAsDefault() stays UI-agnostic -- the toast is this component's
   * own concern, fired right after the save actually happens. No `life` here -- the app-wide
   * <p-toast [life]> in app.html (4000ms) is the single source of truth for every toast's
   * auto-dismiss time. */
  onSaveAsDefault(): void {
    this.collectionsData.saveAsDefault();
    this.messageService.add({
      severity: 'success',
      summary: 'Vista guardada',
      detail: 'Esta será la vista que se cargue siempre que abras la página.',
    });
  }
}
