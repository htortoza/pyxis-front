import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { CollectionsDataService } from '../../../services/collections-data.service';
import { KpiCardComponent } from '../../../components/shared/kpi-card/kpi-card';
import { LoadingSkeletonComponent } from '../../../components/shared/loading-skeleton/loading-skeleton';
import { ceiBand } from '../../../data/utils/collections-kpi.utils';
import { formatSignedAmount } from '../../../pipes/signed-amount';

/**
 * Las 5 KPI cards de Cobranzas General (spec §4.1), mirror del patrón de
 * `pages/ventas-general/kpi-cards-grid` -- misma estructura de componente/loading/grid, pero 5
 * cards en vez de 6 y sin el modo Meta dinámico (ver nota sobre isMetaMode más abajo).
 *
 * `computeCollectionsKpis` (Task 2, SP2) SIEMPRE compara contra el corte/periodo anterior, sin
 * importar qué elija el usuario en el selector "Comparación" del modal de filtros (que sí ofrece
 * "Meta" en el dropdown, heredado del patrón de Ventas) -- esa rama de cálculo para Cobranzas
 * queda pendiente de una tarea futura fuera de este plan. Por eso ninguna de las 5 cards acá
 * bindea `isMetaMode`/`comparisonLabel` dinámico: quedan en su default ('periodo anterior').
 *
 * Regla no-negociable del plan: DSO y CEI SIEMPRE se muestran juntos -- si en el futuro se oculta
 * una franja de esta grilla, se quitan o mantienen ambas cards juntas. No hace falta lógica
 * condicional en SP2 porque las 5 siempre se muestran.
 */
@Component({
  selector: 'app-collections-kpi-cards-grid',
  standalone: true,
  imports: [KpiCardComponent, LoadingSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collections-kpi-cards-grid.html',
  styleUrl: './collections-kpi-cards-grid.css',
})
export class CollectionsKpiCardsGridComponent {
  protected readonly collectionsData = inject(CollectionsDataService);

  // ---- Saldo por Cobrar -- sin meta asociada (spec §4.1). --------------------------------------
  protected readonly saldoPorCobrarValue = computed(() =>
    formatSignedAmount(this.collectionsData.kpis().saldoPorCobrar.current).text,
  );
  protected readonly saldoPorCobrarDelta = computed(() => this.collectionsData.kpis().saldoPorCobrar.deltaPct);
  protected readonly saldoPorCobrarTrend = computed(() => this.collectionsData.kpis().saldoPorCobrar.trend);

  // ---- % Vencido -- semáforo estándar por delta (comparisonBand vía deltaDirection). El plan
  // menciona un semáforo graduado contra `overdueRatioTarget` de COLLECTION_TARGETS; ese cálculo
  // explícito contra la meta queda diferido a cuando computeCollectionsKpis soporte modo Meta
  // (ver nota de clase arriba) -- por ahora alcanza con el semáforo estándar por delta.
  protected readonly porcentajeVencidoValue = computed(
    () => `${this.collectionsData.kpis().porcentajeVencido.current.toFixed(1)}%`,
  );
  protected readonly porcentajeVencidoDelta = computed(() => this.collectionsData.kpis().porcentajeVencido.deltaPct);
  protected readonly porcentajeVencidoTrend = computed(() => this.collectionsData.kpis().porcentajeVencido.trend);

  // ---- DSO -- mismo diferimiento de meta explícita que %Vencido (ver comentario arriba).
  // deltaSensitivityPct: 2 días -- una fluctuación chica no debe pintar rojo/verde.
  protected readonly dsoValue = computed(() => `${this.collectionsData.kpis().dso.current.toFixed(0)} d`);
  protected readonly dsoDelta = computed(() => this.collectionsData.kpis().dso.deltaPct);
  protected readonly dsoTrend = computed(() => this.collectionsData.kpis().dso.trend);

  // ---- CEI -- semáforo propio 90/80 fijo por spec, vía `ceiBand`; NO usa
  // comparisonBand/cumplimientoBand (los genéricos de kpi-card).
  protected readonly ceiValue = computed(() => `${this.collectionsData.kpis().cei.current.toFixed(1)}%`);
  protected readonly ceiDelta = computed(() => this.collectionsData.kpis().cei.deltaPct);
  protected readonly ceiTrend = computed(() => this.collectionsData.kpis().cei.trend);
  protected readonly ceiBandValue = computed(() => ceiBand(this.collectionsData.kpis().cei.current));

  // ---- Recuperado en el Periodo -- sin meta asociada. ------------------------------------------
  protected readonly recuperadoValue = computed(() =>
    formatSignedAmount(this.collectionsData.kpis().recuperado.current).text,
  );
  protected readonly recuperadoDelta = computed(() => this.collectionsData.kpis().recuperado.deltaPct);
  protected readonly recuperadoTrend = computed(() => this.collectionsData.kpis().recuperado.trend);
}
