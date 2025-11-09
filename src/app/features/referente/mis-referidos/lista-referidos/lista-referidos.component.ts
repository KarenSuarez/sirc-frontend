import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

import { ReferidoService } from '../../../../core/services/referido.service';
import { Referido } from '../../../../core/models/referido.interface';

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
    NzToolTipModule,
    NzDescriptionsModule,
  ],
  templateUrl: './lista-referidos.component.html',
  styleUrl: './lista-referidos.component.css',
})
export class ListaReferidosComponent implements OnInit, OnDestroy {
  referidos: Referido[] = [];
  loading = true;
  expandedReferidoId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private message: NzMessageService,
    private modal: NzModalService,
    private referidoService: ReferidoService
  ) {}

  ngOnInit() {
    this.cargarReferidos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarReferidos() {
    this.loading = true;

    this.referidoService
      .listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (referidos) => {
          this.referidos = referidos;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar referidos:', error);
          this.message.error('Error al cargar referidos');
          this.loading = false;
        },
      });
  }

  crearReferido() {
    this.router.navigate(['referente/referidos/nuevo']);
  }

  toggleDetalle(referido: Referido) {
    if (this.expandedReferidoId === referido.id_referido) {
      this.expandedReferidoId = null;
    } else {
      this.expandedReferidoId = referido.id_referido;
    }
  }

  isExpanded(referido: Referido): boolean {
    return this.expandedReferidoId === referido.id_referido;
  }

  eliminarReferido(referido: Referido) {
    if (referido.estado_referido !== 'pendiente') {
      this.message.warning(
        'Solo se pueden eliminar referidos en estado pendiente'
      );
      return;
    }

    this.modal.confirm({
      nzTitle: '¿Eliminar referido?',
      nzContent: `¿Estás seguro de eliminar a ${referido.nombre_referido} ${referido.apellido_referido}? Esta acción no se puede deshacer.`,
      nzOkText: 'Sí, eliminar',
      nzCancelText: 'Cancelar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.message.info('Función de eliminación en desarrollo');
      },
    });
  }

  getEstadoColor(estado: string): string {
    const colores: Record<string, string> = {
      pendiente: 'orange',
      contactado: 'blue',
      activo: 'green',
      no_interesado: 'red',
      inactivo: 'default',
    };
    return colores[estado] || 'default';
  }

  getEstadoTexto(estado: string): string {
    const textos: Record<string, string> = {
      pendiente: 'Pendiente',
      contactado: 'Contactado',
      activo: 'Activo',
      no_interesado: 'No Interesado',
      inactivo: 'Inactivo',
    };
    return textos[estado] || estado;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  getIniciales(nombre: string, apellido: string): string {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }
}
