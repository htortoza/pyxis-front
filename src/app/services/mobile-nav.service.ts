import { Injectable, signal } from '@angular/core';

/**
 * Shared open/close state for the mobile nav drawer -- GlobalHeaderComponent (the hamburger
 * trigger) and SidebarComponent (the actual p-drawer) aren't in a parent/child relationship
 * (app.html renders them as siblings, with GlobalHeaderComponent nested deep inside the routed
 * page instead), so a service is the simplest way to connect them without prop-drilling through
 * app.html/app.ts.
 */
@Injectable({ providedIn: 'root' })
export class MobileNavService {
  readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
