import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Plan,
  PlanConCaracteristicas,
  CrearPlanRequest,
  ActualizarPlanRequest,
  EstadisticasPlan,
  CaracteristicaPlan,
} from '../models/plan.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private baseUrl = `${environment.apiUrl}/planes`;

  constructor(private http: HttpClient) {}

  /**
   * Listar todos los planes activos
   */
  listarPlanes(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.baseUrl);
  }

  /**
   * Listar planes con filtros
   */
  listarPlanesConFiltros(
    estado?: string,
    destacado?: boolean
  ): Observable<Plan[]> {
    let params = new HttpParams();

    if (estado) {
      params = params.set('estado', estado);
    }

    if (destacado !== undefined) {
      params = params.set('destacado', destacado.toString());
    }

    return this.http.get<Plan[]>(this.baseUrl, { params });
  }

  /**
   * Obtener plan por ID
   */
  obtenerPlan(id: number): Observable<Plan> {
    return this.http.get<Plan>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtener plan con características parseadas
   */
  obtenerPlanConCaracteristicas(id: number): Observable<PlanConCaracteristicas> {
    return this.obtenerPlan(id).pipe(
      map((plan) => ({
        ...plan,
        caracteristicas: this.parsearCaracteristicas(plan.caracteristicas_plan),
      }))
    );
  }

  /**
   * Crear plan
   */
  crearPlan(data: CrearPlanRequest): Observable<Plan> {
    return this.http.post<Plan>(this.baseUrl, data);
  }

  /**
   * Actualizar plan
   */
  actualizarPlan(id: number, data: ActualizarPlanRequest): Observable<Plan> {
    return this.http.put<Plan>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Eliminar plan (soft delete)
   */
  eliminarPlan(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtener estadísticas de planes
   */
  obtenerEstadisticasPlanes(): Observable<EstadisticasPlan[]> {
    return this.http.get<EstadisticasPlan[]>(`${this.baseUrl}/estadisticas`);
  }

  /**
   * Parsear características del plan
   */
  private parsearCaracteristicas(caracteristicas?: string): CaracteristicaPlan[] {
    if (!caracteristicas) return [];

    try {
      const parsed = JSON.parse(caracteristicas);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error al parsear características del plan:', error);
      return [];
    }
  }

  /**
   * Obtener color del plan o color por defecto
   */
  obtenerColorPlan(plan: Plan): string {
    if (plan.color_plan) {
      return plan.color_plan;
    }

    // Colores por defecto según el precio
    if (plan.precio_actual >= 300000) {
      return '#9c27b0'; // Morado - Premium
    } else if (plan.precio_actual >= 150000) {
      return '#2196f3'; // Azul - Profesional
    } else {
      return '#4caf50'; // Verde - Básico
    }
  }

  /**
   * Obtener ícono del plan o ícono por defecto
   */
  obtenerIconoPlan(plan: Plan): string {
    return plan.icono_plan || 'file-text';
  }

  /**
   * Calcular comisión de un plan
   */
  calcularComision(plan: Plan): number {
    return (plan.precio_actual * plan.porcentaje_comision_base) / 100;
  }

  /**
   * Formatear precio del plan
   */
  formatearPrecio(plan: Plan): string {
    return `$${plan.precio_actual.toLocaleString('es-CO')}`;
  }

  /**
   * Obtener planes destacados
   */
  obtenerPlanesDestacados(): Observable<Plan[]> {
    return this.listarPlanesConFiltros(undefined, true);
  }

  /**
   * Validar si un plan está activo
   */
  esPlanActivo(plan: Plan): boolean {
    return plan.estado_plan === 'activo';
  }
}
