import { Routes } from '@angular/router';
import { CrearComponent } from './crear/crear.component';
import { ListaComponent } from './lista/lista.component';
import { EstadoComponent } from './estado/estado.component';
import { NavbarComponent } from '../../compartidos/componentes/navbar/navbar.component';

export const REFERIDOS_ROUTES: Routes = [
  {path: "Navbar", component:NavbarComponent},
  { path: 'crear', component: CrearComponent },
  { path: 'lista', component: ListaComponent },
  { path: 'estado', component: EstadoComponent },
];
