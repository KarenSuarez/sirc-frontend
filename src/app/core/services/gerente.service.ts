import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GerenteService {
  constructor(private api: ApiService) {}

  obtenerEquipo(): Observable<any> {
    return this.api.get('/usuarios/gerente/equipo');
  }

  obtenerRendimiento(): Observable<any> {
    return this.api.get('/usuarios/gerente/rendimiento');
  }

  obtenerEstadisticasDetalladas(): Observable<any> {
    return this.api.get('/usuarios/gerente/estadisticas-detalladas');
  }
}
