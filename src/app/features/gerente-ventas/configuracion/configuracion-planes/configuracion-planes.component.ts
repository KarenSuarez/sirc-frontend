import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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

interface Plan {
  id: string;
  nombre: string;
  descripcion: string;
  valor: number;
  comisionPorcentaje: number;
  puntos: number;
  icono: string;
  color: string;
  activo: boolean;
}

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
    NzAlertModule
  ],
  templateUrl: './configuracion-planes.component.html',
  styleUrl: './configuracion-planes.component.css'
})
export class ConfiguracionPlanesComponent implements OnInit {
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
    { label: 'Diamante', value: 'skin' }
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarPlanes();
  }

  initForm() {
    this.planForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      valor: [0, [Validators.required, Validators.min(1)]],
      comisionPorcentaje: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      puntos: [0, [Validators.required, Validators.min(0)]],
      icono: ['star'],
      color: ['#4A90E2']
    });
  }

  cargarPlanes() {
    this.loading = true;

    // Simulación de datos
    setTimeout(() => {
      this.planes = [
        {
          id: '1',
          nombre: 'Plan Básico',
          descripcion: 'Perfecto para emprendedores y pequeños negocios',
          valor: 80000,
          comisionPorcentaje: 10,
          puntos: 100,
          icono: 'star',
          color: '#52c41a',
          activo: true
        },
        {
          id: '2',
          nombre: 'Plan Profesional',
          descripcion: 'Ideal para empresas en crecimiento',
          valor: 150000,
          comisionPorcentaje: 12,
          puntos: 150,
          icono: 'trophy',
          color: '#1890ff',
          activo: true
        },
        {
          id: '3',
          nombre: 'Plan Empresarial',
          descripcion: 'Solución completa para grandes empresas',
          valor: 300000,
          comisionPorcentaje: 15,
          puntos: 200,
          icono: 'crown',
          color: '#722ed1',
          activo: true
        }
      ];

      this.planesFiltrados = [...this.planes];
      this.loading = false;
    }, 1000);
  }

  filtrarPlanes() {
    if (!this.searchText) {
      this.planesFiltrados = [...this.planes];
      return;
    }

    const search = this.searchText.toLowerCase();
    this.planesFiltrados = this.planes.filter(plan =>
      plan.nombre.toLowerCase().includes(search) ||
      plan.descripcion.toLowerCase().includes(search)
    );
  }

  mostrarModalCrear() {
    this.modoEdicion = false;
    this.planSeleccionado = null;
    this.planForm.reset({
      icono: 'star',
      color: '#4A90E2',
      valor: 0,
      comisionPorcentaje: 0,
      puntos: 0
    });
    this.modalVisible = true;
  }

  editarPlan(plan: Plan) {
    this.modoEdicion = true;
    this.planSeleccionado = plan;
    this.planForm.patchValue(plan);
    this.modalVisible = true;
  }

  guardarPlan() {
    if (!this.planForm.valid) {
      Object.values(this.planForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.guardando = true;

    setTimeout(() => {
      if (this.modoEdicion && this.planSeleccionado) {
        // Actualizar plan existente
        const index = this.planes.findIndex(p => p.id === this.planSeleccionado!.id);
        this.planes[index] = {
          ...this.planSeleccionado,
          ...this.planForm.value
        };
        this.message.success('Plan actualizado correctamente');
      } else {
        // Crear nuevo plan
        const nuevoPlan: Plan = {
          id: Date.now().toString(),
          ...this.planForm.value,
          activo: true
        };
        this.planes.push(nuevoPlan);
        this.message.success('Plan creado correctamente');
      }

      this.filtrarPlanes();
      this.guardando = false;
      this.cerrarModal();
    }, 1000);
  }

  cambiarEstadoPlan(plan: Plan) {
    const estado = plan.activo ? 'activado' : 'desactivado';
    this.message.success(`Plan ${estado} correctamente`);
  }

  eliminarPlan(plan: Plan) {
    this.modal.confirm({
      nzTitle: '¿Eliminar plan?',
      nzContent: `¿Estás seguro de eliminar el plan "${plan.nombre}"? Esta acción no se puede deshacer.`,
      nzOkText: 'Sí, eliminar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.planes = this.planes.filter(p => p.id !== plan.id);
        this.filtrarPlanes();
        this.message.success('Plan eliminado correctamente');
      }
    });
  }

  cerrarModal() {
    this.modalVisible = false;
    this.planSeleccionado = null;
    this.planForm.reset();
  }

  calcularComision(valor: number, porcentaje: number): number {
    return (valor * porcentaje) / 100;
  }

  // Formatters y parsers para currency
  formatterCurrency = (value: number): string => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  parserCurrency = (value: string): number => {
    const parsed = value.replace(/\$\s?|(,*)/g, '');
    return isNaN(Number(parsed)) ? 0 : Number(parsed);
  };

  // Formatters y parsers para percentage
  formatterPercent = (value: number): string => `${value}%`;
  parserPercent = (value: string): number => {
    const parsed = value.replace('%', '');
    return isNaN(Number(parsed)) ? 0 : Number(parsed);
  };
}
