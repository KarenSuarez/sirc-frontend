export interface SolicitudRetiro {
  id_solicitud: number;
  id_referente: number;
  metodo_retiro: MetodoRetiro;
  monto_solicitado: number;
  estado_solicitud: EstadoSolicitud;
  fecha_solicitud: string;
  fecha_procesamiento?: string;
  cuenta_destino?: string;
  banco_destino?: string;
  comprobante_pago_url?: string;
  id_usuario_procesa?: number;
  creado_en: string;
  actualizado_en: string;
  procesado_por?: {
    nombre: string;
    apellido: string;
  };
}

export type MetodoRetiro = 'retiro' | 'bono_pago';

export type EstadoSolicitud = 'pendiente' | 'aprobada' | 'rechazada';

export interface CrearSolicitudDTO {
  metodo_retiro: MetodoRetiro;
  monto_solicitado: number;
  cuenta_destino?: string;
  banco_destino?: string;
}

export interface CrearSolicitudResponse {
  message: string;
  solicitud: SolicitudRetiro;
}
