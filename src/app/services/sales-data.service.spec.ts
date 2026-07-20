import { TestBed } from '@angular/core/testing';

import { SalesDataService } from './sales-data.service';

describe('SalesDataService - comparison', () => {
  let service: SalesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesDataService);
  });

  it('defaults to Mes granularity and periodo_anterior/calendario mode', () => {
    expect(service.selectedPeriodGranularity()).toBe('mes');
    expect(service.comparisonMode()).toBe('periodo_anterior');
    expect(service.comparisonAlignment()).toBe('calendario');
  });

  it('computes KPIs without error across Dia granularity with dia_semana alignment', async () => {
    service.selectedPeriodGranularity.set('dia');
    service.selectedPeriodIds.set(['2026-07-20']);
    service.comparisonAlignment.set('dia_semana');
    // dashboardData recomputes through an artificial 400ms loading delay (see the service's
    // own doc comment on `dashboardData`) -- wait past it so this actually exercises the Dia
    // granularity + dia_semana alignment code path instead of reading the stale Mes-default
    // snapshot computed at construction time.
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(service.kpis().ventasTotales).toBeDefined();
  });

  it('periodo_especifico uses explicitComparisonPeriodIds instead of the auto-inferred previous window', async () => {
    service.selectedPeriodGranularity.set('mes');
    service.selectedPeriodIds.set(['2026-07']);
    service.comparisonMode.set('periodo_especifico');
    // '2023-01' no existe en el catálogo de periodos Mes (arranca en 2024-01) -- "previous"
    // cae a 0 porque no matchea ningún Period real, confirmando que el servicio usó el periodo
    // explícito (aunque inválido) y NO cayó de vuelta al periodo anterior automático (2026-06,
    // que sí tiene ventas reales en el dataset mock y haría fallar este assert si el modo se
    // ignorara).
    service.explicitComparisonPeriodIds.set(['2023-01']);
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(service.kpis().ventasTotales.previous).toBe(0);
  });
});
