import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioHelperService } from '../../../core/services/usuario-helper.service';
import { ContadorService } from '../../../core/services/contador.service';
import { UsuarioAutenticado } from '../../../core/models/usuario.interface';
import { SolicitudRecompensa } from '../../../core/models/solicitud.interface';

interface Estadisticas {
  retirosPendientes: number;
  retirosHoy: number;
  montoMes: number;
  totalRetiros: number;
}

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
    NzTableModule,
    NzTagModule,
    NzSpinModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  usuario: UsuarioAutenticado | null = null;
  cargando = true;

  estadisticas: Estadisticas = {
    retirosPendientes: 0,
    retirosHoy: 0,
    montoMes: 0,
    totalRetiros: 0,
  };

  ultimasSolicitudes: SolicitudRecompensa[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    public usuarioHelper: UsuarioHelperService,
    private contadorService: ContadorService,
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
   * SOLO usando endpoints que el contador puede acceder
   */
  cargarDatos() {
    this.cargando = true;

    // Solo cargar solicitudes - NO usar /kpi/general que requiere permisos de gerente
    forkJoin({
      solicitudesPendientes: this.contadorService.listarTodasSolicitudes({
        estado: 'pendiente',
        limite: 5,
        pagina: 1,
      }),
      todasSolicitudes: this.contadorService.listarTodasSolicitudes({
        limite: 1000, // Aumentar límite para obtener todas
        pagina: 1,
      }),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.procesarEstadisticas(data.todasSolicitudes.solicitudes);
          this.ultimasSolicitudes = data.solicitudesPendientes.solicitudes;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar dashboard:', error);
          this.message.error('Error al cargar datos del dashboard');
          this.cargando = false;
        },
      });
  }

  /**
   * Procesar estadísticas desde las solicitudes
   */
  procesarEstadisticas(solicitudes: SolicitudRecompensa[]) {
    const stats = this.contadorService.calcularEstadisticasSolicitudes(solicitudes);

    this.estadisticas.retirosPendientes = stats.pendientes;
    this.estadisticas.totalRetiros = stats.total;

    // Calcular retiros de hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    this.estadisticas.retirosHoy = solicitudes.filter((s) => {
      if (!s.fecha_procesamiento || s.estado_solicitud !== 'aprobada') {
        return false;
      }
      const fechaProceso = new Date(s.fecha_procesamiento);
      fechaProceso.setHours(0, 0, 0, 0);
      return fechaProceso.getTime() === hoy.getTime();
    }).length;

    // Calcular monto del mes actual
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    this.estadisticas.montoMes = solicitudes
      .filter((s) => {
        if (!s.fecha_procesamiento || s.estado_solicitud !== 'aprobada') {
          return false;
        }
        const fechaProceso = new Date(s.fecha_procesamiento);
        return fechaProceso >= inicioMes;
      })
      .reduce((sum, s) => sum + s.monto_solicitado, 0);
  }

  /**
   * Obtener color del estado
   */
  getEstadoColor(estado: string): string {
    return this.contadorService.obtenerColorEstado(estado as any);
  }

  /**
   * Obtener texto del estado
   */
  getEstadoTexto(estado: string): string {
    return this.contadorService.obtenerTextoEstado(estado as any);
  }

  /**
   * Formatear fecha
   */
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  /**
   * Obtener nombre del referente
   */
  obtenerNombreReferente(solicitud: SolicitudRecompensa): string {
    return this.contadorService.obtenerNombreReferente(solicitud);
  }

  get nombreCompleto(): string {
    return this.usuarioHelper.nombreCompleto;
  }

  get iniciales(): string {
    return this.usuarioHelper.iniciales;
  }
}
