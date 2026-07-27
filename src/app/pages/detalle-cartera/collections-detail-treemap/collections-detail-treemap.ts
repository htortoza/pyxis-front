import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Dialog } from 'primeng/dialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Tooltip } from 'primeng/tooltip';

import { COUNTERPARTIES } from '../../../data/mock/collections.mock';
import type { ReceivableDocument } from '../../../data/models/collections.model';
import {
  buildCollectionsTreemapBand,
  type CollectionsTreemapBlock,
  type CollectionsTreemapEntry,
  type CollectionsTreemapLongTailBlock,
} from '../../../data/utils/collections-detail-treemap.utils';
import { squarify, type TreemapRect } from '../../../data/utils/sales-detail-treemap.utils';
import { formatSignedAmount } from '../../../pipes/signed-amount';
import { CollectionsDataService } from '../../../services/collections-data.service';
import { LoadingSkeletonComponent } from '../../../components/shared/loading-skeleton/loading-skeleton';

export interface LaidOutEntry {
  entry: CollectionsTreemapEntry;
  rect: TreemapRect;
}

/** Abstract 100x100 unit square -- mismo mecanismo que sales-detail-treemap.ts's LAYOUT_CONTAINER
 * (los rects de squarify salen en porcentajes, renderizados vía CSS left/top/width/height,
 * independiente del tamaño en píxeles real de la banda). */
const LAYOUT_CONTAINER: TreemapRect = { x: 0, y: 0, width: 100, height: 100 };

/** Mismo gutter fijo en píxeles entre tiles que Ventas -- las tiles posicionadas absolute no
 * participan de flex/grid gap. */
const TILE_GUTTER_PX = 3;

function layoutBand(band: CollectionsTreemapEntry[]): LaidOutEntry[] {
  const values = band.map((entry) => Math.max(entry.saldo, 1));
  const rects = squarify(values, LAYOUT_CONTAINER);
  return band.map((entry, index) => ({ entry, rect: rects[index] }));
}

/** Rojo/coral de Aura (red.600) -- mismo RGB literal que TREND_DOWN_RGB de sales-detail-treemap.ts,
 * a propósito, para que la paleta se sienta consistente entre módulos aunque el SIGNIFICADO
 * difiera acá: no es "tendencia negativa", es intensidad de mora (spec §5.1: "color semántico
 * según días de mora"). Deliberadamente UNA sola paleta, no verde-a-rojo -- 0 días de mora no es
 * "bueno" en el sentido de una tendencia, es simplemente riesgo bajo/neutro. */
const MORA_RGB = '220, 38, 38';
/** Slate neutro para el bloque de long-tail -- mismo tono que TREND_FLAT_RGB de Ventas. */
const LONG_TAIL_RGB = '148, 163, 184';

/** A partir de este umbral de mora ponderada (días) la intensidad de color satura al máximo;
 * por debajo escala linealmente. Valor ajustable a criterio del implementador, documentado acá
 * en vez de quedar como un número mágico oculto en la fórmula. */
const MORA_MAX_DAYS = 90;

/** Intensidad 0-1 según `avgDaysOverdueWeighted`, mapeada a una rgba() sobre MORA_RGB -- el alpha
 * final varía entre 0.12 (mora mínima, casi transparente) y 0.80 (mora máxima, rojo saturado). */
function moraBackground(entry: CollectionsTreemapBlock): string {
  const intensity = Math.min(1, Math.max(0, entry.avgDaysOverdueWeighted / MORA_MAX_DAYS));
  return `rgba(${MORA_RGB}, ${(0.12 + intensity * 0.68).toFixed(2)})`;
}

/**
 * Vista Mapa de Detalle de Cartera: UNA sola banda (todas las contrapartes a la vez, spec §5.1),
 * a diferencia de las 3 bandas apiladas con drill-down de Detalle de Ventas -- no hay "banda
 * hija" a la que bajar, así que no hay foco emitido al pasar el mouse ni al hacer clic en un
 * bloque normal ("hover sin clic"). El color codifica intensidad de mora (`avgDaysOverdueWeighted`),
 * no tendencia. El bloque de long-tail sigue siendo clickeable -- abre un diálogo buscable, y
 * clickear un item ahí adentro sí emite `counterpartyFocused` (útil si el usuario después cambia
 * a Vista Tabla).
 */
@Component({
  selector: 'app-collections-detail-treemap',
  standalone: true,
  imports: [FormsModule, Dialog, IconField, InputIcon, InputText, Tooltip, LoadingSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collections-detail-treemap.html',
  styleUrl: './collections-detail-treemap.css',
})
export class CollectionsDetailTreemapComponent {
  private readonly collectionsData = inject(CollectionsDataService);

  readonly documents = input.required<ReceivableDocument[]>();
  readonly focusedCounterpartyId = input<string | null>(null);
  readonly counterpartyFocused = output<string>();

  protected readonly loading = this.collectionsData.loading;

  protected readonly longTailDialog = signal<CollectionsTreemapLongTailBlock | null>(null);
  protected readonly longTailSearch = signal('');

  protected readonly band = computed<CollectionsTreemapEntry[]>(() =>
    buildCollectionsTreemapBand(this.documents(), COUNTERPARTIES),
  );

  protected readonly layout = computed(() => layoutBand(this.band()));

  protected readonly longTailFilteredItems = computed<CollectionsTreemapBlock[]>(() => {
    const dialog = this.longTailDialog();
    if (!dialog) return [];
    const query = this.longTailSearch().trim().toLowerCase();
    if (!query) return dialog.items;
    return dialog.items.filter((item) => item.label.toLowerCase().includes(query));
  });

  protected openLongTail(block: CollectionsTreemapLongTailBlock): void {
    this.longTailDialog.set(block);
    this.longTailSearch.set('');
  }

  protected closeLongTail(): void {
    this.longTailDialog.set(null);
  }

  /** Único punto del componente que emite `counterpartyFocused` -- un clic dentro del diálogo de
   * long-tail, nunca un hover ni un clic sobre un bloque normal de la banda (spec: "hover sin
   * clic", sin drill-down al que bajar). */
  protected onLongTailItemClick(item: CollectionsTreemapBlock): void {
    this.counterpartyFocused.emit(item.id);
  }

  /** `focusedCounterpartyId` puede traer un id que no existe en la banda actual (filtrado, o
   * escondido dentro del long-tail) -- simplemente no resalta nada, sin lanzar excepciones. */
  protected isFocused(entry: CollectionsTreemapEntry): boolean {
    return !entry.isLongTail && entry.id === this.focusedCounterpartyId();
  }

  protected blockStyle(entry: CollectionsTreemapEntry, rect: TreemapRect): Record<string, string> {
    return {
      position: 'absolute',
      left: `calc(${rect.x}% + ${TILE_GUTTER_PX}px)`,
      top: `calc(${rect.y}% + ${TILE_GUTTER_PX}px)`,
      width: `calc(${rect.width}% - ${TILE_GUTTER_PX * 2}px)`,
      height: `calc(${rect.height}% - ${TILE_GUTTER_PX * 2}px)`,
      'background-color': entry.isLongTail ? `rgba(${LONG_TAIL_RGB}, 0.22)` : moraBackground(entry),
    };
  }

  /** Una línea, separada por "·" -- mismo convenio de tooltip que sales-detail-treemap.ts. */
  protected blockTooltip(entry: CollectionsTreemapEntry): string {
    const sharePct = entry.sharePct.toFixed(1);
    if (entry.isLongTail) {
      return `${entry.label} · ${formatSignedAmount(entry.saldo).text} · ${sharePct}% de la cartera`;
    }
    const moraDays = Math.round(entry.avgDaysOverdueWeighted);
    return `${entry.label} · ${formatSignedAmount(entry.saldo).text} · ${sharePct}% de la cartera · ${moraDays} días de mora prom.`;
  }

  protected moraLabel(entry: CollectionsTreemapBlock): string {
    return `${Math.round(entry.avgDaysOverdueWeighted)} días de mora`;
  }

  protected formattedAmount(value: number): string {
    return formatSignedAmount(value).text;
  }
}
