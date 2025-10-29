import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Clipboard } from '@angular/cdk/clipboard';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  correo: string;
  telefono: string;
  rol: string;
  activo: boolean;
  fechaRegistro: Date;
  ultimoAcceso: Date;
}

interface InfoReferente {
  codigoReferido: string;
  asesorAsignado: string;
  totalReferidos: number;
  referidosActivos: number;
  comisionesAcumuladas: number;
  nivelActual: string;
}

interface Actividad {
  accion: string;
  descripcion: string;
  fecha: Date;
  color: string;
}

interface Estadisticas {
  totalLogins: number;
  diasRegistrado: number;
  accionesRealizadas: number;
}

@Component({
  selector: 'app-detalle-usuario',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzTimelineModule,
    NzGridModule,
    NzInputModule,
    NzSpinModule,
    NzMessageModule,
    NzModalModule
  ],
  templateUrl: './detalle-usuario.component.html',
  styleUrl: './detalle-usuario.component.css'
})
export class DetalleUsuarioComponent implements OnInit {
  loading = true;
  usuarioId: string = '';
  notas: string = '';

  usuario: Usuario = {
    id: '',
    nombre: '',
    apellido: '',
    documento: '',
    correo: '',
    telefono: '',
    rol: '',
    activo: false,
    fechaRegistro: new Date(),
    ultimoAcceso: new Date()
  };

  infoReferente: InfoReferente = {
    codigoReferido: '',
    asesorAsignado: '',
    totalReferidos: 0,
    referidosActivos: 0,
    comisionesAcumuladas: 0,
    nivelActual: ''
  };

  actividadReciente: Actividad[] = [];

  estadisticas: Estadisticas = {
    totalLogins: 0,
    diasRegistrado: 0,
    accionesRealizadas: 0
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private modal: NzModalService,
    private clipboard: Clipboard
  ) {}

  ngOnInit() {
    this.usuarioId = this.route.snapshot.params['id'];
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.loading = true;

    setTimeout(() => {
      this.usuario = {
        id: '2',
        nombre: 'María',
        apellido: 'González',
        documento: '9876543210',
        correo: 'maria.gonzalez@email.com',
        telefono: '3009876543',
        rol: 'referente',
        activo: true,
        fechaRegistro: new Date('2024-01-15'),
        ultimoAcceso: new Date('2025-01-28T14:30:00')
      };

      if (this.usuario.rol === 'referente') {
        this.infoReferente = {
          codigoReferido: 'REF-2024-001',
          asesorAsignado: 'Carlos Ramírez',
          totalReferidos: 15,
          referidosActivos: 12,
          comisionesAcumuladas: 850000,
          nivelActual: 'Oro'
        };
      }

      this.actividadReciente = [
        {
          accion: 'Inicio de Sesión',
          descripcion: 'El usuario ingresó al sistema',
          fecha: new Date('2025-01-28T14:30:00'),
          color: 'green'
        },
        {
          accion: 'Referido Registrado',
          descripcion: 'Registró un nuevo referido: Pedro López',
          fecha: new Date('2025-01-27T10:15:00'),
          color: 'blue'
        },
        {
          accion: 'Comisión Generada',
          descripcion: 'Ganó $50,000 por conversión de referido',
          fecha: new Date('2025-01-26T16:45:00'),
          color: 'orange'
        },
        {
          accion: 'Perfil Actualizado',
          descripcion: 'Actualizó su información de contacto',
          fecha: new Date('2025-01-25T09:20:00'),
          color: 'cyan'
        }
      ];

      this.estadisticas = {
        totalLogins: 127,
        diasRegistrado: this.calcularDiasRegistrado(this.usuario.fechaRegistro),
        accionesRealizadas: 342
      };

      this.loading = false;
    }, 1000);
  }

  calcularDiasRegistrado(fecha: Date): number {
    const hoy = new Date();
    const diff = hoy.getTime() - fecha.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  copiarCodigo() {
    this.clipboard.copy(this.infoReferente.codigoReferido);
    this.message.success('Código copiado al portapapeles');
  }

  enviarNotificacion() {
    this.message.info('Enviando notificación al usuario...');
  }

  resetearContrasena() {
    this.modal.confirm({
      nzTitle: '¿Resetear contraseña?',
      nzContent: 'Se enviará un correo electrónico al usuario con instrucciones para crear una nueva contraseña.',
      nzOkText: 'Sí, resetear',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.message.success('Correo de reseteo enviado correctamente');
      }
    });
  }

  verHistorial() {
    this.message.info('Abriendo historial completo...');
  }

  toggleEstadoUsuario() {
    const accion = this.usuario.activo ? 'desactivar' : 'activar';

    this.modal.confirm({
      nzTitle: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario?`,
      nzContent: `¿Estás seguro de ${accion} a ${this.usuario.nombre} ${this.usuario.apellido}?`,
      nzOkText: `Sí, ${accion}`,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.usuario.activo = !this.usuario.activo;
        this.message.success(`Usuario ${accion}do correctamente`);
      }
    });
  }

  guardarNotas() {
    this.message.success('Notas guardadas correctamente');
  }

  eliminarUsuario() {
    this.modal.confirm({
      nzTitle: '¿Eliminar usuario?',
      nzContent: `¿Estás seguro de eliminar a ${this.usuario.nombre} ${this.usuario.apellido}? Esta acción no se puede deshacer.`,
      nzOkText: 'Sí, eliminar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.message.success('Usuario eliminado correctamente');
        this.router.navigate(['/admin/usuarios']);
      }
    });
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
      'gerente_ventas': 'Gerente de Ventas',
      'asesor_ventas': 'Asesor de Ventas',
      'contador': 'Contador',
      'referente': 'Referente'
    };
    return textos[rol] || rol;
  }

  formatearFechaCompleta(fecha: Date): string {
    return fecha.toLocaleString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearFechaRelativa(fecha: Date): string {
    const ahora = new Date();
    const diff = ahora.getTime() - fecha.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 60) return `Hace ${minutos} minutos`;
    if (horas < 24) return `Hace ${horas} horas`;
    if (dias < 7) return `Hace ${dias} días`;

    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
