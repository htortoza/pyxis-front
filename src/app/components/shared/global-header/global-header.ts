import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';

import { SalesDataService } from '../../../services/sales-data.service';
import { ContextSelectorComponent } from '../context-selector/context-selector';
import { PeriodSelectorComponent } from '../period-selector/period-selector';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [Toolbar, Button, PrimeTemplate, ContextSelectorComponent, PeriodSelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.html',
  styleUrl: './global-header.css',
})
export class GlobalHeaderComponent {
  protected readonly salesData = inject(SalesDataService);
}
