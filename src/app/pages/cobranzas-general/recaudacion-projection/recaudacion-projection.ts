import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { Tooltip } from 'primeng/tooltip';

import { LoadingSkeletonComponent } from '../../../components/shared/loading-skeleton/loading-skeleton';
import { COUNTERPARTY_BEHAVIORS } from '../../../data/mock/collections.mock';
import type { ProjectionBucket, ProjectionGranularity } from '../../../data/utils/collections-projection.utils';
import { buildRecaudacionProjection } from '../../../data/utils/collections-projection.utils';
import { formatSignedAmount } from '../../../pipes/signed-amount';
import { CollectionsDataService } from '../../../services/collections-data.service';

type HorizonMode = '13_semanas' | '6_meses';

interface HorizonOption {
  label: string;
  value: HorizonMode;
}

const HORIZON_OPTIONS: HorizonOption[] = [
  { label: '13 semanas', value: '13_semanas' },
  { label: '6 meses', value: '6_meses' },
];

/**
 * Titular de brecha (mejora #2, Task 3 del plan SP3
 * `docs/superpowers/plans/2026-07-28-cobranzas-3-general-parte-inteligente.md`). Comparación
 * bucket-a-bucket de cuándo la suma acumulada de cada serie alcanza el 50% del total contractual
 * proyectado -- ver el JSDoc de `buildGapHeadline` para el algoritmo exacto.
 */
interface GapHeadline {
  /** Diferencia en cantidad de buckets entre cuándo `adjusted` acumulado alcanza el 50% del total
   * contractual y cuándo `contractual` acumulado lo alcanza. Positivo = la caja real se corre
   * respecto a lo pactado; 0 o negativo = la caja real llega igual de rápido o más rápido. Cuando
   * `isOutOfHorizon` es `true`, este número es solo una COTA INFERIOR (la brecha real podría ser
   * mayor, fuera del horizonte visible). */
  gapBuckets: number;
  /** Diferencia entre `contractual` y `adjusted` acumulados EN el bucket donde `contractual`
   * alcanza el 50% del total -- el "~$X" del titular. Siempre calculable, incluso si
   * `isOutOfHorizon` es `true`. */
  gapAmount: number;
  /** `true` cuando la serie `adjusted` acumulada NUNCA alcanza el 50% del total contractual dentro
   * del horizonte visible -- el número exacto de brecha no es calculable, se muestra como cota
   * inferior ("más de ~N"). */
  isOutOfHorizon: boolean;
  unitSingular: string;
  unitPlural: string;
}

/**
 * Algoritmo del titular de brecha, tal como lo especifica Task 3 (mejora #2, no opcional) del plan
 * SP3:
 * 1. `totalContractual` = suma de `contractual` de todos los buckets.
 * 2. `contractualHalfIndex` = primer índice donde la suma ACUMULADA de `contractual` alcanza o
 *    supera `totalContractual * 0.5`.
 * 3. `adjustedHalfIndex` = primer índice donde la suma ACUMULADA de `adjusted` alcanza o supera ESE
 *    MISMO umbral (basado en el total contractual, no en el total ajustado). Si `adjusted`
 *    acumulado nunca lo alcanza dentro del horizonte, se usa el último bucket como fallback y se
 *    marca `isOutOfHorizon` -- la brecha se muestra como cota inferior, nunca como número exacto
 *    inventado.
 * 4. `gapBuckets = adjustedHalfIndex - contractualHalfIndex` (puede ser <= 0 si el comportamiento
 *    real es más rápido que lo pactado -- nunca se fuerza un número negativo en el texto, ver
 *    template).
 * 5. `gapAmount` = diferencia entre `contractual` y `adjusted` acumulados EN `contractualHalfIndex`
 *    (las 2 curvas acumuladas en el mismo punto de referencia) -- independiente de si el paso 3
 *    cayó en fallback, siempre calculable.
 */
function buildGapHeadline(buckets: ProjectionBucket[], granularity: ProjectionGranularity): GapHeadline {
  const totalContractual = buckets.reduce((sum, bucket) => sum + bucket.contractual, 0);
  const threshold = totalContractual * 0.5;

  let contractualHalfIndex = buckets.length - 1;
  let cumulativeContractual = 0;
  for (let i = 0; i < buckets.length; i++) {
    cumulativeContractual += buckets[i].contractual;
    if (cumulativeContractual >= threshold) {
      contractualHalfIndex = i;
      break;
    }
  }

  let adjustedHalfIndex = buckets.length - 1;
  let isOutOfHorizon = true;
  let cumulativeAdjusted = 0;
  for (let i = 0; i < buckets.length; i++) {
    cumulativeAdjusted += buckets[i].adjusted;
    if (cumulativeAdjusted >= threshold) {
      adjustedHalfIndex = i;
      isOutOfHorizon = false;
      break;
    }
  }

  let contractualAccumAtRef = 0;
  let adjustedAccumAtRef = 0;
  for (let i = 0; i <= contractualHalfIndex; i++) {
    contractualAccumAtRef += buckets[i].contractual;
    adjustedAccumAtRef += buckets[i].adjusted;
  }

  return {
    gapBuckets: adjustedHalfIndex - contractualHalfIndex,
    gapAmount: contractualAccumAtRef - adjustedAccumAtRef,
    isOutOfHorizon,
    unitSingular: granularity === 'semana' ? 'semana' : 'mes',
    unitPlural: granularity === 'semana' ? 'semanas' : 'meses',
  };
}

/**
 * Proyección de Recaudación (spec funcional §4.4, Task 3 del plan SP3). Consume
 * `scopedDocumentsGross()` (SIEMPRE bruto, trampa del IVA -- nunca `scopedDocuments`) +
 * `cutoffDate()` directo de `CollectionsDataService`, sin wiring nuevo. `horizonMode` es un signal
 * puramente visual LOCAL a este componente (no persiste en `DefaultCollectionsFilterView`, mismo
 * criterio que el toggle Vista Tabla/Vista Mapa de Detalle de Ventas).
 */
@Component({
  selector: 'app-recaudacion-projection',
  standalone: true,
  imports: [FormsModule, SelectButton, Tooltip, LoadingSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recaudacion-projection.html',
  styleUrl: './recaudacion-projection.css',
})
export class RecaudacionProjectionComponent {
  protected readonly collectionsData = inject(CollectionsDataService);

  protected readonly horizonOptions = HORIZON_OPTIONS;
  protected readonly horizonMode = signal<HorizonMode>('13_semanas');

  protected readonly horizonLabel = computed(
    () => this.horizonOptions.find((option) => option.value === this.horizonMode())?.label ?? '',
  );

  protected readonly granularity = computed<ProjectionGranularity>(() =>
    this.horizonMode() === '13_semanas' ? 'semana' : 'mes',
  );

  protected readonly projection = computed(() =>
    buildRecaudacionProjection(
      this.collectionsData.scopedDocumentsGross(),
      this.collectionsData.cutoffDate(),
      this.granularity(),
      COUNTERPARTY_BEHAVIORS,
    ),
  );

  protected readonly gapHeadline = computed<GapHeadline | null>(() => {
    const projection = this.projection();
    if (!projection.adjustedSeriesAvailable) {
      return null;
    }
    return buildGapHeadline(projection.buckets, projection.granularity);
  });

  /** Máximo entre TODAS las barras visibles (contractual + ajustada, si se muestra) -- escala de
   * altura compartida por las 2 series de todos los buckets. Piso de 1 para no dividir por 0. */
  protected readonly maxBarValue = computed(() => {
    const projection = this.projection();
    const values = projection.adjustedSeriesAvailable
      ? projection.buckets.flatMap((bucket) => [bucket.contractual, bucket.adjusted])
      : projection.buckets.map((bucket) => bucket.contractual);
    return Math.max(1, ...values);
  });

  protected onHorizonChange(mode: HorizonMode): void {
    this.horizonMode.set(mode);
  }

  protected barHeightPct(value: number): number {
    return (value / this.maxBarValue()) * 100;
  }

  protected formattedAmount(value: number): string {
    return formatSignedAmount(value).text;
  }

  protected gapBucketsLabel(headline: GapHeadline): string {
    const n = Math.abs(headline.gapBuckets);
    return n === 1 ? headline.unitSingular : headline.unitPlural;
  }
}
