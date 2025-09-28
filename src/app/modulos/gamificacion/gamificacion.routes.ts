import { Routes } from '@angular/router';
import { InsigniasComponent } from './insignias/insignias.component';
import { NivelesComponent } from './niveles/niveles.component';
import { PuntosComponent } from './puntos/puntos.component';

export const GAMIFICACION_ROUTES: Routes = [
  { path: 'insignias', component: InsigniasComponent },
  { path: 'niveles', component: NivelesComponent },
  { path: 'puntos', component: PuntosComponent },
];
