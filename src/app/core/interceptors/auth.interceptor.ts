import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AlmacenamientoService } from '../services/almacenamiento.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const almacenamiento = inject(AlmacenamientoService);
  const token = almacenamiento.obtenerToken();

  if (!token) {
    return next(req);
  }

  const clonedReq = req.clone({
    setHeaders: {
      'x-access-token': token,
      Authorization: `Bearer ${token}`,
    },
  });

  return next(clonedReq);
};
