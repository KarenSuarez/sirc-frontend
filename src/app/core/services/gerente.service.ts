import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GerenteService {
  private baseEndpoint = 'gerente';

  constructor(private api: ApiService) {}

  /**
   * Obtiene la lista de asesores bajo el gerente
   */
  getAsesores(): Observable<any> {
    return this.api.get(`${this.baseEndpoint}/asesores`);
  }

  /**
   * Obtiene estadísticas generales o por zona del gerente
   */
  getEstadisticas(): Observable<any> {
    return this.api.get(`${this.baseEndpoint}/estadisticas`);
  }

  /**
   * Obtiene los referidos de un asesor específico
   * @param idAsesor - ID o documento del asesor
   */
  getReferidosPorAsesor(idAsesor: string): Observable<any> {
    return this.api.get(`${this.baseEndpoint}/asesores/${idAsesor}/referidos`);
  }

  /**
   * Actualiza la información de un asesor
   * @param idAsesor - ID o documento del asesor
   * @param data - Datos a actualizar
   */
  actualizarAsesor(idAsesor: string, data: any): Observable<any> {
    return this.api.put(`${this.baseEndpoint}/asesores/${idAsesor}`, data);
  }

  /**
   * Crea un nuevo asesor bajo el gerente
   */
  crearAsesor(data: any): Observable<any> {
    return this.api.post(`${this.baseEndpoint}/asesores`, data);
  }

  /**
   * Elimina un asesor
   * @param idAsesor - ID del asesor a eliminar
   */
  eliminarAsesor(idAsesor: string): Observable<any> {
    return this.api.delete(`${this.baseEndpoint}/asesores/${idAsesor}`);
  }
}
