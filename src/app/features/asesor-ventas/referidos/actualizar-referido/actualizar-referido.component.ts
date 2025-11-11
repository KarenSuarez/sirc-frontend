import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, forkJoin, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { AsesorService } from '../../../../core/services/asesor.service';
import { PlanService } from '../../../../core/services/plan.service';
import { Referido, EstadoReferido } from '../../../../core/models/referido.interface';
import { Plan } from '../../../../core/models/plan.interface';

@Component({
  selector: 'app-actualizar-referido',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzAlertModule,
    NzDividerModule,
    NzTimelineModule,
    NzSpinModule,
    NzModalModule,
    NzDescriptionsModule,
  ],
  templateUrl: './actualizar-referido.component.html',
  styleUrl: './actualizar-referido.component.css',
})
export class ActualizarReferidoComponent implements OnInit, OnDestroy {
  referido: Referido | null = null;
  datosForm!: FormGroup;
  estadoForm!: FormGroup;
  conversionForm!: FormGroup;

  cargando = true;
  guardando = false;
  convirtiendo = false;

  planes: Plan[] = [];
  planSeleccionado: Plan | null = null;

  mostrarFormularioConversion = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private asesorService: AsesorService,
    private planService: PlanService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.initForms();
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializar formularios
   */
  initForms() {
    // Formulario de datos personales
    this.datosForm = this.fb.group({
      nombre_referido: ['', [Validators.required, Validators.minLength(2)]],
      apellido_referido: ['', [Validators.required, Validators.minLength(2)]],
      correo_referido: ['', [Validators.required, Validators.email]],
      telefono_referido: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      empresa_referido: [''],
      cargo_referido: [''],
    });

    // Formulario de estado
    this.estadoForm = this.fb.group({
      estado_referido: ['', Validators.required],
      observaciones: [''],
    });

    // Formulario de conversión
    this.conversionForm = this.fb.group({
      id_plan_adquirido: ['', Validators.required],
    });
  }

  /**
   * Cargar datos desde backend
   */
  cargarDatos() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.message.error('ID de referido no válido');
      this.volver();
      return;
    }

    this.cargando = true;

    forkJoin({
      referido: this.asesorService.obtenerReferido(+id),
      planes: this.planService.listarPlanes(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.referido = data.referido;
          this.planes = data.planes;

          // Poblar formularios
          this.poblarFormularios();

          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar datos:', error);
          this.message.error('Error al cargar datos del referido');
          this.cargando = false;
          this.volver();
        },
      });
  }

  /**
   * Poblar formularios con datos del referido
   */
  poblarFormularios() {
    if (!this.referido) return;

    // Datos personales
    this.datosForm.patchValue({
      nombre_referido: this.referido.nombre_referido,
      apellido_referido: this.referido.apellido_referido,
      correo_referido: this.referido.correo_referido,
      telefono_referido: this.referido.telefono_referido || '',
      empresa_referido: this.referido.empresa_referido || '',
      cargo_referido: this.referido.cargo_referido || '',
    });

    // Estado
    this.estadoForm.patchValue({
      estado_referido: this.referido.estado_referido,
      observaciones: this.referido.observaciones || '',
    });

    // Si ya tiene plan, seleccionarlo
    if (this.referido.id_plan_adquirido) {
      this.conversionForm.patchValue({
        id_plan_adquirido: this.referido.id_plan_adquirido,
      });
      this.onPlanChange();
    }
  }

  /**
   * Guardar cambios de datos personales
   */
  guardarDatos() {
    if (!this.datosForm.valid || !this.referido) {
      this.markFormGroupTouched(this.datosForm);
      return;
    }

    this.guardando = true;

    this.asesorService
      .actualizarReferido(this.referido.id_referido, this.datosForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.message.success('Datos actualizados correctamente');
          this.referido = response.referido;
          this.guardando = false;
        },
        error: (error) => {
          console.error('Error al actualizar datos:', error);
          this.message.error('Error al actualizar datos');
          this.guardando = false;
        },
      });
  }

  /**
   * Guardar cambio de estado
   */
  guardarEstado() {
    if (!this.estadoForm.valid || !this.referido) {
      this.markFormGroupTouched(this.estadoForm);
      return;
    }

    const estadoNuevo = this.estadoForm.get('estado_referido')?.value;
    const estadoAnterior = this.referido.estado_referido;

    // Si el estado nuevo es "activo", redirigir a conversión
    if (estadoNuevo === 'activo' && estadoAnterior !== 'activo') {
      this.mostrarFormularioConversion = true;
      this.message.info('Selecciona el plan adquirido para completar la conversión');
      return;
    }

    this.modal.confirm({
      nzTitle: '¿Confirmar cambio de estado?',
      nzContent: `¿Estás seguro de cambiar el estado de "${this.getEstadoTexto(estadoAnterior)}" a "${this.getEstadoTexto(estadoNuevo)}"?`,
      nzOkText: 'Sí, cambiar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.ejecutarCambioEstado();
      },
    });
  }

  /**
   * Ejecutar cambio de estado
   */
  ejecutarCambioEstado() {
    if (!this.referido) return;

    this.guardando = true;

    this.asesorService
      .actualizarEstado(this.referido.id_referido, this.estadoForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.message.success('Estado actualizado correctamente');
          this.referido = response.referido;
          this.guardando = false;
        },
        error: (error) => {
          console.error('Error al actualizar estado:', error);
          this.message.error('Error al actualizar estado');
          this.guardando = false;
        },
      });
  }

  /**
   * Convertir referido (vender plan)
   */
  convertirReferido() {
    if (!this.conversionForm.valid || !this.referido) {
      this.markFormGroupTouched(this.conversionForm);
      return;
    }

    const plan = this.planSeleccionado;
    console.log('Plan seleccionado:', plan);

    if (!plan) {
      this.message.error('Selecciona un plan válido');
      return;
    }

    this.modal.confirm({
      nzTitle: '¿Confirmar conversión?',
      nzContent: `
        <p>¿Estás seguro de convertir este referido?</p>
        <p><strong>Plan:</strong> ${plan.nombre_plan}</p>
        <p><strong>Valor:</strong> $${plan.precio_actual.toLocaleString('es-CO')}</p>
        <p><strong>Comisión para referente:</strong> $${this.calcularComision().toLocaleString('es-CO')}</p>
        <p><strong>Puntos:</strong> ${plan.puntos_otorgados}</p>
      `,
      nzOkText: 'Sí, convertir',
      nzOkType: 'primary',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.ejecutarConversion();
      },
    });
  }

  /**
   * Ejecutar conversión
   */
  ejecutarConversion() {
    if (!this.referido) return;

    this.convirtiendo = true;

    this.asesorService
      .convertirReferido(this.referido.id_referido, this.conversionForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.message.success('¡Referido convertido exitosamente!');

          // Mostrar modal de éxito con detalles
          this.modal.success({
            nzTitle: '¡Conversión exitosa!',
            nzContent: `
              <p><strong>Referido:</strong> ${this.referido?.nombre_referido} ${this.referido?.apellido_referido}</p>
              <p><strong>Plan:</strong> ${response.referido.plan?.nombre_plan}</p>
              <p><strong>Comisión generada:</strong> $${response.comision.monto_comision.toLocaleString('es-CO')}</p>
              <p><strong>Puntos otorgados:</strong> ${response.comision.puntos_otorgados}</p>
            `,
            nzOnOk: () => {
              this.volver();
            },
          });

          this.convirtiendo = false;
        },
        error: (error) => {
          console.error('Error al convertir referido:', error);
          this.message.error(error.error?.message || 'Error al convertir referido');
          this.convirtiendo = false;
        },
      });
  }

  /**
   * Registrar primer contacto
   */
  registrarContacto() {
    if (!this.referido) return;

    if (this.referido.estado_referido !== 'pendiente') {
      this.message.info('El referido ya fue contactado');
      return;
    }

    this.modal.confirm({
      nzTitle: 'Registrar primer contacto',
      nzContent: '¿Confirmas que realizaste el primer contacto con este referido?',
      nzOkText: 'Sí, registrar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.ejecutarRegistroContacto();
      },
    });
  }

  /**
   * Ejecutar registro de contacto
   */
  ejecutarRegistroContacto() {
    if (!this.referido) return;

    this.guardando = true;

    this.asesorService
      .registrarContacto(this.referido.id_referido, {
        observaciones: 'Primer contacto realizado',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.message.success('Contacto registrado exitosamente');
          this.referido = response.referido;
          this.estadoForm.patchValue({
            estado_referido: this.referido.estado_referido,
          });
          this.guardando = false;
        },
        error: (error) => {
          console.error('Error al registrar contacto:', error);
          this.message.error('Error al registrar contacto');
          this.guardando = false;
        },
      });
  }

  /**
   * Cambio de plan seleccionado
   */
  onPlanChange() {
    const planId = this.conversionForm.get('id_plan_adquirido')?.value;
    this.planSeleccionado = this.planes.find((p) => p.id_plan === planId) || null;
  }

  /**
   * Calcular comisión del plan
   */
  calcularComision(): number {
    if (!this.planSeleccionado) return 0;
    return (
      (this.planSeleccionado.precio_actual *
        this.planSeleccionado.porcentaje_comision_base) /
      100
    );
  }

  /**
   * Marcar formulario como tocado
   */
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsDirty();
      control?.updateValueAndValidity({ onlySelf: true });
    });
  }

  /**
   * Cancelar y volver
   */
  cancelar() {
    if (
      this.datosForm.dirty ||
      this.estadoForm.dirty ||
      this.conversionForm.dirty
    ) {
      this.modal.confirm({
        nzTitle: '¿Descartar cambios?',
        nzContent: 'Tienes cambios sin guardar. ¿Estás seguro de salir?',
        nzOkText: 'Sí, salir',
        nzOkDanger: true,
        nzCancelText: 'Cancelar',
        nzOnOk: () => this.volver(),
      });
    } else {
      this.volver();
    }
  }

  /**
   * Volver a lista
   */
  volver() {
    this.router.navigate(['/asesor/referidos']);
  }

  /**
   * Obtener color del estado
   */
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

  /**
   * Obtener texto del estado
   */
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

  /**
   * Formatear fecha
   */
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Formatear fecha y hora
   */
  formatearFechaHora(fecha: string): string {
    return new Date(fecha).toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Llamar referido
   */
  llamarReferido() {
    if (this.referido?.telefono_referido) {
      window.location.href = `tel:${this.referido.telefono_referido}`;
    }
  }

  /**
   * Enviar email
   */
  enviarEmail() {
    if (this.referido?.correo_referido) {
      window.location.href = `mailto:${this.referido.correo_referido}`;
    }
  }

  /**
   * Puede convertir
   */
  get puedeConvertir(): boolean {
    return this.referido?.estado_referido !== 'activo';
  }

  /**
   * Puede registrar contacto
   */
  get puedeRegistrarContacto(): boolean {
    return this.referido?.estado_referido === 'pendiente';
  }

  /**
   * Nombre completo del referido
   */
  get nombreCompletoReferido(): string {
    if (!this.referido) return '';
    return `${this.referido.nombre_referido} ${this.referido.apellido_referido}`;
  }

  /**
   * Nombre del referente
   */
  get nombreReferente(): string {
    if (!this.referido?.referente) return 'N/A';
    return `${this.referido.referente.usuario.nombre} ${this.referido.referente.usuario.apellido}`;
  }
}
