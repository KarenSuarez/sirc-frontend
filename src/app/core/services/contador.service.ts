import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  SolicitudRecompensa,
  SolicitudesResponse,
  AprobarSolicitudRequest,
  RechazarSolicitudRequest,
  FiltrosSolicitudes,
  EstadoSolicitud,
  MetodoRetiro,
} from '../models/solicitud.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContadorService {
  private solicitudesUrl = `${environment.apiUrl}/solicitudes`;

  constructor(private http: HttpClient) {}

  /**
   * Listar todas las solicitudes (Contador)
   */
  listarTodasSolicitudes(
    filtros?: FiltrosSolicitudes
  ): Observable<SolicitudesResponse> {
    let params = new HttpParams();

    if (filtros?.estado) {
      params = params.set('estado', filtros.estado);
    }
    if (filtros?.metodo_retiro) {
      params = params.set('metodo_retiro', filtros.metodo_retiro);
    }
    if (filtros?.limite) {
      params = params.set('limite', filtros.limite.toString());
    }
    if (filtros?.pagina) {
      params = params.set('pagina', filtros.pagina.toString());
    }

    return this.http.get<SolicitudesResponse>(
      `${this.solicitudesUrl}/contador/todas`,
      { params }
    );
  }

  /**
   * Obtener detalle de una solicitud
   */
  obtenerSolicitud(id: number): Observable<SolicitudRecompensa> {
    return this.http.get<SolicitudRecompensa>(`${this.solicitudesUrl}/${id}`);
  }

  /**
   * Aprobar solicitud
   */
  aprobarSolicitud(
    id: number,
    datos: AprobarSolicitudRequest
  ): Observable<{ message: string; solicitud: SolicitudRecompensa }> {
    return this.http.post<{ message: string; solicitud: SolicitudRecompensa }>(
      `${this.solicitudesUrl}/${id}/aprobar`,
      datos
    );
  }

  /**
   * Rechazar solicitud
   */
  rechazarSolicitud(
    id: number,
    datos: RechazarSolicitudRequest
  ): Observable<{ message: string; solicitud: SolicitudRecompensa; observaciones?: string }> {
    return this.http.post<{
      message: string;
      solicitud: SolicitudRecompensa;
      observaciones?: string;
    }>(`${this.solicitudesUrl}/${id}/rechazar`, datos);
  }

  /**
   * Calcular estadísticas de solicitudes
   */
  calcularEstadisticasSolicitudes(
    solicitudes: SolicitudRecompensa[]
  ): {
    total: number;
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
    monto_total_pendiente: number;
    monto_total_aprobado: number;
  } {
    const stats = {
      total: solicitudes.length,
      pendientes: 0,
      aprobadas: 0,
      rechazadas: 0,
      monto_total_pendiente: 0,
      monto_total_aprobado: 0,
    };

    solicitudes.forEach((sol) => {
      if (sol.estado_solicitud === 'pendiente') {
        stats.pendientes++;
        stats.monto_total_pendiente += sol.monto_solicitado;
      } else if (sol.estado_solicitud === 'aprobada') {
        stats.aprobadas++;
        stats.monto_total_aprobado += sol.monto_solicitado;
      } else if (sol.estado_solicitud === 'rechazada') {
        stats.rechazadas++;
      }
    });

    return stats;
  }

  /**
   * Obtener nombre completo del referente
   */
  obtenerNombreReferente(solicitud: SolicitudRecompensa): string {
    if (!solicitud.referente?.usuario) return 'Desconocido';
    const { nombre, apellido } = solicitud.referente.usuario;
    return `${nombre} ${apellido}`;
  }

  /**
   * Obtener iniciales del referente
   */
  obtenerInicialesReferente(solicitud: SolicitudRecompensa): string {
    if (!solicitud.referente?.usuario) return '??';
    const { nombre, apellido } = solicitud.referente.usuario;
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }

  /**
   * Formatear método de retiro
   */
  formatearMetodoRetiro(metodo: MetodoRetiro): string {
    const metodos: { [key in MetodoRetiro]: string } = {
      retiro: 'Transferencia Bancaria',
      bono_pago: 'Bono de Pago',
    };
    return metodos[metodo] || metodo;
  }

  /**
   * Obtener color del estado
   */
  obtenerColorEstado(estado: EstadoSolicitud): string {
    const colores: { [key in EstadoSolicitud]: string } = {
      pendiente: 'orange',
      aprobada: 'green',
      rechazada: 'red',
    };
    return colores[estado] || 'default';
  }

  /**
   * Obtener texto del estado
   */
  obtenerTextoEstado(estado: EstadoSolicitud): string {
    const textos: { [key in EstadoSolicitud]: string } = {
      pendiente: 'Pendiente',
      aprobada: 'Aprobada',
      rechazada: 'Rechazada',
    };
    return textos[estado] || estado;
  }

  /**
   * Obtener ícono del método de pago
   */
  obtenerIconoMetodo(metodo: MetodoRetiro): string {
    const iconos: { [key in MetodoRetiro]: string } = {
      retiro: 'bank',
      bono_pago: 'gift',
    };
    return iconos[metodo] || 'dollar';
  }
}
