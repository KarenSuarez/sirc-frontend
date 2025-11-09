import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { GestionRetirosComponent } from './gestion-retiros/gestion-retiros.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ReportesComponent } from './reportes/reportes.component';

export const CONTADOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: ['contador'] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'retiros', component: GestionRetirosComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
