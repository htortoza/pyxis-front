import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';

import { SalesDataService } from '../../../services/sales-data.service';
import { TenantVocabularyService } from '../../../services/tenant-vocabulary.service';
import { LoadingSkeletonComponent } from '../../../components/shared/loading-skeleton/loading-skeleton';
import type { Period } from '../../../data/models/period.model';
import type { RankingDimension, RankingItem } from '../../../data/models/ranking.model';
import { RankingPanelComponent } from './ranking-panel/ranking-panel';

export interface RankingSortOption {
  label: string;
  value: string;
}

type RankingSortMode = 'amount' | 'quantity';

const SORT_OPTIONS: RankingSortOption[] = [
  { label: 'Por Monto', value: 'amount' },
  { label: 'Por Cantidad', value: 'quantity' },
];

@Component({
  selector: 'app-ranking-panels',
  standalone: true,
  imports: [Card, Select, FormsModule, LoadingSkeletonComponent, RankingPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ranking-panels.html',
  styleUrl: './ranking-panels.css',
})
export class RankingPanelsComponent {
  protected readonly salesData = inject(SalesDataService);
  protected readonly vocab = inject(TenantVocabularyService);

  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly sortMode = signal<RankingSortMode>('amount');

  /** "Julio 2026" para periodos mensuales; para Día/Semana el label del periodo ya trae su
   * propia fecha, así que se muestra tal cual sin repetir el año. Toma el periodo seleccionado
   * más reciente (por `order`) cuando hay varios -- ej. un trimestre muestra el último mes. */
  protected readonly periodSubtitle = computed(() => {
    const granularity = this.salesData.selectedPeriodGranularity();
    const selectedIds = new Set(this.salesData.selectedPeriodIds());
    const selected = this.salesData.periods().filter((period) => selectedIds.has(period.id));
    const latest = selected.reduce<Period | null>(
      (latest, period) => (!latest || period.order > latest.order ? period : latest),
      null,
    );
    if (!latest) return 'Top performers por categoría';
    const label = granularity === 'mes' ? `${latest.label} ${latest.year}` : latest.label;
    return `Top performers por categoría · ${label}`;
  });

  private sortedBy(items: RankingItem[]): RankingItem[] {
    const mode = this.sortMode();
    return [...items].sort((a, b) => b[mode] - a[mode]);
  }

  protected readonly sortedSectores = computed(() => this.sortedBy(this.salesData.rankings().sectores));
  protected readonly sortedMarcas = computed(() => this.sortedBy(this.salesData.rankings().marcas));
  protected readonly sortedTiendas = computed(() => this.sortedBy(this.salesData.rankings().tiendas));
  protected readonly sortedProductos = computed(() => this.sortedBy(this.salesData.rankings().productos));

  protected activeIdFor(dimension: RankingDimension): string | null {
    const crossFilter = this.salesData.crossFilter();
    return crossFilter && crossFilter.dimension === dimension ? crossFilter.id : null;
  }

  protected onSelect(dimension: RankingDimension, id: string): void {
    this.salesData.setCrossFilter(dimension, id);
  }

  protected onSortChange(value: string): void {
    this.sortMode.set(value as RankingSortMode);
  }
}
