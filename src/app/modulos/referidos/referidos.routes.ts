import { Routes } from '@angular/router';
import { CrearComponent } from './crear/crear.component';
import { ListaComponent } from './lista/lista.component';
import { EstadoComponent } from './estado/estado.component';

export const REFERIDOS_ROUTES: Routes = [
  { path: 'crear', component: CrearComponent },
  { path: 'lista', component: ListaComponent },
  { path: 'estado', component: EstadoComponent },
];
