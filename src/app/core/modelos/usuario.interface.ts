export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  tipoDoc: string;
  documento: string;
  telefono: string;
  fechaNacimiento: string;
  rol: 'referente' | 'asesor' | 'admin' | 'contador';
  codigo?: string;
  link?: string;
  puntos?: number;
  referidos?: number;
  creditos?: number;
  categoria?: string;
  avatar?: string;
}

export interface Estadisticas {
  puntos: number;
  referidos: number;
  creditos: number;
  categoria: string;
}
