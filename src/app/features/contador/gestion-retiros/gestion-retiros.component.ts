import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

interface Retiro {
  id: string;
  referenteNombre: string;
  referenteCodigo: string;
  monto: number;
  fechaSolicitud: Date;
  fechaProcesado?: Date;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  metodoPago: string;
  datosBancarios?: {
    banco: string;
    tipoCuenta: string;
    numeroCuenta: string;
    titular: string;
  };
  procesadoPor?: string;
  observaciones?: string;
}

@Component({
  selector: 'app-gestion-retiros',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzTagModule,
    NzSpaceModule,
    NzDropDownModule,
    NzMenuModule,
    NzSegmentedModule,
    NzSelectModule,
    NzModalModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzFormModule,
    NzRadioModule,
    NzUploadModule,
    NzMessageModule
  ],
  templateUrl: './gestion-retiros.component.html',
  styleUrl: './gestion-retiros.component.css'
})
export class GestionRetirosComponent implements OnInit {
  retiros: Retiro[] = [];
  retirosFiltrados: Retiro[] = [];
  loading = true;

  searchText = '';
  filtroEstado = 'todos';
  ordenarPor = 'fecha';

  opcionesEstado = [
    { label: 'Todos', value: 'todos' },
    { label: 'Pendientes', value: 'pendiente' },
    { label: 'Aprobados', value: 'aprobado' },
    { label: 'Rechazados', value: 'rechazado' }
  ];

  modalProcesarVisible = false;
  modalDetalleVisible = false;
  retiroSeleccionado: Retiro | null = null;
  procesarForm!: FormGroup;
  procesando = false;
  fileList: NzUploadFile[] = [];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarRetiros();
  }

  initForm() {
    this.procesarForm = this.fb.group({
      decision: [''],
      observaciones: ['']
    });
  }

  cargarRetiros() {
    this.loading = true;

    setTimeout(() => {
      this.retiros = [
        {
          id: 'RET-2024-001',
          referenteNombre: 'María González',
          referenteCodigo: 'REF-2024-001',
          monto: 250000,
          fechaSolicitud: new Date('2024-01-28T10:30:00'),
          estado: 'pendiente',
          metodoPago: 'Transferencia Bancaria',
          datosBancarios: {
            banco: 'Bancolombia',
            tipoCuenta: 'Ahorros',
            numeroCuenta: '12345678901',
            titular: 'María González'
          }
        },
        {
          id: 'RET-2024-002',
          referenteNombre: 'Carlos Ramírez',
          referenteCodigo: 'REF-2024-002',
          monto: 180000,
          fechaSolicitud: new Date('2024-01-27T14:20:00'),
          estado: 'pendiente',
          metodoPago: 'Transferencia Bancaria',
          datosBancarios: {
            banco: 'Banco de Bogotá',
            tipoCuenta: 'Corriente',
            numeroCuenta: '98765432109',
            titular: 'Carlos Ramírez'
          }
        },
        {
          id: 'RET-2024-003',
          referenteNombre: 'Ana Martínez',
          referenteCodigo: 'REF-2024-004',
          monto: 320000,
          fechaSolicitud: new Date('2024-01-27T09:15:00'),
          fechaProcesado: new Date('2024-01-27T16:00:00'),
          estado: 'aprobado',
          metodoPago: 'Transferencia Bancaria',
          procesadoPor: 'Laura Pérez',
          observaciones: 'Pago procesado exitosamente'
        },
        {
          id: 'RET-2024-004',
          referenteNombre: 'Pedro Sánchez',
          referenteCodigo: 'REF-2024-003',
          monto: 150000,
          fechaSolicitud: new Date('2024-01-26T11:45:00'),
          fechaProcesado: new Date('2024-01-26T17:30:00'),
          estado: 'aprobado',
          metodoPago: 'Transferencia Bancaria',
          procesadoPor: 'Laura Pérez'
        },
        {
          id: 'RET-2024-005',
          referenteNombre: 'Luis Hernández',
          referenteCodigo: 'REF-2024-005',
          monto: 95000,
          fechaSolicitud: new Date('2024-01-26T08:00:00'),
          fechaProcesado: new Date('2024-01-26T15:00:00'),
          estado: 'rechazado',
          metodoPago: 'Transferencia Bancaria',
          procesadoPor: 'Laura Pérez',
          observaciones: 'Datos bancarios incorrectos'
        }
      ];

      this.retirosFiltrados = [...this.retiros];
      this.ordenarRetiros();
      this.loading = false;
    }, 1000);
  }

  filtrarRetiros() {
    let resultados = [...this.retiros];

    // Filtro de búsqueda
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      resultados = resultados.filter(r =>
        r.referenteNombre.toLowerCase().includes(search) ||
        r.id.toLowerCase().includes(search) ||
        r.referenteCodigo.toLowerCase().includes(search)
      );
    }

    // Filtro de estado
    if (this.filtroEstado !== 'todos') {
      resultados = resultados.filter(r => r.estado === this.filtroEstado);
    }

    this.retirosFiltrados = resultados;
    this.ordenarRetiros();
  }

  ordenarRetiros() {
    switch (this.ordenarPor) {
      case 'fecha':
        this.retirosFiltrados.sort((a, b) =>
          b.fechaSolicitud.getTime() - a.fechaSolicitud.getTime()
        );
        break;
      case 'monto-desc':
        this.retirosFiltrados.sort((a, b) => b.monto - a.monto);
        break;
      case 'monto-asc':
        this.retirosFiltrados.sort((a, b) => a.monto - b.monto);
        break;
      case 'referente':
        this.retirosFiltrados.sort((a, b) =>
          a.referenteNombre.localeCompare(b.referenteNombre)
        );
        break;
    }
  }

  calcularMontoTotal(): number {
    return this.retirosFiltrados.reduce((sum, r) => sum + r.monto, 0);
  }

  procesarRetiro(retiro: Retiro) {
    this.retiroSeleccionado = retiro;
    this.procesarForm.reset();
    this.fileList = [];
    this.modalProcesarVisible = true;
  }

  confirmarProceso() {
    const decision = this.procesarForm.get('decision')?.value;

    if (!decision) {
      this.message.warning('Por favor selecciona una decisión');
      return;
    }

    if (decision === 'aprobar' && this.fileList.length === 0) {
      this.message.warning('Por favor carga el comprobante de pago');
      return;
    }

    const titulo = decision === 'aprobar' ? '¿Aprobar retiro?' : '¿Rechazar retiro?';
    const contenido = decision === 'aprobar'
      ? `¿Confirmas que has realizado el pago de ${this.retiroSeleccionado?.monto.toLocaleString('es-CO')} a ${this.retiroSeleccionado?.referenteNombre}?`
      : `¿Estás seguro de rechazar esta solicitud de retiro?`;

    this.modal.confirm({
      nzTitle: titulo,
      nzContent: contenido,
      nzOkText: 'Sí, confirmar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.procesando = true;

        setTimeout(() => {
          if (this.retiroSeleccionado) {
            const index = this.retiros.findIndex(r => r.id === this.retiroSeleccionado!.id);
            this.retiros[index] = {
              ...this.retiros[index],
              estado: decision === 'aprobar' ? 'aprobado' : 'rechazado',
              fechaProcesado: new Date(),
              procesadoPor: 'Usuario Actual',
              observaciones: this.procesarForm.get('observaciones')?.value
            };

            this.filtrarRetiros();
            this.message.success(
              decision === 'aprobar' ? 'Retiro aprobado exitosamente' : 'Retiro rechazado'
            );
          }

          this.procesando = false;
          this.cerrarModalProcesar();
        }, 1500);
      }
    });
  }

  verDetalle(retiro: Retiro) {
    this.retiroSeleccionado = retiro;
    this.modalDetalleVisible = true;
  }

  descargarComprobante(retiro: Retiro) {
    this.message.info(`Descargando comprobante de ${retiro.id}...`);
  }

  reenviarNotificacion(retiro: Retiro) {
    this.message.success(`Notificación reenviada a ${retiro.referenteNombre}`);
  }

  cerrarModalProcesar() {
    this.modalProcesarVisible = false;
    this.retiroSeleccionado = null;
    this.fileList = [];
  }

  cerrarModalDetalle() {
    this.modalDetalleVisible = false;
    this.retiroSeleccionado = null;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
    return false;
  };

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

  getMetodoIcon(metodo: string): string {
    return 'bank';
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatearHora(fecha: Date): string {
    return fecha.toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
}
