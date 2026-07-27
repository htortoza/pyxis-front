import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

import type { AgingBucket } from '../../../data/utils/collections-aging.utils';
import { buildAgingBuckets } from '../../../data/utils/collections-aging.utils';
import { LoadingSkeletonComponent } from '../../../components/shared/loading-skeleton/loading-skeleton';
import { formatSignedAmount } from '../../../pipes/signed-amount';
import { CollectionsDataService } from '../../../services/collections-data.service';

const CUTOFF_DATE_FORMATTER = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Mismo patrón de formateo de fecha de corte que `collections-filter-chips-summary`/
 * `collections-footer` -- pequeño y sin dependencias compartidas a propósito (cada componente
 * de Cobranzas ya redeclara esta función localmente, ver esos 2 archivos). */
function formatCutoffDate(iso: string): string {
  return CUTOFF_DATE_FORMATTER.format(new Date(`${iso}T00:00:00Z`));
}

const CROSS_FILTER_DIMENSION = 'aging-bucket';

/**
 * Antigüedad de Cartera (spec §4.3/§10.1, Task 6 SP2): 7 tramos de stock al corte activo,
 * agrupados en 2 clusters visuales -- "Por Vencer" (0-30 / 30+ días para vencer, paleta azul/verde)
 * y "Vencido" (1-30 / 31-60 / 61-90 / 90+ días de mora, paleta roja/coral en intensidad creciente) --
 * más una nota aparte para documentos sin `dueDate` (fuera de la escala de altura compartida, spec:
 * NO es una escala continua entre las 3 familias de color).
 *
 * A diferencia del Puente (Task 5), esta vista es de STOCK al corte activo -- consume
 * `scopedDocuments()`/`cutoffDate()` directamente (ya cutoff-filtrados/escalados por ivaMode/
 * escopeados por dimensión, ver `CollectionsDataService`), sin necesitar ningún wiring nuevo en el
 * servicio.
 */
@Component({
  selector: 'app-aging-chart',
  standalone: true,
  imports: [LoadingSkeletonComponent, Tooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './aging-chart.html',
  styleUrl: './aging-chart.css',
})
export class AgingChartComponent {
  protected readonly collectionsData = inject(CollectionsDataService);

  protected readonly cutoffLabel = computed(() => formatCutoffDate(this.collectionsData.cutoffDate()));

  protected readonly buckets = computed(
    () => buildAgingBuckets(this.collectionsData.scopedDocuments(), this.collectionsData.cutoffDate()).buckets,
  );

  protected readonly porVencerBuckets = computed(() => this.buckets().filter((b) => b.overdue === false));
  protected readonly vencidoBuckets = computed(() => this.buckets().filter((b) => b.overdue === true));

  /** `NO_DUE_DATE` vive fuera de ambos clusters y de su escala de altura (spec: no es una escala
   * continua) -- solo se muestra cuando tiene documentos, sin placeholder vacío. */
  protected readonly noDueDateBucket = computed(() => this.buckets().find((b) => b.key === 'NO_DUE_DATE') ?? null);

  /** Máximo de amount entre las 6 barras de ambos clusters -- `NO_DUE_DATE` nunca participa de esta
   * escala (ver arriba). Piso de 1 para no dividir por 0 cuando las 6 barras están en 0. */
  private readonly maxClusterAmount = computed(() =>
    Math.max(1, ...this.porVencerBuckets().map((b) => b.amount), ...this.vencidoBuckets().map((b) => b.amount)),
  );

  /** Suma de las 7 franjas -- denominador del "% de la cartera total" en el tooltip (incluye
   * NO_DUE_DATE: sigue siendo parte de la cartera total aunque no participe de la escala visual). */
  private readonly totalAmount = computed(() => this.buckets().reduce((sum, b) => sum + b.amount, 0));

  protected barHeightPct(bucket: AgingBucket): number {
    return (bucket.amount / this.maxClusterAmount()) * 100;
  }

  protected formattedAmount(bucket: AgingBucket): string {
    return formatSignedAmount(bucket.amount).text;
  }

  protected tooltipText(bucket: AgingBucket): string {
    const total = this.totalAmount();
    const pctOfTotal = total === 0 ? 0 : (bucket.amount / total) * 100;
    const documentWord = bucket.documentCount === 1 ? 'documento' : 'documentos';
    const counterpartyWord = bucket.counterpartyCount === 1 ? 'contraparte' : 'contrapartes';
    return (
      `${this.formattedAmount(bucket)} · ${bucket.documentCount} ${documentWord} · ` +
      `${pctOfTotal.toFixed(1)}% de la cartera · ${bucket.counterpartyCount} ${counterpartyWord}`
    );
  }

  protected isActive(bucket: AgingBucket): boolean {
    const crossFilter = this.collectionsData.crossFilter();
    return crossFilter !== null && crossFilter.dimension === CROSS_FILTER_DIMENSION && crossFilter.id === bucket.key;
  }

  protected onBucketClick(bucket: AgingBucket): void {
    this.collectionsData.setCrossFilter(CROSS_FILTER_DIMENSION, bucket.key);
  }
}
