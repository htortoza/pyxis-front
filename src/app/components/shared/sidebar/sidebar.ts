import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrimeTemplate, type MenuItem } from 'primeng/api';
import { Drawer } from 'primeng/drawer';
import { Menu } from 'primeng/menu';

import { CURRENT_USER } from '../../../data/mock/mock-user.mock';
import type { UserRole } from '../../../data/models/mock-user.model';

type SidebarIconKey =
  | 'ventas'
  | 'margenes'
  | 'comparativos'
  | 'erp'
  | 'carga'
  | 'gobernanza'
  | 'tenant'
  | 'backoffice';

/** `item.icon`'s string value is applied verbatim as a CSS class on p-menu's icon span
 * (see MenuStyle.classes.itemIcon) -- these classes get their shape via a CSS mask-image
 * in styles.css (global, since Menu's internal DOM is unreachable from this component's
 * own scoped stylesheet per Angular's emulated-encapsulation rules). Deliberately not
 * `pi pi-*` font icons, per this project's inline-SVG-only icon convention. */
function iconClass(key: SidebarIconKey): string {
  return `sidebar-menu-icon sidebar-menu-icon--${key}`;
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
      { label: 'Ventas', icon: iconClass('ventas'), routerLink: '/' },
      { label: 'Márgenes', icon: iconClass('margenes'), disabled: true, ...SOON_BADGE },
      { label: 'Comparativos', icon: iconClass('comparativos'), disabled: true, ...SOON_BADGE },
    ],
  },
  {
    label: 'Administración',
    items: [
      { label: 'Motor de mapeo ERP', icon: iconClass('erp'), disabled: true, ...SOON_BADGE },
      { label: 'Carga de datos', icon: iconClass('carga'), disabled: true, ...SOON_BADGE },
      { label: 'Gobernanza y permisos', icon: iconClass('gobernanza'), disabled: true, ...SOON_BADGE },
      { label: 'Panel del tenant', icon: iconClass('tenant'), disabled: true, ...SOON_BADGE },
    ],
  },
  {
    label: 'BI Pyxis Interno',
    items: [{ label: 'Backoffice multi-tenant', icon: iconClass('backoffice'), disabled: true, ...SOON_BADGE }],
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
  protected readonly menuModel = MENU_MODEL;
  protected readonly currentUser = CURRENT_USER;
  protected readonly roleLabel = ROLE_LABELS[CURRENT_USER.role];
  protected readonly userInitial = CURRENT_USER.name.charAt(0).toUpperCase();
}
