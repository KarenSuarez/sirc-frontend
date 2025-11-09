import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  Referido,
  CrearReferidoDTO,
  ActualizarReferidoDTO,
  ConvertirReferidoDTO,
  CrearReferidoResponse,
  ConvertirReferidoResponse,
} from '../models/referido.interface';

const REFERIDO_ENDPOINTS = {
  BASE: `${environment.apiUrl}/referidos`,
  BY_ID: (id: number) => `${environment.apiUrl}/referidos/${id}`,
  CONVERTIR: (id: number) => `${environment.apiUrl}/referidos/${id}/convertir`,
};

@Injectable({
  providedIn: 'root',
})
export class ReferidoService {
  constructor(private http: HttpClient) {}

  crear(data: CrearReferidoDTO): Observable<CrearReferidoResponse> {
    return this.http
      .post<CrearReferidoResponse>(REFERIDO_ENDPOINTS.BASE, data)
      .pipe(catchError(this.manejarError));
  }

  listar(): Observable<Referido[]> {
    return this.http
      .get<Referido[]>(REFERIDO_ENDPOINTS.BASE)
      .pipe(catchError(this.manejarError));
  }

  obtenerPorId(id: number): Observable<Referido> {
    return this.http
      .get<Referido>(REFERIDO_ENDPOINTS.BY_ID(id))
      .pipe(catchError(this.manejarError));
  }

  actualizar(id: number, data: ActualizarReferidoDTO): Observable<any> {
    return this.http
      .put(REFERIDO_ENDPOINTS.BY_ID(id), data)
      .pipe(catchError(this.manejarError));
  }

  convertir(
    id: number,
    data: ConvertirReferidoDTO
  ): Observable<ConvertirReferidoResponse> {
    return this.http
      .post<ConvertirReferidoResponse>(REFERIDO_ENDPOINTS.CONVERTIR(id), data)
      .pipe(catchError(this.manejarError));
  }

  filtrarPorEstado(referidos: Referido[], estado: string): Referido[] {
    if (!estado || estado === 'todos') {
      return referidos;
    }
    return referidos.filter((r) => r.estado_referido === estado);
  }

  contarPorEstado(referidos: Referido[]): Record<string, number> {
    return referidos.reduce((acc, ref) => {
      const estado = ref.estado_referido;
      acc[estado] = (acc[estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      mensajeError = `Error: ${error.error.message}`;
    } else {
      mensajeError =
        error.error?.message || error.message || 'Error del servidor';
    }

    console.error('Error en ReferidoService:', mensajeError);
    return throwError(() => error);
  }
}
