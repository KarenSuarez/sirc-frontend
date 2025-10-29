import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { NzMessageService } from 'ng-zorro-antd/message';

export const roleGuard = (rolesPermitidos: string[]): CanActivateFn => {
  return (route, state) => {
    const usuarioService = inject(UsuarioService);
    const router = inject(Router);
    const message = inject(NzMessageService);

    const usuario = usuarioService.getUsuarioActual();

    if (!usuario) {
      router.navigate(['/auth/login']);
      return false;
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      message.error('No tienes permisos para acceder a esta página');

      // Obtener la ruta del panel correcto
      const panelRoute = usuarioService.getPanelRouteByRole(usuario.rol);

      // Solo redirigir si no estamos ya en ese panel
      if (state.url !== panelRoute) {
        router.navigate([panelRoute]);
      }

      return false;
    }

    return true;
  };
};
