import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Referido,
  ReferidosPaginados,
  ConvertirReferidoRequest,
  ActualizarEstadoRequest,
  ActualizarReferidoRequest,
  RegistrarContactoRequest,
  ConversionResponse,
  EstadoReferido,
} from '../models/referido.interface';
import {
  ReferenteConMetricas,
  ReferentesPaginados,
  MetricasAsesor,
} from '../models/referente.interface';
import { ASESOR_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AsesorService {
  constructor(private http: HttpClient) {}

  // ============================================
  // REFERIDOS
  // ============================================

  /**
   * Listar todos los referidos (con filtros y paginación)
   */
  listarReferidos(
    estado?: EstadoReferido,
    limite: number = 50,
    pagina: number = 1
  ): Observable<ReferidosPaginados> {
    let params = new HttpParams()
      .set('limite', limite.toString())
      .set('pagina', pagina.toString());

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<ReferidosPaginados>(
      ASESOR_ENDPOINTS.REFERIDOS.BASE,
      { params }
    );
  }

  /**
   * Obtener detalle de un referido
   */
  obtenerReferido(id: number): Observable<Referido> {
    return this.http.get<Referido>(ASESOR_ENDPOINTS.REFERIDOS.DETALLE(id));
  }

  /**
   * Convertir referido (vender plan)
   */
  convertirReferido(
    id: number,
    data: ConvertirReferidoRequest
  ): Observable<ConversionResponse> {
    return this.http.post<ConversionResponse>(
      ASESOR_ENDPOINTS.REFERIDOS.CONVERTIR(id),
      data
    );
  }

  /**
   * Actualizar estado del referido
   */
  actualizarEstado(
    id: number,
    data: ActualizarEstadoRequest
  ): Observable<{ message: string; referido: Referido }> {
    return this.http.put<{ message: string; referido: Referido }>(
      ASESOR_ENDPOINTS.REFERIDOS.ACTUALIZAR_ESTADO(id),
      data
    );
  }

  /**
   * Actualizar información del referido
   */
  actualizarReferido(
    id: number,
    data: ActualizarReferidoRequest
  ): Observable<{ message: string; referido: Referido }> {
    return this.http.put<{ message: string; referido: Referido }>(
      ASESOR_ENDPOINTS.REFERIDOS.ACTUALIZAR(id),
      data
    );
  }

  /**
   * Registrar primer contacto
   */
  registrarContacto(
    id: number,
    data: RegistrarContactoRequest
  ): Observable<{ message: string; referido: Referido }> {
    return this.http.post<{ message: string; referido: Referido }>(
      ASESOR_ENDPOINTS.REFERIDOS.CONTACTAR(id),
      data
    );
  }

  // ============================================
  // REFERENTES
  // ============================================

  /**
   * Listar todos los referentes
   */
  listarReferentes(
    limite: number = 50,
    pagina: number = 1
  ): Observable<ReferentesPaginados> {
    const params = new HttpParams()
      .set('limite', limite.toString())
      .set('pagina', pagina.toString());

    return this.http.get<ReferentesPaginados>(
      ASESOR_ENDPOINTS.REFERENTES.BASE,
      { params }
    );
  }

  /**
   * Obtener detalle de un referente
   */
  obtenerReferente(id: number): Observable<ReferenteConMetricas> {
    return this.http.get<ReferenteConMetricas>(
      ASESOR_ENDPOINTS.REFERENTES.DETALLE(id)
    );
  }

  /**
   * Listar referidos de un referente específico
   */
  listarReferidosPorReferente(id: number): Observable<Referido[]> {
    return this.http.get<Referido[]>(
      ASESOR_ENDPOINTS.REFERENTES.REFERIDOS(id)
    );
  }

  /**
   * Obtener mis métricas como asesor
   */
  obtenerMisMetricas(): Observable<MetricasAsesor> {
    return this.http.get<MetricasAsesor>(
      ASESOR_ENDPOINTS.REFERENTES.MIS_METRICAS
    );
  }
}
