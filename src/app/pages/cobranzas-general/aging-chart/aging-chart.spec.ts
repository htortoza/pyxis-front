import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsDataService } from '../../../services/collections-data.service';
import { AgingChartComponent } from './aging-chart';

/** Mismo delay artificial que CollectionsDataService.dashboardData (400ms) -- ver mismo patrón en
 * venta-caja-bridge.spec.ts/collections-kpi-cards-grid.spec.ts. `scopedDocuments()`/`cutoffDate()`
 * son señales inmediatas (no pasan por el pipeline de 400ms), pero el template sigue gateando por
 * `collectionsData.loading()`, que SÍ recorre ese pipeline -- hay que esperarlo igual. */
async function waitForDashboardData(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
}

describe('AgingChartComponent', () => {
  let fixture: ComponentFixture<AgingChartComponent>;
  let service: CollectionsDataService;

  beforeEach(async () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    await TestBed.configureTestingModule({
      imports: [AgingChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgingChartComponent);
    service = TestBed.inject(CollectionsDataService);
    fixture.detectChanges();
  });

  it('muestra un skeleton mientras collectionsData.loading() es true', () => {
    // Justo tras crear el fixture (antes del delay artificial), el pipeline sigue cargando.
    const skeleton = fixture.nativeElement.querySelector('app-loading-skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('crea sin errores y, tras el delay, renderiza los 2 clusters con al menos 1 barra cada uno', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const clusters = fixture.nativeElement.querySelectorAll('.cluster');
    expect(clusters.length).toBe(2);

    const [porVencerCluster, vencidoCluster] = Array.from(clusters) as HTMLElement[];
    expect(porVencerCluster.querySelectorAll('.bar-col').length).toBeGreaterThan(0);
    expect(vencidoCluster.querySelectorAll('.bar-col').length).toBeGreaterThan(0);

    // Los 2 clusters cubren exactamente las 6 barras de escala (las 2 franjas "por vencer" + las 4
    // "vencido") -- NO_DUE_DATE vive fuera de `.cluster-bars`, ver siguiente test.
    const allBars = fixture.nativeElement.querySelectorAll('.cluster-bars .bar-col');
    expect(allBars.length).toBe(6);
  });

  it('el bucket NO_DUE_DATE con documentCount > 0 bajo el scope default se muestra como nota aparte', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const note = fixture.nativeElement.querySelector('.no-due-date-note') as HTMLElement | null;
    expect(note).toBeTruthy();
    expect(note!.textContent).toContain('Sin vencimiento definido');
  });

  it('clickear una barra aplica el cross-filter aging-bucket con el key del bucket', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const firstBar = fixture.nativeElement.querySelector('.bar-col') as HTMLButtonElement;
    firstBar.click();

    // El cross-filter se puede leer de inmediato (no está detrás del delay artificial), aunque
    // dispare un nuevo ciclo de `dashboardData` -- mismo patrón que venta-caja-bridge.spec.ts.
    const crossFilter = service.crossFilter();
    expect(crossFilter).not.toBeNull();
    expect(crossFilter!.dimension).toBe('aging-bucket');
    expect(crossFilter!.id).toBe('POR_VENCER_0_30');

    // El cambio de crossFilter integra el pipeline de carga de 400ms -- hay que esperarlo y
    // volver a consultar el DOM antes del 2do click.
    await waitForDashboardData();
    fixture.detectChanges();

    // Clickear de nuevo la misma barra lo limpia (mismo patrón toggle que el resto de Cobranzas).
    const barAfterReload = fixture.nativeElement.querySelector('.bar-col') as HTMLButtonElement;
    barAfterReload.click();
    expect(service.crossFilter()).toBeNull();
  });
});
