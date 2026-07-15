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
    menu: {
      root: {
        background: 'transparent',
        borderColor: 'transparent',
      },
      // Left padding is 0 at both the list and item level -- the drawer's own content
      // padding (1.25rem, the same token the header/logo uses) is the sole left inset,
      // so menu items and the group headers line up exactly with the logo's left edge.
      list: {
        padding: '0.5rem 0 0.5rem 0',
        gap: '0.25rem',
      },
      item: {
        padding: '0.5rem 0.75rem 0.5rem 0',
        gap: '0.625rem',
      },
      submenuLabel: {
        padding: '0.75rem 0.75rem 0.375rem 0',
        fontWeight: '600',
        color: '{text.muted.color}',
        background: 'transparent',
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
