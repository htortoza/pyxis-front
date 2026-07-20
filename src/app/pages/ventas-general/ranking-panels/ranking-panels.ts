import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { SalesDataService } from '../../../services/sales-data.service';
import { TenantVocabularyService } from '../../../services/tenant-vocabulary.service';
import { LoadingSkeletonComponent } from '../../../components/shared/loading-skeleton/loading-skeleton';
import type { RankingDimension, RankingItem } from '../../../data/models/ranking.model';
import { RankingPanelComponent, type RankingSortOption } from './ranking-panel/ranking-panel';

type ProductSortMode = 'amount' | 'quantity';

const PRODUCT_SORT_OPTIONS: RankingSortOption[] = [
  { label: 'Por Monto', value: 'amount' },
  { label: 'Por Cantidad', value: 'quantity' },
];

@Component({
  selector: 'app-ranking-panels',
  standalone: true,
  imports: [LoadingSkeletonComponent, RankingPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ranking-panels.html',
  styleUrl: './ranking-panels.css',
})
export class RankingPanelsComponent {
  protected readonly salesData = inject(SalesDataService);
  protected readonly vocab = inject(TenantVocabularyService);

  protected readonly productSortOptions = PRODUCT_SORT_OPTIONS;
  protected readonly productSortMode = signal<ProductSortMode>('amount');

  protected readonly sortedProductos = computed(() => {
    const mode = this.productSortMode();
    return [...this.salesData.rankings().productos].sort((a, b) => b[mode] - a[mode]);
  });

  protected activeIdFor(dimension: RankingDimension): string | null {
    const crossFilter = this.salesData.crossFilter();
    return crossFilter && crossFilter.dimension === dimension ? crossFilter.id : null;
  }

  protected onSelect(dimension: RankingDimension, id: string): void {
    this.salesData.setCrossFilter(dimension, id);
  }

  protected onProductSort(value: string): void {
    this.productSortMode.set(value as ProductSortMode);
  }
}
