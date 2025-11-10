import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Usuario,
  UsuariosResponse,
  FiltrosUsuarios,
  CrearUsuarioRequest,
  ActualizarUsuarioRequest,
  EstadisticasUsuarios,
  AsignarRolRequest,
  RolUsuario,
} from '../models/usuario.interface';
import { TipoDocumento } from '../models/tipo-documento.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private usuariosUrl = `${environment.apiUrl}/usuarios`;
  private authUrl = `${environment.apiUrl}/auth`;
  private rolesUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  /**
   * Listar todos los usuarios (Admin/Gerente)
   */
  listarUsuarios(filtros?: FiltrosUsuarios): Observable<UsuariosResponse> {
    let params = new HttpParams();

    if (filtros?.rol) {
      params = params.set('rol', filtros.rol);
    }
    if (filtros?.estado) {
      params = params.set('estado', filtros.estado);
    }
    if (filtros?.limite) {
      params = params.set('limite', filtros.limite.toString());
    }
    if (filtros?.pagina) {
      params = params.set('pagina', filtros.pagina.toString());
    }

    return this.http.get<UsuariosResponse>(this.usuariosUrl, { params });
  }

  /**
   * Obtener usuario por ID
   */
  obtenerUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.usuariosUrl}/${id}`);
  }

  /**
   * Crear usuario (usando endpoint de registro)
   */
  crearUsuario(
    datos: CrearUsuarioRequest
  ): Observable<{ message: string; usuario: any }> {
    return this.http.post<{ message: string; usuario: any }>(
      `${this.authUrl}/register`,
      datos
    );
  }

  /**
   * Actualizar usuario
   */
  actualizarUsuario(
    id: number,
    datos: ActualizarUsuarioRequest
  ): Observable<{ message: string; usuario: Usuario }> {
    return this.http.put<{ message: string; usuario: Usuario }>(
      `${this.usuariosUrl}/${id}`,
      datos
    );
  }

  /**
   * Desactivar usuario (soft delete)
   */
  desactivarUsuario(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.usuariosUrl}/${id}`);
  }

  /**
   * Obtener estadísticas de usuarios (Admin)
   */
  obtenerEstadisticas(): Observable<EstadisticasUsuarios> {
    return this.http.get<EstadisticasUsuarios>(
      `${this.usuariosUrl}/admin/estadisticas`
    );
  }

  /**
   * Asignar rol a usuario (Admin)
   */
  asignarRol(datos: AsignarRolRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.usuariosUrl}/admin/asignar-rol`,
      datos
    );
  }

  /**
   * Listar todos los roles disponibles
   */
  listarRoles(): Observable<RolUsuario[]> {
    return this.http.get<RolUsuario[]>(this.rolesUrl);
  }

  /**
   * Listar tipos de documento
   */
  listarTiposDocumento(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(
      `${environment.apiUrl}/tipos-documento`
    );
  }

  /**
   * Calcular estadísticas desde usuarios
   */
  calcularEstadisticas(usuarios: Usuario[]): {
    total: number;
    activos: number;
    inactivos: number;
    por_rol: { [rol: string]: number };
  } {
    const stats = {
      total: usuarios.length,
      activos: 0,
      inactivos: 0,
      por_rol: {} as { [rol: string]: number },
    };

    usuarios.forEach((usuario) => {
      // Contar activos/inactivos (si tiene perfil de referente)
      if (usuario.referente) {
        if (usuario.referente.estado_referente === 'activo') {
          stats.activos++;
        } else {
          stats.inactivos++;
        }
      }

      // Contar por rol
      usuario.roles?.forEach((rol) => {
        const key = rol.codigo_rol;
        stats.por_rol[key] = (stats.por_rol[key] || 0) + 1;
      });
    });

    return stats;
  }

  /**
   * Obtener nombre completo del usuario
   */
  obtenerNombreCompleto(usuario: Usuario): string {
    return `${usuario.nombre} ${usuario.apellido}`;
  }

  /**
   * Obtener iniciales del usuario
   */
  obtenerIniciales(usuario: Usuario): string {
    return `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();
  }

  /**
   * Formatear rol (desde código)
   */
  formatearRol(codigoRol: string): string {
    const roles: { [key: string]: string } = {
      ADMIN: 'Administrador',
      GEST_VENT: 'Gerente de Ventas',
      ASES_VENT: 'Asesor de Ventas',
      CONT: 'Contador',
      REF: 'Referente',
      administrador: 'Administrador',
      gerente_ventas: 'Gerente de Ventas',
      asesor_ventas: 'Asesor de Ventas',
      contador: 'Contador',
      referente: 'Referente',
    };
    return roles[codigoRol] || codigoRol;
  }

  /**
   * Obtener color del rol
   */
  obtenerColorRol(codigoRol: string): string {
    const colores: { [key: string]: string } = {
      ADMIN: 'red',
      GEST_VENT: 'purple',
      ASES_VENT: 'blue',
      CONT: 'cyan',
      REF: 'green',
      administrador: 'red',
      gerente_ventas: 'purple',
      asesor_ventas: 'blue',
      contador: 'cyan',
      referente: 'green',
    };
    return colores[codigoRol] || 'default';
  }

  /**
   * Obtener descripción del rol
   */
  obtenerDescripcionRol(codigoRol: string): string {
    const descripciones: { [key: string]: string } = {
      ADMIN: 'Acceso completo al sistema con capacidad de gestionar usuarios y configuraciones',
      GEST_VENT:
        'Puede gestionar planes, comisiones, niveles e insignias del sistema',
      ASES_VENT: 'Puede gestionar referentes y referidos asignados',
      CONT: 'Puede gestionar retiros y generar reportes financieros',
      REF: 'Puede registrar referidos y consultar sus comisiones',
      administrador:
        'Acceso completo al sistema con capacidad de gestionar usuarios y configuraciones',
      gerente_ventas:
        'Puede gestionar planes, comisiones, niveles e insignias del sistema',
      asesor_ventas: 'Puede gestionar referentes y referidos asignados',
      contador: 'Puede gestionar retiros y generar reportes financieros',
      referente: 'Puede registrar referidos y consultar sus comisiones',
    };
    return descripciones[codigoRol] || '';
  }

  /**
   * Obtener primer rol del usuario (principal)
   */
  obtenerRolPrincipal(usuario: Usuario): RolUsuario | undefined {
    return usuario.roles && usuario.roles.length > 0
      ? usuario.roles[0]
      : undefined;
  }
}
