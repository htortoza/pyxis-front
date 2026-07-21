/**
 * Pure functions + tenant-namespaced localStorage persistence for the user-defined "default
 * view" -- what loads on a fresh page load, and what "Limpiar filtros" resets back to, once the
 * user has pressed "Guardar" at least once. Same mock-persistence rationale as
 * saved-views.utils.ts (no backend yet); this is a single object, not a list, so it skips that
 * file's scope/access-reconciliation logic entirely.
 */

import type { ComparisonAlignment, ComparisonMode } from '../models/comparison.model';
import type { IvaMode } from '../models/iva.model';
import type { PeriodGranularity } from '../models/period.model';

export interface DefaultFilterView {
  contextId: string;
  periodIds: string[];
  granularity: PeriodGranularity;
  sectorMarcaTiendaFilter: string[] | null;
  compareToPrevious: boolean;
  comparisonMode: ComparisonMode;
  comparisonAlignment: ComparisonAlignment;
  explicitComparisonPeriodIds: string[] | null;
  ivaMode: IvaMode;
}

const STORAGE_KEY_PREFIX = 'pyxis:default-view:';

function isStringArrayOrNull(value: unknown): value is string[] | null {
  return value === null || (Array.isArray(value) && value.every((id) => typeof id === 'string'));
}

function isDefaultFilterView(value: unknown): value is DefaultFilterView {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['contextId'] === 'string' &&
    Array.isArray(candidate['periodIds']) &&
    candidate['periodIds'].every((id) => typeof id === 'string') &&
    (candidate['granularity'] === 'dia' || candidate['granularity'] === 'semana' || candidate['granularity'] === 'mes') &&
    isStringArrayOrNull(candidate['sectorMarcaTiendaFilter']) &&
    typeof candidate['compareToPrevious'] === 'boolean' &&
    (candidate['comparisonMode'] === 'periodo_anterior' ||
      candidate['comparisonMode'] === 'periodo_especifico' ||
      candidate['comparisonMode'] === 'meta') &&
    (candidate['comparisonAlignment'] === 'calendario' || candidate['comparisonAlignment'] === 'dia_semana') &&
    isStringArrayOrNull(candidate['explicitComparisonPeriodIds']) &&
    (candidate['ivaMode'] === 'con_iva' || candidate['ivaMode'] === 'sin_iva')
  );
}

export function loadDefaultView(tenantId: string): DefaultFilterView | null {
  try {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${tenantId}`);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isDefaultFilterView(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function persistDefaultView(tenantId: string, view: DefaultFilterView): void {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${tenantId}`, JSON.stringify(view));
  } catch {
    // no-op -- persistence must never crash the UI (e.g. quota exceeded, private browsing).
  }
}

/** Same string-array-or-null equality every "does the current filter match the default" check
 * needs -- order-independent (a Set comparison), so re-selecting the same ids in a different
 * order still counts as unchanged. */
export function sameStringArrayOrNull(a: string[] | null, b: string[] | null): boolean {
  if (a === null || b === null) {
    return a === b;
  }
  if (a.length !== b.length) {
    return false;
  }
  const setB = new Set(b);
  return a.every((id) => setB.has(id));
}
