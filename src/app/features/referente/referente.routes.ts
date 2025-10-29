import { Routes } from '@angular/router';
//import { AuthGuard } from '../../core/guards/auth.guard';
//import { RoleGuard } from '../../core/guards/role.guard';
import { Rol } from '../../core/enums/rol.enum';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ListaReferidosComponent } from './mis-referidos/lista-referidos/lista-referidos.component';
import { CrearReferidoComponent } from './mis-referidos/crear-referido/crear-referido.component';
import { DetalleReferidoComponent } from './mis-referidos/detalle-referido/detalle-referido.component';
import { RecompensasComponent } from './recompensas/recompensas.component';
import { PuntosComponent } from './puntos/puntos.component';
import { SolicitarRetiroComponent } from './retiros/solicitar-retiro/solicitar-retiro.component';
import { HistorialRetirosComponent } from './retiros/historial-retiros/historial-retiros.component';
import { PerfilComponent } from './perfil/perfil.component';

export const REFERENTE_ROUTES: Routes = [
  {
    path: '',
 //   canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Rol.REFERENTE] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'referidos', component: ListaReferidosComponent },
      { path: 'referidos/nuevo', component: CrearReferidoComponent },
      { path: 'referidos/:id', component: DetalleReferidoComponent },
      { path: 'recompensas', component: RecompensasComponent },
      { path: 'puntos', component: PuntosComponent },
      { path: 'retiros/solicitar', component: SolicitarRetiroComponent },
      { path: 'retiros/historial', component: HistorialRetirosComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
