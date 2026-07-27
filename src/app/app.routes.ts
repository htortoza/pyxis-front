import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/ventas-general/ventas-general').then((m) => m.VentasGeneralComponent),
  },
  {
    path: 'detalle-ventas',
    loadComponent: () => import('./pages/detalle-ventas/detalle-ventas').then((m) => m.DetalleVentasComponent),
  },
  {
    path: 'cobranzas',
    loadComponent: () =>
      import('./pages/cobranzas-general/cobranzas-general').then((m) => m.CobranzasGeneralComponent),
  },
  {
    path: 'cobranzas/cartera',
    loadComponent: () => import('./pages/detalle-cartera/detalle-cartera').then((m) => m.DetalleCarteraComponent),
  },
];
