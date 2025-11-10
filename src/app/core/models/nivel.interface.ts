/**
 * Interface de Nivel (completa)
 */
export interface Nivel {
  id_nivel: number;
  nombre_nivel: string;
  orden_nivel: number;
  puntos_minimos: number;
  puntos_maximos: number;
  porcentaje_comision_extra: number;
  icono_nivel?: string;
  color_nivel?: string;
  beneficios_nivel?: string; // JSON string
  descripcion?: string;
  creado_en: string;
  actualizado_en: string;
}

/**
 * Request para crear nivel
 */
export interface CrearNivelRequest {
  nombre_nivel: string;
  orden_nivel: number;
  puntos_minimos: number;
  puntos_maximos: number;
  porcentaje_comision_extra?: number;
  icono_nivel?: string;
  color_nivel?: string;
  beneficios_nivel?: string;
  descripcion?: string;
}

/**
 * Request para actualizar nivel
 */
export interface ActualizarNivelRequest {
  nombre_nivel?: string;
  orden_nivel?: number;
  puntos_minimos?: number;
  puntos_maximos?: number;
  porcentaje_comision_extra?: number;
  icono_nivel?: string;
  color_nivel?: string;
  beneficios_nivel?: string;
  descripcion?: string;
}

/**
 * Beneficio parseado del nivel
 */
export interface BeneficioNivel {
  descripcion?: string;
  icono?: string;
}
