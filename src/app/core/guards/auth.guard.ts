import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UsuarioService } from '../servicios/usuario.service';

export const authGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  const usuario = usuarioService.getUsuarioActual();

  // Si no hay usuario, redirigir a login
  if (!usuario) {
    // Solo redirigir si no estamos ya en login
    if (!state.url.includes('/auth/login')) {
      router.navigate(['/auth/login']);
    }
    return false;
  }

  return true;
};
