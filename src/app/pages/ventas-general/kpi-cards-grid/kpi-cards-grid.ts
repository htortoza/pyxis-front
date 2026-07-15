import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { SalesDataService } from '../../../services/sales-data.service';
import { KpiCardComponent } from '../../../components/shared/kpi-card/kpi-card';
import { LoadingSkeletonComponent } from '../../../components/shared/loading-skeleton/loading-skeleton';
import { formatSignedAmount } from '../../../pipes/signed-amount';

const INT_FORMATTER = new Intl.NumberFormat('es-CL');

@Component({
  selector: 'app-kpi-cards-grid',
  standalone: true,
  imports: [KpiCardComponent, LoadingSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kpi-cards-grid.html',
  styleUrl: './kpi-cards-grid.css',
})
export class KpiCardsGridComponent {
  protected readonly salesData = inject(SalesDataService);

  protected readonly ventasTotalesValue = computed(() =>
    formatSignedAmount(this.salesData.kpis().ventasTotales.current).text,
  );
  protected readonly ventasTotalesDelta = computed(() => this.salesData.kpis().ventasTotales.deltaPct);
  protected readonly ventasTotalesTrend = computed(() => this.salesData.kpis().ventasTotales.trend);

  protected readonly transaccionesValue = computed(() =>
    INT_FORMATTER.format(this.salesData.kpis().transacciones.current),
  );
  protected readonly transaccionesDelta = computed(() => this.salesData.kpis().transacciones.deltaPct);
  protected readonly transaccionesTrend = computed(() => this.salesData.kpis().transacciones.trend);

  protected readonly unidadesPorTransaccionValue = computed(() =>
    this.salesData.kpis().unidadesPorTransaccion.current.toFixed(1),
  );
  protected readonly unidadesPorTransaccionDelta = computed(
    () => this.salesData.kpis().unidadesPorTransaccion.deltaPct,
  );
  protected readonly unidadesPorTransaccionTrend = computed(
    () => this.salesData.kpis().unidadesPorTransaccion.trend,
  );

  protected readonly ticketPromedioValue = computed(() =>
    formatSignedAmount(this.salesData.kpis().ticketPromedio.current).text,
  );
  protected readonly ticketPromedioDelta = computed(() => this.salesData.kpis().ticketPromedio.deltaPct);
  protected readonly ticketPromedioTrend = computed(() => this.salesData.kpis().ticketPromedio.trend);
}
