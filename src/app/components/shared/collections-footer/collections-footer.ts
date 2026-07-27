import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { TODAY_ISO } from '../../../data/mock/collections.mock';
import { CollectionsDataService } from '../../../services/collections-data.service';

const FOOTER_DATE_FORMATTER = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatFooterDate(iso: string): string {
  return FOOTER_DATE_FORMATTER.format(new Date(`${iso}T00:00:00Z`));
}

/**
 * Cobranzas' two dates are not interchangeable (spec §6 "Footer"): `TODAY_ISO` is when the mock
 * "última carga" (ERP ingest) happened -- fixed, independent of any filter. `cutoffDate` is
 * whatever "Saldo al [fecha]" the user picked in the filters modal -- it can be moved into the
 * past, while the data itself was still loaded on `TODAY_ISO`. Showing only one would let a user
 * mistake a backdated cutoff for stale data, or vice versa.
 */
@Component({
  selector: 'app-collections-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collections-footer.html',
  styleUrl: './collections-footer.css',
})
export class CollectionsFooterComponent {
  private readonly collectionsData = inject(CollectionsDataService);

  protected readonly lastLoadLabel = `Última carga: ${formatFooterDate(TODAY_ISO)}`;
  protected readonly cutoffLabel = computed(() => `Saldo al: ${formatFooterDate(this.collectionsData.cutoffDate())}`);
}
