import { TestBed } from '@angular/core/testing';

import { COUNTERPARTIES, RECEIVABLE_DOCUMENTS, TODAY_ISO } from '../data/mock/collections.mock';
import { addDaysIso } from '../data/utils/date.utils';
import { CollectionsDataService } from './collections-data.service';

/** Cross-check contra el mock crudo -- documentos no-PAGADO existentes a la fecha de corte por
 * defecto (== TODAY_ISO), sin filtro de dimensión. Es la semántica que scopedDocuments DEBE
 * reproducir; comparar contra esto (y no contra un número mágico) mantiene el test legible si el
 * mock cambia, sin ser una copia literal de la implementación del servicio. */
function expectedDefaultScopeDocIds(): Set<string> {
  return new Set(
    RECEIVABLE_DOCUMENTS.filter((doc) => doc.status !== 'PAGADO' && doc.issueDate <= TODAY_ISO).map(
      (doc) => doc.id,
    ),
  );
}

describe('CollectionsDataService', () => {
  let service: CollectionsDataService;

  beforeEach(() => {
    // Aislar de un saveAsDefault persistido por otro test (localStorage sobrevive entre tests en jsdom).
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionsDataService);
  });

  it('arranca en el default: corte = TODAY_ISO, mes, con_iva, sin filtros de dimensión', () => {
    expect(service.cutoffDate()).toBe(TODAY_ISO);
    expect(service.selectedPeriodGranularity()).toBe('mes');
    expect(service.ivaMode()).toBe('con_iva');
    expect(service.counterpartyFilter()).toBeNull();
    expect(service.sectorMarcaLocalFilter()).toBeNull();
    expect(service.hasActiveFilter()).toBe(false);
  });

  it('scopedDocuments excluye PAGADO y respeta la fecha de corte, cuadrando con el mock', () => {
    const scopedIds = new Set(service.scopedDocuments().map((doc) => doc.id));
    expect(scopedIds).toEqual(expectedDefaultScopeDocIds());
    expect(service.scopedDocuments().every((doc) => doc.status !== 'PAGADO')).toBe(true);
    expect(service.scopedDocuments().every((doc) => doc.issueDate <= service.cutoffDate())).toBe(true);
  });

  it('saldoTotalFromScope = suma de balances de scopedDocuments (una sola fuente, no puede divergir)', () => {
    const expected = service.scopedDocuments().reduce((sum, doc) => sum + doc.balance, 0);
    expect(service.saldoTotalFromScope()).toBe(expected);
    expect(service.saldoTotalFromScope()).toBeGreaterThan(0);
  });

  it('en Sin IVA el saldo neto es menor que el bruto (Con IVA)', () => {
    const gross = service.saldoTotalFromScope();
    service.ivaMode.set('sin_iva');
    const net = service.saldoTotalFromScope();
    expect(net).toBeLessThan(gross);
    // scopedDocumentsGross ignora el toggle -- la Proyección (SP3) siempre opera sobre bruto.
    const grossFromGrossView = service.scopedDocumentsGross().reduce((s, d) => s + d.balance, 0);
    expect(grossFromGrossView).toBe(gross);
  });

  it('setCounterpartyFilter reduce el scope a esa contraparte', () => {
    const target = COUNTERPARTIES[0].id;
    service.setCounterpartyFilter([target]);
    const scoped = service.scopedDocuments();
    expect(scoped.length).toBeGreaterThan(0);
    expect(scoped.every((doc) => doc.counterpartyId === target)).toBe(true);
    expect(service.hasActiveFilter()).toBe(true);
  });

  it('setCrossFilter alterna: mismo dimension+id lo limpia', () => {
    service.setCrossFilter('contraparte', COUNTERPARTIES[0].id);
    expect(service.crossFilter()).toEqual({ dimension: 'contraparte', id: COUNTERPARTIES[0].id });
    service.setCrossFilter('contraparte', COUNTERPARTIES[0].id);
    expect(service.crossFilter()).toBeNull();
  });

  it('clearFilters restaura el default y limpia el cross-filter', () => {
    service.cutoffDate.set('2026-06-30');
    service.setCounterpartyFilter([COUNTERPARTIES[0].id]);
    service.setCrossFilter('contraparte', COUNTERPARTIES[1].id);
    expect(service.hasActiveFilter()).toBe(true);

    service.clearFilters();
    expect(service.cutoffDate()).toBe(TODAY_ISO);
    expect(service.counterpartyFilter()).toBeNull();
    expect(service.crossFilter()).toBeNull();
    expect(service.hasActiveFilter()).toBe(false);
  });

  it('hasActiveFilter se activa al cambiar la fecha de corte', () => {
    expect(service.hasActiveFilter()).toBe(false);
    service.cutoffDate.set('2026-06-30');
    expect(service.hasActiveFilter()).toBe(true);
  });

  it('a un corte histórico (~1 mes antes de TODAY_ISO), un documento PAGADO hoy pero pagado DESPUÉS de ese corte reaparece reconstruido', () => {
    // Corte histórico -- ~1 mes antes de TODAY_ISO (spec Task 1: "análogo a restar 1 mes a cutoffDate").
    const historicalCutoff = addDaysIso(TODAY_ISO, -30);
    // Buscado en el mock real (no un ID hardcodeado): un documento PAGADO cuya paidDate cae DESPUÉS
    // de ese corte -- por Task 1, `documentStateAsOf` debe reconstruirlo como POR_VENCER/VENCIDO en
    // vez de excluirlo, aunque hoy (TODAY_ISO) ya esté PAGADO.
    const candidate = RECEIVABLE_DOCUMENTS.find(
      (doc) => doc.status === 'PAGADO' && doc.paidDate !== null && doc.paidDate > historicalCutoff,
    );
    expect(candidate).toBeDefined();

    service.cutoffDate.set(historicalCutoff);
    const reconstructed = service.scopedDocuments().find((doc) => doc.id === candidate!.id);
    expect(reconstructed).toBeDefined();
    expect(['POR_VENCER', 'VENCIDO']).toContain(reconstructed!.status);
  });

  it('saldoTotal (tras el pipeline de carga de 400ms) refleja el scope actual', async () => {
    service.setCounterpartyFilter([COUNTERPARTIES[0].id]);
    // dashboardData recomputa detrás de un delay artificial de 400ms (ver doc del servicio).
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(service.saldoTotal()).toBe(service.saldoTotalFromScope());
  });
});
