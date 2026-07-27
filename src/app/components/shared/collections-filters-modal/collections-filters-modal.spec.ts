import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TODAY_ISO } from '../../../data/mock/collections.mock';
import { CollectionsDataService } from '../../../services/collections-data.service';
import { CollectionsFiltersModalComponent } from './collections-filters-modal';

describe('CollectionsFiltersModalComponent', () => {
  let fixture: ComponentFixture<CollectionsFiltersModalComponent>;
  let component: CollectionsFiltersModalComponent;
  let collectionsData: CollectionsDataService;

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    TestBed.configureTestingModule({ imports: [CollectionsFiltersModalComponent] });
    fixture = TestBed.createComponent(CollectionsFiltersModalComponent);
    component = fixture.componentInstance;
    collectionsData = TestBed.inject(CollectionsDataService);
    fixture.detectChanges();
  });

  it('renders the "Filtros" trigger button', () => {
    const trigger = fixture.nativeElement.querySelector('.collections-filters-modal-trigger');
    expect(trigger).toBeTruthy();
    expect((trigger.textContent ?? '').trim()).toContain('Filtros');
  });

  it('open() sets isOpen true and syncs draftCutoffDate from CollectionsDataService', () => {
    expect((component as any).isOpen()).toBe(false);

    collectionsData.cutoffDate.set('2026-06-15');
    component.open();
    fixture.detectChanges();

    expect((component as any).isOpen()).toBe(true);
    expect((component as any).draftCutoffDate()).toBe('2026-06-15');
  });

  it('open() with the default view syncs draftCutoffDate to TODAY_ISO', () => {
    component.open();
    expect((component as any).draftCutoffDate()).toBe(TODAY_ISO);
  });

  it('apply() splits draftCheckedIds into counterparty ids vs sector/marca/local ids', () => {
    component.open();
    // A plain Sector/Marca/Local node id (no counterpartyId on its tree node).
    const filterTree = (component as any).filterTree as { id: string; counterpartyId?: string }[];
    const sectorNode = filterTree.find((node) => !node.counterpartyId)!;
    const counterpartyNode = filterTree.find((node) => !!node.counterpartyId)!;

    (component as any).draftCheckedIds.set(new Set([sectorNode.id, counterpartyNode.id]));
    component.apply();

    expect(collectionsData.sectorMarcaLocalFilter()).toEqual([sectorNode.id]);
    expect(collectionsData.counterpartyFilter()).toEqual([counterpartyNode.counterpartyId]);
  });

  it('cancel() closes the dialog without writing to CollectionsDataService', () => {
    const originalCutoff = collectionsData.cutoffDate();
    component.open();
    (component as any).draftCutoffDate.set('2024-03-01');
    component.cancel();

    expect((component as any).isOpen()).toBe(false);
    expect(collectionsData.cutoffDate()).toBe(originalCutoff);
  });

  it('coherenceWarning is null with no periods selected and set when cutoff precedes the earliest selected period', () => {
    component.open();
    expect((component as any).coherenceWarning()).toBeNull();

    (component as any).draftGranularity.set('mes');
    (component as any).draftPeriodIds.set(new Set(['2026-07']));
    (component as any).draftCutoffDate.set('2026-01-01');

    expect((component as any).coherenceWarning()).toContain('anterior al inicio del período');
  });
});
