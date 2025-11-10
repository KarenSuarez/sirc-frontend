import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Nivel,
  BeneficioNivel,
  CrearNivelRequest,
  ActualizarNivelRequest,
} from '../models/nivel.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NivelService {
  private baseUrl = `${environment.apiUrl}/niveles`;

  constructor(private http: HttpClient) {}

  /**
   * Listar todos los niveles
   */
  listarNiveles(): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(this.baseUrl);
  }

  /**
   * Listar niveles activos
   */
  listarNivelesActivos(): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(`${this.baseUrl}/activos`);
  }

  /**
   * Obtener nivel por ID
   */
  obtenerNivel(id: number): Observable<Nivel> {
    return this.http.get<Nivel>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtener nivel con beneficios parseados
   */
  obtenerNivelConBeneficios(id: number): Observable<BeneficioNivel> {
    return this.obtenerNivel(id).pipe(
      map((nivel) => ({
        ...nivel,
        beneficios: this.parsearBeneficios(nivel.beneficios_nivel),
      }))
    );
  }

  /**
   * Crear nivel
   */
  crearNivel(data: CrearNivelRequest): Observable<{ message: string; nivel: Nivel }> {
    return this.http.post<{ message: string; nivel: Nivel }>(this.baseUrl, data);
  }

  /**
   * Actualizar nivel
   */
  actualizarNivel(
    id: number,
    data: ActualizarNivelRequest
  ): Observable<{ message: string; nivel: Nivel }> {
    return this.http.put<{ message: string; nivel: Nivel }>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Eliminar nivel
   */
  eliminarNivel(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  /**
   * Parsear beneficios JSON
   */
  parsearBeneficios(beneficios?: string): string[] {
    if (!beneficios) return [];

    try {
      const parsed = JSON.parse(beneficios);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error al parsear beneficios del nivel:', error);
      return [];
    }
  }

  /**
   * Convertir array de beneficios a JSON string
   */
  stringificarBeneficios(beneficios: string[]): string {
    return JSON.stringify(beneficios);
  }

  /**
   * Obtener color del nivel o color por defecto
   */
  obtenerColorNivel(nivel: Nivel): string {
    if (nivel.color_nivel) {
      return nivel.color_nivel;
    }
    return '';
  }

  /**
   * Obtener ícono del nivel o ícono por defecto
   */
  obtenerIconoNivel(nivel: Nivel): string {
    return nivel.icono_nivel || 'trophy';
  }
}
