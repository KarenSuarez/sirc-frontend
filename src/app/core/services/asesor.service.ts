import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AsesorService {
  constructor(private api: ApiService) {}

  // REFERIDOS
  listarReferidos(): Observable<any> {
    return this.api.get('/asesor/referidos');
  }

  obtenerReferido(id: number): Observable<any> {
    return this.api.get(`/asesor/referidos/${id}`);
  }

  actualizarReferido(id: number, data: any): Observable<any> {
    return this.api.put(`/asesor/referidos/${id}`, data);
  }

  convertirReferido(id: number, data: any): Observable<any> {
    return this.api.post(`/asesor/referidos/${id}/convertir`, data);
  }

  actualizarEstadoReferido(id: number, data: any): Observable<any> {
    return this.api.put(`/asesor/referidos/${id}/actualizar-estado`, data);
  }

  contactarReferido(id: number, data: any): Observable<any> {
    return this.api.post(`/asesor/referidos/${id}/contactar`, data);
  }

  // REFERENTES
  listarReferentes(): Observable<any> {
    return this.api.get('/asesor/referentes');
  }

  obtenerReferente(id: number): Observable<any> {
    return this.api.get(`/asesor/referentes/${id}`);
  }

  listarReferidosDeReferente(id: number): Observable<any> {
    return this.api.get(`/asesor/referentes/${id}/referidos`);
  }

  obtenerMisMetricas(): Observable<any> {
    return this.api.get('/asesor/referentes/estadisticas/mis-metricas');
  }
}
