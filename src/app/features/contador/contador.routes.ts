import { Routes } from '@angular/router';
//import { AuthGuard } from '../../core/guards/auth.guard';
//import { RoleGuard } from '../../core/guards/role.guard';
import { Rol } from '../../core/enums/rol.enum';

import { DashboardComponent } from './dashboard/dashboard.component';
import { GestionRetirosComponent } from './gestion-retiros/gestion-retiros.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ReportesComponent } from './reportes/reportes.component';

export const CONTADOR_ROUTES: Routes = [
  {
    path: '',
  //  canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Rol.CONTADOR] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'retiros', component: GestionRetirosComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
