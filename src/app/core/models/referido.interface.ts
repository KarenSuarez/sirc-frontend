export interface Referido {
  id_referido: number;
  id_referente: number;
  nombre_referido: string;
  apellido_referido: string;
  correo_referido: string;
  telefono_referido: string;
  id_tipo_documento: number;
  numero_documento_referido: string;
  empresa_referido?: string;
  cargo_referido?: string;
  estado_referido: EstadoReferido;
  fecha_referencia: string;
  fecha_primer_contacto?: string;
  fecha_conversion?: string;
  id_plan_adquirido?: number;
  id_asesor_vendedor?: number;
  observaciones?: string;
  creado_en: string;
  actualizado_en: string;

  referente?: {
    codigo_referente: string;
    usuario: {
      nombre: string;
      apellido: string;
      correo_electronico: string;
      telefono?: string;
    };
  };
  plan?: {
    id_plan: number;
    nombre_plan: string;
    precio_actual: number;
    icono_plan?: string;
    color_plan?: string;
  };
  tipoDocumento?: {
    nombre_tipo: string;
    codigo_tipo: string;
  };
  asesorVendedor?: {
    nombre: string;
    apellido: string;
  };
}

export type EstadoReferido =
  | 'pendiente'
  | 'contactado'
  | 'activo'
  | 'no_interesado'
  | 'inactivo';

export interface ReferidosPaginados {
  total: number;
  pagina: number;
  limite: number;
  total_paginas: number;
  referidos: Referido[];
}

export interface ConvertirReferidoRequest {
  id_plan_adquirido: number;
}

/**
 * Request para actualizar estado
 */
export interface ActualizarEstadoRequest {
  estado_referido: EstadoReferido;
  observaciones?: string;
}

/**
 * Request para actualizar información
 */
export interface ActualizarReferidoRequest {
  nombre_referido?: string;
  apellido_referido?: string;
  correo_referido?: string;
  telefono_referido?: string;
  empresa_referido?: string;
  cargo_referido?: string;
  observaciones?: string;
}

/**
 * Request para registrar contacto
 */
export interface RegistrarContactoRequest {
  observaciones?: string;
}

/**
 * Response de conversión
 */
export interface ConversionResponse {
  message: string;
  referido: Referido;
  comision: {
    precio_plan_momento: number;
    monto_comision: number;
    puntos_otorgados: number;
    estado: string;
    id_movimiento: number;
  };
  asesor_vendedor: {
    id_usuario: number;
    mensaje: string;
  };
}

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


