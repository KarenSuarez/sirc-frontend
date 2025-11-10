/**
 * Interface de Insignia
 */
export interface Insignia {
  id_insignia: number;
  nombre_insignia: string;
  descripcion: string;
  icono_insignia: string;
  color_insignia: string;
  criterio_obtencion: string;
  rareza: RarezaInsignia;
  estado: EstadoInsignia;
  creado_en: string;
  actualizado_en: string;
}

/**
 * Rareza de insignia
 */
export type RarezaInsignia = 'comun' | 'rara' | 'epica' | 'legendaria';

/**
 * Estado de insignia
 */
export type EstadoInsignia = 'activa' | 'inactiva';

/**
 * Insignia con estadísticas
 */
export interface InsigniaConEstadisticas extends Insignia {
  estadisticas: {
    total_referentes: number;
  };
}

/**
 * Request para crear insignia
 */
export interface CrearInsigniaRequest {
  nombre_insignia: string;
  descripcion: string;
  icono_insignia: string;
  color_insignia?: string;
  criterio_obtencion: string;
  rareza?: RarezaInsignia;
}

/**
 * Request para actualizar insignia
 */
export interface ActualizarInsigniaRequest {
  nombre_insignia?: string;
  descripcion?: string;
  icono_insignia?: string;
  color_insignia?: string;
  criterio_obtencion?: string;
  rareza?: RarezaInsignia;
  estado?: EstadoInsignia;
}

/**
 * Asignación de insignia a referente
 */
export interface InsigniaReferente {
  id_asignacion: number;
  id_referente: number;
  id_insignia: number;
  fecha_obtencion: string;
  notificado: boolean;
  insignia?: Insignia;
}

/**
 * Request para asignar insignia
 */
export interface AsignarInsigniaRequest {
  id_referente: number;
}
