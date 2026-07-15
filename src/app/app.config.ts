import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

/**
 * Primary scale anchored on the brand's primary color, #182bcd. 500 is that exact hex;
 * every other step is a computed white-tint (50-400) or black-shade (600-950) of it --
 * monochromatic, not a multi-hue ramp.
 */
const PyxisPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#edeefb',
      100: '#d1d5f5',
      200: '#a3aaeb',
      300: '#7480e1',
      400: '#4655d7',
      500: '#182bcd',
      600: '#1425ae',
      700: '#111e90',
      800: '#0d1871',
      900: '#0a1152',
      950: '#060b33',
    },
  },
  components: {
    // Flat cards (hairline border only, no shadow at rest -- shadow is added
    // back in per-component CSS for the :hover state only) and a larger
    // container-tier radius, set via design tokens rather than fighting
    // PrimeNG's own CSS with a blanket ".p-card" override.
    card: {
      root: {
        borderRadius: '18px',
        shadow: 'none',
      },
    },
    // The sidebar's static (non-popup) p-menu: transparent root (the drawer around it
    // already supplies background/border), muted uppercase section headers via the
    // submenuLabel token group.
    //
    // Item/submenuLabel padding is the normal, symmetric 0.75rem -- so the active/hover
    // highlight pill still has real padding around its icon and text, not touching its
    // own edge. To still line the icon/header text up with the logo (drawer.content.padding
    // below is reduced by that same 0.75rem on the left), the list itself adds no extra
    // horizontal offset: 0.5rem (reduced content padding) + 0.75rem (item/label padding)
    // = 1.25rem, matching the header/logo's own left inset exactly.
    menu: {
      root: {
        background: 'transparent',
        borderColor: 'transparent',
      },
      list: {
        padding: '0.5rem 0',
        gap: '0.25rem',
      },
      item: {
        padding: '0.5rem 0.75rem',
        gap: '0.625rem',
      },
      submenuLabel: {
        padding: '0.75rem 0.75rem 0.375rem 0.75rem',
        fontWeight: '600',
        color: '{text.muted.color}',
        background: 'transparent',
      },
    },
    // content.padding's left is reduced from the default {overlay.modal.padding} (1.25rem)
    // so the menu's own item padding (0.75rem, restored above) can supply the rest --
    // see the menu comment above for the full 0.5rem + 0.75rem = 1.25rem reasoning.
    drawer: {
      content: {
        padding: '0 {overlay.modal.padding} {overlay.modal.padding} 0.5rem',
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: PyxisPreset, options: { darkModeSelector: false } } })
  ]
};
