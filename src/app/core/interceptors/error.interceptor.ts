import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Manejar errores específicos
      switch (error.status) {
        case 401:
          // Token expirado o no válido
          localStorage.removeItem('accessToken');
          router.navigate(['/auth/login']);
          console.error('Sesión expirada');
          break;

        case 403:
          console.error('Sin permisos');
          break;

        case 404:
          console.error('Recurso no encontrado');
          break;

        case 500:
          console.error('Error del servidor');
          break;

        default:
          console.error(errorMessage);
          break;
      }

      return throwError(() => error);
    })
  );
};
