export interface Comision {
  id_movimiento: number;
  id_referente: number;
  id_referido: number;
  puntos_otorgados: number;
  creado_en: string;
  precio_plan_momento: number;
  porcentaje_comision_base: number;
  porcentaje_comision_nivel: number;
  porcentaje_comision_total: number;
  monto_comision: number;
  estado_comision: EstadoComision;
  fecha_movimiento: string;
  fecha_vencimiento: string | null;
  referido: {
    id_referido: number;
    nombre_referido: string;
    apellido_referido: string;
    empresa_referido: string;
    plan: {
      nombre_plan: string;
    };
  };
}

export type EstadoComision = 'pendiente' | 'pagada' | 'cancelada';

export interface EstadisticasComisiones {
  total_comisiones: number;
  comisiones_pendientes: number;
  comisiones_pagadas: number;
  monto_total: number;
  monto_pendiente: number;
  monto_pagado: number;
}
