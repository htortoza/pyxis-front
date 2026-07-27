import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COUNTERPARTIES, COUNTERPARTY_BEHAVIORS } from '../../../data/mock/collections.mock';
import { buildConcentrationRows } from '../../../data/utils/collections-concentration.utils';
import { CollectionsDataService } from '../../../services/collections-data.service';
import { ConcentracionCarteraComponent } from './concentracion-cartera';

/** Mismo delay artificial que CollectionsDataService.dashboardData (400ms) -- ver mismo patrón en
 * aging-chart.spec.ts/venta-caja-bridge.spec.ts. `scopedDocuments()` es una señal inmediata (no
 * pasa por el pipeline de 400ms), pero el template sigue gateando por `collectionsData.loading()`,
 * que SÍ recorre ese pipeline -- hay que esperarlo igual. */
async function waitForDashboardData(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
}

describe('ConcentracionCarteraComponent', () => {
  let fixture: ComponentFixture<ConcentracionCarteraComponent>;
  let service: CollectionsDataService;

  beforeEach(async () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    await TestBed.configureTestingModule({
      imports: [ConcentracionCarteraComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConcentracionCarteraComponent);
    service = TestBed.inject(CollectionsDataService);
    fixture.detectChanges();
  });

  it('muestra un skeleton mientras collectionsData.loading() es true', () => {
    // Justo tras crear el fixture (antes del delay artificial), el pipeline sigue cargando. El
    // scope default tiene múltiples contrapartes, así que isVisible() ya es true en este punto.
    const skeleton = fixture.nativeElement.querySelector('app-loading-skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('bajo el scope default (múltiples contrapartes) renderiza la lista completa sin errores', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const expected = buildConcentrationRows(service.scopedDocuments(), COUNTERPARTIES, COUNTERPARTY_BEHAVIORS, 'saldo');
    expect(expected.rows.length).toBeGreaterThan(1);

    const rows = fixture.nativeElement.querySelectorAll('.concentration-row');
    expect(rows.length).toBe(expected.rows.length);
  });

  it('usa el vocabulario del tenant para el título, nunca "Contraparte" hardcodeado', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.concentration-title') as HTMLElement;
    expect(title.textContent).toContain('Concentración de');
  });

  it('cambiar sortMode reordena las filas visualmente', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fixture.componentInstance as any).onSortChange('saldoVencido');
    fixture.detectChanges();

    const expected = buildConcentrationRows(
      service.scopedDocuments(),
      COUNTERPARTIES,
      COUNTERPARTY_BEHAVIORS,
      'saldoVencido',
    );
    const labels = Array.from(fixture.nativeElement.querySelectorAll('.concentration-label')).map((el) =>
      (el as HTMLElement).textContent?.trim(),
    );
    expect(labels).toEqual(expected.rows.map((row) => row.label));
  });

  it('clic en una fila aplica el cross-filter contraparte y un segundo clic en la misma lo limpia', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const firstRow = fixture.nativeElement.querySelector('.concentration-row') as HTMLButtonElement;
    firstRow.click();

    const crossFilter = service.crossFilter();
    expect(crossFilter).not.toBeNull();
    expect(crossFilter!.dimension).toBe('contraparte');

    // Un 2do click sobre la MISMA referencia DOM, sin `detectChanges()` de por medio, lo limpia --
    // si esperáramos a re-renderizar antes, el panel entero se ocultaría (regla de visibilidad:
    // queda 1 sola contraparte en el alcance tras aplicar el cross-filter) y este botón concreto
    // dejaría de existir en el DOM (su listener se destruye junto con la vista `@if`).
    firstRow.click();
    expect(service.crossFilter()).toBeNull();

    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.concentration-row');
    expect(rows.length).toBeGreaterThan(1);
  });

  it('con el scope reducido a 1 sola contraparte, el panel no renderiza contenido visible', async () => {
    // cp-adquirente-01 tiene documentos propios bajo el scope default (confirmado por inspección
    // directa de RECEIVABLE_DOCUMENTS/scopedDocuments antes de escribir este test).
    service.setCounterpartyFilter(['cp-adquirente-01']);
    await waitForDashboardData();
    fixture.detectChanges();

    const expected = buildConcentrationRows(service.scopedDocuments(), COUNTERPARTIES, COUNTERPARTY_BEHAVIORS, 'saldo');
    expect(expected.rows.length).toBe(1);

    expect(fixture.nativeElement.querySelector('.concentration')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-loading-skeleton')).toBeNull();
  });

  it('realza la fila de mayor riesgo cuando result().highestRisk no es null bajo el scope default', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const expected = buildConcentrationRows(service.scopedDocuments(), COUNTERPARTIES, COUNTERPARTY_BEHAVIORS, 'saldo');
    expect(expected.highestRisk).not.toBeNull();

    const highlighted = fixture.nativeElement.querySelector('.concentration-row.is-highest-risk');
    expect(highlighted).toBeTruthy();
    expect(highlighted!.textContent).toContain(expected.highestRisk!.label);

    const summary = fixture.nativeElement.querySelector('.concentration-risk-summary');
    expect(summary).toBeTruthy();
    expect(summary!.textContent).toContain(expected.highestRisk!.label);
  });
});
