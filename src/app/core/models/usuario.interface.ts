export interface Usuario {
  id_usuario: number;
  numero_documento: string;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  telefono?: string;
  fecha_registro: string;
  roles?: RolUsuario[];
  referente?: Referente;
}

export interface RolUsuario {
  id_rol: number;
  codigo_rol: string;
  nombre_rol: string;
  descripcion?: string;
}

export interface Referente {
  id_usuario: number;
  codigo_referente: string;
  tipo_referente: 'cliente_externo' | 'cliente_interno';
  puntos_actuales: number;
  puntos_totales_historico: number;
  saldo_disponible: number;
  total_comisiones_historico: number;
  total_retirado: number;
  estado_referente: 'activo' | 'inactivo' | 'suspendido';
  fecha_ultima_actividad?: string;
  usuario?: Usuario;
}

export interface UsuarioAutenticado {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  telefono?: string;
  numero_documento: string;
  roles: string[];
  codigo_referente?: string;
}

export interface PerfilReferenteCompleto {
  referente: Referente;
  nivel: NivelReferente;
  progreso: ProgresoNivel;
}

export interface NivelReferente {
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

export interface ProgresoNivel {
  nivel_actual: NivelReferente;
  siguiente_nivel?: NivelReferente;
  puntos_actuales: number;
  puntos_siguiente_nivel?: number;
  puntos_faltantes: number;
  porcentaje_progreso: number;
}

