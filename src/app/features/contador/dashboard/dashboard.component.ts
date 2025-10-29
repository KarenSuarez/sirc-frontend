import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.interface';

interface Estadisticas {
  retirosPendientes: number;
  retirosHoy: number;
  montoMes: number;
  totalRetiros: number;
}

interface SolicitudRetiro {
  id: string;
  referenteNombre: string;
  monto: number;
  fechaSolicitud: Date;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
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
    NzTagModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  usuario: Usuario | null = null;
  estadisticas: Estadisticas = {
    retirosPendientes: 0,
    retirosHoy: 0,
    montoMes: 0,
    totalRetiros: 0
  };
  ultimasSolicitudes: SolicitudRetiro[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuarioActual();
    this.cargarEstadisticas();
    this.cargarUltimasSolicitudes();
  }

  cargarEstadisticas() {
    // Simulación de datos
    this.estadisticas = {
      retirosPendientes: 8,
      retirosHoy: 5,
      montoMes: 4500000,
      totalRetiros: 142
    };
  }

  cargarUltimasSolicitudes() {
    // Simulación de datos
    this.ultimasSolicitudes = [
      {
        id: '1',
        referenteNombre: 'María González',
        monto: 250000,
        fechaSolicitud: new Date('2024-01-28'),
        estado: 'pendiente'
      },
      {
        id: '2',
        referenteNombre: 'Carlos Ramírez',
        monto: 180000,
        fechaSolicitud: new Date('2024-01-27'),
        estado: 'pendiente'
      },
      {
        id: '3',
        referenteNombre: 'Ana Martínez',
        monto: 320000,
        fechaSolicitud: new Date('2024-01-27'),
        estado: 'aprobado'
      },
      {
        id: '4',
        referenteNombre: 'Pedro Sánchez',
        monto: 150000,
        fechaSolicitud: new Date('2024-01-26'),
        estado: 'aprobado'
      },
      {
        id: '5',
        referenteNombre: 'Luis Hernández',
        monto: 95000,
        fechaSolicitud: new Date('2024-01-26'),
        estado: 'rechazado'
      }
    ];
  }

  getEstadoColor(estado: string): string {
    const colores = {
      'pendiente': 'orange',
      'aprobado': 'green',
      'rechazado': 'red'
    };
    return colores[estado as keyof typeof colores] || 'default';
  }

  getEstadoTexto(estado: string): string {
    const textos = {
      'pendiente': 'Pendiente',
      'aprobado': 'Aprobado',
      'rechazado': 'Rechazado'
    };
    return textos[estado as keyof typeof textos] || estado;
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
