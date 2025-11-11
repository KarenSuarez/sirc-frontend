import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzStatisticModule,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  estadisticas = {
    totalUsuarios: 0,
    usuariosActivos: 0,
    totalReferentes: 0,
    ingresosTotal: 0
  };

  distribucionRoles: any[] = [];
  chartSegments: any[] = [];
  ultimosUsuarios: any[] = [];
  actividadReciente: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.cargarUltimosUsuarios();
    this.cargarActividadReciente();
  }

  // ✅ Cargar estadísticas desde el backend
  cargarEstadisticas(): void {
    this.http.get(`${environment.apiUrl}/usuarios/admin/estadisticas`).subscribe({
      next: (data: any) => {
        this.estadisticas.totalUsuarios = data.total_usuarios;
        this.estadisticas.usuariosActivos = data.referentes_activos || 0;
        this.estadisticas.totalReferentes =
          data.por_rol.find((r: any) => r.codigo_rol === 'REF')?.cantidad || 0;
        this.estadisticas.ingresosTotal = data.registros_ultimos_30_dias || 0;

        // Distribución de roles
        this.distribucionRoles = data.por_rol.map((rol: any) => ({
          nombre: rol.nombre_rol,
          cantidad: rol.cantidad,
          porcentaje: this.calcularPorcentaje(rol.cantidad, data.total_usuarios),
          color: this.getColorRol(rol.codigo_rol)
        }));

        this.generarChartSegments();
      },
      error: (err) => {
        console.error('Error cargando estadísticas:', err);
      }
    });
  }

  // ✅ Cargar últimos usuarios desde el backend
  cargarUltimosUsuarios(): void {
    this.http.get(`${environment.apiUrl}/usuarios?limite=5`).subscribe({
      next: (data: any) => {
        this.ultimosUsuarios = data.usuarios.map((u: any) => ({
          id: u.id_usuario,
          nombre: u.nombre,
          apellido: u.apellido,
          correo: u.correo_electronico,
          rol: u.roles?.[0]?.nombre_rol || 'Sin rol',
          fechaRegistro: new Date(u.fecha_registro)
        }));
      },
      error: (err) => {
        console.error('Error cargando últimos usuarios:', err);
      }
    });
  }

  // 🟡 Por ahora la actividad es simulada (puedes conectar tu endpoint cuando lo tengas)
  cargarActividadReciente(): void {
    this.actividadReciente = [
      {
        fecha: new Date(),
        usuario: 'admin',
        accion: 'Inicio de sesión',
        tipo: 'login',
        detalles: 'Ingreso al sistema',
        exitoso: true
      },
      {
        fecha: new Date(),
        usuario: 'asesor1',
        accion: 'Registro de cliente',
        tipo: 'registro',
        detalles: 'Nuevo cliente creado',
        exitoso: true
      }
    ];
  }

  // 🧮 Funciones auxiliares
  calcularPorcentaje(cantidad: number, total: number): number {
    return total > 0 ? Math.round((cantidad / total) * 100) : 0;
  }

  generarChartSegments(): void {
    let offset = 0;
    this.chartSegments = this.distribucionRoles.map((rol) => {
      const dashArray = `${rol.porcentaje * 2.513} 251.3`; // 2.513 = circunferencia / 100
      const segment = {
        color: rol.color,
        dashArray,
        offset
      };
      offset -= (rol.porcentaje * 2.513);
      return segment;
    });
  }

  // 🎨 Colores por rol
  getColorRol(codigo: string): string {
    const colores: any = {
      ADMIN: '#f5222d',
      REF: '#52c41a',
      ASESOR: '#1890ff',
      GERENTE: '#722ed1',
      CONTADOR: '#13c2c2'
    };
    return colores[codigo] || '#999999';
  }

  getAccionColor(tipo: string): string {
    switch (tipo) {
      case 'login': return 'blue';
      case 'registro': return 'green';
      case 'eliminacion': return 'red';
      default: return 'default';
    }
  }

  getRolColor(rol: string): string {
    switch (rol.toLowerCase()) {
      case 'administrador': return 'red';
      case 'asesor': return 'blue';
      case 'gerente': return 'purple';
      case 'referente': return 'green';
      default: return 'gray';
    }
  }

  getRolTexto(rol: string): string {
    return rol.charAt(0).toUpperCase() + rol.slice(1);
  }

  // 📅 Utilidades de formato
  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleString();
  }

  formatearFechaRelativa(fecha: Date): string {
    const diff = Date.now() - new Date(fecha).getTime();
    const minutos = Math.floor(diff / 60000);
    if (minutos < 60) return `${minutos} min atrás`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `${horas} h atrás`;
    const dias = Math.floor(horas / 24);
    return `${dias} d atrás`;
  }
}


  /*import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RouterModule } from '@angular/router';
  import { NzCardModule } from 'ng-zorro-antd/card';
  import { NzStatisticModule } from 'ng-zorro-antd/statistic';
  import { NzButtonModule } from 'ng-zorro-antd/button';
  import { NzIconModule } from 'ng-zorro-antd/icon';
  import { NzTagModule } from 'ng-zorro-antd/tag';
  import { NzTableModule } from 'ng-zorro-antd/table';
  */
  /*
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
  /*
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
  */
