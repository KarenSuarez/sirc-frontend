import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

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
}

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
    NzModalModule
  ],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent implements OnInit {
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
    administradores: 0
  };

  constructor(
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;

    setTimeout(() => {
      this.usuarios = [
        {
          id: '1',
          nombre: 'Juan',
          apellido: 'Pérez',
          documento: '1234567890',
          correo: 'juan.perez@email.com',
          telefono: '3001234567',
          rol: 'admin',
          activo: true,
          fechaRegistro: new Date('2024-01-10')
        },
        {
          id: '2',
          nombre: 'María',
          apellido: 'González',
          documento: '9876543210',
          correo: 'maria.gonzalez@email.com',
          telefono: '3009876543',
          rol: 'referente',
          activo: true,
          fechaRegistro: new Date('2024-01-15')
        },
        {
          id: '3',
          nombre: 'Carlos',
          apellido: 'Ramírez',
          documento: '1122334455',
          correo: 'carlos.ramirez@email.com',
          telefono: '3001122334',
          rol: 'asesor_ventas',
          activo: true,
          fechaRegistro: new Date('2024-01-20')
        },
        {
          id: '4',
          nombre: 'Ana',
          apellido: 'Martínez',
          documento: '5544332211',
          correo: 'ana.martinez@email.com',
          telefono: '3005544332',
          rol: 'gerente_ventas',
          activo: true,
          fechaRegistro: new Date('2024-01-25')
        },
        {
          id: '5',
          nombre: 'Pedro',
          apellido: 'Sánchez',
          documento: '6677889900',
          correo: 'pedro.sanchez@email.com',
          telefono: '3006677889',
          rol: 'contador',
          activo: false,
          fechaRegistro: new Date('2024-02-01')
        }
      ];

      this.calcularEstadisticas();
      this.usuariosFiltrados = [...this.usuarios];
      this.loading = false;
    }, 1000);
  }

  calcularEstadisticas() {
    this.estadisticas = {
      total: this.usuarios.length,
      activos: this.usuarios.filter(u => u.activo).length,
      referentes: this.usuarios.filter(u => u.rol === 'referente').length,
      administradores: this.usuarios.filter(u => u.rol === 'admin').length
    };
  }

  filtrarUsuarios() {
    let resultados = [...this.usuarios];

    // Filtro de búsqueda
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      resultados = resultados.filter(u =>
        u.nombre.toLowerCase().includes(search) ||
        u.apellido.toLowerCase().includes(search) ||
        u.correo.toLowerCase().includes(search) ||
        u.documento.includes(search)
      );
    }

    // Filtro por rol
    if (this.filtroRol !== 'todos') {
      resultados = resultados.filter(u => u.rol === this.filtroRol);
    }

    // Filtro por estado
    if (this.filtroEstado !== 'todos') {
      const activo = this.filtroEstado === 'activo';
      resultados = resultados.filter(u => u.activo === activo);
    }

    this.usuariosFiltrados = resultados;
  }

  cambiarEstadoUsuario(usuario: Usuario) {
    const estado = usuario.activo ? 'activado' : 'desactivado';
    this.message.success(`Usuario ${estado} correctamente`);
  }

  eliminarUsuario(usuario: Usuario) {
    this.modal.confirm({
      nzTitle: '¿Eliminar usuario?',
      nzContent: `¿Estás seguro de eliminar al usuario "${usuario.nombre} ${usuario.apellido}"? Esta acción no se puede deshacer.`,
      nzOkText: 'Sí, eliminar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
        this.calcularEstadisticas();
        this.filtrarUsuarios();
        this.message.success('Usuario eliminado correctamente');
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

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
