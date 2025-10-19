import { Routes } from '@angular/router';
import { PanelAdminComponent } from './panel-admin/panel-admin.component';
import { PanelReferenteComponent } from './panel-referente/panel-referente.component';
import { PanelContadorComponent } from './panel-contador/panel-contador.component';
import { PanelVentasComponent } from './panel-ventas/panel-ventas.component';

export const PANELES_ROUTES: Routes = [
  { path: 'admin', component: PanelAdminComponent },
  { path: 'referente', component: PanelReferenteComponent },
  { path: 'contador', component: PanelContadorComponent },
  { path: 'asesor', component: PanelVentasComponent },
];
