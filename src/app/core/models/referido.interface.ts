export interface Referido {
  id_referido: number;
  id_referente: number;
  numero_documento_referido: string;
  id_tipo_documento: number;
  nombre_referido: string;
  apellido_referido: string;
  correo_referido: string;
  telefono_referido: string;
  empresa_referido?: string;
  cargo_referido?: string;
  estado_referido: EstadoReferido;
  fecha_referencia: string;
  fecha_conversion?: string;
  id_plan_adquirido?: number;
  observaciones?: string;
  creado_en: string;
  actualizado_en: string;
  plan?: Plan;
  tipoDocumento?: TipoDocumento;
}

export type EstadoReferido =
  | 'pendiente'
  | 'contactado'
  | 'activo'
  | 'no_interesado'
  | 'inactivo';

export interface Plan {
  id_plan: number;
  nombre_plan: string;
  descripcion?: string;
  precio_actual: number;
  porcentaje_comision_base: number;
  puntos_otorgados: number;
  estado_plan: 'activo' | 'inactivo';
  icono_plan?: string;
  color_plan?: string;
}

export interface TipoDocumento {
  id_tipo_documento: number;
  codigo_tipo: string;
  nombre_tipo: string;
}

export interface CrearReferidoDTO {
  numero_documento_referido: string;
  id_tipo_documento: number;
  nombre_referido: string;
  apellido_referido: string;
  correo_referido: string;
  telefono_referido: string;
  empresa_referido?: string;
  cargo_referido?: string;
  observaciones?: string;
}

export interface ActualizarReferidoDTO {
  nombre_referido?: string;
  apellido_referido?: string;
  correo_referido?: string;
  telefono_referido?: string;
  empresa_referido?: string;
  cargo_referido?: string;
  estado_referido?: EstadoReferido;
  observaciones?: string;
}

export interface ConvertirReferidoDTO {
  id_plan_adquirido: number;
}

export interface CrearReferidoResponse {
  message: string;
  referido: Referido;
}

export interface ConvertirReferidoResponse {
  message: string;
  referido: Referido;
  comision: any;
}
