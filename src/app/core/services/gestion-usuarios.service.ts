import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { USUARIOS_ENDPOINTS } from '../../core/constants/api-endpoints';

export interface UsuarioResponse {
  id_usuario: string;
  nombre: string;
  apellido: string;
  documento: string;
  correo_electronico: string;
  telefono: string;
  rol: string;
  activo: boolean;
  fecha_registro: Date;
}

export interface EstadisticasResponse {
  total: number;
  activos: number;
  referentes: number;
  administradores: number;
}

@Injectable({
  providedIn: 'root'
})
export class GestionUsuariosService {
  constructor(private http: HttpClient) {}

  listar(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(USUARIOS_ENDPOINTS.BASE);
  }

  obtenerPorId(id: string): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(USUARIOS_ENDPOINTS.DETALLE(parseInt(id)));
  }

  crear(data: Partial<UsuarioResponse>): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(USUARIOS_ENDPOINTS.BASE, data);
  }

  actualizar(id: string, data: Partial<UsuarioResponse>): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(USUARIOS_ENDPOINTS.ACTUALIZAR(parseInt(id)), data);
  }

  eliminar(id: string): Observable<any> {
    return this.http.delete(USUARIOS_ENDPOINTS.ELIMINAR(parseInt(id)));
  }

  obtenerEstadisticas(): Observable<EstadisticasResponse> {
    return this.http.get<EstadisticasResponse>(USUARIOS_ENDPOINTS.ESTADISTICAS);
  }

  cambiarEstado(id: string, activo: boolean): Observable<any> {
    return this.http.patch(`${USUARIOS_ENDPOINTS.BASE}/${id}/estado`, { activo });
  }
}
