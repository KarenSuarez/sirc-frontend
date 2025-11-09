import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ListaReferidosComponent } from './mis-referidos/lista-referidos/lista-referidos.component';
import { CrearReferidoComponent } from './mis-referidos/crear-referido/crear-referido.component';
import { RecompensasComponent } from './recompensas/recompensas.component';
import { PuntosComponent } from './puntos/puntos.component';
import { PerfilComponent } from './perfil/perfil.component';

export const REFERENTE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: ['referente'] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'referidos', component: ListaReferidosComponent },
      { path: 'referidos/nuevo', component: CrearReferidoComponent },
      { path: 'recompensas', component: RecompensasComponent },
      { path: 'puntos', component: PuntosComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
