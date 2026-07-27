import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { Counterparty, ReceivableDocument } from '../../../data/models/collections.model';
import { COUNTERPARTIES } from '../../../data/mock/collections.mock';
import { buildCollectionsTreemapBand } from '../../../data/utils/collections-detail-treemap.utils';
import { squarify } from '../../../data/utils/sales-detail-treemap.utils';
import { CollectionsDataService } from '../../../services/collections-data.service';
import { CollectionsDetailTreemapComponent } from './collections-detail-treemap';

/** Mismo delay artificial que CollectionsDataService.dashboardData (400ms) -- ver mismo patrón en
 * concentracion-cartera.spec.ts. `scopedDocuments()` es una señal inmediata, pero el template
 * gatea por `collectionsData.loading()`, que SÍ recorre ese pipeline. */
async function waitForDashboardData(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
}

/** Documento mínimo válido -- solo los campos que `buildCollectionsTreemapBand` efectivamente lee
 * importan, mismo patrón que `collections-detail-treemap.utils.spec.ts`. */
function makeDoc(overrides: Partial<ReceivableDocument>): ReceivableDocument {
  return {
    id: 'doc-1',
    externalRef: 'F-1',
    counterpartyId: 'cp-1',
    issueDate: '2026-01-01',
    dueDate: '2026-02-01',
    grossAmount: 1000,
    netAmount: 840,
    appliedAmount: 0,
    creditNoteAmount: 0,
    balance: 1000,
    status: 'POR_VENCER',
    daysOverdue: 0,
    currency: 'CLP',
    paidDate: null,
    ...overrides,
  };
}

function makeCounterparty(overrides: Partial<Counterparty>): Counterparty {
  return {
    id: 'cp-1',
    label: 'Contraparte 1',
    type: 'CLIENTE_CREDITO',
    societaryNodeId: 'node-1',
    commercialNodeIds: [],
    creditLimit: 1000,
    creditTermDays: 30,
    currency: 'CLP',
    ...overrides,
  };
}

describe('CollectionsDetailTreemapComponent', () => {
  let fixture: ComponentFixture<CollectionsDetailTreemapComponent>;
  let service: CollectionsDataService;

  beforeEach(async () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    await TestBed.configureTestingModule({
      imports: [CollectionsDetailTreemapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsDetailTreemapComponent);
    service = TestBed.inject(CollectionsDataService);
  });

  it('renderiza sin errores con service.scopedDocuments() real, cubriendo el contenedor (mismo humo de squarify)', async () => {
    fixture.componentRef.setInput('documents', service.scopedDocuments());
    await waitForDashboardData();
    fixture.detectChanges();

    const expectedEntries = buildCollectionsTreemapBand(service.scopedDocuments(), COUNTERPARTIES);
    const blocks = fixture.nativeElement.querySelectorAll('.treemap-block');
    expect(blocks.length).toBe(expectedEntries.length);

    const container = { x: 0, y: 0, width: 800, height: 600 };
    const rects = squarify(
      expectedEntries.map((e) => e.saldo),
      container,
    );
    const totalArea = rects.reduce((sum, r) => sum + r.width * r.height, 0);
    expect(totalArea).toBeCloseTo(container.width * container.height, 3);
  });

  it('el color va de intensidad baja a alta según avgDaysOverdueWeighted', async () => {
    const lowMoraCp = makeCounterparty({ id: 'cp-low', label: 'Mora baja' });
    const highMoraCp = makeCounterparty({ id: 'cp-high', label: 'Mora alta' });
    const documents = [
      makeDoc({ id: 'd-low', counterpartyId: 'cp-low', balance: 500_000, daysOverdue: 2, status: 'VENCIDO' }),
      makeDoc({ id: 'd-high', counterpartyId: 'cp-high', balance: 500_000, daysOverdue: 120, status: 'VENCIDO' }),
    ];

    fixture.componentRef.setInput('documents', documents);
    await waitForDashboardData();
    fixture.detectChanges();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const component = fixture.componentInstance as any;
    const layout = component.layout();
    const lowEntry = layout.find((l: { entry: { id: string } }) => l.entry.id === 'cp-low');
    const highEntry = layout.find((l: { entry: { id: string } }) => l.entry.id === 'cp-high');
    expect(lowEntry).toBeTruthy();
    expect(highEntry).toBeTruthy();

    const lowAlpha = Number(component.blockStyle(lowEntry.entry, lowEntry.rect)['background-color'].match(/[\d.]+(?=\))/)[0]);
    const highAlpha = Number(component.blockStyle(highEntry.entry, highEntry.rect)['background-color'].match(/[\d.]+(?=\))/)[0]);
    expect(highAlpha).toBeGreaterThan(lowAlpha);
  });

  // El componente resuelve `label` contra la constante real `COUNTERPARTIES` del mock (no recibe
  // contrapartes por input, ver decisión de diseño en el reporte) -- por eso estos 2 tests, que
  // verifican TEXTO de label, arman sus documentos sobre ids reales del mock (nombres fijos y
  // únicos: Transbank/Getnet Chile/Mercado Pago POS/Rappi) en vez de contrapartes fabricadas a
  // mano, que resolverían todas al mismo label "Contraparte no mapeada" y no discriminarían nada.
  function realCounterpartyId(label: string): string {
    const found = COUNTERPARTIES.find((c) => c.label === label);
    if (!found) throw new Error(`Fixture assumption broken: no counterparty labeled "${label}" in COUNTERPARTIES`);
    return found.id;
  }

  it('el diálogo de long-tail abre, filtra por búsqueda, y cierra', async () => {
    const bigId = realCounterpartyId('Transbank');
    const tiny1Id = realCounterpartyId('Getnet Chile');
    const tiny2Id = realCounterpartyId('Mercado Pago POS');
    const tiny3Id = realCounterpartyId('Rappi');
    const documents = [
      makeDoc({ id: 'd-big', counterpartyId: bigId, balance: 1_940_000 }),
      makeDoc({ id: 'd-tiny-1', counterpartyId: tiny1Id, balance: 10_000 }),
      makeDoc({ id: 'd-tiny-2', counterpartyId: tiny2Id, balance: 10_000 }),
      makeDoc({ id: 'd-tiny-3', counterpartyId: tiny3Id, balance: 10_000 }),
    ];

    fixture.componentRef.setInput('documents', documents);
    await waitForDashboardData();
    fixture.detectChanges();

    const longTailButton = Array.from(fixture.nativeElement.querySelectorAll('.treemap-block.is-long-tail')) as HTMLButtonElement[];
    expect(longTailButton.length).toBe(1);
    longTailButton[0].click();
    fixture.detectChanges();

    let rows = fixture.nativeElement.querySelectorAll('.treemap-long-tail-row');
    expect(rows.length).toBe(3);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const component = fixture.componentInstance as any;
    component.longTailSearch.set('getnet');
    fixture.detectChanges();

    rows = fixture.nativeElement.querySelectorAll('.treemap-long-tail-row');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Getnet Chile');

    component.closeLongTail();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.treemap-long-tail-list')).toBeNull();
  });

  it('clickear un item dentro del diálogo de long-tail emite counterpartyFocused', async () => {
    const bigId = realCounterpartyId('Transbank');
    const tiny1Id = realCounterpartyId('Getnet Chile');
    const tiny2Id = realCounterpartyId('Mercado Pago POS');
    const tiny3Id = realCounterpartyId('Rappi');
    const documents = [
      makeDoc({ id: 'd-big', counterpartyId: bigId, balance: 1_940_000 }),
      makeDoc({ id: 'd-tiny-1', counterpartyId: tiny1Id, balance: 10_000 }),
      makeDoc({ id: 'd-tiny-2', counterpartyId: tiny2Id, balance: 10_000 }),
      makeDoc({ id: 'd-tiny-3', counterpartyId: tiny3Id, balance: 10_000 }),
    ];

    fixture.componentRef.setInput('documents', documents);
    await waitForDashboardData();
    fixture.detectChanges();

    let emitted: string | null = null;
    fixture.componentInstance.counterpartyFocused.subscribe((id: string) => (emitted = id));

    (fixture.nativeElement.querySelector('.treemap-block.is-long-tail') as HTMLButtonElement).click();
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.treemap-long-tail-row') as HTMLButtonElement).click();
    expect(emitted).not.toBeNull();
  });

  it('focusedCounterpartyId con un id inexistente en la banda actual no lanza excepción y no resalta nada', async () => {
    fixture.componentRef.setInput('documents', service.scopedDocuments());
    fixture.componentRef.setInput('focusedCounterpartyId', 'cp-no-existe-en-esta-banda');
    await waitForDashboardData();

    expect(() => fixture.detectChanges()).not.toThrow();

    const focused = fixture.nativeElement.querySelectorAll('.treemap-block.is-focused');
    expect(focused.length).toBe(0);
  });

  it('focusedCounterpartyId con un id existente resalta el bloque correspondiente', async () => {
    const documents = service.scopedDocuments();
    fixture.componentRef.setInput('documents', documents);
    const targetId = buildCollectionsTreemapBand(documents, COUNTERPARTIES).find((e) => !e.isLongTail)?.id ?? null;
    expect(targetId).not.toBeNull();
    fixture.componentRef.setInput('focusedCounterpartyId', targetId);
    await waitForDashboardData();
    fixture.detectChanges();

    const focused = fixture.nativeElement.querySelectorAll('.treemap-block.is-focused');
    expect(focused.length).toBe(1);
  });
});
