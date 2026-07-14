import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';

import type { RankingDimension, RankingItem } from '../../../../data/models/ranking.model';
import { formatSignedAmount } from '../../../../pipes/signed-amount';

export interface RankingSortOption {
  label: string;
  value: string;
}

const VISIBLE_STEP = 10;
const INITIAL_VISIBLE = 5;

@Component({
  selector: 'app-ranking-panel',
  standalone: true,
  imports: [Card, Select, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ranking-panel.html',
  styleUrl: './ranking-panel.css',
})
export class RankingPanelComponent {
  readonly title = input.required<string>();
  readonly items = input.required<RankingItem[]>();
  readonly dimension = input.required<RankingDimension>();
  readonly activeId = input<string | null>(null);
  readonly sortOptions = input<RankingSortOption[] | null>(null);
  readonly sortValue = input<string | null>(null);

  readonly itemSelected = output<string>();
  readonly sortChanged = output<string>();

  protected readonly visibleCount = signal(INITIAL_VISIBLE);

  protected readonly maxAmount = computed(() => Math.max(1, ...this.items().map((item) => item.amount)));
  protected readonly visibleItems = computed(() => this.items().slice(0, this.visibleCount()));
  protected readonly hasMore = computed(() => this.items().length > this.visibleCount());

  protected barWidth(item: RankingItem): number {
    return (item.amount / this.maxAmount()) * 100;
  }

  protected formattedAmount(item: RankingItem): string {
    return formatSignedAmount(item.amount).text;
  }

  protected showMore(): void {
    this.visibleCount.update((count) => count + VISIBLE_STEP);
  }

  protected onSortChange(value: string): void {
    this.sortChanged.emit(value);
  }
}
