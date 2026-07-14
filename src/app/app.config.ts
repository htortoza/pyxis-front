import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

/**
 * Monochromatic violet primary scale matching the Pyxis logo's dominant hue
 * (the logo's gradient runs violet #8400c8 -> blue #0271ed; this scale stays
 * within the violet family rather than spanning both, per the brand direction:
 * one disciplined hue for UI color, the full gradient reserved for accent use).
 */
const PyxisPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{violet.50}',
      100: '{violet.100}',
      200: '{violet.200}',
      300: '{violet.300}',
      400: '{violet.400}',
      500: '{violet.500}',
      600: '{violet.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}',
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
