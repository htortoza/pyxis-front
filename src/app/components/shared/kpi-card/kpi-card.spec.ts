import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiCardComponent } from './kpi-card';

/** jsdom no implementa ResizeObserver -- kpi-card lo usa para el shrink-to-fit imperativo del
 * valor grande (ver constructor de kpi-card.ts); este es el primer spec que efectivamente
 * renderiza el componente, así que es el primer lugar donde hace falta este stub mínimo. */
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
(globalThis as unknown as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver ??= ResizeObserverStub;

describe('KpiCardComponent', () => {
  let fixture: ComponentFixture<KpiCardComponent>;
  let component: KpiCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Test');
    fixture.componentRef.setInput('value', '100');
  });

  it('bandOverride en null (default) preserva el comportamiento previo de comparisonBand', () => {
    fixture.componentRef.setInput('deltaPct', -10);
    fixture.componentRef.setInput('deltaDirection', 'higher-good');
    fixture.detectChanges();
    // -10% higher-good, por debajo del umbral BAD_THRESHOLD_PCT (-5) -> 'bad'.
    expect(component.band()).toBe('bad');
  });

  it('bandOverride en null (default) preserva el comportamiento previo de cumplimientoBand en modo Meta', () => {
    fixture.componentRef.setInput('isMetaMode', true);
    fixture.componentRef.setInput('deltaPct', -60); // cumplimientoPct = 40 -> 'bad'
    fixture.detectChanges();
    expect(component.band()).toBe('bad');
  });

  it('bandOverride, cuando no es null, pisa comparisonBand/cumplimientoBand sin importar deltaPct/deltaDirection', () => {
    fixture.componentRef.setInput('deltaPct', 999); // sería 'good' bajo comparisonBand estándar
    fixture.componentRef.setInput('deltaDirection', 'higher-good');
    fixture.componentRef.setInput('bandOverride', 'bad');
    fixture.detectChanges();
    expect(component.band()).toBe('bad');
  });
});
