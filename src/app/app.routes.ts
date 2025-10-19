import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirección inicial
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Rutas de autenticación (sin navbar)
  {
    path: 'auth',
    loadChildren: () =>
      import('./modulos/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modulos/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },

  {
    path: 'referentes',
    loadChildren: () =>
      import('./modulos/referentes/referentes.routes').then(
        (m) => m.REFERENTES_ROUTES
      ),
  },
    {
    path: 'referidos',
    loadChildren: () =>
      import('./modulos/referidos/referidos.routes').then(
        (m) => m.REFERIDOS_ROUTES
      ),
  },

  {
    path: 'referidos',
    loadChildren: () =>
      import('./modulos/referidos/referidos.routes').then(
        (m) => m.REFERIDOS_ROUTES
      ),
  },

  {
    path: 'recompensas',
    loadChildren: () =>
      import('./modulos/recompensas/recompensas.routes').then(
        (m) => m.RECOMPENSAS_ROUTES
      ),
  },

  {
    path: 'gamificacion',
    loadChildren: () =>
      import('./modulos/gamificacion/gamificacion.routes').then(
        (m) => m.GAMIFICACION_ROUTES
      ),
  },

  {
    path: 'reportes',
    loadChildren: () =>
      import('./modulos/reportes/reportes.routes').then(
        (m) => m.REPORTES_ROUTES
      ),
  },

//  {
//    path: 'pagos',
//    loadChildren: () =>
//      import('./modulos/pagos/pagos.routes').then((m) => m.PAGOS_ROUTES),
//  },

  {
    path: 'paneles',
    loadChildren: () =>
      import('./modulos/paneles/paneles.routes').then((m) => m.PANELES_ROUTES),
  },

];
