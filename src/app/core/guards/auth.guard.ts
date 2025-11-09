import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const estaAutenticado = authService.estaAutenticado();
  const tieneToken = authService.tieneToken();

  if (estaAutenticado && tieneToken) {
    return true;
  }

  const returnUrl = state.url;

  router.navigate(['/auth/login'], {
    queryParams: { returnUrl },
  });

  return false;
};
