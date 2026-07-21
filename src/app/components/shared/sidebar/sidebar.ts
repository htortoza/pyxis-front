import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PrimeTemplate, type MenuItem } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { Menu } from 'primeng/menu';

import { CURRENT_USER } from '../../../data/mock/mock-user.mock';
import type { UserRole } from '../../../data/models/mock-user.model';
import { MobileNavService } from '../../../services/mobile-nav.service';

/** Same 900px breakpoint global-header.css/sidebar.css use for the mobile layout switch. */
const MOBILE_MEDIA_QUERY = '(max-width: 900px)';

/** jsdom (the test environment) has no matchMedia implementation -- guards every call site,
 * not just `typeof window`, which alone isn't enough (window exists in jsdom, matchMedia doesn't). */
function mobileMediaQueryList(): MediaQueryList | null {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(MOBILE_MEDIA_QUERY)
    : null;
}

const SOON_BADGE = { badge: 'Pronto', badgeStyleClass: 'sidebar-badge-soon' };

/**
 * Static roadmap of every module, enabled or not -- the sidebar deliberately shows disabled
 * items (grayed out, tagged "Pronto") so the product's full scope is visible, not just what's
 * live today. No tenant/rubro branching: the same structure renders for every tenant.
 *
 * Ventas is a single entry routed to '/' -- the General/Detalle split lives as sub-navigation
 * inside the global header, not as two sidebar items. Its default routerLinkActiveOptions
 * ({ exact: false }) is exactly what makes it read active on both '/' and '/detalle-ventas'.
 */
const MENU_MODEL: MenuItem[] = [
  {
    label: 'Visor Estratégico',
    items: [
      { label: 'Ventas', icon: 'pi pi-chart-line', routerLink: '/' },
      { label: 'Márgenes', icon: 'pi pi-percentage', disabled: true, ...SOON_BADGE },
      { label: 'Comparativos', icon: 'pi pi-clone', disabled: true, ...SOON_BADGE },
    ],
  },
  {
    label: 'Administración',
    items: [
      { label: 'Motor de mapeo ERP', icon: 'pi pi-sitemap', disabled: true, ...SOON_BADGE },
      { label: 'Carga de datos', icon: 'pi pi-upload', disabled: true, ...SOON_BADGE },
      { label: 'Gobernanza y permisos', icon: 'pi pi-shield', disabled: true, ...SOON_BADGE },
      { label: 'Panel del tenant', icon: 'pi pi-building', disabled: true, ...SOON_BADGE },
    ],
  },
  {
    label: 'BI Pyxis Interno',
    items: [{ label: 'Backoffice multi-tenant', icon: 'pi pi-server', disabled: true, ...SOON_BADGE }],
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
  imports: [Drawer, Menu, PrimeTemplate],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  private readonly mobileNav = inject(MobileNavService);

  protected readonly menuModel = MENU_MODEL;
  protected readonly currentUser = CURRENT_USER;
  protected readonly roleLabel = ROLE_LABELS[CURRENT_USER.role];
  protected readonly userInitial = CURRENT_USER.name.charAt(0).toUpperCase();

  /** Desktop: always visible, persistent, non-dismissible (unchanged from before this was
   * responsive). Mobile: a real dismissible overlay drawer, closed by default, opened by the
   * header's hamburger button via MobileNavService. */
  private readonly isMobile = signal(mobileMediaQueryList()?.matches ?? false);

  protected readonly isOpen = computed(() => (this.isMobile() ? this.mobileNav.isOpen() : true));
  protected readonly isMobileMode = this.isMobile.asReadonly();

  constructor() {
    mobileMediaQueryList()?.addEventListener('change', (event) => this.isMobile.set(event.matches));
  }

  onVisibleChange(visible: boolean): void {
    if (!visible) this.mobileNav.close();
  }

  /** Selecting a nav item on mobile should close the drawer, same as tapping the backdrop. */
  onMenuClick(): void {
    if (this.isMobile()) this.mobileNav.close();
  }
}
