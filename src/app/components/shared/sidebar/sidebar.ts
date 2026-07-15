import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { Tag } from 'primeng/tag';

import { CURRENT_USER } from '../../../data/mock/mock-user.mock';
import type { UserRole } from '../../../data/models/mock-user.model';
import { SidebarIconComponent, type SidebarIconKey } from './sidebar-icon/sidebar-icon';

interface SidebarItem {
  label: string;
  icon: SidebarIconKey;
  enabled: boolean;
  route?: string;
  /** Routes (besides its own) that should also count as "this item is active" -- e.g. Ventas
   * owns both the General and Detalle routes but is a single sidebar entry, not two. */
  matchPrefixes?: string[];
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

/**
 * Static roadmap of every module, enabled or not -- the sidebar deliberately shows disabled
 * items (grayed out, tagged "Pronto") so the product's full scope is visible, not just what's
 * live today. No tenant/rubro branching: the same structure renders for every tenant.
 */
const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: 'Visor Estratégico',
    items: [
      { label: 'Ventas', icon: 'ventas', enabled: true, route: '/', matchPrefixes: ['/', '/detalle-ventas'] },
      { label: 'Márgenes', icon: 'margenes', enabled: false },
      { label: 'Comparativos', icon: 'comparativos', enabled: false },
    ],
  },
  {
    title: 'Administración',
    items: [
      { label: 'Motor de mapeo ERP', icon: 'erp', enabled: false },
      { label: 'Carga de datos', icon: 'carga', enabled: false },
      { label: 'Gobernanza y permisos', icon: 'gobernanza', enabled: false },
      { label: 'Panel del tenant', icon: 'tenant', enabled: false },
    ],
  },
  {
    title: 'BI Pyxis Interno',
    items: [{ label: 'Backoffice multi-tenant', icon: 'backoffice', enabled: false }],
  },
];

const ROLE_LABELS: Record<UserRole, string> = {
  HOLDING_ADMIN: 'Administrador Holding',
  CLIENT_ADMIN: 'Administrador Cliente',
  VIEWER_ESTRATEGICO: 'Visor Estratégico',
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, Tag, SidebarIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  private readonly router = inject(Router);

  protected readonly sections = SIDEBAR_SECTIONS;
  protected readonly currentUser = CURRENT_USER;
  protected readonly roleLabel = ROLE_LABELS[CURRENT_USER.role];
  protected readonly userInitial = CURRENT_USER.name.charAt(0).toUpperCase();

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected isItemActive(item: SidebarItem): boolean {
    if (!item.matchPrefixes) return false;
    const url = this.currentUrl();
    return item.matchPrefixes.some((prefix) => (prefix === '/' ? url === '/' : url.startsWith(prefix)));
  }
}
