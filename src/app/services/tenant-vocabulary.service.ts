import { Injectable } from '@angular/core';

import { CURRENT_USER } from '../data/mock/mock-user.mock';
import { RUBRO_PRESETS } from '../data/mock/rubro-presets.mock';
import { resolveDimensionLabel } from '../data/utils/tenant-vocabulary.utils';
import type { FilterNodeType } from '../data/utils/sector-marca-tienda-tree.utils';

/**
 * Resolves Sector/Marca/Tienda display labels for the current tenant. See
 * resolveDimensionLabel (tenant-vocabulary.utils.ts) for the fallback chain itself --
 * this service only binds it to the current mock tenant and the retail preset.
 */
@Injectable({ providedIn: 'root' })
export class TenantVocabularyService {
  /** Mock stand-in for the real logged-in user -- see CURRENT_USER doc comment in mock-user.mock.ts. */
  readonly currentUser = CURRENT_USER;

  labelFor(dimension: FilterNodeType): string {
    return resolveDimensionLabel(
      dimension,
      this.currentUser.vocabularyOverrides,
      RUBRO_PRESETS[this.currentUser.rubro],
    );
  }
}
