import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiCardComponent } from '../../../components/shared/kpi-card/kpi-card';
import { CollectionsDataService } from '../../../services/collections-data.service';
import { ceiBand } from '../../../data/utils/collections-kpi.utils';
import { CollectionsKpiCardsGridComponent } from './collections-kpi-cards-grid';

/** jsdom no implementa ResizeObserver -- cada app-kpi-card renderizada lo usa para el
 * shrink-to-fit imperativo del valor grande (ver constructor de kpi-card.ts). Mismo stub mínimo
 * que kpi-card.spec.ts. */
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
(globalThis as unknown as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver ??= ResizeObserverStub;

/** Mismo delay artificial que CollectionsDataService.dashboardData (400ms) -- ver spec liviano
 * pedido por el plan Task 4: existencia de 5 cards + valores no vacíos, sin re-testear el cálculo
 * de los KPIs en sí (eso ya lo cubren collections-kpi.utils.spec.ts / collections-data.service.spec.ts). */
async function waitForDashboardData(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
}

describe('CollectionsKpiCardsGridComponent', () => {
  let fixture: ComponentFixture<CollectionsKpiCardsGridComponent>;
  let service: CollectionsDataService;

  beforeEach(async () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    await TestBed.configureTestingModule({
      imports: [CollectionsKpiCardsGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsKpiCardsGridComponent);
    service = TestBed.inject(CollectionsDataService);
    fixture.detectChanges();
  });

  it('crea sin errores y, tras el delay, renderiza las 5 app-kpi-card', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-kpi-card');
    expect(cards.length).toBe(5);
  });

  it('ninguno de los 5 KPIs subyacentes es NaN/undefined bajo el default', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const kpis = service.kpis();
    for (const value of [
      kpis.saldoPorCobrar.current,
      kpis.porcentajeVencido.current,
      kpis.dso.current,
      kpis.cei.current,
      kpis.recuperado.current,
    ]) {
      expect(typeof value).toBe('number');
      expect(Number.isNaN(value)).toBe(false);
    }
  });

  it('la card de CEI (4ta) recibe un bandOverride coherente con ceiBand del valor actual', async () => {
    await waitForDashboardData();
    fixture.detectChanges();

    const expectedBand = ceiBand(service.kpis().cei.current);
    expect(['good', 'medium', 'bad']).toContain(expectedBand);

    const cardDebugEls = fixture.debugElement.queryAll(By.directive(KpiCardComponent));
    expect(cardDebugEls.length).toBe(5);
    const ceiCard = cardDebugEls[3].componentInstance as KpiCardComponent;
    expect(ceiCard.bandOverride()).toBe(expectedBand);
    expect(ceiCard.band()).toBe(expectedBand);
  });
});
