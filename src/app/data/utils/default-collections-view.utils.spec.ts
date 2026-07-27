import {
  buildHardcodedDefaultCollectionsView,
  loadDefaultCollectionsView,
  persistDefaultCollectionsView,
  type DefaultCollectionsFilterView,
} from './default-collections-view.utils';

describe('default-collections-view.utils', () => {
  const TENANT_ID = 'tenant-spec-cobranzas';

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('buildHardcodedDefaultCollectionsView returns the product-hardcoded defaults', () => {
    const view = buildHardcodedDefaultCollectionsView();
    expect(view.cutoffDate).toBe('2026-07-25');
    expect(view.granularity).toBe('mes');
    expect(view.periodIds.length).toBeGreaterThan(0);
    expect(view.counterpartyIds).toBeNull();
    expect(view.sectorMarcaLocalFilter).toBeNull();
    expect(view.compareToPrevious).toBe(true);
    expect(view.comparisonMode).toBe('periodo_anterior');
    expect(view.comparisonAlignment).toBe('calendario');
    expect(view.explicitComparisonPeriodIds).toBeNull();
    expect(view.ivaMode).toBe('con_iva');
  });

  it('load returns null when nothing was ever persisted for this tenant', () => {
    expect(loadDefaultCollectionsView(TENANT_ID)).toBeNull();
  });

  it('persist -> load roundtrips to an equal object', () => {
    const view: DefaultCollectionsFilterView = {
      cutoffDate: '2026-07-10',
      periodIds: ['2026-06', '2026-07'],
      granularity: 'mes',
      counterpartyIds: ['cp-a', 'cp-b'],
      sectorMarcaLocalFilter: ['local-1'],
      compareToPrevious: false,
      comparisonMode: 'meta',
      comparisonAlignment: 'dia_semana',
      explicitComparisonPeriodIds: ['2026-01'],
      ivaMode: 'sin_iva',
    };

    persistDefaultCollectionsView(TENANT_ID, view);
    const loaded = loadDefaultCollectionsView(TENANT_ID);
    expect(loaded).toEqual(view);
  });

  it('load returns null for malformed JSON instead of throwing', () => {
    localStorage.setItem(`pyxis:default-view-cobranzas:${TENANT_ID}`, '{not valid json');
    expect(() => loadDefaultCollectionsView(TENANT_ID)).not.toThrow();
    expect(loadDefaultCollectionsView(TENANT_ID)).toBeNull();
  });

  it('load returns null when the stored shape does not match DefaultCollectionsFilterView', () => {
    localStorage.setItem(
      `pyxis:default-view-cobranzas:${TENANT_ID}`,
      JSON.stringify({ cutoffDate: '2026-07-10' }),
    );
    expect(loadDefaultCollectionsView(TENANT_ID)).toBeNull();
  });

  it('namespaces storage per tenantId', () => {
    const viewA: DefaultCollectionsFilterView = { ...buildHardcodedDefaultCollectionsView(), cutoffDate: '2026-01-01' };
    persistDefaultCollectionsView('tenant-a', viewA);
    expect(loadDefaultCollectionsView('tenant-b')).toBeNull();
    expect(loadDefaultCollectionsView('tenant-a')?.cutoffDate).toBe('2026-01-01');
  });
});
