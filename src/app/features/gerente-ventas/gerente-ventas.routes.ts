import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component'
import { ConfiguracionPlanesComponent } from './configuracion/configuracion-planes/configuracion-planes.component';
import { ConfiguracionNivelesComponent } from './configuracion/configuracion-niveles/configuracion-niveles.component';
import { ConfiguracionInsigniasComponent } from './configuracion/configuracion-insignias/configuracion-insignias.component';
import { AnaliticasComponent } from './analiticas/analiticas.component';
import { PerfilComponent } from './perfil/perfil.component';

export const GERENTE_VENTAS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: { roles: ['gerente_ventas', 'gerente'] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'configuracion/planes', component: ConfiguracionPlanesComponent },
      { path: 'configuracion/niveles', component: ConfiguracionNivelesComponent },
      { path: 'configuracion/insignias', component: ConfiguracionInsigniasComponent },
      { path: 'analiticas', component: AnaliticasComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
