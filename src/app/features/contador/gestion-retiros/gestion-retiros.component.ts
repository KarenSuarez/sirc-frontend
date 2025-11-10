import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

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
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { ContadorService } from '../../../core/services/contador.service';
import {
  SolicitudRecompensa,
  EstadoSolicitud,
} from '../../../core/models/solicitud.interface';

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
    NzMessageModule,
    NzSpinModule,
  ],
  templateUrl: './gestion-retiros.component.html',
  styleUrl: './gestion-retiros.component.css',
})
export class GestionRetirosComponent implements OnInit, OnDestroy {
  solicitudes: SolicitudRecompensa[] = [];
  solicitudesFiltradas: SolicitudRecompensa[] = [];
  loading = true;

  searchText = '';
  filtroEstado: string = 'todos';
  ordenarPor = 'fecha';

  opcionesEstado = [
    { label: 'Todos', value: 'todos' },
    { label: 'Pendientes', value: 'pendiente' },
    { label: 'Aprobados', value: 'aprobada' },
    { label: 'Rechazados', value: 'rechazada' },
  ];

  modalProcesarVisible = false;
  modalDetalleVisible = false;
  solicitudSeleccionada: SolicitudRecompensa | null = null;
  procesarForm!: FormGroup;
  procesando = false;
  fileList: NzUploadFile[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private contadorService: ContadorService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarSolicitudes();

    // Si viene un ID en query params, abrir detalle
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['id']) {
        const id = parseInt(params['id']);
        this.cargarYMostrarDetalle(id);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.procesarForm = this.fb.group({
      decision: [''],
      observaciones: [''],
      comprobante_pago_url: [''],
    });
  }

  /**
   * Cargar solicitudes desde backend
   */
  cargarSolicitudes() {
    this.loading = true;

    this.contadorService
      .listarTodasSolicitudes({ limite: 100, pagina: 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.solicitudes = response.solicitudes;
          this.solicitudesFiltradas = [...this.solicitudes];
          this.ordenarSolicitudes();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar solicitudes:', error);
          this.message.error('Error al cargar solicitudes');
          this.loading = false;
        },
      });
  }

  /**
   * Cargar y mostrar detalle de una solicitud específica
   */
  cargarYMostrarDetalle(id: number) {
    this.contadorService
      .obtenerSolicitud(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (solicitud) => {
          this.solicitudSeleccionada = solicitud;
          this.modalDetalleVisible = true;
        },
        error: (error) => {
          console.error('Error al cargar solicitud:', error);
          this.message.error('Error al cargar detalle de la solicitud');
        },
      });
  }

  /**
   * Filtrar solicitudes
   */
  filtrarSolicitudes() {
    let resultados = [...this.solicitudes];

    // Filtro de búsqueda
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      resultados = resultados.filter((s) => {
        const nombreReferente = this.obtenerNombreReferente(s).toLowerCase();
        const codigo = s.referente?.codigo_referente?.toLowerCase() || '';
        const id = s.id_solicitud.toString();
        return (
          nombreReferente.includes(search) ||
          codigo.includes(search) ||
          id.includes(search)
        );
      });
    }

    // Filtro de estado
    if (this.filtroEstado !== 'todos') {
      resultados = resultados.filter(
        (s) => s.estado_solicitud === this.filtroEstado
      );
    }

    this.solicitudesFiltradas = resultados;
    this.ordenarSolicitudes();
  }

  /**
   * Ordenar solicitudes
   */
  ordenarSolicitudes() {
    switch (this.ordenarPor) {
      case 'fecha':
        this.solicitudesFiltradas.sort(
          (a, b) =>
            new Date(b.fecha_solicitud).getTime() -
            new Date(a.fecha_solicitud).getTime()
        );
        break;
      case 'monto-desc':
        this.solicitudesFiltradas.sort(
          (a, b) => b.monto_solicitado - a.monto_solicitado
        );
        break;
      case 'monto-asc':
        this.solicitudesFiltradas.sort(
          (a, b) => a.monto_solicitado - b.monto_solicitado
        );
        break;
      case 'referente':
        this.solicitudesFiltradas.sort((a, b) =>
          this.obtenerNombreReferente(a).localeCompare(
            this.obtenerNombreReferente(b)
          )
        );
        break;
    }
  }

  /**
   * Calcular monto total
   */
  calcularMontoTotal(): number {
    return this.solicitudesFiltradas.reduce(
      (sum, s) => sum + s.monto_solicitado,
      0
    );
  }

  /**
   * Procesar retiro
   */
  procesarRetiro(solicitud: SolicitudRecompensa) {
    this.solicitudSeleccionada = solicitud;
    this.procesarForm.reset();
    this.fileList = [];
    this.modalProcesarVisible = true;
  }

  /**
   * Confirmar proceso (aprobar o rechazar)
   */
  confirmarProceso() {
    const decision = this.procesarForm.get('decision')?.value;

    if (!decision) {
      this.message.warning('Por favor selecciona una decisión');
      return;
    }

    if (decision === 'aprobar' && this.fileList.length === 0) {
      this.message.warning(
        'Por favor carga el comprobante de pago o ingresa la URL'
      );
      // Permitir continuar si hay URL en el formulario
      const urlComprobante = this.procesarForm.get('comprobante_pago_url')?.value;
      if (!urlComprobante) {
        return;
      }
    }

    const titulo =
      decision === 'aprobar' ? '¿Aprobar retiro?' : '¿Rechazar retiro?';
    const contenido =
      decision === 'aprobar'
        ? `¿Confirmas que has realizado el pago de ${this.solicitudSeleccionada?.monto_solicitado.toLocaleString('es-CO')} a ${this.obtenerNombreReferente(this.solicitudSeleccionada!)}?`
        : `¿Estás seguro de rechazar esta solicitud de retiro?`;

    this.modal.confirm({
      nzTitle: titulo,
      nzContent: contenido,
      nzOkText: 'Sí, confirmar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.procesando = true;

        if (decision === 'aprobar') {
          this.aprobarSolicitud();
        } else {
          this.rechazarSolicitud();
        }
      },
    });
  }

  /**
   * Aprobar solicitud
   */
  aprobarSolicitud() {
    const observaciones = this.procesarForm.get('observaciones')?.value;
    const comprobante_pago_url = this.procesarForm.get(
      'comprobante_pago_url'
    )?.value;

    this.contadorService
      .aprobarSolicitud(this.solicitudSeleccionada!.id_solicitud, {
        observaciones,
        comprobante_pago_url,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.message.success('Retiro aprobado exitosamente');
          this.cargarSolicitudes();
          this.procesando = false;
          this.cerrarModalProcesar();
        },
        error: (error) => {
          console.error('Error al aprobar solicitud:', error);
          this.message.error(
            error.error?.message || 'Error al aprobar retiro'
          );
          this.procesando = false;
        },
      });
  }

  /**
   * Rechazar solicitud
   */
  rechazarSolicitud() {
    const observaciones = this.procesarForm.get('observaciones')?.value;

    this.contadorService
      .rechazarSolicitud(this.solicitudSeleccionada!.id_solicitud, {
        observaciones,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.message.success('Retiro rechazado');
          this.cargarSolicitudes();
          this.procesando = false;
          this.cerrarModalProcesar();
        },
        error: (error) => {
          console.error('Error al rechazar solicitud:', error);
          this.message.error(
            error.error?.message || 'Error al rechazar retiro'
          );
          this.procesando = false;
        },
      });
  }

  /**
   * Ver detalle
   */
  verDetalle(solicitud: SolicitudRecompensa) {
    this.solicitudSeleccionada = solicitud;
    this.modalDetalleVisible = true;
  }

  /**
   * Descargar comprobante (simulado)
   */
  descargarComprobante(solicitud: SolicitudRecompensa) {
    if (solicitud.comprobante_pago_url) {
      window.open(solicitud.comprobante_pago_url, '_blank');
    } else {
      this.message.info(`No hay comprobante disponible`);
    }
  }

  /**
   * Reenviar notificación (simulado)
   */
  reenviarNotificacion(solicitud: SolicitudRecompensa) {
    this.message.success(
      `Notificación reenviada a ${this.obtenerNombreReferente(solicitud)}`
    );
  }

  cerrarModalProcesar() {
    this.modalProcesarVisible = false;
    this.solicitudSeleccionada = null;
    this.fileList = [];
  }

  cerrarModalDetalle() {
    this.modalDetalleVisible = false;
    this.solicitudSeleccionada = null;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
    // Aquí podrías subir el archivo a un servidor y obtener la URL
    // Por ahora solo guardamos el archivo localmente
    return false;
  };

  // Métodos helper usando el servicio
  getEstadoColor(estado: string): string {
    return this.contadorService.obtenerColorEstado(estado as EstadoSolicitud);
  }

  getEstadoTexto(estado: string): string {
    return this.contadorService.obtenerTextoEstado(estado as EstadoSolicitud);
  }

  getMetodoIcon(metodo: string): string {
    return this.contadorService.obtenerIconoMetodo(metodo as any);
  }

  obtenerNombreReferente(solicitud: SolicitudRecompensa): string {
    return this.contadorService.obtenerNombreReferente(solicitud);
  }

  obtenerInicialesReferente(solicitud: SolicitudRecompensa): string {
    return this.contadorService.obtenerInicialesReferente(solicitud);
  }

  formatearMetodoRetiro(metodo: string): string {
    return this.contadorService.formatearMetodoRetiro(metodo as any);
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  formatearHora(fecha: string): string {
    return new Date(fecha).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
}
