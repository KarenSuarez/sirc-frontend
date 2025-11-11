import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private baseUrl = environment.apiUrl; // Ejemplo: http://localhost:3000

  constructor(private http: HttpClient) {}

  /** Estadísticas generales del sistema (Admin) */
  obtenerEstadisticas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/admin/estadisticas`);
  }

  /** KPI generales del sistema */
  obtenerKpiGeneral(): Observable<any> {
    return this.http.get(`${this.baseUrl}/kpi/general`);
  }

  /** Dashboard de KPIs combinados */
  obtenerDashboardKpi(): Observable<any> {
    return this.http.get(`${this.baseUrl}/kpi/dashboard`);
  }

  /** Listar todos los usuarios (para tabla o resumen) */
  listarUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios`);
  }
}
