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
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { PlanService } from '../../../../core/services/plan.service';
import { Plan, CrearPlanRequest, ActualizarPlanRequest } from '../../../../core/models/plan.interface';

@Component({
  selector: 'app-configuracion-planes',
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
    NzFormModule,
    NzModalModule,
    NzSelectModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzSpaceModule,
    NzToolTipModule,
    NzAlertModule,
  ],
  templateUrl: './configuracion-planes.component.html',
  styleUrl: './configuracion-planes.component.css',
})
export class ConfiguracionPlanesComponent implements OnInit, OnDestroy {
  planes: Plan[] = [];
  planesFiltrados: Plan[] = [];
  loading = true;
  searchText = '';

  modalVisible = false;
  modoEdicion = false;
  guardando = false;
  planForm!: FormGroup;
  planSeleccionado: Plan | null = null;

  iconosDisponibles = [
    { label: 'Estrella', value: 'star' },
    { label: 'Trofeo', value: 'trophy' },
    { label: 'Cohete', value: 'rocket' },
    { label: 'Corona', value: 'crown' },
    { label: 'Fuego', value: 'fire' },
    { label: 'Corazón', value: 'heart' },
    { label: 'Archivo', value: 'file-text' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private planService: PlanService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarPlanes();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.planForm = this.fb.group({
      nombre_plan: ['', Validators.required],
      descripcion: [''],
      precio_actual: [0, [Validators.required, Validators.min(1)]],
      porcentaje_comision_base: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      puntos_otorgados: [0, [Validators.required, Validators.min(0)]],
      icono_plan: ['file-text'],
      color_plan: ['#4A90E2'],
    });
  }

  /**
   * Cargar planes desde backend
   */
  cargarPlanes() {
    this.loading = true;

    this.planService
      .listarPlanes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (planes) => {
          this.planes = planes;
          this.planesFiltrados = [...this.planes];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar planes:', error);
          this.message.error('Error al cargar planes');
          this.loading = false;
        },
      });
  }

  /**
   * Filtrar planes
   */
  filtrarPlanes() {
    if (!this.searchText) {
      this.planesFiltrados = [...this.planes];
      return;
    }

    const search = this.searchText.toLowerCase();
    this.planesFiltrados = this.planes.filter(
      (plan) =>
        plan.nombre_plan.toLowerCase().includes(search) ||
        (plan.descripcion_plan && plan.descripcion_plan.toLowerCase().includes(search))
    );
  }

  /**
   * Mostrar modal para crear
   */
  mostrarModalCrear() {
    this.modoEdicion = false;
    this.planSeleccionado = null;
    this.planForm.reset({
      icono_plan: 'file-text',
      color_plan: '#4A90E2',
      precio_actual: 0,
      porcentaje_comision_base: 0,
      puntos_otorgados: 0,
    });
    this.modalVisible = true;
  }

  /**
   * Editar plan
   */
  editarPlan(plan: Plan) {
    this.modoEdicion = true;
    this.planSeleccionado = plan;
    this.planForm.patchValue({
      nombre_plan: plan.nombre_plan,
      descripcion: plan.descripcion_plan || '',
      precio_actual: plan.precio_actual,
      porcentaje_comision_base: plan.porcentaje_comision_base,
      puntos_otorgados: plan.puntos_otorgados,
      icono_plan: plan.icono_plan || 'file-text',
      color_plan: plan.color_plan || '#4A90E2',
    });
    this.modalVisible = true;
  }

  /**
   * Guardar plan (crear o actualizar)
   */
  guardarPlan() {
    if (!this.planForm.valid) {
      Object.values(this.planForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.guardando = true;

    const datosFormulario = this.planForm.value;

    if (this.modoEdicion && this.planSeleccionado) {
      // Actualizar
      const datosActualizar: ActualizarPlanRequest = datosFormulario;

      this.planService
        .actualizarPlan(this.planSeleccionado.id_plan, datosActualizar)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.message.success('Plan actualizado correctamente');
            this.cargarPlanes();
            this.guardando = false;
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al actualizar plan:', error);
            this.message.error('Error al actualizar plan');
            this.guardando = false;
          },
        });
    } else {
      // Crear
      const datosCrear: CrearPlanRequest = datosFormulario;

      this.planService
        .crearPlan(datosCrear)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.message.success('Plan creado correctamente');
            this.cargarPlanes();
            this.guardando = false;
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al crear plan:', error);
            this.message.error('Error al crear plan');
            this.guardando = false;
          },
        });
    }
  }

  /**
   * Cambiar estado del plan (activar/desactivar)
   */
  cambiarEstadoPlan(plan: Plan) {
    const nuevoEstado = plan.estado_plan === 'activo' ? 'inactivo' : 'activo';

    this.planService
      .actualizarPlan(plan.id_plan, { estado_plan: nuevoEstado })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          plan.estado_plan = nuevoEstado;
          this.message.success(
            `Plan ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} correctamente`
          );
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          this.message.error('Error al cambiar estado del plan');
          // Revertir cambio en la UI
          plan.estado_plan = plan.estado_plan === 'activo' ? 'inactivo' : 'activo';
        },
      });
  }

  /**
   * Eliminar plan
   */
  eliminarPlan(plan: Plan) {
    this.modal.confirm({
      nzTitle: '¿Desactivar plan?',
      nzContent: `¿Estás seguro de desactivar el plan "${plan.nombre_plan}"? No se eliminará, solo cambiará a estado inactivo.`,
      nzOkText: 'Sí, desactivar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.planService
          .eliminarPlan(plan.id_plan)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.message.success('Plan desactivado correctamente');
              this.cargarPlanes();
            },
            error: (error) => {
              console.error('Error al desactivar plan:', error);
              this.message.error(
                error.error?.message || 'Error al desactivar plan'
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
    this.planSeleccionado = null;
    this.planForm.reset();
  }

  /**
   * Calcular comisión
   */
  calcularComision(valor: number, porcentaje: number): number {
    return (valor * porcentaje) / 100;
  }

  /**
   * Formatters y parsers para currency
   */
  formatterCurrency = (value: number): string =>
    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  parserCurrency = (value: string): number => {
    const parsed = value.replace(/\$\s?|(,*)/g, '');
    return isNaN(Number(parsed)) ? 0 : Number(parsed);
  };

  /**
   * Formatters y parsers para percentage
   */
  formatterPercent = (value: number): string => `${value}%`;
  parserPercent = (value: string): number => {
    const parsed = value.replace('%', '');
    return isNaN(Number(parsed)) ? 0 : Number(parsed);
  };

  /**
   * Verificar si plan está activo
   */
  estaActivo(plan: Plan): boolean {
    return plan.estado_plan === 'activo';
  }
}
