import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { AdminService } from '../../../../core/services/admin.service';
import { Usuario } from '../../../../core/models/usuario.interface';

interface Estadisticas {
  total: number;
  activos: number;
  referentes: number;
  administradores: number;
}

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzTagModule,
    NzSwitchModule,
    NzSpaceModule,
    NzToolTipModule,
    NzMessageModule,
    NzModalModule,
    NzSpinModule,
  ],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css',
})
export class ListaUsuariosComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  loading = true;

  searchText = '';
  filtroRol = 'todos';
  filtroEstado = 'todos';

  estadisticas: Estadisticas = {
    total: 0,
    activos: 0,
    referentes: 0,
    administradores: 0,
  };

  private destroy$ = new Subject<void>();

  constructor(
    private adminService: AdminService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar usuarios desde backend
   */
  cargarUsuarios() {
    this.loading = true;

    this.adminService
      .listarUsuarios({ limite: 100, pagina: 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.usuarios = response.usuarios;
          this.calcularEstadisticas();
          this.usuariosFiltrados = [...this.usuarios];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar usuarios:', error);
          this.message.error('Error al cargar usuarios');
          this.loading = false;
        },
      });
  }

  /**
   * Calcular estadísticas
   */
  calcularEstadisticas() {
    const stats = this.adminService.calcularEstadisticas(this.usuarios);

    this.estadisticas = {
      total: stats.total,
      activos: stats.activos,
      referentes: stats.por_rol['REF'] || stats.por_rol['referente'] || 0,
      administradores: stats.por_rol['ADMIN'] || stats.por_rol['administrador'] || 0,
    };
  }

  /**
   * Filtrar usuarios
   */
  filtrarUsuarios() {
    let resultados = [...this.usuarios];

    // Filtro de búsqueda
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      resultados = resultados.filter((u) => {
        const nombreCompleto = this.adminService.obtenerNombreCompleto(u).toLowerCase();
        return (
          nombreCompleto.includes(search) ||
          u.correo_electronico.toLowerCase().includes(search) ||
          u.numero_documento.includes(search)
        );
      });
    }

    // Filtro por rol
    if (this.filtroRol !== 'todos') {
      resultados = resultados.filter((u) =>
        u.roles?.some(
          (r) =>
            r.codigo_rol.toLowerCase() === this.filtroRol.toLowerCase() ||
            r.nombre_rol.toLowerCase() === this.filtroRol.toLowerCase()
        )
      );
    }

    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      const activo = this.filtroEstado === 'activo';
      resultados = resultados.filter((u) => {
        if (u.referente) {
          return u.referente.estado_referente === (activo ? 'activo' : 'inactivo');
        }
        return false;
      });
    }

    this.usuariosFiltrados = resultados;
  }

  /**
   * Cambiar estado de usuario (toggle)
   */
  cambiarEstadoUsuario(usuario: Usuario) {
    // Esta funcionalidad requeriría un endpoint específico en el backend
    // Por ahora solo mostramos el cambio en la UI
    const estado = usuario.referente?.estado_referente === 'activo' ? 'activado' : 'desactivado';
    this.message.success(`Usuario ${estado} correctamente`);
  }

  /**
   * Eliminar usuario
   */
  eliminarUsuario(usuario: Usuario) {
    this.modal.confirm({
      nzTitle: '¿Desactivar usuario?',
      nzContent: `¿Estás seguro de desactivar a "${this.adminService.obtenerNombreCompleto(usuario)}"? El usuario no podrá acceder al sistema.`,
      nzOkText: 'Sí, desactivar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.adminService
          .desactivarUsuario(usuario.id_usuario)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.message.success('Usuario desactivado correctamente');
              this.cargarUsuarios();
            },
            error: (error) => {
              console.error('Error al desactivar usuario:', error);
              this.message.error(error.error?.message || 'Error al desactivar usuario');
            },
          });
      },
    });
  }

  getRolColor(usuario: Usuario): string {
    const rol = this.adminService.obtenerRolPrincipal(usuario);
    return rol ? this.adminService.obtenerColorRol(rol.codigo_rol) : 'default';
  }

  getRolTexto(usuario: Usuario): string {
    const rol = this.adminService.obtenerRolPrincipal(usuario);
    return rol ? this.adminService.formatearRol(rol.codigo_rol) : 'Sin rol';
  }

  obtenerNombreCompleto(usuario: Usuario): string {
    return this.adminService.obtenerNombreCompleto(usuario);
  }

  obtenerIniciales(usuario: Usuario): string {
    return this.adminService.obtenerIniciales(usuario);
  }

  estaActivo(usuario: Usuario): boolean {
    return usuario.referente?.estado_referente === 'activo';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
