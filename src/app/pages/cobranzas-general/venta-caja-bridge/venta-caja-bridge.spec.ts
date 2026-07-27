import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CollectionsDataService } from '../../../services/collections-data.service';
import { VentaCajaBridgeComponent } from './venta-caja-bridge';

/** Mismo delay artificial que CollectionsDataService.dashboardData (400ms). */
async function waitForDashboardData(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
}

describe('VentaCajaBridgeComponent', () => {
  let fixture: ComponentFixture<VentaCajaBridgeComponent>;
  let service: CollectionsDataService;

  beforeEach(async () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    await TestBed.configureTestingModule({
      imports: [VentaCajaBridgeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VentaCajaBridgeComponent);
    service = TestBed.inject(CollectionsDataService);
    fixture.detectChanges();
  });

  it('crea sin errores y, tras el delay, renderiza los 4 segmentos de la barra y del desglose', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const barSegments = fixture.nativeElement.querySelectorAll('.bridge-bar-segment');
    expect(barSegments.length).toBe(4);
    const rows = fixture.nativeElement.querySelectorAll('.bridge-segment-row');
    expect(rows.length).toBe(4);
  });

  it('el titular muestra el ratio Cobrado/Venta coherente con el servicio', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const bridge = service.bridge();
    const collected = bridge.segments.find((s) => s.key === 'COLLECTED')!;
    const expectedPct = Math.round(collected.ratio * 100);

    const headline = fixture.nativeElement.querySelector('.bridge-headline-value') as HTMLElement;
    expect(headline.textContent).toContain(`${expectedPct}%`);
  });

  it('rotula explícitamente que opera sobre periodo de emisión, no sobre la fecha de corte', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const subtitle = fixture.nativeElement.querySelector('.bridge-subtitle') as HTMLElement;
    expect(subtitle.textContent?.toLowerCase()).toContain('emitidas');
  });

  it('clickear un segmento aplica el cross-filter bridge-<key> sin vaciar scopedDocuments', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const before = new Set(service.scopedDocuments().map((doc) => doc.id));

    const firstRow = fixture.nativeElement.querySelector('.bridge-segment-row') as HTMLButtonElement;
    firstRow.click();

    // scopedDocuments/scopedCounterpartyIds NO están detrás del delay artificial -- se puede
    // verificar de inmediato, antes de que el cambio de crossFilter dispare un nuevo ciclo de
    // `dashboardData` (que sí tiene el delay de 400ms y, mientras carga, reemplaza el contenido
    // por el skeleton -- ver collectionsData.loading() en el template).
    expect(service.crossFilter()).toEqual({ dimension: 'bridge-COLLECTED', id: 'COLLECTED' });
    const after = new Set(service.scopedDocuments().map((doc) => doc.id));
    expect(after).toEqual(before);

    // El cambio de crossFilter integra el pipeline de carga de 400ms (mismo patrón que cualquier
    // otro filtro de Cobranzas) -- hay que esperarlo y volver a consultar el DOM antes del 2do
    // click, ya que el nodo original pudo desmontarse durante el paso por el skeleton.
    await waitForDashboardData();
    fixture.detectChanges();

    // Clickear de nuevo el mismo segmento lo limpia (mismo patrón toggle que ranking-panel).
    const rowAfterReload = fixture.nativeElement.querySelector('.bridge-segment-row') as HTMLButtonElement;
    rowAfterReload.click();
    expect(service.crossFilter()).toBeNull();
  });

  it('cada segmento de la barra usa ratio*100 como ancho (ratio siempre >= 0, incluido CREDIT_NOTE)', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const bridge = service.bridge();
    const barEls = Array.from(fixture.nativeElement.querySelectorAll('.bridge-bar-segment')) as HTMLElement[];
    expect(barEls.length).toBe(bridge.segments.length);
    bridge.segments.forEach((segment, i) => {
      expect(segment.ratio).toBeGreaterThanOrEqual(0);
      expect(barEls[i].style.width).toBe(`${segment.ratio * 100}%`);
    });
  });

  it('muestra un skeleton mientras collectionsData.loading() es true', () => {
    // Justo tras crear el fixture (antes del delay artificial), el pipeline sigue cargando.
    const skeleton = fixture.nativeElement.querySelector('app-loading-skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('incluye un link "Ver en Ventas General"', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.bridge-ventas-link') as HTMLElement;
    expect(link).toBeTruthy();
    expect(link.textContent).toContain('Ver en Ventas General');
  });
});
