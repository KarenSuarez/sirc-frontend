import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
    ],
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'referente',
        loadChildren: () =>
          import('./features/referente/referente.routes').then(
            (m) => m.REFERENTE_ROUTES
          ),
      },

      {
        path: 'asesor',
        loadChildren: () =>
          import('./features/asesor-ventas/asesor-ventas.routes').then(
            (m) => m.ASESOR_VENTAS_ROUTES
          ),
      },

      {
        path: 'gerente',
        loadChildren: () =>
          import('./features/gerente-ventas/gerente-ventas.routes').then(
            (m) => m.GERENTE_VENTAS_ROUTES
          ),
      },

      {
        path: 'contador',
        loadChildren: () =>
          import('./features/contador/contador.routes').then(
            (m) => m.CONTADOR_ROUTES
          ),
      },

      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },
    ],
  },

  // Ruta 404
  { path: '**', redirectTo: '/auth/login' },
];
