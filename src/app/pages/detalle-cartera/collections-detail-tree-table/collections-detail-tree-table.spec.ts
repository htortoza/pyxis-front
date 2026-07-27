import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { ReceivableDocument } from '../../../data/models/collections.model';
import { COUNTERPARTIES } from '../../../data/mock/collections.mock';
import { formatSignedAmount } from '../../../pipes/signed-amount';
import { CollectionsDataService } from '../../../services/collections-data.service';
import { CollectionsDetailTreeTableComponent } from './collections-detail-tree-table';

/** Mismo delay artificial que CollectionsDataService.dashboardData (400ms) -- ver mismo patrón en
 * concentracion-cartera.spec.ts/collections-detail-treemap.spec.ts. `scopedDocuments()` es una
 * señal inmediata, pero el template gatea por `collectionsData.loading()`, que sí recorre ese
 * pipeline. */
async function waitForDashboardData(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
}

/** Documento mínimo válido -- mismo patrón que collections-detail-treemap.spec.ts. */
function makeDoc(overrides: Partial<ReceivableDocument>): ReceivableDocument {
  return {
    id: 'doc-fixture-1',
    externalRef: 'F-FIXTURE-1',
    counterpartyId: 'cp-1',
    issueDate: '2026-06-01',
    dueDate: '2026-07-01',
    grossAmount: 1000,
    netAmount: 840,
    appliedAmount: 0,
    creditNoteAmount: 0,
    balance: 1000,
    status: 'VENCIDO',
    daysOverdue: 10,
    currency: 'CLP',
    paidDate: null,
    ...overrides,
  };
}

describe('CollectionsDetailTreeTableComponent', () => {
  let fixture: ComponentFixture<CollectionsDetailTreeTableComponent>;
  let service: CollectionsDataService;

  beforeEach(async () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    await TestBed.configureTestingModule({
      imports: [CollectionsDetailTreeTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionsDetailTreeTableComponent);
    service = TestBed.inject(CollectionsDataService);
  });

  function setDefaultScopeInputs(): void {
    fixture.componentRef.setInput('documents', service.scopedDocuments());
    fixture.componentRef.setInput('cutoffDate', service.cutoffDate());
  }

  it('renderiza sin errores con datos mock reales bajo el scope default', async () => {
    setDefaultScopeInputs();
    fixture.detectChanges();
    await waitForDashboardData();
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.detail-tree-row--contraparte');
    expect(rows.length).toBeGreaterThan(0);

    // Ninguna celda numérica debe quedar como "NaN" en pantalla.
    expect(fixture.nativeElement.textContent).not.toContain('NaN');
  });

  it('la fila de totales cuadra exactamente con saldoTotalFromScope()', async () => {
    setDefaultScopeInputs();
    fixture.detectChanges();
    await waitForDashboardData();
    fixture.detectChanges();

    const totalsRow = fixture.nativeElement.querySelector('.detail-tree-totals-row') as HTMLElement;
    expect(totalsRow).toBeTruthy();

    const expectedSaldo = service.saldoTotalFromScope();
    const formatted = formatSignedAmount(expectedSaldo).text;
    expect(totalsRow.textContent).toContain(formatted);
  });

  it('ordenar por la columna Saldo reordena las filas correctamente', async () => {
    setDefaultScopeInputs();
    fixture.detectChanges();
    await waitForDashboardData();
    fixture.detectChanges();

    const saldoHeader = Array.from(fixture.nativeElement.querySelectorAll('th')).find((th) =>
      (th as HTMLElement).textContent?.trim().startsWith('Saldo'),
    ) as HTMLElement;
    expect(saldoHeader).toBeTruthy();

    saldoHeader.click();
    fixture.detectChanges();

    const labels = Array.from(fixture.nativeElement.querySelectorAll('.detail-tree-row--contraparte .detail-tree-label-text')).map(
      (el) => (el as HTMLElement).textContent?.trim(),
    );

    // component.tree() ya está construido con el scope actual -- reordenamos manualmente para
    // comparar contra lo que el componente debería mostrar tras el clic (descendente, 1er click).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = [...(fixture.componentInstance as any).tree().rows] as { label: string; saldo: number }[];
    rows.sort((a, b) => b.saldo - a.saldo);
    expect(labels).toEqual(rows.map((r) => r.label));
  });

  it('el toggle "Mostrar filas sin saldo" cambia la cantidad de filas visibles', async () => {
    // Construye un doc con balance 0 (appliedAmount === grossAmount exacto) para una contraparte
    // real bajo un id no usado por el resto del scope de este test.
    const zeroBalanceCounterpartyId = COUNTERPARTIES[0].id;
    const zeroBalanceDoc = makeDoc({
      id: 'doc-zero-balance',
      externalRef: 'F-ZERO',
      counterpartyId: zeroBalanceCounterpartyId,
      grossAmount: 500,
      appliedAmount: 500,
      creditNoteAmount: 0,
      balance: 0,
      status: 'PAGADO',
      daysOverdue: 0,
    });

    fixture.componentRef.setInput('documents', [zeroBalanceDoc]);
    fixture.componentRef.setInput('cutoffDate', service.cutoffDate());
    fixture.detectChanges();
    await waitForDashboardData();
    fixture.detectChanges();

    const hiddenCount = fixture.nativeElement.querySelectorAll('.detail-tree-row--contraparte').length;
    expect(hiddenCount).toBe(0);

    // p-toggleswitch wires its toggle behavior to a (click) HOST listener (onHostClick), not to
    // the inner <input>'s own change event -- click the host element itself.
    const toggleHost = fixture.nativeElement.querySelector('.detail-tree-zero-balance-toggle p-toggleswitch') as HTMLElement;
    expect(toggleHost).toBeTruthy();
    toggleHost.click();
    fixture.detectChanges();
    await waitForDashboardData();
    fixture.detectChanges();

    const shownCount = fixture.nativeElement.querySelectorAll('.detail-tree-row--contraparte').length;
    expect(shownCount).toBe(1);
  });

  it('buscar el externalRef de un documento real auto-expande su contraparte', async () => {
    setDefaultScopeInputs();
    fixture.detectChanges();
    await waitForDashboardData();
    fixture.detectChanges();

    const realDoc = service.scopedDocuments()[0];
    expect(realDoc).toBeTruthy();

    const searchInput = fixture.nativeElement.querySelector('.detail-tree-search input') as HTMLInputElement;
    searchInput.value = realDoc.externalRef;
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // debounceTime(300)
    await new Promise((resolve) => setTimeout(resolve, 350));
    fixture.detectChanges();

    const docCell = Array.from(fixture.nativeElement.querySelectorAll('.doc-cell--folio')).find((el) =>
      (el as HTMLElement).textContent?.includes(realDoc.externalRef),
    );
    expect(docCell).toBeTruthy();
  });

  it('una fila con utilizacionPct >= 1 muestra la marca de advertencia de sobre-límite', async () => {
    const withLimit = COUNTERPARTIES.find((c) => c.creditLimit !== null && c.creditLimit > 0);
    expect(withLimit).toBeTruthy();

    const overLimitDoc = makeDoc({
      id: 'doc-over-limit',
      externalRef: 'F-OVER-LIMIT',
      counterpartyId: withLimit!.id,
      grossAmount: withLimit!.creditLimit! + 5_000_000,
      appliedAmount: 0,
      creditNoteAmount: 0,
      balance: withLimit!.creditLimit! + 5_000_000,
      status: 'VENCIDO',
      daysOverdue: 15,
    });

    fixture.componentRef.setInput('documents', [overLimitDoc]);
    fixture.componentRef.setInput('cutoffDate', service.cutoffDate());
    fixture.detectChanges();
    await waitForDashboardData();
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.over-limit-badge');
    expect(badge).toBeTruthy();

    const overLimitRow = fixture.nativeElement.querySelector('.detail-tree-row--over-limit');
    expect(overLimitRow).toBeTruthy();
  });
});
