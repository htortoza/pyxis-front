import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Toolbar } from 'primeng/toolbar';
import { PrimeTemplate } from 'primeng/api';

import { MobileNavService } from '../../../services/mobile-nav.service';

export interface GlobalHeaderTab {
  label: string;
  route: string;
  exact?: boolean;
}

/**
 * Module-agnostic shell: toolbar (mobile logo + tabs + hamburger) and the chips-scroll row.
 * Every module-specific bit (filters trigger, chips, Limpiar/Guardar actions) is content
 * projected in by the page that owns it -- this component no longer knows about
 * SalesDataService or any particular module's filter stack. See `[filters-trigger]`/`[chips]`/
 * `[actions]` slots in global-header.html.
 */
@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [Toolbar, PrimeTemplate, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.html',
  styleUrl: './global-header.css',
})
export class GlobalHeaderComponent {
  protected readonly mobileNav = inject(MobileNavService);

  readonly tabs = input<GlobalHeaderTab[]>([]);
}
