import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

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

import { AdminService } from '../../../../core/services/admin.service';
import { Usuario } from '../../../../core/models/usuario.interface';

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
    NzModalModule,
  ],
  templateUrl: './detalle-usuario.component.html',
  styleUrl: './detalle-usuario.component.css',
})
export class DetalleUsuarioComponent implements OnInit, OnDestroy {
  loading = true;
  usuarioId: number = 0;
  usuario: Usuario | null = null;
  notas: string = '';

  actividadReciente: Actividad[] = [];

  estadisticas: Estadisticas = {
    totalLogins: 0,
    diasRegistrado: 0,
    accionesRealizadas: 0,
  };

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private message: NzMessageService,
    private modal: NzModalService,
    private clipboard: Clipboard
  ) {}

  ngOnInit() {
    this.usuarioId = parseInt(this.route.snapshot.params['id']);
    this.cargarUsuario();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar usuario desde backend
   */
  cargarUsuario() {
    this.loading = true;

    this.adminService
      .obtenerUsuario(this.usuarioId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;

          // Calcular estadísticas
          this.estadisticas = {
            totalLogins: 0, // Esto vendría de un endpoint de historial
            diasRegistrado: this.calcularDiasRegistrado(usuario.fecha_registro),
            accionesRealizadas: 0,
          };

          // Actividad reciente (simulada - idealmente vendría del backend)
          this.actividadReciente = [
            {
              accion: 'Registro en el Sistema',
              descripcion: 'Usuario registrado exitosamente',
              fecha: new Date(usuario.fecha_registro),
              color: 'green',
            },
          ];

          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar usuario:', error);
          this.message.error('Error al cargar datos del usuario');
          this.loading = false;
          this.router.navigate(['/admin/usuarios']);
        },
      });
  }

  calcularDiasRegistrado(fecha: string): number {
    const hoy = new Date();
    const fechaRegistro = new Date(fecha);
    const diff = hoy.getTime() - fechaRegistro.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  copiarCodigo() {
    if (this.usuario?.referente?.codigo_referente) {
      this.clipboard.copy(this.usuario.referente.codigo_referente);
      this.message.success('Código copiado al portapapeles');
    }
  }

  enviarNotificacion() {
    this.message.info('Enviando notificación al usuario...');
  }

  resetearContrasena() {
    this.modal.confirm({
      nzTitle: '¿Resetear contraseña?',
      nzContent:
        'Se enviará un correo electrónico al usuario con instrucciones para crear una nueva contraseña.',
      nzOkText: 'Sí, resetear',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.message.success('Correo de reseteo enviado correctamente');
      },
    });
  }

  verHistorial() {
    this.message.info('Abriendo historial completo...');
  }

  toggleEstadoUsuario() {
    if (!this.usuario) return;

    const esActivo = this.usuario.referente?.estado_referente === 'activo';
    const accion = esActivo ? 'desactivar' : 'activar';

    this.modal.confirm({
      nzTitle: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} usuario?`,
      nzContent: `¿Estás seguro de ${accion} a ${this.adminService.obtenerNombreCompleto(this.usuario)}?`,
      nzOkText: `Sí, ${accion}`,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        // Aquí iría la llamada al endpoint para cambiar estado
        this.message.success(`Usuario ${accion}do correctamente`);
        this.cargarUsuario();
      },
    });
  }

  guardarNotas() {
    this.message.success('Notas guardadas correctamente');
  }

  eliminarUsuario() {
    if (!this.usuario) return;

    this.modal.confirm({
      nzTitle: '¿Desactivar usuario?',
      nzContent: `¿Estás seguro de desactivar a ${this.adminService.obtenerNombreCompleto(this.usuario)}? El usuario no podrá acceder al sistema.`,
      nzOkText: 'Sí, desactivar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.adminService
          .desactivarUsuario(this.usuario!.id_usuario)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.message.success('Usuario desactivado correctamente');
              this.router.navigate(['/admin/usuarios']);
            },
            error: (error) => {
              console.error('Error al desactivar usuario:', error);
              this.message.error(error.error?.message || 'Error al desactivar usuario');
            },
          });
      },
    });
  }

  getRolColor(): string {
    if (!this.usuario) return 'default';
    const rol = this.adminService.obtenerRolPrincipal(this.usuario);
    return rol ? this.adminService.obtenerColorRol(rol.codigo_rol) : 'default';
  }

  getRolTexto(): string {
    if (!this.usuario) return '';
    const rol = this.adminService.obtenerRolPrincipal(this.usuario);
    return rol ? this.adminService.formatearRol(rol.codigo_rol) : 'Sin rol';
  }

  obtenerNombreCompleto(): string {
    return this.usuario ? this.adminService.obtenerNombreCompleto(this.usuario) : '';
  }

  obtenerIniciales(): string {
    return this.usuario ? this.adminService.obtenerIniciales(this.usuario) : '??';
  }

  estaActivo(): boolean {
    return this.usuario?.referente?.estado_referente === 'activo';
  }

  formatearFechaCompleta(fecha: string): string {
    return new Date(fecha).toLocaleString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
      year: 'numeric',
    });
  }
}
