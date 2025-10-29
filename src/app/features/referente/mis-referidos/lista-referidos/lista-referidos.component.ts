import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../core/models/usuario.interface';

interface Referido {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  tipoDoc: string;
  documento: string;
  estado: 'pendiente' | 'contactado' | 'activo' | 'rechazado';
  fechaRegistro: Date;
  fechaContacto?: Date;
  referenteCodigo: string;
  puntos?: number;
}

@Component({
  selector: 'app-lista-referidos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzCardModule,
    NzSpaceModule,
    NzDropDownModule,
    NzMenuModule,
    NzModalModule,
    NzMessageModule
  ],
  templateUrl: './lista-referidos.component.html',
  styleUrl: './lista-referidos.component.css'
})
export class ListaReferidosComponent implements OnInit {
  usuario: Usuario | null = null;
  referidos: Referido[] = [];
  loading = true;

  constructor(
    private router: Router,
    private message: NzMessageService,
    private modal: NzModalService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.usuarioService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      if (usuario) {
        this.cargarReferidos();
      }
    });
  }

  cargarReferidos() {
    this.loading = true;
    // Simulación de datos - aquí iría la llamada al servicio
    setTimeout(() => {
      this.referidos = [
        {
          id: '1',
          nombre: 'Juan Pérez García',
          correo: 'juan.perez@email.com',
          telefono: '3001234567',
          tipoDoc: 'CC',
          documento: '12345678',
          estado: 'activo',
          fechaRegistro: new Date('2024-01-15'),
          fechaContacto: new Date('2024-01-16'),
          referenteCodigo: this.usuario?.codigo || '',
          puntos: 150
        },
        {
          id: '2',
          nombre: 'María López Rodríguez',
          correo: 'maria.lopez@email.com',
          telefono: '3009876543',
          tipoDoc: 'CC',
          documento: '87654321',
          estado: 'contactado',
          fechaRegistro: new Date('2024-01-20'),
          fechaContacto: new Date('2024-01-21'),
          referenteCodigo: this.usuario?.codigo || ''
        },
        {
          id: '3',
          nombre: 'Carlos Ramírez Santos',
          correo: 'carlos.ramirez@email.com',
          telefono: '3005551234',
          tipoDoc: 'CC',
          documento: '11223344',
          estado: 'pendiente',
          fechaRegistro: new Date('2024-01-25'),
          referenteCodigo: this.usuario?.codigo || ''
        }
      ];
      this.loading = false;
    }, 1000);
  }

  crearReferido() {
    this.router.navigate(['referente/referidos/nuevo']);
  }

  verDetalle(referido: Referido) {
    this.message.info(`Ver detalles de ${referido.nombre}`);
  }

  eliminarReferido(referido: Referido) {
    this.modal.confirm({
      nzTitle: '¿Eliminar referido?',
      nzContent: `¿Estás seguro de eliminar a ${referido.nombre}? Esta acción no se puede deshacer.`,
      nzOkText: 'Sí, eliminar',
      nzCancelText: 'Cancelar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.referidos = this.referidos.filter(r => r.id !== referido.id);
        this.message.success('Referido eliminado correctamente');
      }
    });
  }

  getEstadoColor(estado: string): string {
    const colores = {
      'pendiente': 'orange',
      'contactado': 'blue',
      'activo': 'green',
      'rechazado': 'red'
    };
    return colores[estado as keyof typeof colores] || 'default';
  }

  getEstadoTexto(estado: string): string {
    const textos = {
      'pendiente': 'Pendiente',
      'contactado': 'Contactado',
      'activo': 'Activo',
      'rechazado': 'Rechazado'
    };
    return textos[estado as keyof typeof textos] || estado;
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
