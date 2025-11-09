import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioHelperService } from '../../../core/services/usuario-helper.service';
import { ReferidoService } from '../../../core/services/referido.service';
import {
  UsuarioAutenticado,
  Referente,
  PerfilReferenteCompleto,
} from '../../../core/models/usuario.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzStatisticModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzAvatarModule,
    NzSpinModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  usuario: UsuarioAutenticado | null = null;
  perfilReferente: Referente | null = null;
  perfilCompleto: PerfilReferenteCompleto | null = null;
  cargando = true;
  totalReferidos = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private usuarioHelper: UsuarioHelperService,
    private referidoService: ReferidoService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.usuario = this.authService.usuario();
    if (this.usuario) {
      this.cargarDatosCompletos();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatosCompletos() {
    this.cargando = true;

    this.usuarioHelper
      .obtenerPerfilCompletoReferente()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (perfil) => {
          this.perfilCompleto = perfil;
          this.perfilReferente = perfil.referente;
          this.cargarReferidos();
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar perfil completo:', error);
          this.cargando = false;
          this.message.error('Error al cargar datos del dashboard');

          this.cargarPerfilBasico();
        },
      });
  }

  cargarPerfilBasico() {
    this.usuarioHelper
      .obtenerPerfilReferente()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (perfil) => {
          this.perfilReferente = perfil;
          this.cargarReferidos();
        },
        error: (error) => {
          console.error('Error al cargar perfil básico:', error);
        },
      });
  }

  cargarReferidos() {
    this.referidoService
      .listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (referidos) => {
          this.totalReferidos = referidos.length;
        },
        error: (error) => {
          console.error('Error al cargar referidos:', error);
          this.totalReferidos = 0;
        },
      });
  }

  get iniciales(): string {
    return this.usuarioHelper.iniciales;
  }

  get codigoReferente(): string {
    return (
      this.usuario?.codigo_referente ||
      this.perfilReferente?.codigo_referente ||
      ''
    );
  }

  get linkReferido(): string {
    if (!this.codigoReferente) return '';
    return `https://clarisa.com/registro?ref=${this.codigoReferente}`;
  }

  get nivelActual(): string {
    return this.perfilCompleto?.nivel?.nombre_nivel || '';
  }

  get colorNivel(): string {
    return this.perfilCompleto?.nivel?.color_nivel || '';
  }

  get iconoNivel(): string {
    return this.perfilCompleto?.nivel?.icono_nivel || '';
  }

  get colorNivelTranslucido(): string {
    const color = this.perfilCompleto?.nivel?.color_nivel || '';
    return this.hexToRgba(color, 0.08);
  }

  hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  copiarCodigo() {
    if (this.codigoReferente) {
      navigator.clipboard.writeText(this.codigoReferente);
      this.message.success('Código copiado al portapapeles');
    }
  }

  copiarLink() {
    if (this.linkReferido) {
      navigator.clipboard.writeText(this.linkReferido);
      this.message.success('Enlace copiado al portapapeles');
    }
  }

  navigateToProfile() {
    this.router.navigate(['/referente/perfil']);
  }
}
