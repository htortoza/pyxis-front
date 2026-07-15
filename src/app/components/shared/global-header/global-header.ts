import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';

import { SalesDataService } from '../../../services/sales-data.service';
import { ContextFilterComponent } from '../context-filter/context-filter';
import { ContextSelectorComponent } from '../context-selector/context-selector';
import { FilterChipsSummaryComponent } from '../filter-chips-summary/filter-chips-summary';
import { PeriodPickerComponent } from '../period-picker/period-picker';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [
    Toolbar,
    Button,
    PrimeTemplate,
    RouterLink,
    RouterLinkActive,
    ContextSelectorComponent,
    ContextFilterComponent,
    PeriodPickerComponent,
    FilterChipsSummaryComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.html',
  styleUrl: './global-header.css',
})
export class GlobalHeaderComponent {
  protected readonly salesData = inject(SalesDataService);
}
