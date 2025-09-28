import { Routes } from '@angular/router';
import { LoginComponent } from './modulos/auth/login/login.component';
import { RegistroComponent } from './modulos/auth/registro/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/registro', component: RegistroComponent}

];
