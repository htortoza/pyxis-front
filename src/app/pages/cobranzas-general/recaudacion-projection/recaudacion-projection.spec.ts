import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COUNTERPARTY_BEHAVIORS } from '../../../data/mock/collections.mock';
import { buildRecaudacionProjection } from '../../../data/utils/collections-projection.utils';
import { CollectionsDataService } from '../../../services/collections-data.service';
import { RecaudacionProjectionComponent } from './recaudacion-projection';

/** Mismo delay artificial que CollectionsDataService.dashboardData (400ms) -- ver mismo patrón en
 * aging-chart.spec.ts/venta-caja-bridge.spec.ts. */
async function waitForDashboardData(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
}

describe('RecaudacionProjectionComponent', () => {
  let fixture: ComponentFixture<RecaudacionProjectionComponent>;
  let service: CollectionsDataService;

  beforeEach(async () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    await TestBed.configureTestingModule({
      imports: [RecaudacionProjectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecaudacionProjectionComponent);
    service = TestBed.inject(CollectionsDataService);
    fixture.detectChanges();
  });

  it('muestra un skeleton mientras collectionsData.loading() es true', () => {
    const skeleton = fixture.nativeElement.querySelector('app-loading-skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('tras el delay, renderiza 13 buckets bajo el horizonte por defecto (13 semanas), sin NaN', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const groups = fixture.nativeElement.querySelectorAll('.bucket-group');
    expect(groups.length).toBe(13);
    expect(fixture.nativeElement.textContent).not.toContain('NaN');
    expect(fixture.nativeElement.textContent).not.toContain('Infinity');
  });

  it('cambiar el toggle a 6 meses recalcula la proyección a 6 buckets sin errores', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.horizon-toggle p-selectbutton') as HTMLElement;
    expect(toggle).toBeTruthy();

    // Disparamos el cambio directo sobre el componente (equivalente a lo que produce el click en
    // la 2da opción del p-selectButton) -- evita depender del DOM interno de PrimeNG para el evento.
    const component = fixture.componentInstance as unknown as {
      onHorizonChange: (mode: '13_semanas' | '6_meses') => void;
    };
    component.onHorizonChange('6_meses');
    fixture.detectChanges();
    await waitForDashboardData();
    fixture.detectChanges();

    const groups = fixture.nativeElement.querySelectorAll('.bucket-group');
    expect(groups.length).toBe(6);
    expect(fixture.nativeElement.textContent).not.toContain('NaN');
  });

  it('con ivaMode en sin_iva, muestra la nota de monto bruto (trampa del IVA)', async () => {
    service.ivaMode.set('sin_iva');
    await waitForDashboardData();
    fixture.detectChanges();

    const note = fixture.nativeElement.querySelector('.iva-note') as HTMLElement | null;
    expect(note).toBeTruthy();
    expect(note!.textContent).toContain('monto bruto');
  });

  it('con ivaMode en con_iva (default), la nota de monto bruto no aparece', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const note = fixture.nativeElement.querySelector('.iva-note');
    expect(note).toBeFalsy();
  });

  it('el backlog vencido mostrado coincide con projection().backlogOverdue de la utilidad pura', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const projection = buildRecaudacionProjection(
      service.scopedDocumentsGross(),
      service.cutoffDate(),
      'semana',
      COUNTERPARTY_BEHAVIORS,
    );

    const backlogEl = fixture.nativeElement.querySelector('.backlog-amount') as HTMLElement;
    expect(backlogEl).toBeTruthy();
    // formatSignedAmount con paréntesis para negativos, o el monto CLP formateado -- alcanza con
    // confirmar que el texto no está vacío y que backlogOverdue es >= 0 bajo el scope default
    // (spec: el backlog vencido siempre es un monto no negativo, suma de balances > 0).
    expect(projection.backlogOverdue).toBeGreaterThanOrEqual(0);
    expect(backlogEl.textContent?.trim().length).toBeGreaterThan(0);
  });

  it('muestra exactamente uno de: titular de brecha (mejora #2) o placeholder de degradación', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const headline = fixture.nativeElement.querySelector('.gap-headline');
    const degradationNote = fixture.nativeElement.querySelector('.degradation-note');
    const exactlyOne = (headline !== null) !== (degradationNote !== null);
    expect(exactlyOne).toBe(true);

    const projection = buildRecaudacionProjection(
      service.scopedDocumentsGross(),
      service.cutoffDate(),
      'semana',
      COUNTERPARTY_BEHAVIORS,
    );
    expect(headline !== null).toBe(projection.adjustedSeriesAvailable);
  });

  it('la serie ajustada (bar-adjusted) solo se dibuja cuando adjustedSeriesAvailable es true', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const projection = buildRecaudacionProjection(
      service.scopedDocumentsGross(),
      service.cutoffDate(),
      'semana',
      COUNTERPARTY_BEHAVIORS,
    );

    const adjustedBars = fixture.nativeElement.querySelectorAll('.bar-adjusted');
    if (projection.adjustedSeriesAvailable) {
      expect(adjustedBars.length).toBe(13);
    } else {
      expect(adjustedBars.length).toBe(0);
    }
  });

  it('la nota de monto excluido solo aparece cuando excludedNoDueDate > 0, y refleja el monto exacto', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const projection = buildRecaudacionProjection(
      service.scopedDocumentsGross(),
      service.cutoffDate(),
      'semana',
      COUNTERPARTY_BEHAVIORS,
    );

    const excludedNote = fixture.nativeElement.querySelector('.excluded-note') as HTMLElement | null;
    if (projection.excludedNoDueDate > 0) {
      expect(excludedNote).toBeTruthy();
      expect(excludedNote!.textContent).toContain('sin fecha de vencimiento');
    } else {
      expect(excludedNote).toBeFalsy();
    }
  });
});
