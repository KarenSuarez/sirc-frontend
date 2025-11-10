import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Insignia,
  InsigniaConEstadisticas,
  CrearInsigniaRequest,
  ActualizarInsigniaRequest,
  AsignarInsigniaRequest,
  InsigniaReferente,
  RarezaInsignia,
  EstadoInsignia,
} from '../models/insignia.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InsigniaService {
  private baseUrl = `${environment.apiUrl}/insignias`;

  constructor(private http: HttpClient) {}

  /**
   * Listar todas las insignias
   */
  listarInsignias(estado?: EstadoInsignia, rareza?: RarezaInsignia): Observable<Insignia[]> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    if (rareza) params = params.set('rareza', rareza);

    return this.http.get<Insignia[]>(this.baseUrl, { params });
  }

  /**
   * Obtener insignia por ID
   */
  obtenerInsignia(id: number): Observable<InsigniaConEstadisticas> {
    return this.http.get<InsigniaConEstadisticas>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crear insignia
   */
  crearInsignia(data: CrearInsigniaRequest): Observable<{ message: string; insignia: Insignia }> {
    return this.http.post<{ message: string; insignia: Insignia }>(this.baseUrl, data);
  }

  /**
   * Actualizar insignia
   */
  actualizarInsignia(
    id: number,
    data: ActualizarInsigniaRequest
  ): Observable<{ message: string; insignia: Insignia }> {
    return this.http.put<{ message: string; insignia: Insignia }>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Desactivar insignia
   */
  eliminarInsignia(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  /**
   * Asignar insignia a referente
   */
  asignarInsignia(
    id: number,
    data: AsignarInsigniaRequest
  ): Observable<{ message: string; asignacion: any }> {
    return this.http.post<{ message: string; asignacion: any }>(
      `${this.baseUrl}/${id}/asignar`,
      data
    );
  }

  /**
   * Obtener insignias de un referente
   */
  obtenerInsigniasReferente(id: number): Observable<InsigniaReferente[]> {
    return this.http.get<InsigniaReferente[]>(`${this.baseUrl}/referente/${id}`);
  }

  /**
   * Obtener color de rareza
   */
  obtenerColorRareza(rareza: RarezaInsignia): string {
    const colores: { [key in RarezaInsignia]: string } = {
      comun: '#8c8c8c',
      rara: '#1890ff',
      epica: '#722ed1',
      legendaria: '#faad14',
    };
    return colores[rareza] || '#8c8c8c';
  }

  /**
   * Obtener texto de rareza
   */
  obtenerTextoRareza(rareza: RarezaInsignia): string {
    const textos: { [key in RarezaInsignia]: string } = {
      comun: 'Común',
      rara: 'Rara',
      epica: 'Épica',
      legendaria: 'Legendaria',
    };
    return textos[rareza] || 'Común';
  }
}
