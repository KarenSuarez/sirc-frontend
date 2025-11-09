export interface Nivel {
  id_nivel: number;
  nombre_nivel: string;
  orden_nivel: number;
  puntos_minimos: number;
  puntos_maximos: number;
  porcentaje_comision_extra: number;
  icono_nivel?: string;
  color_nivel?: string;
  beneficios_nivel?: string;
  descripcion?: string;
}

export interface Insignia {
  id_insignia: number;
  nombre_insignia: string;
  descripcion?: string;
  icono_insignia?: string;
  color_insignia?: string;
  criterio_obtencion?: string;
  rareza: Rareza;
  estado: 'activa' | 'inactiva';
  creado_en?: string;
  actualizado_en?: string;
}

export type Rareza = 'comun' | 'rara' | 'epica' | 'legendaria';

export interface InsigniaReferente {
  id_insignia_referente: number;
  id_referente: number;
  id_insignia: number;
  insignia: Insignia;
  fecha_obtencion: string;
  notificado: boolean;
  creado_en?: string;
}

export interface PerfilNivel {
  nivel_actual: Nivel;
  siguiente_nivel?: Nivel;
  puntos_actuales: number;
  puntos_para_siguiente: number;
  progreso_porcentaje: number;
}
