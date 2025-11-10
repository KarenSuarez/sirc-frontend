/**
 * Interface de Plan
 */
export interface Plan {
  id_plan: number;
  nombre_plan: string;
  descripcion_plan?: string;
  precio_actual: number;
  porcentaje_comision: number;
  puntos_plan: number;
  duracion_dias: number;
  icono_plan?: string;
  color_plan?: string;
  caracteristicas_plan?: string; // JSON string o null
  estado_plan: EstadoPlan;
  es_destacado: boolean;
  orden_visualizacion: number;
  creado_en: string;
  actualizado_en: string;
}

/**
 * Estados del plan
 */
export type EstadoPlan = 'activo' | 'inactivo' | 'eliminado';

/**
 * Característica del plan (parseada)
 */
export interface CaracteristicaPlan {
  nombre: string;
  descripcion?: string;
  icono?: string;
  incluido: boolean;
}

/**
 * Plan con características parseadas
 */
export interface PlanConCaracteristicas extends Plan {
  caracteristicas: CaracteristicaPlan[];
}

/**
 * Request para crear plan
 */
export interface CrearPlanRequest {
  nombre_plan: string;
  descripcion_plan?: string;
  precio_actual: number;
  porcentaje_comision: number;
  puntos_plan: number;
  duracion_dias: number;
  icono_plan?: string;
  color_plan?: string;
  caracteristicas_plan?: string;
  es_destacado?: boolean;
  orden_visualizacion?: number;
}

/**
 * Request para actualizar plan
 */
export interface ActualizarPlanRequest {
  nombre_plan?: string;
  descripcion_plan?: string;
  precio_actual?: number;
  porcentaje_comision?: number;
  puntos_plan?: number;
  duracion_dias?: number;
  icono_plan?: string;
  color_plan?: string;
  caracteristicas_plan?: string;
  estado_plan?: EstadoPlan;
  es_destacado?: boolean;
  orden_visualizacion?: number;
}

/**
 * Historial de precios del plan
 */
export interface HistorialPrecioPlan {
  id_historial: number;
  id_plan: number;
  precio_anterior: number;
  precio_nuevo: number;
  fecha_cambio: string;
  id_usuario_cambio?: number;
  motivo_cambio?: string;
}

/**
 * Response de estadísticas de plan
 */
export interface EstadisticasPlan {
  id_plan: number;
  nombre_plan: string;
  total_referidos: number;
  referidos_activos: number;
  comisiones_generadas: number;
  puntos_otorgados: number;
  ingresos_totales: number;
}
