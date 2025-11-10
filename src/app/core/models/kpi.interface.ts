/**
 * KPIs Generales del Sistema
 */
export interface KPIsGenerales {
  usuarios: {
    total: number;
    referentes: {
      total: number;
      activos: number;
      inactivos: number;
    };
  };
  referidos: {
    total: number;
    activos: number;
    pendientes: number;
  };
  comisiones: {
    total: number;
    pendientes: number;
    pagadas: number;
  };
  solicitudes: {
    total: number;
    pendientes: number;
    procesadas: number;
  };
}

/**
 * KPIs de Referentes
 */
export interface KPIsReferentes {
  top_puntos: TopReferente[];
  top_comisiones: TopReferente[];
  top_referidos: TopReferidosReferente[];
  distribucion_niveles: DistribucionNivel[];
}

export interface TopReferente {
  id_usuario: number;
  codigo_referente: string;
  puntos_actuales?: number;
  puntos_totales_historico?: number;
  total_comisiones_historico?: number;
  saldo_disponible?: number;
  usuario: {
    nombre: string;
    apellido: string;
  };
}

export interface TopReferidosReferente {
  id_usuario: number;
  codigo_referente: string;
  nombre: string;
  apellido: string;
  total_referidos: number;
}

export interface DistribucionNivel {
  nombre_nivel: string;
  color_nivel: string;
  cantidad_referentes: number;
}

/**
 * KPIs de Comisiones
 */
export interface KPIsComisiones {
  por_estado: ComisionPorEstado[];
  por_plan: ComisionPorPlan[];
  ultimos_30_dias: number;
  promedio_comision: number;
}

export interface ComisionPorEstado {
  estado_comision: string;
  cantidad: number;
  monto_total: number;
}

export interface ComisionPorPlan {
  nombre_plan: string;
  cantidad_comisiones: number;
  monto_total: number;
  promedio_comision: number;
}

/**
 * Dashboard Completo
 */
export interface DashboardKPIs {
  generales: {
    usuarios: number;
    referentes: {
      total: number;
      activos: number;
    };
    referidos: {
      total: number;
      activos: number;
    };
    comisiones_total: number;
  };
  referentes: {
    top_puntos: TopReferente[];
  };
  comisiones: {
    pendientes: number;
  };
  timestamp: string;
}
