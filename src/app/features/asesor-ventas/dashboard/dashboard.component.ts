import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioHelperService } from '../../../core/services/usuario-helper.service';
import { AsesorService } from '../../../core/services/asesor.service';
import { UsuarioAutenticado } from '../../../core/models/usuario.interface';
import { MetricasAsesor } from '../../../core/models/referente.interface';
import { Referido } from '../../../core/models/referido.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzStatisticModule,
    NzGridModule,
    NzSpinModule,
    NzTableModule,
    NzTagModule,
    NzAvatarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  usuario: UsuarioAutenticado | null = null;
  metricas: MetricasAsesor | null = null;
  ultimosReferidos: Referido[] = [];
  cargando = true;

  // Estadísticas adicionales
  referidosPendientes = 0;
  referidosContactados = 0;
  referidosActivos = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    public usuarioHelper: UsuarioHelperService,
    private asesorService: AsesorService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.usuario = this.authService.usuario();
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar todos los datos del dashboard
   */
  cargarDatos() {
    this.cargando = true;

    forkJoin({
      metricas: this.asesorService.obtenerMisMetricas(),
      referidos: this.asesorService.listarReferidos(undefined, 10, 1), // Últimos 10
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.metricas = data.metricas;
          this.ultimosReferidos = data.referidos.referidos.slice(0, 5); // Mostrar solo 5

          // Calcular estadísticas por estado
          this.calcularEstadisticas(data.referidos.referidos);

          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar datos del dashboard:', error);
          this.message.error('Error al cargar datos del dashboard');
          this.cargando = false;
        },
      });
  }

  /**
   * Calcular estadísticas por estado
   */
  calcularEstadisticas(referidos: Referido[]) {
    this.referidosPendientes = referidos.filter(
      (r) => r.estado_referido === 'pendiente'
    ).length;
    this.referidosContactados = referidos.filter(
      (r) => r.estado_referido === 'contactado'
    ).length;
    this.referidosActivos = referidos.filter(
      (r) => r.estado_referido === 'activo'
    ).length;
  }

  /**
   * Navegar a lista de referidos con filtro
   */
  verReferidosPorEstado(estado?: string) {
    this.router.navigate(['/asesor/referidos'], {
      queryParams: estado ? { estado } : {},
    });
  }

  /**
   * Navegar a referentes
   */
  verReferentes() {
    this.router.navigate(['/asesor/referentes']);
  }

  /**
   * Ver detalle de referido
   */
  verDetalleReferido(referido: Referido) {
    this.router.navigate([
      `/asesor/referidos/${referido.id_referido}/editar`
    ]);
  }

  /**
   * Obtener color del estado
   */
  getEstadoColor(estado: string): string {
    const colores: Record<string, string> = {
      pendiente: 'orange',
      contactado: 'blue',
      activo: 'green',
      no_interesado: 'red',
      inactivo: 'default',
    };
    return colores[estado] || 'default';
  }

  /**
   * Obtener texto del estado
   */
  getEstadoTexto(estado: string): string {
    const textos: Record<string, string> = {
      pendiente: 'Pendiente',
      contactado: 'Contactado',
      activo: 'Activo',
      no_interesado: 'No Interesado',
      inactivo: 'Inactivo',
    };
    return textos[estado] || estado;
  }

  /**
   * Formatear fecha
   */
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Iniciales del usuario
   */
  get iniciales(): string {
    return this.usuarioHelper.iniciales;
  }

  /**
   * Nombre completo del usuario
   */
  get nombreCompleto(): string {
    return this.usuarioHelper.nombreCompleto;
  }
}
