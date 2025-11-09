import { Injectable, computed, signal } from '@angular/core';
import { Observable, catchError, map, throwError, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import {
  Usuario,
  Referente,
  UsuarioAutenticado,
  PerfilReferenteCompleto,
} from '../models/usuario.interface';
import { AuthService } from './auth.service';
import { REFERENTE_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class UsuarioHelperService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  get usuario() {
    return this.authService.usuario;
  }

  get nombreCompleto(): string {
    const u = this.usuario();
    return u ? `${u.nombre} ${u.apellido}` : '';
  }

  get iniciales(): string {
    const u = this.usuario();
    return u ? `${u.nombre[0]}${u.apellido[0]}`.toUpperCase() : '';
  }

  get primerRol(): string {
    const u = this.usuario();
    return u?.roles[0] || '';
  }

  get esReferente(): boolean {
    return this.authService.tieneRol('referente');
  }

  get esAsesor(): boolean {
    return this.authService.tieneRol('asesor_ventas');
  }

  get esGerente(): boolean {
    return this.authService.tieneRol('gerente_ventas');
  }

  get esContador(): boolean {
    return this.authService.tieneRol('contador');
  }

  get esAdmin(): boolean {
    return this.authService.tieneRol('administrador');
  }

  obtenerPerfilReferente(): Observable<Referente> {
    return this.http.get<Referente>(REFERENTE_ENDPOINTS.PERFIL);
  }

  obtenerPuntosActuales(): Observable<number> {
    return this.obtenerPerfilReferente().pipe(
      map((referente) => referente.puntos_actuales)
    );
  }

  obtenerSaldoDisponible(): Observable<number> {
    return this.obtenerPerfilCompletoReferente().pipe(
      map((perfil) => {
        const saldo = perfil?.referente?.saldo_disponible;
        return saldo;
      })
    );
  }

  static extraerIniciales(nombre: string, apellido: string): string {
    if (!nombre || !apellido) return '';
    return `${nombre[0]}${apellido[0]}`.toUpperCase();
  }

  static formatearDocumento(documento: string): string {
    if (!documento) return '';
    return documento.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  obtenerPerfilCompletoReferente(): Observable<PerfilReferenteCompleto> {
    return this.http
      .get<PerfilReferenteCompleto>(REFERENTE_ENDPOINTS.PERFIL)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener perfil completo:', error);
          return throwError(() => error);
        })
      );
  }
}
