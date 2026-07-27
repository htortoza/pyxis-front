import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsContextFilterComponent } from './collections-context-filter';
import { SECTORES } from '../../../data/mock/context-tree.mock';

@Component({
  standalone: true,
  imports: [CollectionsContextFilterComponent],
  template: `<app-collections-context-filter [(checkedIds)]="checkedIds" />`,
})
class HostComponent {
  readonly checkedIds = signal<Set<string>>(new Set());
}

describe('CollectionsContextFilterComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function columnTitles(): string[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('.collections-context-filter-column-title'),
    ).map((el) => (el as HTMLElement).textContent?.trim() ?? '');
  }

  it('renders the 4 column headers: Sector/Marca/Local/Contraparte (retail preset labels)', () => {
    const titles = columnTitles();
    expect(titles).toEqual(['Sectores', 'Marcas', 'Tiendas', 'Recaudador']);
  });

  it('renders a Sector row for every Sector in the mock data', () => {
    const rows = fixture.nativeElement.querySelectorAll(
      '.collections-context-filter-column:first-child .collections-context-filter-row',
    );
    expect(rows.length).toBe(SECTORES.length);
  });

  it('toggling a Sector checkbox updates checkedIds (two-way model)', () => {
    const sectorId = SECTORES[0].id;
    expect(host.checkedIds().has(sectorId)).toBe(false);

    const component = fixture.debugElement.children[0].componentInstance as CollectionsContextFilterComponent;
    component.toggleCheckbox(sectorId);
    fixture.detectChanges();

    expect(host.checkedIds().has(sectorId)).toBe(true);

    component.toggleCheckbox(sectorId);
    fixture.detectChanges();
    expect(host.checkedIds().has(sectorId)).toBe(false);
  });

  it('checking a Sector navigates into it, populating the Marca column', () => {
    const sectorId = SECTORES[0].id;
    const component = fixture.debugElement.children[0].componentInstance as CollectionsContextFilterComponent;

    component.toggleCheckbox(sectorId);
    fixture.detectChanges();

    expect((component as any).navSectorId()).toBe(sectorId);
  });

  it('shows a pinned "Sin asociación comercial" row that is always visible in the Contraparte column', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Sin asociación comercial');
  });

  it('the summary reflects "Sin selección" when nothing is checked', () => {
    const summary = fixture.nativeElement.querySelector('.collections-context-filter-summary');
    expect(summary.textContent.trim()).toBe('Sin selección');
  });
});
