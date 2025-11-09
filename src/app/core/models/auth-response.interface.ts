import { Usuario } from './usuario.interface';

export interface LoginResponse {
  message: string;
  token: string;
  usuario: Usuario;
}

export interface RegisterResponse {
  message: string;
  usuario: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo_electronico: string;
    numero_documento: string;
  };
}

export interface LoginCredentials {
  numero_documento: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  correo_electronico: string;
  password: string;
  numero_documento: string;
  id_tipo_documento: number;
  telefono?: string;
  roles?: string[];
  tipo_referente?: 'cliente_interno' | 'cliente_externo';
}
