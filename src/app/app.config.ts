import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
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
    // Default maxWidth (12.5rem) is too narrow for a full sentence (e.g. the ranking rows'
    // "Vendió X% menos que Y" comparison) and wraps awkwardly -- widened, with a bit more
    // padding, via the token system rather than a one-off ".p-tooltip" CSS override.
    tooltip: {
      root: {
        maxWidth: '18rem',
        padding: '0.625rem 0.875rem',
      },
    },
    // Smaller footprint for the header's applied-filter chips row -- only used there
    // (filter-chips-summary.html), so shrinking it globally has no other side effects.
    // Font-size isn't tokenized for Chip, so that part is a scoped CSS rule instead
    // (see filter-chips-summary.css).
    chip: {
      root: {
        paddingX: '0.5rem',
        paddingY: '0.1875rem',
        gap: '0.375rem',
      },
      removeIcon: {
        size: '0.75rem',
      },
    },
    // Ranking Comercial's "Por Monto / Por Cantidad" sort select -- the only p-select in the
    // app, so shrinking it globally is safe. No padding/border at all so its height matches
    // the panel title's line height exactly instead of the default form-field box. Font-size
    // has no token at all here (PrimeNG hardcodes 1rem directly in .p-select-label's base
    // CSS) -- that part is a global override instead, scoped under .ranking-sort-select (see
    // styles.css), the same "reach into PrimeNG's internal DOM" pattern already used there.
    select: {
      root: {
        paddingX: '0',
        paddingY: '0',
        borderColor: 'transparent',
        hoverBorderColor: 'transparent',
        focusBorderColor: 'transparent',
        color: '{text.muted.color}',
        focusRing: {
          width: '0',
          shadow: 'none',
        },
      },
      dropdown: {
        width: '0.875rem',
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // Ventas General and Detalle de Ventas have different content heights -- without this,
    // the Angular Router keeps whatever scroll position the previous page was at, so
    // navigating from a scrolled-down Detalle de Ventas to a shorter Ventas General (or
    // vice versa) looks "broken" (content appears cut off/misplaced) even though the
    // layout itself is correct. A hard refresh always starts at scrollY 0, which is why
    // it "looks fine" -- this makes SPA navigation reset scroll the same way.
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: PyxisPreset, options: { darkModeSelector: false } } })
  ]
};
