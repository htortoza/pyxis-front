import type { SavedView } from '../models/saved-view.model';
import { normalizeSavedView, seedDefaultViews } from './saved-views.utils';

function legacyRawView(overrides: Partial<SavedView> = {}): SavedView {
  // Simula un registro persistido ANTES de que existieran los 5 campos nuevos --
  // JSON.parse de localStorage no los tendría, así que se castea a partir de un
  // objeto que literalmente no los incluye.
  const legacy = {
    id: 'v1',
    label: 'Vista Vieja',
    ownerId: 'user-demo',
    ownerName: 'Usuario Demo',
    tenantId: 'tenant-demo',
    scope: 'personal',
    periodIds: ['2026-01'],
    compareToPrevious: true,
    checkedNodeIds: ['sector-costanera'],
    createdAt: '2026-01-01T00:00:00.000Z',
    lastUsedAt: '2026-01-01T00:00:00.000Z',
  } as SavedView;
  return { ...legacy, ...overrides };
}

describe('normalizeSavedView', () => {
  it('fills the 5 new fields with their implicit legacy defaults when absent', () => {
    const result = normalizeSavedView(legacyRawView());
    expect(result.granularity).toBe('mes');
    expect(result.comparisonMode).toBe('periodo_anterior');
    expect(result.comparisonAlignment).toBe('calendario');
    expect(result.explicitComparisonPeriodIds).toBeNull();
    expect(result.ivaMode).toBe('con_iva');
  });

  it('leaves already-present new fields untouched', () => {
    const result = normalizeSavedView(
      legacyRawView({
        granularity: 'semana',
        comparisonMode: 'meta',
        comparisonAlignment: 'dia_semana',
        explicitComparisonPeriodIds: ['2026-W10'],
        ivaMode: 'sin_iva',
      }),
    );
    expect(result.granularity).toBe('semana');
    expect(result.comparisonMode).toBe('meta');
    expect(result.comparisonAlignment).toBe('dia_semana');
    expect(result.explicitComparisonPeriodIds).toEqual(['2026-W10']);
    expect(result.ivaMode).toBe('sin_iva');
  });

  it('preserves the core fields unchanged', () => {
    const result = normalizeSavedView(legacyRawView());
    expect(result.id).toBe('v1');
    expect(result.checkedNodeIds).toEqual(['sector-costanera']);
  });
});

describe('seedDefaultViews', () => {
  it('includes explicit values for the 5 new fields on every seeded view', () => {
    const seeded = seedDefaultViews('tenant-demo', 'user-demo', 'Usuario Demo');
    for (const view of seeded) {
      expect(view.granularity).toBe('mes');
      expect(view.comparisonMode).toBe('periodo_anterior');
      expect(view.comparisonAlignment).toBe('calendario');
      expect(view.explicitComparisonPeriodIds).toBeNull();
      expect(view.ivaMode).toBe('con_iva');
    }
  });
});
