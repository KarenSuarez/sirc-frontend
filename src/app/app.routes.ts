import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () =>
      import('./modulos/auth/auth.routes').then((m) => m.AUTH_ROUTES),
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
    path: 'reportes',
    loadChildren: () =>
      import('./modulos/reportes/reportes.routes').then(
        (m) => m.REPORTES_ROUTES
      ),
  },

  {
    path: 'panel',
    loadChildren: () =>
      import('./modulos/paneles/paneles.routes').then((m) => m.PANELES_ROUTES),
  },

  {
    path: 'gamificacion',
    loadChildren: () =>
      import('./modulos/gamificacion/gamificacion.routes').then(
        (m) => m.GAMIFICACION_ROUTES
      ),
  },

  { path: '**', redirectTo: 'auth/login' },
];
