import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { CargaService } from '../services/carga.service';

export const cargaInterceptor: HttpInterceptorFn = (req, next) => {
  const cargaService = inject(CargaService);

  cargaService.iniciar();

  return next(req).pipe(
    finalize(() => {
      cargaService.finalizar();
    })
  );
};
