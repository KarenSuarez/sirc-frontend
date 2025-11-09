import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { AlmacenamientoService } from './almacenamiento.service';
import { AUTH_ENDPOINTS } from '../constants/api-endpoints';
import {
  LoginResponse,
  RegisterResponse,
  LoginCredentials,
  RegisterData,
} from '../models/auth-response.interface';
import { Usuario, UsuarioAutenticado } from '../models/usuario.interface';
import { RolDashboard } from '../enums/rol.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioSignal = signal<UsuarioAutenticado | null>(null);
  private autenticadoSignal = signal<boolean>(false);

  readonly usuario = computed(() => this.usuarioSignal());
  readonly estaAutenticado = computed(() => this.autenticadoSignal());
  readonly roles = computed(() => this.usuarioSignal()?.roles || []);
  readonly nombreCompleto = computed(() => {
    const u = this.usuarioSignal();
    return u ? `${u.nombre} ${u.apellido}` : '';
  });

  private usuarioSubject = new BehaviorSubject<UsuarioAutenticado | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(
    private http: HttpClient,
    private almacenamiento: AlmacenamientoService,
    private router: Router
  ) {
    this.inicializarSesion();
  }

  private inicializarSesion(): void {
    const token = this.almacenamiento.obtenerToken();
    const usuario = this.almacenamiento.obtenerUsuario<UsuarioAutenticado>();

    if (token && usuario) {
      this.usuarioSignal.set(usuario);
      this.autenticadoSignal.set(true);
      this.usuarioSubject.next(usuario);
    }
  }

  login(
    numero_documento: string,
    password: string,
    recordar: boolean = false
  ): Observable<LoginResponse> {
    const credentials: LoginCredentials = {
      numero_documento,
      password,
    };

    return this.http
      .post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials)
      .pipe(
        tap((response) => {
          this.almacenamiento.guardarToken(response.token, recordar);
          this.almacenamiento.guardarRecordar(recordar);

          const usuarioAuth = this.construirUsuarioAutenticado(
            response.usuario
          );

          this.almacenamiento.guardarUsuario(usuarioAuth, recordar);

          this.usuarioSignal.set(usuarioAuth);
          this.autenticadoSignal.set(true);
          this.usuarioSubject.next(usuarioAuth);
        }),
        catchError(this.manejarError)
      );
  }

  register(data: RegisterData): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(AUTH_ENDPOINTS.REGISTER, data)
      .pipe(catchError(this.manejarError));
  }

  logout(): Observable<any> {
    const token = this.almacenamiento.obtenerToken();

    if (!token) {
      this.limpiarSesionLocal();
      return of({ message: 'Sesión cerrada' });
    }

    return this.http.post(AUTH_ENDPOINTS.LOGOUT, {}).pipe(
      tap(() => {
        this.limpiarSesionLocal();
      }),
      catchError((error) => {
        this.limpiarSesionLocal();
        return of({ message: 'Sesión cerrada localmente' });
      })
    );
  }

  private limpiarSesionLocal(): void {
    this.almacenamiento.limpiarSesion();
    this.usuarioSignal.set(null);
    this.autenticadoSignal.set(false);
    this.usuarioSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  obtenerUsuarioActual(): Observable<Usuario> {
    return this.http.get<Usuario>(AUTH_ENDPOINTS.ME).pipe(
      tap((usuario) => {
        const usuarioAuth = this.construirUsuarioAutenticado(usuario);
        console.log('🔄 Usuario actualizado desde backend:', usuarioAuth);
        const recordar = this.almacenamiento.debeRecordar();

        this.almacenamiento.guardarUsuario(usuarioAuth, recordar);
        this.usuarioSignal.set(usuarioAuth);
        this.usuarioSubject.next(usuarioAuth);
      }),
      catchError(this.manejarError)
    );
  }

  private construirUsuarioAutenticado(usuario: Usuario): UsuarioAutenticado {
    let roles: string[] = [];

    if (usuario.roles && Array.isArray(usuario.roles)) {
      roles = usuario.roles
        .map((r) => {
          if (typeof r === 'string') return r;
          if (typeof r === 'object' && r !== null) {
            return (r as any).nombre_rol || (r as any).codigo_rol;
          }
          return null;
        })
        .filter((r): r is string => r !== null);
    }

    return {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo_electronico: usuario.correo_electronico,
      telefono: usuario.telefono,
      numero_documento: usuario.numero_documento,
      roles,
      codigo_referente: usuario.referente?.codigo_referente,
    };
  }

  tieneRol(rol: string): boolean {
    const roles = this.usuarioSignal()?.roles || [];
    return roles.some((r) => r.toLowerCase() === rol.toLowerCase());
  }

  tieneAlgunRol(rolesPermitidos: string[]): boolean {
    const roles = this.usuarioSignal()?.roles || [];
    return roles.some((r) =>
      rolesPermitidos.some((rp) => rp.toLowerCase() === r.toLowerCase())
    );
  }

  obtenerDashboardRuta(): string {
    const usuario = this.usuarioSignal();

    if (!usuario || !usuario.roles || usuario.roles.length === 0) {
      console.warn(
        '⚠️ Usuario sin roles asignados, redirigiendo a /referente/dashboard'
      );
      return '/referente/dashboard';
    }

    const primerRol = usuario.roles[0];

    if (!primerRol) {
      console.warn(
        '⚠️ Primer rol es undefined, redirigiendo a /referente/dashboard'
      );
      return '/referente/dashboard';
    }

    const rolKey = primerRol.toLowerCase();
    const ruta = RolDashboard[rolKey as keyof typeof RolDashboard];

    if (!ruta) {
      console.warn(
        `⚠️ Ruta no encontrada para rol: ${rolKey}, redirigiendo a /referente/dashboard`
      );
      return '/referente/dashboard';
    }

    console.log(`✅ Redirigiendo a dashboard de rol: ${rolKey} → ${ruta}`);
    return ruta;
  }

  tieneToken(): boolean {
    return !!this.almacenamiento.obtenerToken();
  }

  obtenerToken(): string | null {
    return this.almacenamiento.obtenerToken();
  }

  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      mensajeError = `Error: ${error.error.message}`;
    } else {
      mensajeError =
        error.error?.message || error.message || 'Error del servidor';
    }

    console.error('Error en AuthService:', mensajeError);
    return throwError(() => new Error(mensajeError));
  }
}
