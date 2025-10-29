import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal'; // Añadir esta importación
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

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
  referenteNombre: string;
  plan?: string;
  valorPlan?: number;
}

interface Plan {
  id: string;
  nombre: string;
  valor: number;
  comisionPorcentaje: number;
  puntos: number;
}

interface Historial {
  fecha: Date;
  tipo: string;
  descripcion: string;
  usuario: string;
  color: string;
}

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
    NzDatePickerModule,
    NzAlertModule,
    NzDividerModule,
    NzTimelineModule,
    NzSpinModule,
    NzModalModule  // Añadir esta línea
  ],
  templateUrl: './actualizar-referido.component.html',
  styleUrl: './actualizar-referido.component.css'
})
export class ActualizarReferidoComponent implements OnInit {
  referido: Referido | null = null;
  actualizarForm!: FormGroup;
  guardando = false;
  planSeleccionado: Plan | null = null;

  planes: Plan[] = [
    {
      id: 'basico',
      nombre: 'Plan Básico',
      valor: 80000,
      comisionPorcentaje: 10,
      puntos: 100
    },
    {
      id: 'profesional',
      nombre: 'Plan Profesional',
      valor: 150000,
      comisionPorcentaje: 12,
      puntos: 150
    },
    {
      id: 'empresarial',
      nombre: 'Plan Empresarial',
      valor: 300000,
      comisionPorcentaje: 15,
      puntos: 200
    }
  ];

  historial: Historial[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarReferido();
    this.cargarHistorial();
  }

  initForm() {
    this.actualizarForm = this.fb.group({
      estado: ['', Validators.required],
      fechaContacto: [null],
      plan: [''],
      observaciones: ['']
    });
  }

  cargarReferido() {
    const id = this.route.snapshot.paramMap.get('id');

    // Simulación - aquí iría la llamada al servicio
    setTimeout(() => {
      this.referido = {
        id: id || 'REF-001',
        nombre: 'Juan Pérez García',
        correo: 'juan.perez@email.com',
        telefono: '3001234567',
        tipoDoc: 'CC',
        documento: '12345678',
        estado: 'contactado',
        fechaRegistro: new Date('2024-01-15'),
        fechaContacto: new Date('2024-01-16'),
        referenteCodigo: 'REF-2024-001',
        referenteNombre: 'María González'
      };

      // Cargar valores actuales en el formulario
      this.actualizarForm.patchValue({
        estado: this.referido.estado,
        fechaContacto: this.referido.fechaContacto
      });
    }, 500);
  }

  cargarHistorial() {
    // Simulación de historial
    this.historial = [
      {
        fecha: new Date('2024-01-16T10:30:00'),
        tipo: 'Contacto',
        descripcion: 'Se realizó el primer contacto con el referido. Mostró interés en el plan profesional.',
        usuario: 'Carlos Ramírez (Asesor)',
        color: 'blue'
      },
      {
        fecha: new Date('2024-01-15T14:20:00'),
        tipo: 'Registro',
        descripcion: 'Referido registrado en el sistema.',
        usuario: 'María González (Referente)',
        color: 'green'
      }
    ];
  }

  onEstadoChange() {
    const estado = this.actualizarForm.get('estado')?.value;

    // Si cambia a contactado, activo o rechazado, establecer fecha de contacto si no existe
    if (['contactado', 'activo', 'rechazado'].includes(estado)) {
      if (!this.actualizarForm.get('fechaContacto')?.value) {
        this.actualizarForm.patchValue({
          fechaContacto: new Date()
        });
      }
    }

    // Si es activo, hacer el plan requerido
    if (estado === 'activo') {
      this.actualizarForm.get('plan')?.setValidators(Validators.required);
    } else {
      this.actualizarForm.get('plan')?.clearValidators();
      this.actualizarForm.patchValue({ plan: '' });
      this.planSeleccionado = null;
    }
    this.actualizarForm.get('plan')?.updateValueAndValidity();
  }

  onPlanChange() {
    const planId = this.actualizarForm.get('plan')?.value;
    this.planSeleccionado = this.planes.find(p => p.id === planId) || null;
  }

  mostrarFechaContacto(): boolean {
    const estado = this.actualizarForm.get('estado')?.value;
    return ['contactado', 'activo', 'rechazado'].includes(estado);
  }

  mostrarSeleccionPlan(): boolean {
    return this.actualizarForm.get('estado')?.value === 'activo';
  }

  calcularComision(): number {
    if (!this.planSeleccionado) return 0;
    return (this.planSeleccionado.valor * this.planSeleccionado.comisionPorcentaje) / 100;
  }

  guardarCambios() {
    if (!this.actualizarForm.valid) {
      Object.values(this.actualizarForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const cambios = this.actualizarForm.value;
    const estadoAnterior = this.referido?.estado;
    const estadoNuevo = cambios.estado;

    this.modal.confirm({
      nzTitle: '¿Confirmar cambios?',
      nzContent: `¿Estás seguro de actualizar el estado de ${this.referido?.nombre} de "${this.getEstadoTexto(estadoAnterior!)}" a "${this.getEstadoTexto(estadoNuevo)}"?`,
      nzOkText: 'Sí, guardar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.guardando = true;

        // Simulación de guardado
        setTimeout(() => {
          this.message.success('Referido actualizado correctamente');
          this.guardando = false;
          this.router.navigate(['/asesor/referidos']);
        }, 1500);
      }
    });
  }

  cancelar() {
    if (this.actualizarForm.dirty) {
      this.modal.confirm({
        nzTitle: '¿Descartar cambios?',
        nzContent: 'Tienes cambios sin guardar. ¿Estás seguro de salir?',
        nzOkText: 'Sí, salir',
        nzOkDanger: true,
        nzCancelText: 'Cancelar',
        nzOnOk: () => this.volver()
      });
    } else {
      this.volver();
    }
  }

  volver() {
    this.router.navigate(['/asesor/referidos']);
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
      month: 'long',
      year: 'numeric'
    });
  }

  formatearFechaHora(fecha: Date): string {
    return fecha.toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
