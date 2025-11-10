import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMessageModule } from 'ng-zorro-antd/message';

import { ContadorService } from '../../../core/services/contador.service';
import { SolicitudRecompensa } from '../../../core/models/solicitud.interface';

interface Resumen {
  totalPagado: number;
  cantidadPagos: number;
  totalPendiente: number;
  cantidadPendientes: number;
  comisionesGeneradas: number;
  promedioPago: number;
}

interface PagoMes {
  mes: string;
  monto: number;
}

interface TopReferente {
  nombre: string;
  monto: number;
  porcentaje: number;
}

interface PagoDetalle {
  fecha: string;
  retiroId: number;
  referenteNombre: string;
  monto: number;
  metodo: string;
  procesadoPor: string;
  estado: string;
}

interface MetodoPago {
  nombre: string;
  icono: string;
  cantidad: number;
  monto: number;
}

@Component({
  selector: 'app-reportes-financieros',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzDatePickerModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    NzTagModule,
    NzProgressModule,
    NzMessageModule,
    NzSpinModule,
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent implements OnInit, OnDestroy {
  rangoFechas: Date[] = [];
  loading = false;

  resumen: Resumen = {
    totalPagado: 0,
    cantidadPagos: 0,
    totalPendiente: 0,
    cantidadPendientes: 0,
    comisionesGeneradas: 0,
    promedioPago: 0,
  };

  pagosPorMes: PagoMes[] = [];
  maxPagoMes = 0;
  topReferentes: TopReferente[] = [];
  pagosDetalle: PagoDetalle[] = [];
  resumenMetodos: MetodoPago[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private contadorService: ContadorService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.inicializarFechas();
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  inicializarFechas() {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    this.rangoFechas = [hace30Dias, hoy];
  }

  /**
   * Cargar datos desde backend
   * SOLO usando endpoints de solicitudes (sin KPIs de comisiones que requieren permisos)
   */
  cargarDatos() {
    this.loading = true;

    this.contadorService
      .listarTodasSolicitudes({
        limite: 1000,
        pagina: 1,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.procesarDatos(response.solicitudes);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar reportes:', error);
          this.message.error('Error al cargar reportes financieros');
          this.loading = false;
        },
      });
  }

  /**
   * Procesar datos del backend
   */
  procesarDatos(solicitudes: SolicitudRecompensa[]) {
    const stats = this.contadorService.calcularEstadisticasSolicitudes(solicitudes);

    // Resumen
    this.resumen = {
      totalPagado: stats.monto_total_aprobado,
      cantidadPagos: stats.aprobadas,
      totalPendiente: stats.monto_total_pendiente,
      cantidadPendientes: stats.pendientes,
      comisionesGeneradas: stats.monto_total_aprobado, // Usar el mismo dato
      promedioPago: stats.aprobadas > 0 ? stats.monto_total_aprobado / stats.aprobadas : 0,
    };

    // Pagos por mes
    this.calcularPagosPorMes(solicitudes);

    // Top referentes
    this.calcularTopReferentes(solicitudes);

    // Detalle de pagos
    this.pagosDetalle = solicitudes
      .filter((s) => s.estado_solicitud === 'aprobada')
      .slice(0, 10)
      .map((s) => ({
        fecha: s.fecha_procesamiento || s.fecha_solicitud,
        retiroId: s.id_solicitud,
        referenteNombre: this.contadorService.obtenerNombreReferente(s),
        monto: s.monto_solicitado,
        metodo: this.contadorService.formatearMetodoRetiro(s.metodo_retiro),
        procesadoPor: s.procesado_por
          ? `${s.procesado_por.nombre} ${s.procesado_por.apellido}`
          : 'Sistema',
        estado: 'completado',
      }));

    // Resumen por método
    this.calcularResumenMetodos(solicitudes);
  }

  /**
   * Calcular pagos por mes
   */
  calcularPagosPorMes(solicitudes: SolicitudRecompensa[]) {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const montosPorMes: { [key: string]: number } = {};

    solicitudes
      .filter((s) => s.estado_solicitud === 'aprobada' && s.fecha_procesamiento)
      .forEach((s) => {
        const fecha = new Date(s.fecha_procesamiento!);
        const mes = meses[fecha.getMonth()];
        montosPorMes[mes] = (montosPorMes[mes] || 0) + s.monto_solicitado;
      });

    // Obtener últimos 6 meses
    const hoy = new Date();
    const ultimos6Meses = [];
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mes = meses[fecha.getMonth()];
      ultimos6Meses.push({
        mes,
        monto: montosPorMes[mes] || 0,
      });
    }

    this.pagosPorMes = ultimos6Meses;
    this.maxPagoMes = Math.max(...this.pagosPorMes.map((p) => p.monto), 1);
  }

  /**
   * Calcular top referentes
   */
  calcularTopReferentes(solicitudes: SolicitudRecompensa[]) {
    const montosPorReferente: { [key: string]: number } = {};

    solicitudes
      .filter((s) => s.estado_solicitud === 'aprobada')
      .forEach((s) => {
        const nombre = this.contadorService.obtenerNombreReferente(s);
        montosPorReferente[nombre] = (montosPorReferente[nombre] || 0) + s.monto_solicitado;
      });

    const referentesArray = Object.entries(montosPorReferente)
      .map(([nombre, monto]) => ({ nombre, monto }))
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 5);

    const maxMonto = referentesArray[0]?.monto || 1;

    this.topReferentes = referentesArray.map((ref) => ({
      nombre: ref.nombre,
      monto: ref.monto,
      porcentaje: Math.round((ref.monto / maxMonto) * 100),
    }));
  }

  /**
   * Calcular resumen por métodos
   */
  calcularResumenMetodos(solicitudes: SolicitudRecompensa[]) {
    const metodos: { [key: string]: { cantidad: number; monto: number } } = {};

    solicitudes
      .filter((s) => s.estado_solicitud === 'aprobada')
      .forEach((s) => {
        const metodo = this.contadorService.formatearMetodoRetiro(s.metodo_retiro);
        if (!metodos[metodo]) {
          metodos[metodo] = { cantidad: 0, monto: 0 };
        }
        metodos[metodo].cantidad++;
        metodos[metodo].monto += s.monto_solicitado;
      });

    this.resumenMetodos = Object.entries(metodos).map(([nombre, datos]) => ({
      nombre,
      icono: nombre.includes('Transferencia') ? 'bank' : 'gift',
      cantidad: datos.cantidad,
      monto: datos.monto,
    }));
  }

  cambiarRangoFechas() {
    if (this.rangoFechas && this.rangoFechas.length === 2) {
      this.message.info('Actualizando datos...');
      this.cargarDatos();
    }
  }

  exportarExcel() {
    this.message.success('Exportando a Excel...');
  }

  exportarPDF() {
    this.message.success('Generando PDF...');
  }

  getEstadoColor(estado: string): string {
    return 'green';
  }

  getEstadoTexto(estado: string): string {
    return 'Completado';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
