import { inject } from '@angular/core';
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  const rolesRequeridos = route.data['roles'] as string[];

  if (!rolesRequeridos || rolesRequeridos.length === 0) {
    return true;
  }

  const rolesString = rolesRequeridos.map((rol) => {
    if (typeof rol === 'string') {
      return rol.toLowerCase();
    }
    return String(rol).toLowerCase();
  });

  const tienePermiso = authService.tieneAlgunRol(rolesString);

  if (!tienePermiso) {
    const dashboardRuta = authService.obtenerDashboardRuta();
    router.navigate([dashboardRuta]);

    return false;
  }

  return true;
};
