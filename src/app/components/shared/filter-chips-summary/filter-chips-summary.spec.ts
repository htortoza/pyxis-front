import { TestBed } from '@angular/core/testing';
import { FilterChipsSummaryComponent } from './filter-chips-summary';
import { SalesDataService } from '../../../services/sales-data.service';

describe('FilterChipsSummaryComponent', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [FilterChipsSummaryComponent] });
    const fixture = TestBed.createComponent(FilterChipsSummaryComponent);
    const salesData = TestBed.inject(SalesDataService);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance as any, salesData };
  }

  it('shows no comparison chip when comparisonMode is periodo_anterior (default)', () => {
    const { component } = setup();
    expect(component.comparisonChipLabel()).toBeNull();
  });

  it('shows a comparison chip when comparisonMode is meta', () => {
    const { component, salesData, fixture } = setup();
    salesData.comparisonMode.set('meta');
    fixture.detectChanges();
    expect(component.comparisonChipLabel()).toBe('Comparación: Meta');
  });

  it('shows a comparison chip when comparisonMode is periodo_especifico', () => {
    const { component, salesData, fixture } = setup();
    salesData.comparisonMode.set('periodo_especifico');
    fixture.detectChanges();
    expect(component.comparisonChipLabel()).toBe('Comparación: Periodo Específico');
  });

  it('shows no IVA chip when ivaMode is con_iva (default)', () => {
    const { component } = setup();
    expect(component.ivaChipLabel()).toBeNull();
  });

  it('shows an IVA chip when ivaMode is sin_iva', () => {
    const { component, salesData, fixture } = setup();
    salesData.ivaMode.set('sin_iva');
    fixture.detectChanges();
    expect(component.ivaChipLabel()).toBe('Sin IVA');
  });

  it('shows a periods chip when granularity is non-default even if period ids match defaults for that granularity', () => {
    const { component, salesData, fixture } = setup();
    salesData.selectedPeriodGranularity.set('semana');
    fixture.detectChanges();
    expect(component.periodsChipLabel()).not.toBeNull();
  });
});
