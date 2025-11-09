import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificacionService } from '../services/notificacion.service';
import { AlmacenamientoService } from '../services/almacenamiento.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificacion = inject(NotificacionService);
  const almacenamiento = inject(AlmacenamientoService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensajeError = 'Ocurrió un error desconocido';

      if (error.error instanceof ErrorEvent) {
        mensajeError = `Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 0:
            mensajeError =
              'No se pudo conectar con el servidor. Verifica tu conexión.';
            notificacion.error(mensajeError);
            break;

          case 400:
            mensajeError = error.error?.message || 'Datos inválidos';
            break;

          case 401:
            mensajeError =
              'Sesión expirada. Por favor, inicia sesión nuevamente.';
            notificacion.advertencia(mensajeError);
            almacenamiento.limpiarSesion();
            router.navigate(['/auth/login']);
            break;

          case 403:
            mensajeError = 'No tienes permisos para realizar esta acción';
            notificacion.error(mensajeError);
            break;

          case 404:
            mensajeError = error.error?.message || 'Recurso no encontrado';
            break;

          case 500:
            mensajeError = 'Error interno del servidor. Intenta nuevamente.';
            notificacion.error(mensajeError);
            break;

          case 503:
            mensajeError = 'Servicio no disponible. Intenta más tarde.';
            notificacion.error(mensajeError);
            break;

          default:
            mensajeError =
              error.error?.message ||
              `Error ${error.status}: ${error.statusText}`;
            if (error.status >= 500) {
              notificacion.error(mensajeError);
            }
        }
      }

      console.error('Error HTTP:', {
        status: error.status,
        mensaje: mensajeError,
        url: req.url,
        error: error.error,
      });

      return throwError(() => error);
    })
  );
};
