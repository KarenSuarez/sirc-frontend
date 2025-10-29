import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';

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

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  fechaRegistro: Date;
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
    NzTableModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  estadisticas: Estadisticas = {
    totalUsuarios: 0,
    usuariosActivos: 0,
    totalReferentes: 0,
    ingresosTotal: 0
  };

  distribucionRoles: DistribucionRol[] = [];
  chartSegments: ChartSegment[] = [];
  actividadReciente: Actividad[] = [];
  ultimosUsuarios: Usuario[] = [];

  ngOnInit() {
    this.cargarEstadisticas();
    this.cargarDistribucionRoles();
    this.cargarActividadReciente();
    this.cargarUltimosUsuarios();
  }

  cargarEstadisticas() {
    this.estadisticas = {
      totalUsuarios: 47,
      usuariosActivos: 42,
      totalReferentes: 28,
      ingresosTotal: 12500000
    };
  }

  cargarDistribucionRoles() {
    this.distribucionRoles = [
      { nombre: 'Referentes', cantidad: 28, porcentaje: 60, color: '#52c41a' },
      { nombre: 'Asesores', cantidad: 8, porcentaje: 17, color: '#1890ff' },
      { nombre: 'Gerentes', cantidad: 5, porcentaje: 11, color: '#722ed1' },
      { nombre: 'Contadores', cantidad: 3, porcentaje: 6, color: '#13c2c2' },
      { nombre: 'Administradores', cantidad: 3, porcentaje: 6, color: '#f5222d' }
    ];

    this.generarChartSegments();
  }

  generarChartSegments() {
    const circumference = 2 * Math.PI * 40;
    let currentOffset = 0;

    this.chartSegments = this.distribucionRoles.map(rol => {
      const segmentLength = (rol.porcentaje / 100) * circumference;
      const dashArray = `${segmentLength} ${circumference}`;
      const offset = -currentOffset;

      currentOffset += segmentLength;

      return {
        color: rol.color,
        dashArray: dashArray,
        offset: offset
      };
    });
  }

  cargarActividadReciente() {
    this.actividadReciente = [
      {
        fecha: new Date('2025-01-29T01:45:00'),
        usuario: 'María González',
        accion: 'Usuario Creado',
        tipo: 'crear',
        detalles: 'Nuevo referente registrado',
        exitoso: true
      },
      {
        fecha: new Date('2025-01-29T01:30:00'),
        usuario: 'Admin',
        accion: 'Configuración',
        tipo: 'config',
        detalles: 'Modificó parámetros de comisiones',
        exitoso: true
      },
      {
        fecha: new Date('2025-01-29T01:15:00'),
        usuario: 'Carlos Ramírez',
        accion: 'Login',
        tipo: 'login',
        detalles: 'Inició sesión en el sistema',
        exitoso: true
      },
      {
        fecha: new Date('2025-01-29T01:00:00'),
        usuario: 'Ana López',
        accion: 'Usuario Editado',
        tipo: 'editar',
        detalles: 'Actualizó información de perfil',
        exitoso: true
      }
    ];
  }

  cargarUltimosUsuarios() {
    this.ultimosUsuarios = [
      {
        id: '10',
        nombre: 'Laura',
        apellido: 'Martínez',
        correo: 'laura.martinez@email.com',
        rol: 'referente',
        fechaRegistro: new Date('2025-01-28')
      },
      {
        id: '9',
        nombre: 'Diego',
        apellido: 'Rodríguez',
        correo: 'diego.rodriguez@email.com',
        rol: 'referente',
        fechaRegistro: new Date('2025-01-27')
      },
      {
        id: '8',
        nombre: 'Sofia',
        apellido: 'López',
        correo: 'sofia.lopez@email.com',
        rol: 'asesor_ventas',
        fechaRegistro: new Date('2025-01-26')
      }
    ];
  }

  getAccionColor(tipo: string): string {
    const colores: { [key: string]: string } = {
      'crear': 'green',
      'editar': 'blue',
      'eliminar': 'red',
      'config': 'purple',
      'login': 'cyan'
    };
    return colores[tipo] || 'default';
  }

  getRolColor(rol: string): string {
    const colores: { [key: string]: string } = {
      'admin': 'red',
      'gerente_ventas': 'purple',
      'asesor_ventas': 'blue',
      'contador': 'cyan',
      'referente': 'green'
    };
    return colores[rol] || 'default';
  }

  getRolTexto(rol: string): string {
    const textos: { [key: string]: string } = {
      'admin': 'Administrador',
      'gerente_ventas': 'Gerente',
      'asesor_ventas': 'Asesor',
      'contador': 'Contador',
      'referente': 'Referente'
    };
    return textos[rol] || rol;
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearFechaRelativa(fecha: Date): string {
    const ahora = new Date();
    const diff = ahora.getTime() - fecha.getTime();
    const dias = Math.floor(diff / 86400000);

    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `Hace ${dias} días`;

    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short'
    });
  }
}
