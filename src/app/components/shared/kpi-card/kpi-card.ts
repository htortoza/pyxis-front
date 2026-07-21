import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, input, viewChild } from '@angular/core';
import { Card } from 'primeng/card';

import type { TrendPoint } from '../../../data/models/kpi.model';
import { MIN_TREND_POINTS } from '../../../data/utils/sales-fact.utils';
import { comparisonBand, cumplimientoBand } from '../../../pipes/signed-amount';

/** Fixed sparkline viewBox -- coordinates are computed as percentages of this, not real px. */
const SPARKLINE_VIEWBOX_WIDTH = 100;
const SPARKLINE_VIEWBOX_HEIGHT = 50;
/** Vertical inset so peaks/valleys never touch the very top/bottom edge. */
const SPARKLINE_Y_INSET = 6;

/** .kpi-value's normal size (matches the old fixed 1.375rem) and the floor it will shrink to
 * before giving up -- a holding-level peso total can run past mil millones, and the whole
 * point of shrink-to-fit is that it stays on one line, fully readable, at whatever size that
 * takes, rather than wrapping or truncating (see shrinkValueToFit below). */
const VALUE_BASE_FONT_PX = 22;
const VALUE_MIN_FONT_PX = 11;

interface Point {
  x: number;
  y: number;
}

/**
 * Catmull-Rom-to-cubic-Bezier smoothing -- turns straight polyline segments into a smooth curve
 * so the eye reads gradual trend evolution instead of a sharp, checkmark-like angle (the actual
 * bug this fixes: 2-3 raw points joined by straight lines render as a narrow "V" that looks like
 * a status icon, not a trend). Standard 1/6-tangent conversion; each original point is preserved
 * exactly, only the path between them is curved.
 */
function smoothPath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length < 3) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
  }

  let path = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return path;
}

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [Card],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCardComponent {
  private readonly valueEl = viewChild<ElementRef<HTMLElement>>('valueEl');

  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly deltaPct = input<number | null>(null);
  /** Contra qué se compara el delta (ej. "periodo anterior", "meta") -- las cards sin modo Meta propio siempre lo dejan en el default. */
  readonly comparisonLabel = input<string>('periodo anterior');
  /** true solo en las cards con modo Meta propio cuando el modo activo es 'meta' -- cambia a un semáforo graduado por % de cumplimiento en vez del semáforo por delta vs. periodo anterior. */
  readonly isMetaMode = input<boolean>(false);
  /** Candidate sparkline points from SalesDataService -- not yet threshold-checked (see trendState). */
  readonly trendPoints = input<TrendPoint[]>([]);

  /** Semaphore band (good/medium/bad) -- single source of truth for the delta text and the sparkline color. */
  readonly band = computed(() =>
    this.isMetaMode() ? cumplimientoBand(this.deltaPct()) : comparisonBand(this.deltaPct()),
  );
  readonly isPositive = computed(() => (this.deltaPct() ?? 0) >= 0);
  readonly deltaText = computed(() => {
    const pct = this.deltaPct();
    if (pct === null) return '';
    return `${Math.abs(pct).toFixed(1)}%`;
  });

  /**
   * Three states, per the product spec on insufficient-history handling:
   * - 'none': no previous period at all (deltaPct null) -- no badge, no sparkline, neutral copy.
   * - 'insufficient': a previous period exists (badge shows) but fewer than MIN_TREND_POINTS
   *   real data points are available -- sparkline area shows discreet copy instead of a line
   *   that would suggest a trend from just 1-2 points.
   * - 'chart': enough real points to draw a representative line.
   */
  readonly trendState = computed<'none' | 'insufficient' | 'chart'>(() => {
    if (this.deltaPct() === null) return 'none';
    return this.trendPoints().length >= MIN_TREND_POINTS ? 'chart' : 'insufficient';
  });

  private readonly sparklineValues = computed(() => this.trendPoints().map((point) => point.value));

  /** Raw coordinates scaled to the fixed viewBox, flat mid-line for constant data. */
  private readonly sparklineCoords = computed<Point[]>(() => {
    const values = this.sparklineValues();
    if (values.length === 0) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const plotHeight = SPARKLINE_VIEWBOX_HEIGHT - SPARKLINE_Y_INSET * 2;
    const lastIndex = Math.max(1, values.length - 1);

    return values.map((value, index) => {
      const x = (index / lastIndex) * SPARKLINE_VIEWBOX_WIDTH;
      const normalized = range === 0 ? 0.5 : (value - min) / range;
      const y = SPARKLINE_Y_INSET + (1 - normalized) * plotHeight;
      return { x, y };
    });
  });

  /** Smoothed SVG path ("M ... C ...") for the trend line. */
  readonly sparklineLinePath = computed(() => smoothPath(this.sparklineCoords()));

  /** Same smoothed curve closed down to the baseline -- the translucent area fill under the line. */
  readonly sparklineAreaPath = computed(() => {
    const coords = this.sparklineCoords();
    if (coords.length === 0) return '';
    const line = smoothPath(coords);
    const firstX = coords[0].x.toFixed(2);
    const lastX = coords[coords.length - 1].x.toFixed(2);
    return `${line} L ${lastX},${SPARKLINE_VIEWBOX_HEIGHT} L ${firstX},${SPARKLINE_VIEWBOX_HEIGHT} Z`;
  });

  readonly sparklineViewBox = `0 0 ${SPARKLINE_VIEWBOX_WIDTH} ${SPARKLINE_VIEWBOX_HEIGHT}`;

  /**
   * CSS alone can't make font-size react to content length (only to container size), and this
   * value must stay on one line, fully visible, never wrapped or ellipsized -- so it's fit
   * imperatively: start at the base size and step down until the (single-line, nowrap) text
   * stops overflowing its own box. Re-runs whenever the formatted value changes, and whenever
   * the card itself is resized (window resize, sidebar toggle, responsive column breakpoints).
   */
  constructor() {
    effect((onCleanup) => {
      const el = this.valueEl()?.nativeElement;
      this.value();
      if (!el) return;

      const fit = () => {
        let fontSize = VALUE_BASE_FONT_PX;
        el.style.fontSize = `${fontSize}px`;
        while (el.scrollWidth > el.clientWidth && fontSize > VALUE_MIN_FONT_PX) {
          fontSize -= 1;
          el.style.fontSize = `${fontSize}px`;
        }
      };

      fit();
      // Observes the parent (not el itself) so the fit's own font-size writes -- which change
      // el's height via the font-size-relative line-height -- can't feed back into a resize loop.
      const resizeObserver = new ResizeObserver(fit);
      resizeObserver.observe(el.parentElement!);
      onCleanup(() => resizeObserver.disconnect());
    });
  }
}
