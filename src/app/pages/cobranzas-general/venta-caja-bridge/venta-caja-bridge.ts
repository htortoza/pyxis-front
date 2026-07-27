import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LoadingSkeletonComponent } from '../../../components/shared/loading-skeleton/loading-skeleton';
import type { VentaCajaBridgeSegment } from '../../../data/utils/venta-caja-bridge.utils';
import { formatSignedAmount } from '../../../pipes/signed-amount';
import { CollectionsDataService } from '../../../services/collections-data.service';

/**
 * Puente Venta→Caja (spec §4.2, Task 5 SP2): descompone la venta bruta del periodo de EMISIÓN
 * seleccionado -- NO el corte activo (`cutoffDate`) -- en 4 destinos: Cobrado, Por vencer, Vencido
 * y Notas de crédito (negativo). Mejora #1 (aprobada): titular grande con el ratio Cobrado/Venta
 * del periodo + su propia variación vs. el periodo anterior, antes del desglose de 4 segmentos.
 *
 * Cada segmento es clickeable -> cross-filter con una dimensión propia (`bridge-<key>`, ver
 * `CollectionsDataService.setCrossFilter`) que el propio servicio sabe NO tratar como un filtro de
 * contraparte (ver el fix en `scopedCounterpartyIds` -- de lo contrario el clic vaciaría el scope
 * de toda la pantalla).
 */
@Component({
  selector: 'app-venta-caja-bridge',
  standalone: true,
  imports: [LoadingSkeletonComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './venta-caja-bridge.html',
  styleUrl: './venta-caja-bridge.css',
})
export class VentaCajaBridgeComponent {
  protected readonly collectionsData = inject(CollectionsDataService);

  protected readonly segments = computed(() => this.collectionsData.bridge().segments);

  /** Ratio Cobrado/Venta del periodo, redondeado para el titular (spec Mejora #1). */
  protected readonly collectedRatioPct = computed(() => {
    const collected = this.segments().find((segment) => segment.key === 'COLLECTED');
    return collected ? Math.round(collected.ratio * 100) : 0;
  });

  /** Variación del ratio Cobrado/Venta vs. la ventana de periodos anterior, en puntos
   * porcentuales -- `null` cuando no hay ventana anterior calculable (ver
   * `CollectionsDataService.bridgeCollectedRatioDelta`). */
  protected readonly ratioDeltaPp = computed(() => this.collectionsData.bridgeCollectedRatioDelta());

  /** Ancho de barra proporcional -- `segment.ratio` ya es siempre >= 0 (las 4 magnitudes, incluida
   * CREDIT_NOTE, son la magnitud económica real), así que no hace falta ningún `Math.abs()`. */
  protected barWidthPct(segment: VentaCajaBridgeSegment): number {
    return segment.ratio * 100;
  }

  /** El dato (`segment.amount`) es siempre >= 0, incluido CREDIT_NOTE -- pero el plan pide
   * mostrar las notas de crédito en formato negativo/rojo/paréntesis, así que el signo se aplica
   * acá, solo para presentación. */
  private displayAmountFor(segment: VentaCajaBridgeSegment): number {
    return segment.key === 'CREDIT_NOTE' ? -segment.amount : segment.amount;
  }

  protected formattedAmount(segment: VentaCajaBridgeSegment): string {
    return formatSignedAmount(this.displayAmountFor(segment)).text;
  }

  protected isActive(segment: VentaCajaBridgeSegment): boolean {
    const crossFilter = this.collectionsData.crossFilter();
    return crossFilter !== null && crossFilter.dimension === `bridge-${segment.key}`;
  }

  protected onSegmentClick(segment: VentaCajaBridgeSegment): void {
    this.collectionsData.setCrossFilter(`bridge-${segment.key}`, segment.key);
  }
}
