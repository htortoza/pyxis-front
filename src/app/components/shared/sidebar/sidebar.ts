import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PrimeTemplate, type MenuItem } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { Menu } from 'primeng/menu';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

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
 * inside the global header, not as two sidebar items.
 *
 * routerLinkActiveOptions rule for any top-level item: the default ({ exact: false }) is safe
 * and desired for every item EXCEPT the one routed to '/'. With exact:false, PrimeNG's p-menu
 * marks an item active whenever the current URL is a descendant of its routerLink -- e.g.
 * Cobranzas ('/cobranzas') correctly stays active on '/cobranzas/cartera' too, because that
 * route is a genuine child path of '/cobranzas'. But '/' is an ancestor of every route in
 * Angular's URL tree, not just its own sub-routes, so exact:false on '/' would make Ventas read
 * active on '/cobranzas' and every other page as well. That's why Ventas alone sets
 * routerLinkActiveOptions: { exact: true } below. A future top-level item only needs this
 * override if its own routerLink is '/'; any real non-root path (like Cobranzas') is safe with
 * the default.
 *
 * Unlike Cobranzas/cartera, '/detalle-ventas' is NOT a descendant of '/' -- it's a sibling
 * top-level route (see app.routes.ts), reached via a tab in the global header rather than a
 * second sidebar item. No single routerLinkActiveOptions value can make '/' match both '/' and
 * '/detalle-ventas' while still excluding every other route (exact:true only matches '/' itself;
 * exact:false matches everything). SidebarComponent.menuModel (below) covers this one exception
 * by pointing Ventas' routerLink AT '/detalle-ventas' while the user is actually there, so
 * Angular's own RouterLinkActive (still exact:true) matches itself natively -- no manually
 * toggled CSS class fighting the directive's own class management. See SIBLING_ACTIVE_ROUTES
 * for the general hook a future item would reuse for the same "highlighted from an unrelated
 * top-level route" need.
 */
const MENU_MODEL: MenuItem[] = [
  {
    label: 'Visor Estratégico',
    items: [
      { label: 'Ventas', icon: 'pi pi-chart-line', routerLink: '/', routerLinkActiveOptions: { exact: true } },
      { label: 'Cobranzas', icon: 'pi pi-wallet', routerLink: '/cobranzas' },
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

/** Sibling routes (not descendants) that should still light up a given item's routerLink, keyed
 * by that routerLink. Add an entry here for any future top-level item whose sub-view is reached
 * via a header tab at its own top-level route instead of via sidebar/URL nesting. */
const SIBLING_ACTIVE_ROUTES: Record<string, readonly string[]> = {
  '/': ['/detalle-ventas'],
};

function matchedSiblingRoute(routerLink: unknown, currentUrl: string): string | undefined {
  const siblings = typeof routerLink === 'string' ? SIBLING_ACTIVE_ROUTES[routerLink] : undefined;
  return siblings?.find((route) => currentUrl === route || currentUrl.startsWith(`${route}/`));
}

/** Clones the static menu, retargeting any item whose routerLink has a matching entry in
 * SIBLING_ACTIVE_ROUTES so it points at the current URL instead of its usual one. RouterLinkActive
 * (still exact:true) then matches that link against the router's own current URL natively --
 * clicking the item while already on the sibling route is then simply a no-op, which is the
 * expected behavior for a nav item already showing as active. */
function withSiblingRouteHighlight(model: MenuItem[], currentUrl: string): MenuItem[] {
  return model.map((group) => ({
    ...group,
    items: group.items?.map((item) => {
      const sibling = matchedSiblingRoute(item.routerLink, currentUrl);
      return sibling ? { ...item, routerLink: sibling } : item;
    }),
  }));
}

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
  private readonly router = inject(Router);

  /** Router.events rather than router.url directly -- router.url only updates on navigation,
   * and toSignal needs an Observable to know when to re-read it. */
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Cache of the last computed menu so unrelated change-detection passes (e.g. toggling the
   * mobile drawer) don't hand PrimeNG a brand-new MenuItem[] on every tick -- only a genuine
   * route change should do that. */
  private lastMenuModelUrl: string | undefined;
  private lastMenuModel: MenuItem[] = MENU_MODEL;

  /** Getter, not a signal: PrimeNG's `[model]="menuModel"` template binding expects a plain
   * MenuItem[] value, re-read on every change-detection pass -- calling `currentUrl()` here
   * (inside that same pass) registers this component as a consumer of that signal under
   * zoneless change detection, so a route change alone is enough to schedule the re-read. */
  protected get menuModel(): MenuItem[] {
    const url = this.currentUrl();
    if (url !== this.lastMenuModelUrl) {
      this.lastMenuModelUrl = url;
      this.lastMenuModel = withSiblingRouteHighlight(MENU_MODEL, url);
    }
    return this.lastMenuModel;
  }

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
