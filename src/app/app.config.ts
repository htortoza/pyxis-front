import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

/**
 * Primary scale built from the Pyxis logo's own 3 gradient stops (Logo/SVG/icono-color
 * copia.svg: violet #8400c8 -> indigo #2010c0 -> blue #0271ed), not a generic Tailwind/Aura
 * hue import. 500/700/900 are the exact brand hexes (blue/indigo/violet respectively);
 * everything else is a computed white-tint (50-400) or black-shade (950) of that same trio,
 * so every step in the ramp is either a real brand color or a direct mix of two real ones.
 */
const PyxisPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e6f1fd',
      100: '#c0dcfb',
      200: '#8dbff7',
      300: '#5ba3f3',
      400: '#2886f0',
      500: '#0271ed', // logo blue
      600: '#0c51de',
      700: '#2010c0', // logo indigo
      800: '#5208c4',
      900: '#8400c8', // logo violet
      950: '#560082',
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
