import type { DimensionVocabulary, RubroId } from './tenant-vocabulary.model';

/**
 * This app has no real authentication yet -- MockUser stands in for whatever a real
 * logged-in user/session object would look like once a backend exists.
 */
export type UserRole = 'HOLDING_ADMIN' | 'CLIENT_ADMIN' | 'VIEWER_ESTRATEGICO';

export interface MockUser {
  id: string;
  name: string;
  role: UserRole;
  tenantId: string;
  /** Which industry-vocabulary preset this tenant uses (see rubro-presets.mock.ts). */
  rubro: RubroId;
  /**
   * Tenant-specific label overrides, layered on top of the rubro preset. Unset in phase 1 --
   * no admin UI writes to this yet, but the resolution chain already reads from it.
   */
  vocabularyOverrides?: Partial<DimensionVocabulary>;
}
