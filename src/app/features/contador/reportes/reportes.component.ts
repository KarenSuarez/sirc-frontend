import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMessageModule } from 'ng-zorro-antd/message';

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
  fecha: Date;
  retiroId: string;
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
    NzMessageModule
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {
  rangoFechas: Date[] = [];
  loading = false;

  resumen: Resumen = {
    totalPagado: 0,
    cantidadPagos: 0,
    totalPendiente: 0,
    cantidadPendientes: 0,
    comisionesGeneradas: 0,
    promedioPago: 0
  };

  pagosPorMes: PagoMes[] = [];
  maxPagoMes = 0;
  topReferentes: TopReferente[] = [];
  pagosDetalle: PagoDetalle[] = [];
  resumenMetodos: MetodoPago[] = [];

  constructor(private message: NzMessageService) {}

  ngOnInit() {
    this.inicializarFechas();
    this.cargarDatos();
  }

  inicializarFechas() {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    this.rangoFechas = [hace30Dias, hoy];
  }

  cargarDatos() {
    this.loading = true;

    setTimeout(() => {
      // Resumen
      this.resumen = {
        totalPagado: 4500000,
        cantidadPagos: 18,
        totalPendiente: 850000,
        cantidadPendientes: 5,
        comisionesGeneradas: 8750000,
        promedioPago: 250000
      };

      // Pagos por mes
      this.pagosPorMes = [
        { mes: 'Jul', monto: 2800000 },
        { mes: 'Ago', monto: 3200000 },
        { mes: 'Sep', monto: 2900000 },
        { mes: 'Oct', monto: 3500000 },
        { mes: 'Nov', monto: 4100000 },
        { mes: 'Dic', monto: 4500000 }
      ];
      this.maxPagoMes = Math.max(...this.pagosPorMes.map(p => p.monto));

      // Top referentes
      const maxMonto = 1200000;
      this.topReferentes = [
        { nombre: 'María González', monto: 1200000, porcentaje: 100 },
        { nombre: 'Carlos Ramírez', monto: 950000, porcentaje: 79 },
        { nombre: 'Ana Martínez', monto: 820000, porcentaje: 68 },
        { nombre: 'Pedro Sánchez', monto: 680000, porcentaje: 57 },
        { nombre: 'Luis Hernández', monto: 450000, porcentaje: 38 }
      ];

      // Detalle de pagos
      this.pagosDetalle = [
        {
          fecha: new Date('2024-01-27'),
          retiroId: 'RET-2024-015',
          referenteNombre: 'María González',
          monto: 320000,
          metodo: 'Transferencia Bancaria',
          procesadoPor: 'Laura Pérez',
          estado: 'completado'
        },
        {
          fecha: new Date('2024-01-26'),
          retiroId: 'RET-2024-014',
          referenteNombre: 'Carlos Ramírez',
          monto: 280000,
          metodo: 'Transferencia Bancaria',
          procesadoPor: 'Laura Pérez',
          estado: 'completado'
        },
        {
          fecha: new Date('2024-01-25'),
          retiroId: 'RET-2024-013',
          referenteNombre: 'Ana Martínez',
          monto: 195000,
          metodo: 'Transferencia Bancaria',
          procesadoPor: 'Laura Pérez',
          estado: 'completado'
        }
      ];

      // Resumen por método
      this.resumenMetodos = [
        {
          nombre: 'Transferencia Bancaria',
          icono: 'bank',
          cantidad: 18,
          monto: 4500000
        }
      ];

      this.loading = false;
    }, 1000);
  }

  cambiarRangoFechas() {
    if (this.rangoFechas && this.rangoFechas.length === 2) {
      this.message.info('Actualizando datos...');
      this.cargarDatos();
    }
  }

  exportarExcel() {
    this.message.success('Exportando a Excel...');
    // Aquí iría la lógica de exportación
  }

  exportarPDF() {
    this.message.success('Generando PDF...');
    // Aquí iría la lógica de exportación
  }

  getEstadoColor(estado: string): string {
    return 'green';
  }

  getEstadoTexto(estado: string): string {
    return 'Completado';
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
