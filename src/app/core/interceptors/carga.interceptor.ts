import { HttpInterceptorFn } from '@angular/common/http';

export const cargaInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
