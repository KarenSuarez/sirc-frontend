import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  KPIsGenerales,
  KPIsReferentes,
  KPIsComisiones,
  DashboardKPIs,
} from '../models/kpi.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GerenteService {
  private kpiUrl = `${environment.apiUrl}/kpi`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener KPIs generales del sistema
   */
  obtenerKPIsGenerales(): Observable<KPIsGenerales> {
    return this.http.get<KPIsGenerales>(`${this.kpiUrl}/general`);
  }

  /**
   * Obtener KPIs de referentes
   */
  obtenerKPIsReferentes(): Observable<KPIsReferentes> {
    return this.http.get<KPIsReferentes>(`${this.kpiUrl}/referentes`);
  }

  /**
   * Obtener KPIs de comisiones
   */
  obtenerKPIsComisiones(): Observable<KPIsComisiones> {
    return this.http.get<KPIsComisiones>(`${this.kpiUrl}/comisiones`);
  }

  /**
   * Obtener dashboard completo de KPIs
   */
  obtenerDashboardKPIs(): Observable<DashboardKPIs> {
    return this.http.get<DashboardKPIs>(`${this.kpiUrl}/dashboard`);
  }
}
