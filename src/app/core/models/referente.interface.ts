// ... código existente ...

/**
 * Referente con métricas (para asesores)
 */
export interface ReferenteConMetricas {
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
  creado_en: string;
  actualizado_en: string;

  // Usuario asociado
  usuario: {
    nombre: string;
    apellido: string;
    correo_electronico: string;
    telefono?: string;
    numero_documento: string;
  };

  // Métricas agregadas
  metricas: {
    total_referidos: number;
    referidos_activos: number;
  };
}

/**
 * Response paginada de referentes
 */
export interface ReferentesPaginados {
  total: number;
  pagina: number;
  limite: number;
  total_paginas: number;
  referentes: ReferenteConMetricas[];
}

/**
 * Métricas del asesor
 */
export interface MetricasAsesor {
  referidos_convertidos_total: number;
  comisiones_generadas_total: number;
  conversiones_ultimos_30_dias: number;
}
