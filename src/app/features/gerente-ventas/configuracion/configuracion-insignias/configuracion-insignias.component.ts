import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { InsigniaService } from '../../../../core/services/insignia.service';
import {
  Insignia,
  InsigniaConEstadisticas,
  CrearInsigniaRequest,
  ActualizarInsigniaRequest,
  RarezaInsignia,
} from '../../../../core/models/insignia.interface';

interface InsigniaDisplay extends Insignia {
  criteriosArray?: string[];
  usuariosObtenidos?: number;
  activa?: boolean;
  destacada?: boolean;
}

@Component({
  selector: 'app-configuracion-insignias',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzModalModule,
    NzSelectModule,
    NzInputNumberModule,
    NzDividerModule,
    NzTagModule,
    NzSwitchModule,
    NzAlertModule,
    NzRadioModule,
    NzCheckboxModule,
    NzTabsModule,
    NzSpinModule,
  ],
  templateUrl: './configuracion-insignias.component.html',
  styleUrl: './configuracion-insignias.component.css',
})
export class ConfiguracionInsigniasComponent implements OnInit, OnDestroy {
  insignias: InsigniaDisplay[] = [];
  loading = true;

  modalVisible = false;
  modoEdicion = false;
  guardando = false;
  insigniaForm!: FormGroup;
  insigniaSeleccionada: Insignia | null = null;

  nuevoCriterio = '';
  criteriosTemp: string[] = [];

  iconosDisponibles = [
    { label: 'Estrella', value: 'star' },
    { label: 'Trofeo', value: 'trophy' },
    { label: 'Corona', value: 'crown' },
    { label: 'Medalla', value: 'medal' },
    { label: 'Fuego', value: 'fire' },
    { label: 'Rayo', value: 'thunderbolt' },
    { label: 'Cohete', value: 'rocket' },
    { label: 'Diamante', value: 'skin' },
    { label: 'Corazón', value: 'heart' },
    { label: 'Like', value: 'like' },
    { label: 'Regalo', value: 'gift' },
    { label: 'Bandera', value: 'flag' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private insigniaService: InsigniaService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarInsignias();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.insigniaForm = this.fb.group({
      nombre_insignia: ['', Validators.required],
      descripcion: ['', Validators.required],
      icono_insignia: ['star', Validators.required],
      color_insignia: ['#4A90E2'],
      rareza: ['comun' as RarezaInsignia],
      descripcionRecompensa: [''],
      destacada: [false],
    });
  }

  /**
   * Cargar insignias desde backend
   */
  cargarInsignias() {
    this.loading = true;

    this.insigniaService
      .listarInsignias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (insignias) => {
          this.insignias = insignias.map((ins) => ({
            ...ins,
            criteriosArray: this.parsearCriterios(ins.criterio_obtencion),
            usuariosObtenidos: 0, // Se obtendría de estadísticas
            activa: ins.estado === 'activa',
            destacada: false, // Campo que no existe en backend pero se usa en UI
          }));
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar insignias:', error);
          this.message.error('Error al cargar insignias');
          this.loading = false;
        },
      });
  }

  /**
   * Parsear criterios de obtención
   */
  parsearCriterios(criterio: string): string[] {
    try {
      const parsed = JSON.parse(criterio);
      return Array.isArray(parsed) ? parsed : [criterio];
    } catch {
      return [criterio];
    }
  }

  /**
   * Mostrar modal para crear
   */
  mostrarModalCrear() {
    this.modoEdicion = false;
    this.insigniaSeleccionada = null;
    this.criteriosTemp = [];
    this.insigniaForm.reset({
      icono_insignia: 'star',
      color_insignia: '#4A90E2',
      rareza: 'comun',
      destacada: false,
    });
    this.modalVisible = true;
  }

  /**
   * Editar insignia
   */
  editarInsignia(insignia: InsigniaDisplay) {
    this.modoEdicion = true;
    this.insigniaSeleccionada = insignia;
    this.criteriosTemp = insignia.criteriosArray || [];
    this.insigniaForm.patchValue({
      nombre_insignia: insignia.nombre_insignia,
      descripcion: insignia.descripcion,
      icono_insignia: insignia.icono_insignia,
      color_insignia: insignia.color_insignia,
      rareza: insignia.rareza,
      destacada: insignia.destacada || false,
    });
    this.modalVisible = true;
  }

  /**
   * Agregar criterio
   */
  agregarCriterio() {
    if (this.nuevoCriterio.trim()) {
      this.criteriosTemp.push(this.nuevoCriterio.trim());
      this.nuevoCriterio = '';
    }
  }

  /**
   * Eliminar criterio
   */
  eliminarCriterio(index: number) {
    this.criteriosTemp.splice(index, 1);
  }

  /**
   * Guardar insignia (crear o actualizar)
   */
  guardarInsignia() {
    if (!this.insigniaForm.valid) {
      Object.values(this.insigniaForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    if (this.criteriosTemp.length === 0) {
      this.message.warning('Debes agregar al menos un criterio de obtención');
      return;
    }

    this.guardando = true;

    const datosFormulario = this.insigniaForm.value;
    const criteriosJson = JSON.stringify(this.criteriosTemp);

    if (this.modoEdicion && this.insigniaSeleccionada) {
      // Actualizar
      const datosActualizar: ActualizarInsigniaRequest = {
        nombre_insignia: datosFormulario.nombre_insignia,
        descripcion: datosFormulario.descripcion,
        icono_insignia: datosFormulario.icono_insignia,
        color_insignia: datosFormulario.color_insignia,
        criterio_obtencion: criteriosJson,
        rareza: datosFormulario.rareza,
      };

      this.insigniaService
        .actualizarInsignia(this.insigniaSeleccionada.id_insignia, datosActualizar)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.message.success('Insignia actualizada correctamente');
            this.cargarInsignias();
            this.guardando = false;
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al actualizar insignia:', error);
            this.message.error(
              error.error?.message || 'Error al actualizar insignia'
            );
            this.guardando = false;
          },
        });
    } else {
      // Crear
      const datosCrear: CrearInsigniaRequest = {
        nombre_insignia: datosFormulario.nombre_insignia,
        descripcion: datosFormulario.descripcion,
        icono_insignia: datosFormulario.icono_insignia,
        color_insignia: datosFormulario.color_insignia,
        criterio_obtencion: criteriosJson,
        rareza: datosFormulario.rareza,
      };

      this.insigniaService
        .crearInsignia(datosCrear)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.message.success('Insignia creada correctamente');
            this.cargarInsignias();
            this.guardando = false;
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al crear insignia:', error);
            this.message.error(
              error.error?.message || 'Error al crear insignia'
            );
            this.guardando = false;
          },
        });
    }
  }

  /**
   * Cambiar estado de insignia
   */
  cambiarEstadoInsignia(insignia: InsigniaDisplay) {
    const nuevoEstado = insignia.estado === 'activa' ? 'inactiva' : 'activa';

    this.insigniaService
      .actualizarInsignia(insignia.id_insignia, { estado: nuevoEstado })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          insignia.estado = nuevoEstado;
          insignia.activa = nuevoEstado === 'activa';
          this.message.success(
            `Insignia ${nuevoEstado === 'activa' ? 'activada' : 'desactivada'} correctamente`
          );
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          this.message.error('Error al cambiar estado de la insignia');
          // Revertir cambio en la UI
          insignia.activa = !insignia.activa;
        },
      });
  }

  /**
   * Ver detalles de insignia
   */
  verDetalles(insignia: InsigniaDisplay) {
    this.insigniaService
      .obtenerInsignia(insignia.id_insignia)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.modal.info({
            nzTitle: data.nombre_insignia,
            nzWidth: 600,
            nzContent: `
              <div style="padding: 16px 0;">
                <p><strong>Descripción:</strong> ${data.descripcion}</p>
                <p><strong>Rareza:</strong> ${this.insigniaService.obtenerTextoRareza(data.rareza)}</p>
                <p><strong>Usuarios que la tienen:</strong> ${data.estadisticas.total_referentes}</p>
                <p><strong>Criterios:</strong></p>
                <ul>
                  ${this.parsearCriterios(data.criterio_obtencion)
                    .map((c) => `<li>${c}</li>`)
                    .join('')}
                </ul>
              </div>
            `,
            nzOkText: 'Cerrar',
          });
        },
        error: (error) => {
          console.error('Error al obtener detalles:', error);
          this.message.error('Error al obtener detalles de la insignia');
        },
      });
  }

  /**
   * Eliminar insignia
   */
  eliminarInsignia(insignia: InsigniaDisplay) {
    this.modal.confirm({
      nzTitle: '¿Desactivar insignia?',
      nzContent: `¿Estás seguro de desactivar la insignia "${insignia.nombre_insignia}"? Los usuarios que ya la tienen la conservarán, pero no se otorgará a nuevos usuarios.`,
      nzOkText: 'Sí, desactivar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.insigniaService
          .eliminarInsignia(insignia.id_insignia)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.message.success('Insignia desactivada correctamente');
              this.cargarInsignias();
            },
            error: (error) => {
              console.error('Error al desactivar insignia:', error);
              this.message.error(
                error.error?.message || 'Error al desactivar insignia'
              );
            },
          });
      },
    });
  }

  /**
   * Cerrar modal
   */
  cerrarModal() {
    this.modalVisible = false;
    this.insigniaSeleccionada = null;
    this.criteriosTemp = [];
    this.insigniaForm.reset();
  }

  /**
   * Obtener color de rareza
   */
  getRarezaColor(rareza: RarezaInsignia): string {
    return this.insigniaService.obtenerColorRareza(rareza);
  }

  /**
   * Obtener texto de rareza en español
   */
  obtenerTextoRareza(rareza: RarezaInsignia): string {
    const textos: { [key in RarezaInsignia]: string } = {
      comun: 'Común',
      rara: 'Rara',
      epica: 'Épica',
      legendaria: 'Legendaria',
    };
    return textos[rareza] || 'Común';
  }
}
