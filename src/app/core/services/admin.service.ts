import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/usuarios`; // Asegúrate de que apiUrl apunte al backend base

  constructor(private http: HttpClient) {}

  // ✅ Obtener todos los usuarios
  obtenerUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // ✅ Obtener un usuario por ID
  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ✅ Crear usuario
  crearUsuario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  // ✅ Actualizar usuario
  actualizarUsuario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // ✅ Eliminar usuario
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
