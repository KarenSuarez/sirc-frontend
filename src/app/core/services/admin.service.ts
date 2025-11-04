import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseEndpoint = 'admin';

  constructor(private api: ApiService) {}

  //Obtiene la lista de todos los usuarios registrados
   
  getUsuarios(): Observable<any> {
    return this.api.get(`${this.baseEndpoint}/usuarios`);
  }

  //Crea un nuevo usuario en el sistema
   
  crearUsuario(data: any): Observable<any> {
    return this.api.post(`${this.baseEndpoint}/usuarios`, data);
  }

  // Actualiza los datos de un usuario específico

  actualizarUsuario(idUsuario: string, data: any): Observable<any> {
    return this.api.put(`${this.baseEndpoint}/usuarios/${idUsuario}`, data);
  }

  // Elimina un usuario del sistema
  eliminarUsuario(idUsuario: string): Observable<any> {
    return this.api.delete(`${this.baseEndpoint}/usuarios/${idUsuario}`);
  }

  // Obtiene estadísticas generales del sistema
  getEstadisticas(): Observable<any> {
    return this.api.get(`${this.baseEndpoint}/estadisticas`);
  }
}
