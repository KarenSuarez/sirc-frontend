import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Comision, EstadisticasComisiones } from '../models/comision.interface';

const COMISION_ENDPOINTS = {
  BASE: `${environment.apiUrl}/referente/comisiones`,
};

@Injectable({
  providedIn: 'root',
})
export class ComisionService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Comision[]> {
    return this.http.get<Comision[]>(COMISION_ENDPOINTS.BASE);
  }

  obtenerEstadisticas(): Observable<EstadisticasComisiones> {
    return this.http.get<EstadisticasComisiones>(
      `${COMISION_ENDPOINTS.BASE}/estadisticas`
    );
  }
}
