import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private api: ApiService) {}

  obtenerEstadisticas(): Observable<any> {
    return this.api.get('/usuarios/admin/estadisticas');
  }

  asignarRol(data: { numero_documento: string; id_rol: number }): Observable<any> {
    return this.api.post('/usuarios/admin/asignar-rol', data);
  }
}
