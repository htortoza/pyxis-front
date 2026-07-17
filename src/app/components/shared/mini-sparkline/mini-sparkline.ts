import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface SparklinePoint {
  label: string;
  value: number;
}

/** App's primary color (#182bcd, app.config.ts) -- an inline SVG stroke needs a literal color,
 * not a var(--p-*) token, same accepted exception as hourly-bar-chart.ts's own palette. */
const SPARKLINE_COLOR = '#182bcd';

const VIEWBOX_WIDTH = 52;
const VIEWBOX_HEIGHT = 24;
const PADDING = 2;

/**
 * A tiny, chrome-free trend line (no axes/legend/tooltip/animation) for embedding inline --
 * e.g. one per Detalle de Ventas row, showing that row's amount across the selected periods.
 * Plain inline SVG, not Chart.js/p-chart: Chart.js's `responsive: true` canvas has no
 * intrinsic size of its own and only settles to its real pixel size after a post-mount
 * ResizeObserver tick, which reads as a visible "pop" once dozens of these mount/unmount
 * together on a route change (confirmed cause of a flicker regression). SVG lays out
 * synchronously with the rest of the DOM, so there's nothing to pop.
 */
@Component({
  selector: 'app-mini-sparkline',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mini-sparkline.html',
  styleUrl: './mini-sparkline.css',
})
export class MiniSparklineComponent {
  readonly points = input.required<SparklinePoint[]>();

  protected readonly color = SPARKLINE_COLOR;
  protected readonly viewBox = `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`;

  protected readonly polylinePoints = computed(() => {
    const values = this.points().map((point) => point.value);
    if (values.length === 0) {
      return '';
    }
    if (values.length === 1) {
      const y = VIEWBOX_HEIGHT / 2;
      return `${PADDING},${y} ${VIEWBOX_WIDTH - PADDING},${y}`;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const stepX = (VIEWBOX_WIDTH - PADDING * 2) / (values.length - 1);

    return values
      .map((value, index) => {
        const x = PADDING + index * stepX;
        const y = VIEWBOX_HEIGHT - PADDING - ((value - min) / range) * (VIEWBOX_HEIGHT - PADDING * 2);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  });
}
