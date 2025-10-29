import { Routes } from '@angular/router';
//import { AuthGuard } from '../../core/guards/auth.guard';
//import { RoleGuard } from '../../core/guards/role.guard';
import { Rol } from '../../core/enums/rol.enum';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ListaUsuariosComponent } from './gestion-usuarios/lista-usuarios/lista-usuarios.component';
import { CrearUsuarioComponent } from './gestion-usuarios/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './gestion-usuarios/editar-usuario/editar-usuario.component';
import { DetalleUsuarioComponent } from './gestion-usuarios/detalle-usuario/detalle-usuario.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
  //  canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Rol.ADMIN] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: ListaUsuariosComponent },
      { path: 'usuarios/nuevo', component: CrearUsuarioComponent },
      { path: 'usuarios/:id/editar', component: EditarUsuarioComponent },
      { path: 'usuarios/:id', component: DetalleUsuarioComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
