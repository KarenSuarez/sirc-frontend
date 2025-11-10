/**
 * Estados posibles de una solicitud
 */
export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada';

/**
 * Métodos de retiro disponibles
 */
export type MetodoRetiro = 'retiro' | 'bono_pago';

/**
 * Interface de Solicitud de Recompensa
 */
export interface SolicitudRecompensa {
  id_solicitud: number;
  id_referente: number;
  metodo_retiro: MetodoRetiro;
  monto_solicitado: number;
  estado_solicitud: EstadoSolicitud;
  fecha_solicitud: string;
  fecha_procesamiento?: string;
  id_usuario_procesa?: number;
  comprobante_pago_url?: string;
  cuenta_destino?: string;
  banco_destino?: string;
  creado_en: string;
  actualizado_en: string;

  // Relaciones
  referente?: {
    id_usuario: number;
    codigo_referente: string;
    saldo_disponible: number;
    usuario: {
      nombre: string;
      apellido: string;
      correo_electronico: string;
      telefono?: string;
      numero_documento: string;
    };
  };
  procesado_por?: {
    nombre: string;
    apellido: string;
  };
}

/**
 * Respuesta paginada de solicitudes
 */
export interface SolicitudesResponse {
  total: number;
  pagina: number;
  limite: number;
  total_paginas: number;
  solicitudes: SolicitudRecompensa[];
}

/**
 * Request para crear solicitud (Referente)
 */
export interface CrearSolicitudRequest {
  metodo_retiro: MetodoRetiro;
  monto_solicitado: number;
  cuenta_destino?: string;
  banco_destino?: string;
}

/**
 * Request para aprobar solicitud (Contador)
 */
export interface AprobarSolicitudRequest {
  comprobante_pago_url?: string;
  observaciones?: string;
}

/**
 * Request para rechazar solicitud (Contador)
 */
export interface RechazarSolicitudRequest {
  observaciones?: string;
}

/**
 * Filtros para listar solicitudes
 */
export interface FiltrosSolicitudes {
  estado?: EstadoSolicitud;
  metodo_retiro?: MetodoRetiro;
  limite?: number;
  pagina?: number;
}

/**
 * Estadísticas de solicitudes para el dashboard del contador
 */
export interface EstadisticasSolicitudes {
  total: number;
  pendientes: number;
  aprobadas: number;
  rechazadas: number;
  monto_total_pendiente: number;
  monto_total_aprobado: number;
  monto_total_rechazado: number;
}
