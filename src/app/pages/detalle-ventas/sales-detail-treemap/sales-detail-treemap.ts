import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';

import type { Period } from '../../../data/models/period.model';
import type { DetailTreeNode } from '../../../data/utils/sales-detail-tree.utils';
import {
  buildTreemapBand,
  findChildByKey,
  squarify,
  type TreemapBlock,
  type TreemapEntry,
  type TreemapLongTailBlock,
  type TreemapRect,
} from '../../../data/utils/sales-detail-treemap.utils';
import { formatSignedAmount } from '../../../pipes/signed-amount';

export interface LaidOutEntry {
  entry: TreemapEntry;
  rect: TreemapRect;
}

/** Abstract 100x100 unit square -- rects come out as percentages, rendered via CSS
 * `left/top/width/height`, independent of the band's actual pixel size. */
const LAYOUT_CONTAINER: TreemapRect = { x: 0, y: 0, width: 100, height: 100 };

/** Small fixed-pixel gutter between tiles, applied via calc() on the percentage-based rect
 * rather than a `gap` (absolutely-positioned tiles don't participate in flex/grid gap). */
const TILE_GUTTER_PX = 3;

function layoutBand(band: TreemapEntry[]): LaidOutEntry[] {
  const values = band.map((entry) => Math.max(entry.consolidadoTotal, 1));
  const rects = squarify(values, LAYOUT_CONTAINER);
  return band.map((entry, index) => ({ entry, rect: rects[index] }));
}

/** Aura's green.600/red.600, as raw RGB -- same "need a literal color, not a token" exception
 * as sales-heatmap.ts's HEAT_COLOR_RGB (rgba() alpha must vary independently per block, and
 * PrimeNG's --p-* tokens are stored as hex, not decomposable r,g,b triplets). Values copied
 * directly from Aura's primitive scale so this matches the app's real green/red, not a guess. */
const TREND_UP_RGB = '22, 163, 74';
const TREND_DOWN_RGB = '220, 38, 38';
const TREND_FLAT_RGB = '148, 163, 184';

function trendBackground(entry: TreemapBlock): string {
  if (entry.trend === 'flat') {
    return `rgba(${TREND_FLAT_RGB}, 0.3)`;
  }
  const rgb = entry.trend === 'up' ? TREND_UP_RGB : TREND_DOWN_RGB;
  const alpha = 0.22 + entry.trendIntensity * 0.58;
  return `rgba(${rgb}, ${alpha.toFixed(2)})`;
}

/**
 * Vista Mapa: three always-visible stacked bands (Familia / Subfamilia / Artículo). Each band
 * is a real 2D squarified treemap (see sales-detail-treemap.utils.ts's `squarify`) filling its
 * whole allotted rectangle -- an earlier single-row "proportional width only" layout left most
 * of a band's vertical space empty while still cramming many blocks into one thin strip.
 * Clicking a block in a band only updates the band below it; the long-tail "+N más" block opens
 * a searchable list instead of ever being a dead end.
 */
@Component({
  selector: 'app-sales-detail-treemap',
  standalone: true,
  imports: [FormsModule, Dialog, IconField, InputIcon, InputText, Tooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sales-detail-treemap.html',
  styleUrl: './sales-detail-treemap.css',
})
export class SalesDetailTreemapComponent {
  readonly tree = input.required<DetailTreeNode[]>();
  readonly periods = input.required<Period[]>();
  readonly selectedPeriodIds = input.required<string[]>();
  readonly focusedFamiliaId = input<string | null>(null);
  readonly focusedSubfamiliaId = input<string | null>(null);

  readonly familiaFocused = output<string>();
  readonly subfamiliaFocused = output<string>();

  protected readonly longTailDialog = signal<TreemapLongTailBlock | null>(null);
  protected readonly longTailSearch = signal('');

  protected readonly familiaBand = computed<TreemapEntry[]>(() =>
    buildTreemapBand(this.tree(), this.selectedPeriodIds(), this.periods()),
  );

  /** Falls back to the band's biggest real entry whenever the requested focus id is absent
   * (first load, or the previously-focused node no longer exists after a filter change). */
  private readonly effectiveFamiliaId = computed(() =>
    resolveFocusedId(this.familiaBand(), this.focusedFamiliaId()),
  );

  protected readonly focusedFamiliaNode = computed<DetailTreeNode | null>(() =>
    findChildByKey(this.tree(), this.effectiveFamiliaId()),
  );

  protected readonly subfamiliaBand = computed<TreemapEntry[]>(() => {
    const children = this.focusedFamiliaNode()?.children;
    if (!children) return [];
    return buildTreemapBand(children, this.selectedPeriodIds(), this.periods());
  });

  private readonly effectiveSubfamiliaId = computed(() =>
    resolveFocusedId(this.subfamiliaBand(), this.focusedSubfamiliaId()),
  );

  protected readonly focusedSubfamiliaNode = computed<DetailTreeNode | null>(() => {
    const children = this.focusedFamiliaNode()?.children;
    const subId = this.effectiveSubfamiliaId();
    if (!children || !subId) return null;
    return findChildByKey(children, subId);
  });

  protected readonly articuloBand = computed<TreemapEntry[]>(() => {
    const children = this.focusedSubfamiliaNode()?.children;
    if (!children) return [];
    return buildTreemapBand(children, this.selectedPeriodIds(), this.periods());
  });

  protected readonly familiaLayout = computed(() => layoutBand(this.familiaBand()));
  protected readonly subfamiliaLayout = computed(() => layoutBand(this.subfamiliaBand()));
  protected readonly articuloLayout = computed(() => layoutBand(this.articuloBand()));

  protected readonly longTailFilteredItems = computed<TreemapBlock[]>(() => {
    const dialog = this.longTailDialog();
    if (!dialog) return [];
    const query = this.longTailSearch().trim().toLowerCase();
    if (!query) return dialog.items;
    return dialog.items.filter((item) => item.label.toLowerCase().includes(query));
  });

  constructor() {
    // Keeps the parent's shared focus state (read by Vista Tabla too) in sync with whichever
    // node this band actually ends up resolving to -- both on user clicks and on the initial
    // "no focus yet, pick the biggest" fallback above.
    effect(() => {
      const id = this.effectiveFamiliaId();
      if (id) this.familiaFocused.emit(id);
    });
    effect(() => {
      const id = this.effectiveSubfamiliaId();
      if (id) this.subfamiliaFocused.emit(id);
    });
  }

  protected onFamiliaBlockClick(entry: TreemapEntry): void {
    if (entry.isLongTail) {
      this.openLongTail(entry);
      return;
    }
    this.familiaFocused.emit(entry.id);
  }

  protected onSubfamiliaBlockClick(entry: TreemapEntry): void {
    if (entry.isLongTail) {
      this.openLongTail(entry);
      return;
    }
    this.subfamiliaFocused.emit(entry.id);
  }

  protected openLongTail(block: TreemapLongTailBlock): void {
    this.longTailDialog.set(block);
    this.longTailSearch.set('');
  }

  protected closeLongTail(): void {
    this.longTailDialog.set(null);
  }

  protected blockStyle(entry: TreemapEntry, rect: TreemapRect): Record<string, string> {
    return {
      position: 'absolute',
      left: `calc(${rect.x}% + ${TILE_GUTTER_PX}px)`,
      top: `calc(${rect.y}% + ${TILE_GUTTER_PX}px)`,
      width: `calc(${rect.width}% - ${TILE_GUTTER_PX * 2}px)`,
      height: `calc(${rect.height}% - ${TILE_GUTTER_PX * 2}px)`,
      'background-color': entry.isLongTail ? `rgba(${TREND_FLAT_RGB}, 0.22)` : trendBackground(entry),
    };
  }

  /** One line, "·"-separated -- the tooltip token (app.config.ts) doesn't force a specific
   * white-space handling for embedded newlines, so this follows ranking-panel's own tooltip
   * convention (a single wrapping sentence) rather than relying on literal line breaks. */
  protected blockTooltip(entry: TreemapEntry): string {
    if (entry.isLongTail) {
      return `${entry.label} · ${formatSignedAmount(entry.consolidadoTotal).text}`;
    }
    const parts = entry.periodPoints.map((point) => `${point.label} ${formatSignedAmount(point.total).text}`);
    parts.push(`Consolidado ${formatSignedAmount(entry.consolidadoTotal).text}`);
    return `${entry.label} · ${parts.join(' · ')}`;
  }

  protected formattedAmount(value: number): string {
    return formatSignedAmount(value).text;
  }
}

function resolveFocusedId(band: TreemapEntry[], requested: string | null): string | null {
  if (requested && band.some((entry) => !entry.isLongTail && entry.id === requested)) {
    return requested;
  }
  const firstReal = band.find((entry): entry is TreemapBlock => !entry.isLongTail);
  return firstReal ? firstReal.id : null;
}
