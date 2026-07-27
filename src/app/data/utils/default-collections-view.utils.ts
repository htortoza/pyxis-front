/**
 * Cobranzas' analogue of default-view.utils.ts -- pure functions + tenant-namespaced localStorage
 * persistence for the user-defined "default view" (what loads on a fresh page load, and what
 * "Limpiar filtros" resets back to once the user has pressed "Guardar" at least once). Kept as a
 * separate file/storage key (`pyxis:default-view-cobranzas:`) rather than reusing Ventas' because
 * the two shapes diverge (`cutoffDate`/`counterpartyIds` have no Ventas equivalent, and
 * `contextId`/`sectorMarcaTiendaFilter` have no Cobranzas equivalent) -- see
 * [[feedback-backend-contract-is-fixed]].
 */

import type { ComparisonAlignment, ComparisonMode } from '../models/comparison.model';
import type { IvaMode } from '../models/iva.model';
import type { PeriodGranularity } from '../models/period.model';
import { DEFAULT_SELECTED_GRANULARITY, DEFAULT_SELECTED_PERIOD_IDS } from '../mock/periods.mock';
import { TODAY_ISO } from '../mock/collections.mock';

export interface DefaultCollectionsFilterView {
  /** "Saldo al [fecha]" -- stock cutoff, always a single ISO date, never a range. */
  cutoffDate: string;
  periodIds: string[];
  granularity: PeriodGranularity;
  counterpartyIds: string[] | null;
  sectorMarcaLocalFilter: string[] | null;
  compareToPrevious: boolean;
  comparisonMode: ComparisonMode;
  comparisonAlignment: ComparisonAlignment;
  explicitComparisonPeriodIds: string[] | null;
  ivaMode: IvaMode;
}

const STORAGE_KEY_PREFIX = 'pyxis:default-view-cobranzas:';

function isStringArrayOrNull(value: unknown): value is string[] | null {
  return value === null || (Array.isArray(value) && value.every((id) => typeof id === 'string'));
}

function isDefaultCollectionsFilterView(value: unknown): value is DefaultCollectionsFilterView {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['cutoffDate'] === 'string' &&
    Array.isArray(candidate['periodIds']) &&
    candidate['periodIds'].every((id) => typeof id === 'string') &&
    (candidate['granularity'] === 'dia' || candidate['granularity'] === 'semana' || candidate['granularity'] === 'mes') &&
    isStringArrayOrNull(candidate['counterpartyIds']) &&
    isStringArrayOrNull(candidate['sectorMarcaLocalFilter']) &&
    typeof candidate['compareToPrevious'] === 'boolean' &&
    (candidate['comparisonMode'] === 'periodo_anterior' ||
      candidate['comparisonMode'] === 'periodo_especifico' ||
      candidate['comparisonMode'] === 'meta') &&
    (candidate['comparisonAlignment'] === 'calendario' || candidate['comparisonAlignment'] === 'dia_semana') &&
    isStringArrayOrNull(candidate['explicitComparisonPeriodIds']) &&
    (candidate['ivaMode'] === 'con_iva' || candidate['ivaMode'] === 'sin_iva')
  );
}

export function loadDefaultCollectionsView(tenantId: string): DefaultCollectionsFilterView | null {
  try {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${tenantId}`);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    return isDefaultCollectionsFilterView(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function persistDefaultCollectionsView(tenantId: string, view: DefaultCollectionsFilterView): void {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${tenantId}`, JSON.stringify(view));
  } catch {
    // no-op -- persistence must never crash the UI (e.g. quota exceeded, private browsing).
  }
}

/**
 * The hardcoded product default before the user has ever pressed "Guardar" for Cobranzas.
 * `cutoffDate` matches the mock's own `TODAY_ISO` ("fecha de corte por defecto = última carga",
 * spec §4) rather than a separately hardcoded literal, so the two can never silently drift apart.
 */
export function buildHardcodedDefaultCollectionsView(): DefaultCollectionsFilterView {
  return {
    cutoffDate: TODAY_ISO,
    periodIds: [...DEFAULT_SELECTED_PERIOD_IDS],
    granularity: DEFAULT_SELECTED_GRANULARITY,
    counterpartyIds: null,
    sectorMarcaLocalFilter: null,
    compareToPrevious: true,
    comparisonMode: 'periodo_anterior',
    comparisonAlignment: 'calendario',
    explicitComparisonPeriodIds: null,
    ivaMode: 'con_iva',
  };
}
