import { Routes } from '@angular/router';
//import { AuthGuard } from '../../core/guards/auth.guard';
//import { RoleGuard } from '../../core/guards/role.guard';
import { Rol } from '../../core/enums/rol.enum';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ListaComponent } from './referidos/lista/lista.component';
import { ActualizarReferidoComponent } from './referidos/actualizar-referido/actualizar-referido.component';
import { ReferentesComponent } from './referentes/referentes.component';
import { PerfilComponent } from './perfil/perfil.component';

export const ASESOR_VENTAS_ROUTES: Routes = [
  {
    path: '',
 //   canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Rol.ASESOR_VENTAS] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'referidos', component: ListaComponent },
      { path: 'referidos/:id/editar', component: ActualizarReferidoComponent },
      { path: 'referentes', component: ReferentesComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
