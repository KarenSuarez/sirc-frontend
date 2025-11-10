import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AdminService } from '../../../core/services/admin.service';
import { GerenteService } from '../../../core/services/gerente.service';
import { Usuario } from '../../../core/models/usuario.interface';

interface Estadisticas {
  totalUsuarios: number;
  usuariosActivos: number;
  totalReferentes: number;
  ingresosTotal: number;
}

interface DistribucionRol {
  nombre: string;
  cantidad: number;
  porcentaje: number;
  color: string;
}

interface Actividad {
  fecha: Date;
  usuario: string;
  accion: string;
  tipo: string;
  detalles: string;
  exitoso: boolean;
}

interface ChartSegment {
  color: string;
  dashArray: string;
  offset: number;
}

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
    NzTagModule,
    NzTableModule,
    NzSpinModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  cargando = true;

  estadisticas: Estadisticas = {
    totalUsuarios: 0,
    usuariosActivos: 0,
    totalReferentes: 0,
    ingresosTotal: 0,
  };

  distribucionRoles: DistribucionRol[] = [];
  chartSegments: ChartSegment[] = [];
  actividadReciente: Actividad[] = [];
  ultimosUsuarios: Usuario[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private adminService: AdminService,
    private gerenteService: GerenteService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar datos desde backend
   */
  cargarDatos() {
    this.cargando = true;

    forkJoin({
      usuarios: this.adminService.listarUsuarios({ limite: 100, pagina: 1 }),
      kpisGenerales: this.gerenteService.obtenerKPIsGenerales(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.procesarDatos(data.usuarios.usuarios, data.kpisGenerales);
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar dashboard:', error);
          this.message.error('Error al cargar datos del dashboard');
          this.cargando = false;
          // Cargar datos de respaldo
          this.cargarDatosRespaldo();
        },
      });
  }

  /**
   * Procesar datos del backend
   */
  procesarDatos(usuarios: Usuario[], kpis: any) {
    const stats = this.adminService.calcularEstadisticas(usuarios);

    // Estadísticas
    this.estadisticas = {
      totalUsuarios: stats.total,
      usuariosActivos: stats.activos,
      totalReferentes: stats.por_rol['REF'] || stats.por_rol['referente'] || 0,
      ingresosTotal: kpis.comisiones.total,
    };

    // Distribución por roles
    this.calcularDistribucionRoles(stats.por_rol, stats.total);

    // Últimos usuarios registrados
    this.ultimosUsuarios = usuarios
      .sort((a, b) => {
        const fechaA = new Date(a.fecha_registro).getTime();
        const fechaB = new Date(b.fecha_registro).getTime();
        return fechaB - fechaA;
      })
      .slice(0, 5);

    // Actividad reciente (simulada por ahora)
    this.actividadReciente = [
      {
        fecha: new Date(),
        usuario: 'Sistema',
        accion: 'Login',
        tipo: 'login',
        detalles: 'Acceso al dashboard',
        exitoso: true,
      },
    ];
  }

  /**
   * Calcular distribución por roles
   */
  calcularDistribucionRoles(porRol: { [rol: string]: number }, total: number) {
    const roles = Object.entries(porRol).map(([codigo, cantidad]) => ({
      nombre: this.adminService.formatearRol(codigo),
      cantidad,
      porcentaje: Math.round((cantidad / total) * 100),
      color: this.adminService.obtenerColorRol(codigo),
    }));

    this.distribucionRoles = roles.sort((a, b) => b.cantidad - a.cantidad);
    this.generarChartSegments();
  }

  /**
   * Generar segmentos del gráfico
   */
  generarChartSegments() {
    const circumference = 2 * Math.PI * 40;
    let currentOffset = 0;

    this.chartSegments = this.distribucionRoles.map((rol) => {
      const segmentLength = (rol.porcentaje / 100) * circumference;
      const dashArray = `${segmentLength} ${circumference}`;
      const offset = -currentOffset;

      currentOffset += segmentLength;

      return {
        color: this.getColorValue(rol.color),
        dashArray: dashArray,
        offset: offset,
      };
    });
  }

  /**
   * Obtener valor hexadecimal del color
   */
  getColorValue(color: string): string {
    const colores: { [key: string]: string } = {
      red: '#f5222d',
      purple: '#722ed1',
      blue: '#1890ff',
      cyan: '#13c2c2',
      green: '#52c41a',
    };
    return colores[color] || color;
  }

  /**
   * Cargar datos de respaldo
   */
  cargarDatosRespaldo() {
    this.estadisticas = {
      totalUsuarios: 47,
      usuariosActivos: 42,
      totalReferentes: 28,
      ingresosTotal: 12500000,
    };

    this.distribucionRoles = [
      { nombre: 'Referentes', cantidad: 28, porcentaje: 60, color: 'green' },
      { nombre: 'Asesores', cantidad: 8, porcentaje: 17, color: 'blue' },
      { nombre: 'Gerentes', cantidad: 5, porcentaje: 11, color: 'purple' },
      { nombre: 'Contadores', cantidad: 3, porcentaje: 6, color: 'cyan' },
      { nombre: 'Administradores', cantidad: 3, porcentaje: 6, color: 'red' },
    ];

    this.generarChartSegments();

    this.actividadReciente = [
      {
        fecha: new Date('2025-01-29T01:45:00'),
        usuario: 'María González',
        accion: 'Usuario Creado',
        tipo: 'crear',
        detalles: 'Nuevo referente registrado',
        exitoso: true,
      },
    ];

    this.ultimosUsuarios = [];
  }

  getAccionColor(tipo: string): string {
    const colores: { [key: string]: string } = {
      crear: 'green',
      editar: 'blue',
      eliminar: 'red',
      config: 'purple',
      login: 'cyan',
    };
    return colores[tipo] || 'default';
  }

  getRolColor(usuario: Usuario): string {
    const rol = this.adminService.obtenerRolPrincipal(usuario);
    return rol ? this.adminService.obtenerColorRol(rol.codigo_rol) : 'default';
  }

  getRolTexto(usuario: Usuario): string {
    const rol = this.adminService.obtenerRolPrincipal(usuario);
    return rol ? this.adminService.formatearRol(rol.codigo_rol) : 'Usuario';
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatearFechaRelativa(fecha?: string): string {
  if (!fecha) return 'Sin fecha';

  const fechaDate = new Date(fecha);
  if (isNaN(fechaDate.getTime())) return 'Fecha inválida';

  const ahora = new Date();
  const diff = ahora.getTime() - fechaDate.getTime();
  const dias = Math.floor(diff / 86400000);

  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Ayer';
  if (dias < 7) return `Hace ${dias} días`;

  return fechaDate.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
  });
}
}
