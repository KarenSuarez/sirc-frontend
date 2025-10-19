import { Routes } from '@angular/router';
import { CrearComponent } from './crear/crear.component';
import { ListaComponent } from './lista/lista.component';
import { PerfilComponent } from './perfil/perfil.component';

export const REFERENTES_ROUTES: Routes = [
  { path: 'crear', component: CrearComponent },
  { path: 'lista', component: ListaComponent },
  { path: 'perfil', component: PerfilComponent },
];
