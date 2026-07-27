import { TestBed } from '@angular/core/testing';
import { CollectionsFilterChipsSummaryComponent } from './collections-filter-chips-summary';
import { CollectionsDataService } from '../../../services/collections-data.service';
import { COUNTERPARTIES } from '../../../data/mock/collections.mock';

describe('CollectionsFilterChipsSummaryComponent', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [CollectionsFilterChipsSummaryComponent] });
    const fixture = TestBed.createComponent(CollectionsFilterChipsSummaryComponent);
    const collectionsData = TestBed.inject(CollectionsDataService);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance as any, collectionsData };
  }

  it('always shows the periods chip, even at default', () => {
    const { component } = setup();
    expect(component.periodsChipLabel()).not.toBeNull();
    expect(component.periodsChipLabel()).not.toBe('');
  });

  it('always shows the cutoff chip labeled "Saldo al [fecha]", even at default', () => {
    const { component, collectionsData } = setup();
    expect(component.cutoffChipLabel()).toBe(
      `Saldo al ${new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
        new Date(`${collectionsData.defaultView().cutoffDate}T00:00:00Z`),
      )}`,
    );
    expect(component.cutoffChipLabel().startsWith('Saldo al ')).toBe(true);
  });

  it('shows no comparison chip when comparisonMode matches default', () => {
    const { component } = setup();
    expect(component.comparisonChipLabel()).toBeNull();
  });

  it('shows a comparison chip when comparisonMode is meta', () => {
    const { component, collectionsData, fixture } = setup();
    collectionsData.comparisonMode.set('meta');
    fixture.detectChanges();
    expect(component.comparisonChipLabel()).toBe('Comparación: Meta');
  });

  it('shows no IVA chip when ivaMode matches default', () => {
    const { component } = setup();
    expect(component.ivaChipLabel()).toBeNull();
  });

  it('shows an IVA chip when ivaMode is sin_iva', () => {
    const { component, collectionsData, fixture } = setup();
    collectionsData.ivaMode.set('sin_iva');
    fixture.detectChanges();
    expect(component.ivaChipLabel()).toBe('Sin IVA');
  });

  it('shows no counterparty chips at default', () => {
    const { component } = setup();
    expect(component.counterpartyChips()).toEqual([]);
  });

  it('shows a counterparty chip after setCounterpartyFilter, and removing it clears the filter', () => {
    const { component, collectionsData, fixture } = setup();
    const someId = COUNTERPARTIES[0].id;
    collectionsData.setCounterpartyFilter([someId]);
    fixture.detectChanges();

    expect(component.counterpartyChips()).toEqual([{ id: someId, label: COUNTERPARTIES[0].label }]);

    component.removeCounterparty(someId);
    fixture.detectChanges();
    expect(collectionsData.counterpartyFilter()).toBeNull();
  });

  it('removing the cutoff chip resets cutoffDate to the default', () => {
    const { component, collectionsData, fixture } = setup();
    collectionsData.cutoffDate.set('2026-01-01');
    fixture.detectChanges();

    component.resetCutoff();
    fixture.detectChanges();
    expect(collectionsData.cutoffDate()).toBe(collectionsData.defaultView().cutoffDate);
  });
});
