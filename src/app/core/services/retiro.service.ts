import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  SolicitudRetiro,
  CrearSolicitudDTO,
  CrearSolicitudResponse,
} from '../models/retiro.interface';

const RETIRO_ENDPOINTS = {
  BASE: `${environment.apiUrl}/solicitudes`,
  BY_ID: (id: number) => `${environment.apiUrl}/solicitudes/${id}`,
};

@Injectable({
  providedIn: 'root',
})
export class RetiroService {
  constructor(private http: HttpClient) {}

  crear(data: CrearSolicitudDTO): Observable<CrearSolicitudResponse> {
    return this.http
      .post<CrearSolicitudResponse>(RETIRO_ENDPOINTS.BASE, data)
      .pipe(catchError(this.manejarError));
  }

  listar(): Observable<SolicitudRetiro[]> {
    return this.http
      .get<SolicitudRetiro[]>(RETIRO_ENDPOINTS.BASE)
      .pipe(catchError(this.manejarError));
  }

  obtenerPorId(id: number): Observable<SolicitudRetiro> {
    return this.http
      .get<SolicitudRetiro>(RETIRO_ENDPOINTS.BY_ID(id))
      .pipe(catchError(this.manejarError));
  }

  private manejarError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en RetiroService:', error);
    return throwError(() => error);
  }
}
