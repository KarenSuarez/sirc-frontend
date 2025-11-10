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
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { NivelService } from '../../../../core/services/nivel.service';
import {
  Nivel,
  CrearNivelRequest,
  ActualizarNivelRequest,
} from '../../../../core/models/nivel.interface';

@Component({
  selector: 'app-configuracion-niveles',
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
    NzSpinModule,
  ],
  templateUrl: './configuracion-niveles.component.html',
  styleUrl: './configuracion-niveles.component.css',
})
export class ConfiguracionNivelesComponent implements OnInit, OnDestroy {
  niveles: Nivel[] = [];
  loading = true;

  modalVisible = false;
  modoEdicion = false;
  guardando = false;
  nivelForm!: FormGroup;
  nivelSeleccionado: Nivel | null = null;

  nuevoBeneficio = '';
  beneficiosTemp: string[] = [];

  iconosDisponibles = [
    { label: 'Trofeo', value: 'trophy' },
    { label: 'Corona', value: 'crown' },
    { label: 'Estrella', value: 'star' },
    { label: 'Fuego', value: 'fire' },
    { label: 'Rayo', value: 'thunderbolt' },
    { label: 'Cohete', value: 'rocket' },
    { label: 'Diamante', value: 'skin' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private nivelService: NivelService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarNiveles();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.nivelForm = this.fb.group({
      nombre_nivel: ['', Validators.required],
      descripcion: [''],
      orden_nivel: [1, [Validators.required, Validators.min(1)]],
      puntos_minimos: [0, [Validators.required, Validators.min(0)]],
      puntos_maximos: [0, [Validators.required, Validators.min(0)]],
      porcentaje_comision_extra: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      icono_nivel: ['trophy'],
      color_nivel: ['#FFD700'],
    });
  }

  /**
   * Cargar niveles desde backend
   */
  cargarNiveles() {
    this.loading = true;

    this.nivelService
      .listarNiveles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (niveles) => {
          this.niveles = niveles.sort((a, b) => a.orden_nivel - b.orden_nivel);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar niveles:', error);
          this.message.error('Error al cargar niveles');
          this.loading = false;
        },
      });
  }

  /**
   * Mostrar modal para crear
   */
  mostrarModalCrear() {
    this.modoEdicion = false;
    this.nivelSeleccionado = null;
    this.beneficiosTemp = [];
    this.nivelForm.reset({
      icono_nivel: 'trophy',
      color_nivel: '#FFD700',
      orden_nivel: this.niveles.length + 1,
      puntos_minimos: 0,
      puntos_maximos: 0,
      porcentaje_comision_extra: 0,
    });
    this.modalVisible = true;
  }

  /**
   * Editar nivel
   */
  editarNivel(nivel: Nivel) {
    this.modoEdicion = true;
    this.nivelSeleccionado = nivel;
    this.beneficiosTemp = this.nivelService.parsearBeneficios(
      nivel.beneficios_nivel
    );
    this.nivelForm.patchValue({
      nombre_nivel: nivel.nombre_nivel,
      descripcion: nivel.descripcion || '',
      orden_nivel: nivel.orden_nivel,
      puntos_minimos: nivel.puntos_minimos,
      puntos_maximos: nivel.puntos_maximos,
      porcentaje_comision_extra: nivel.porcentaje_comision_extra,
      icono_nivel: nivel.icono_nivel || 'trophy',
      color_nivel: nivel.color_nivel || '#FFD700',
    });
    this.modalVisible = true;
  }

  /**
   * Agregar beneficio
   */
  agregarBeneficio() {
    if (this.nuevoBeneficio.trim()) {
      this.beneficiosTemp.push(this.nuevoBeneficio.trim());
      this.nuevoBeneficio = '';
    }
  }

  /**
   * Eliminar beneficio
   */
  eliminarBeneficio(index: number) {
    this.beneficiosTemp.splice(index, 1);
  }

  /**
   * Guardar nivel (crear o actualizar)
   */
  guardarNivel() {
    if (!this.nivelForm.valid) {
      Object.values(this.nivelForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    // Validar puntos
    const puntosMin = this.nivelForm.get('puntos_minimos')?.value;
    const puntosMax = this.nivelForm.get('puntos_maximos')?.value;

    if (puntosMin >= puntosMax) {
      this.message.error(
        'Los puntos mínimos deben ser menores que los puntos máximos'
      );
      return;
    }

    this.guardando = true;

    const datosFormulario = this.nivelForm.value;
    const beneficiosJson = this.nivelService.stringificarBeneficios(
      this.beneficiosTemp
    );

    if (this.modoEdicion && this.nivelSeleccionado) {
      // Actualizar
      const datosActualizar: ActualizarNivelRequest = {
        ...datosFormulario,
        beneficios_nivel: beneficiosJson,
      };

      this.nivelService
        .actualizarNivel(this.nivelSeleccionado.id_nivel, datosActualizar)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.message.success('Nivel actualizado correctamente');
            this.cargarNiveles();
            this.guardando = false;
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al actualizar nivel:', error);
            this.message.error(
              error.error?.message || 'Error al actualizar nivel'
            );
            this.guardando = false;
          },
        });
    } else {
      // Crear
      const datosCrear: CrearNivelRequest = {
        ...datosFormulario,
        beneficios_nivel: beneficiosJson,
      };

      this.nivelService
        .crearNivel(datosCrear)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.message.success('Nivel creado correctamente');
            this.cargarNiveles();
            this.guardando = false;
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al crear nivel:', error);
            this.message.error(error.error?.message || 'Error al crear nivel');
            this.guardando = false;
          },
        });
    }
  }

  /**
   * Eliminar nivel
   */
  eliminarNivel(nivel: Nivel) {
    this.modal.confirm({
      nzTitle: '¿Eliminar nivel?',
      nzContent: `¿Estás seguro de eliminar el nivel "${nivel.nombre_nivel}"? Los referentes en este nivel permanecerán sin cambios hasta que alcancen otro nivel.`,
      nzOkText: 'Sí, eliminar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.nivelService
          .eliminarNivel(nivel.id_nivel)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.message.success('Nivel eliminado correctamente');
              this.cargarNiveles();
            },
            error: (error) => {
              console.error('Error al eliminar nivel:', error);
              this.message.error(
                error.error?.message || 'Error al eliminar nivel'
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
    this.nivelSeleccionado = null;
    this.beneficiosTemp = [];
    this.nivelForm.reset();
  }

  /**
   * Obtener beneficios de un nivel
   */
  obtenerBeneficios(nivel: Nivel): string[] {
    return this.nivelService.parsearBeneficios(nivel.beneficios_nivel);
  }

  formatterPercent = (value: number): string => `${value}%`;
  parserPercent = (value: string): number => {
    const parsed = value.replace('%', '');
    return isNaN(Number(parsed)) ? 0 : Number(parsed);
  };
}
