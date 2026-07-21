import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { Tooltip } from 'primeng/tooltip';

import { MobileNavService } from '../../../services/mobile-nav.service';
import { SalesDataService } from '../../../services/sales-data.service';
import { FilterChipsSummaryComponent } from '../filter-chips-summary/filter-chips-summary';
import { FiltersModalComponent } from '../filters-modal/filters-modal';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [
    Toolbar,
    Button,
    PrimeTemplate,
    RouterLink,
    RouterLinkActive,
    FiltersModalComponent,
    FilterChipsSummaryComponent,
    Tooltip,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.html',
  styleUrl: './global-header.css',
})
export class GlobalHeaderComponent {
  protected readonly salesData = inject(SalesDataService);
  protected readonly mobileNav = inject(MobileNavService);
}
