import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AsesorService {
  private baseEndpoint = 'asesor';

  constructor(private api: ApiService) {}

//Obtiene todos los referidos asignados al asesor  
  getReferidos(): Observable<any> {
    return this.api.get(`${this.baseEndpoint}/referidos`);
  }


  // Obtiene las estadísticas del asesor (ventas, puntos, etc.)
  getEstadisticas(): Observable<any> {
    return this.api.get(`${this.baseEndpoint}/estadisticas`);
  }


  // Crea un nuevo cliente o referido desde el panel del asesor
  crearCliente(data: any): Observable<any> {
    return this.api.post(`${this.baseEndpoint}/clientes`, data);
  }

  
  //Actualiza los datos de un cliente
  
  actualizarCliente(idCliente: string, data: any): Observable<any> {
    return this.api.put(`${this.baseEndpoint}/clientes/${idCliente}`, data);
  }

  
  // Elimina un cliente asociado al asesor
  
  eliminarCliente(idCliente: string): Observable<any> {
    return this.api.delete(`${this.baseEndpoint}/clientes/${idCliente}`);
  }
}
