import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Tooltip } from 'primeng/tooltip';

import { LoadingSkeletonComponent } from '../../../components/shared/loading-skeleton/loading-skeleton';
import { COUNTERPARTIES, COUNTERPARTY_BEHAVIORS } from '../../../data/mock/collections.mock';
import type { ConcentrationRow, ConcentrationSortMode } from '../../../data/utils/collections-concentration.utils';
import { buildConcentrationRows } from '../../../data/utils/collections-concentration.utils';
import { formatSignedAmount } from '../../../pipes/signed-amount';
import { CollectionsDataService } from '../../../services/collections-data.service';
import { TenantVocabularyService } from '../../../services/tenant-vocabulary.service';

/** Misma dimensión literal que `CollectionsDataService.scopedCounterpartyIds` ya reconoce como la
 * rama "original" desde SP1 -- clickear una fila angosta el scope de TODA la pantalla a esa
 * contraparte (a diferencia de las dimensiones `bridge-<key>`/`aging-bucket`, que el servicio
 * deliberadamente NO usa para angostar `scopedCounterpartyIds`). */
const CROSS_FILTER_DIMENSION = 'contraparte';

interface ConcentrationSortOption {
  label: string;
  value: ConcentrationSortMode;
}

const SORT_OPTIONS: ConcentrationSortOption[] = [
  { label: 'Saldo', value: 'saldo' },
  { label: 'Saldo vencido', value: 'saldoVencido' },
  { label: '% de utilización de límite', value: 'utilizacion' },
];

/** How much `bigger` is above `reference`, as a percentage of `reference` -- mismo cálculo que
 * `ranking-panel.ts`'s `pctAbove`, redeclarado acá (no importado: `RankingItem`/`RankingDimension`
 * son tipos propios de Ventas, ver [[feedback-backend-contract-is-fixed]]). */
function pctAbove(bigger: number, reference: number): number {
  return reference === 0 ? 0 : ((bigger - reference) / reference) * 100;
}

/**
 * Concentración de Cartera (spec §4.5, Task 4 SP3): ranking de contrapartes por Saldo/Saldo
 * vencido/% de utilización de límite, con mini-barra proporcional, comparación par-a-par al hover
 * (adaptado de `ranking-panel.ts`) y el realce de "mayor riesgo" (mejora #3, resuelto en
 * `buildConcentrationRows`). A diferencia de la Proyección (Task 3), opera sobre `scopedDocuments`
 * (SÍ respeta el toggle Con/Sin IVA) -- no hay trampa del IVA acá.
 *
 * Regla de visibilidad (spec §4.5): el panel completo se oculta cuando el alcance activo contiene
 * exactamente 1 contraparte distinta -- ver `isVisible`, envolvente incluso sobre el propio
 * `loading()` en el template.
 */
@Component({
  selector: 'app-concentracion-cartera',
  standalone: true,
  imports: [LoadingSkeletonComponent, Select, FormsModule, Tooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './concentracion-cartera.html',
  styleUrl: './concentracion-cartera.css',
})
export class ConcentracionCarteraComponent {
  protected readonly collectionsData = inject(CollectionsDataService);
  protected readonly vocab = inject(TenantVocabularyService);

  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly sortMode = signal<ConcentrationSortMode>('saldo');

  protected readonly result = computed(() =>
    buildConcentrationRows(this.collectionsData.scopedDocuments(), COUNTERPARTIES, COUNTERPARTY_BEHAVIORS, this.sortMode()),
  );

  /** Spec §4.5 "Regla de visibilidad": el panel entero se oculta cuando hay exactamente 1
   * contraparte distinta en el alcance activo -- no tiene sentido un ranking de una fila. */
  protected readonly isVisible = computed(() => this.result().rows.length !== 1);

  /** Spec §2.3: nunca "Concentración de Contraparte" hardcodeado -- se resuelve por el vocabulario
   * del tenant (p.ej. "Concentración de Recaudador" en el preset retail). */
  protected readonly title = computed(() => `Concentración de ${this.vocab.labelFor('contraparte')}`);

  protected readonly highestRiskSummary = computed(() => {
    const highestRisk = this.result().highestRisk;
    if (highestRisk === null) return null;
    return (
      `Mayor riesgo: ${highestRisk.label} concentra el mayor saldo entre las contrapartes ` +
      'sobre su límite de crédito y con historial de pago tardío.'
    );
  });

  /** Máximo del campo activo de `sortMode` entre las filas actualmente listadas -- denominador de
   * la mini-barra proporcional. Filas con el campo activo en `null` (solo posible en modo
   * `'utilizacion'`) nunca participan del cálculo del máximo. Piso de 1 para no dividir por 0. */
  private readonly maxActiveValue = computed(() => {
    const mode = this.sortMode();
    const values = this.result()
      .rows.map((row) => this.activeValue(row, mode))
      .filter((value): value is number => value !== null);
    return Math.max(1, ...values);
  });

  private activeValue(row: ConcentrationRow, mode: ConcentrationSortMode): number | null {
    if (mode === 'saldo') return row.saldo;
    if (mode === 'saldoVencido') return row.saldoVencido;
    return row.utilizacionPct;
  }

  protected rank(index: number): string {
    return (index + 1).toString().padStart(2, '0');
  }

  protected barWidthPct(row: ConcentrationRow): number {
    const value = this.activeValue(row, this.sortMode());
    if (value === null) return 0;
    return (value / this.maxActiveValue()) * 100;
  }

  protected formattedValue(row: ConcentrationRow): string {
    const mode = this.sortMode();
    if (mode === 'utilizacion') {
      return row.utilizacionPct === null ? '—' : `${(row.utilizacionPct * 100).toFixed(1)}%`;
    }
    const value = mode === 'saldo' ? row.saldo : row.saldoVencido;
    return formatSignedAmount(value).text;
  }

  /**
   * "Concentra X% más/menos que [vecino]" contra los vecinos inmediatos EN LA LISTA ORDENADA
   * actual -- mismo patrón `comparisonTooltip` de `ranking-panel.ts`, adaptado para comparar el
   * campo ACTIVO de `sortMode` en vez de siempre `amount`. Filas cuyo campo activo es `null` (solo
   * en modo `'utilizacion'`) no tienen nada sensato que comparar -- sin tooltip para ellas, y
   * tampoco se usan como referencia de comparación para un vecino.
   */
  protected comparisonTooltip(row: ConcentrationRow): string {
    const mode = this.sortMode();
    const value = this.activeValue(row, mode);
    if (value === null) return '';

    const rows = this.result().rows;
    const index = rows.findIndex((candidate) => candidate.counterpartyId === row.counterpartyId);
    if (index === -1) return '';

    const above = index > 0 ? rows[index - 1] : null;
    const below = index < rows.length - 1 ? rows[index + 1] : null;

    const parts: string[] = [];
    if (above) {
      const aboveValue = this.activeValue(above, mode);
      if (aboveValue !== null) {
        parts.push(`${pctAbove(aboveValue, value).toFixed(1)}% menos que ${above.label}`);
      }
    }
    if (below) {
      const belowValue = this.activeValue(below, mode);
      if (belowValue !== null) {
        parts.push(`${pctAbove(value, belowValue).toFixed(1)}% más que ${below.label}`);
      }
    }
    if (parts.length === 0) return '';
    return `Concentra ${parts.join(' y ')}`;
  }

  protected isHighestRisk(row: ConcentrationRow): boolean {
    const highestRisk = this.result().highestRisk;
    return highestRisk !== null && highestRisk.counterpartyId === row.counterpartyId;
  }

  protected isActive(row: ConcentrationRow): boolean {
    const crossFilter = this.collectionsData.crossFilter();
    return (
      crossFilter !== null && crossFilter.dimension === CROSS_FILTER_DIMENSION && crossFilter.id === row.counterpartyId
    );
  }

  protected onRowClick(row: ConcentrationRow): void {
    this.collectionsData.setCrossFilter(CROSS_FILTER_DIMENSION, row.counterpartyId);
  }

  protected onSortChange(value: ConcentrationSortMode): void {
    this.sortMode.set(value);
  }
}
