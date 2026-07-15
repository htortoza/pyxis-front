import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';
import { Tooltip } from 'primeng/tooltip';

import type { RankingDimension, RankingItem } from '../../../../data/models/ranking.model';
import { formatSignedAmount } from '../../../../pipes/signed-amount';

export interface RankingSortOption {
  label: string;
  value: string;
}

const VISIBLE_STEP = 10;
const INITIAL_VISIBLE = 5;

/** How much `bigger` is above `reference`, as a percentage of `reference`. */
function pctAbove(bigger: number, reference: number): number {
  return reference === 0 ? 0 : ((bigger - reference) / reference) * 100;
}

@Component({
  selector: 'app-ranking-panel',
  standalone: true,
  imports: [Card, Select, FormsModule, Tooltip],
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

  protected readonly visibleItems = computed(() => this.items().slice(0, this.visibleCount()));
  protected readonly hasMore = computed(() => this.items().length > this.visibleCount());

  protected formattedAmount(item: RankingItem): string {
    return formatSignedAmount(item.amount).text;
  }

  /**
   * "Vendió X% menos que <arriba>" / "X% más que <abajo>", relative to the item's neighbors
   * in the FULL ranking (not just the currently visible slice, so the last visible row still
   * compares correctly against the next hidden one). Empty string when there's no neighbor to
   * compare against (a single-item ranking, or a tie at 0).
   */
  protected comparisonTooltip(item: RankingItem): string {
    const all = this.items();
    const index = all.findIndex((candidate) => candidate.id === item.id);
    if (index === -1) return '';

    const above = index > 0 ? all[index - 1] : null;
    const below = index < all.length - 1 ? all[index + 1] : null;

    const parts: string[] = [];
    if (above) {
      parts.push(`${pctAbove(above.amount, item.amount).toFixed(1)}% menos que ${above.label}`);
    }
    if (below) {
      parts.push(`${pctAbove(item.amount, below.amount).toFixed(1)}% más que ${below.label}`);
    }
    if (parts.length === 0) return '';
    // No trailing period -- store labels are sometimes already-abbreviated with their own
    // (e.g. "Parque A."), which would otherwise read as a jarring double "..".
    return `Vendió ${parts.join(' y ')}`;
  }

  protected showMore(): void {
    this.visibleCount.update((count) => count + VISIBLE_STEP);
  }

  protected onSortChange(value: string): void {
    this.sortChanged.emit(value);
  }
}
