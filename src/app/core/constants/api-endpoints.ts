import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  LOGOUT: `${API_URL}/auth/logout`,
  ME: `${API_URL}/auth/me`,
} as const;

export const REFERENTE_ENDPOINTS = {
  DASHBOARD: `${API_URL}/referente/dashboard`,
  PERFIL: `${API_URL}/referente/perfil`,
  SALDO: `${API_URL}/referente/saldo`,
  COMISIONES: `${API_URL}/referente/comisiones`,
  NIVEL: `${API_URL}/referente/nivel`,
} as const;

export const REFERIDOS_ENDPOINTS = {
  BASE: `${API_URL}/referidos`,
  CREAR: `${API_URL}/referidos`,
  LISTAR: `${API_URL}/referidos`,
  DETALLE: (id: number) => `${API_URL}/referidos/${id}`,
  ACTUALIZAR: (id: number) => `${API_URL}/referidos/${id}`,
} as const;

export const ASESOR_ENDPOINTS = {
  REFERIDOS: {
    BASE: `${API_URL}/asesor/referidos`,
    DETALLE: (id: number) => `${API_URL}/asesor/referidos/${id}`,
    CONVERTIR: (id: number) => `${API_URL}/asesor/referidos/${id}/convertir`,
    ACTUALIZAR_ESTADO: (id: number) => `${API_URL}/asesor/referidos/${id}/actualizar-estado`,
    ACTUALIZAR: (id: number) => `${API_URL}/asesor/referidos/${id}`,
    CONTACTAR: (id: number) => `${API_URL}/asesor/referidos/${id}/contactar`,
  },
  REFERENTES: {
    BASE: `${API_URL}/asesor/referentes`,
    DETALLE: (id: number) => `${API_URL}/asesor/referentes/${id}`,
    REFERIDOS: (id: number) => `${API_URL}/asesor/referentes/${id}/referidos`,
    MIS_METRICAS: `${API_URL}/asesor/referentes/estadisticas/mis-metricas`,
  },
} as const;

export const SOLICITUDES_ENDPOINTS = {
  BASE: `${API_URL}/solicitudes`,
  CREAR: `${API_URL}/solicitudes`,
  LISTAR: `${API_URL}/solicitudes`,
  CONTADOR_TODAS: `${API_URL}/solicitudes/contador/todas`,
  DETALLE: (id: number) => `${API_URL}/solicitudes/${id}`,
  APROBAR: (id: number) => `${API_URL}/solicitudes/${id}/aprobar`,
  RECHAZAR: (id: number) => `${API_URL}/solicitudes/${id}/rechazar`,
} as const;

export const INSIGNIAS_ENDPOINTS = {
  BASE: `${API_URL}/insignias`,
  DETALLE: (id: number) => `${API_URL}/insignias/${id}`,
  CREAR: `${API_URL}/insignias`,
  ACTUALIZAR: (id: number) => `${API_URL}/insignias/${id}`,
  ELIMINAR: (id: number) => `${API_URL}/insignias/${id}`,
  ASIGNAR: (id: number) => `${API_URL}/insignias/${id}/asignar`,
  REFERENTE: (id: number) => `${API_URL}/insignias/referente/${id}`,
  MIS_INSIGNIAS: `${API_URL}/insignias/mis-insignias`,
} as const;

export const PLANES_ENDPOINTS = {
  BASE: `${API_URL}/planes`,
  DETALLE: (id: number) => `${API_URL}/planes/${id}`,
  CREAR: `${API_URL}/planes`,
  ACTUALIZAR: (id: number) => `${API_URL}/planes/${id}`,
  ELIMINAR: (id: number) => `${API_URL}/planes/${id}`,
} as const;

export const NIVELES_ENDPOINTS = {
  BASE: `${API_URL}/niveles`,
  ACTIVOS: `${API_URL}/niveles/activos`,
  DETALLE: (id: number) => `${API_URL}/niveles/${id}`,
  CREAR: `${API_URL}/niveles`,
  ACTUALIZAR: (id: number) => `${API_URL}/niveles/${id}`,
  ELIMINAR: (id: number) => `${API_URL}/niveles/${id}`,
} as const;

export const KPI_ENDPOINTS = {
  GENERAL: `${API_URL}/kpi/general`,
  REFERENTES: `${API_URL}/kpi/referentes`,
  COMISIONES: `${API_URL}/kpi/comisiones`,
  DASHBOARD: `${API_URL}/kpi/dashboard`,
} as const;

export const USUARIOS_ENDPOINTS = {
  BASE: `${API_URL}/usuarios`,
  DETALLE: (id: number) => `${API_URL}/usuarios/${id}`,
  ACTUALIZAR: (id: number) => `${API_URL}/usuarios/${id}`,
  ELIMINAR: (id: number) => `${API_URL}/usuarios/${id}`,
  ESTADISTICAS: `${API_URL}/usuarios/admin/estadisticas`,
  ASIGNAR_ROL: `${API_URL}/usuarios/admin/asignar-rol`,
  EQUIPO: `${API_URL}/usuarios/gerente/equipo`,
  RENDIMIENTO: `${API_URL}/usuarios/gerente/rendimiento`,
  ESTADISTICAS_DETALLADAS: `${API_URL}/usuarios/gerente/estadisticas-detalladas`,
} as const;

export const PUNTOS_ENDPOINTS = {
  MI_HISTORIAL: `${API_URL}/puntos/mi-historial`,
} as const;

export const RANKING_ENDPOINTS = {
  PUNTOS: `${API_URL}/ranking/puntos`,
  COMISIONES: `${API_URL}/ranking/comisiones`,
  REFERIDOS: `${API_URL}/ranking/referidos`,
  GENERAL: `${API_URL}/ranking/general`,
} as const;
