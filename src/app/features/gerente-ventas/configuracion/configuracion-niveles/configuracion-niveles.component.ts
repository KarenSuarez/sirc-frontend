import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

interface Nivel {
  id: string;
  nombre: string;
  descripcion: string;
  orden: number;
  puntosMinimos: number;
  bonificacionExtra: number;
  icono: string;
  color: string;
  beneficios: string[];
}

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
    NzTagModule
  ],
  templateUrl: './configuracion-niveles.component.html',
  styleUrl: './configuracion-niveles.component.css'
})
export class ConfiguracionNivelesComponent implements OnInit {
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
    { label: 'Diamante', value: 'skin' }
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarNiveles();
  }

  initForm() {
    this.nivelForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      orden: [1, [Validators.required, Validators.min(1)]],
      puntosMinimos: [0, [Validators.required, Validators.min(0)]],
      bonificacionExtra: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      icono: ['trophy'],
      color: ['#FFD700']
    });
  }

  cargarNiveles() {
    this.loading = true;

    setTimeout(() => {
      this.niveles = [
        {
          id: '1',
          nombre: 'Bronce',
          descripcion: 'Nivel inicial para nuevos referentes',
          orden: 1,
          puntosMinimos: 0,
          bonificacionExtra: 0,
          icono: 'star',
          color: '#CD7F32',
          beneficios: ['Acceso al sistema', 'Comisiones estándar']
        },
        {
          id: '2',
          nombre: 'Plata',
          descripcion: 'Para referentes en crecimiento',
          orden: 2,
          puntosMinimos: 200,
          bonificacionExtra: 2,
          icono: 'trophy',
          color: '#C0C0C0',
          beneficios: ['+2% en comisiones', 'Soporte prioritario', 'Reportes mensuales']
        },
        {
          id: '3',
          nombre: 'Oro',
          descripcion: 'Para referentes destacados',
          orden: 3,
          puntosMinimos: 500,
          bonificacionExtra: 5,
          icono: 'crown',
          color: '#FFD700',
          beneficios: ['+5% en comisiones', 'Asesor dedicado', 'Acceso a eventos exclusivos']
        },
        {
          id: '4',
          nombre: 'Platino',
          descripcion: 'Nivel élite de referentes',
          orden: 4,
          puntosMinimos: 1000,
          bonificacionExtra: 8,
          icono: 'fire',
          color: '#E5E4E2',
          beneficios: ['+8% en comisiones', 'Capacitaciones exclusivas', 'Bonos especiales', 'Reconocimiento público']
        }
      ].sort((a, b) => a.orden - b.orden);

      this.loading = false;
    }, 1000);
  }

  mostrarModalCrear() {
    this.modoEdicion = false;
    this.nivelSeleccionado = null;
    this.beneficiosTemp = [];
    this.nivelForm.reset({
      icono: 'trophy',
      color: '#FFD700',
      orden: this.niveles.length + 1,
      puntosMinimos: 0,
      bonificacionExtra: 0
    });
    this.modalVisible = true;
  }

  editarNivel(nivel: Nivel) {
    this.modoEdicion = true;
    this.nivelSeleccionado = nivel;
    this.beneficiosTemp = [...nivel.beneficios];
    this.nivelForm.patchValue(nivel);
    this.modalVisible = true;
  }

  agregarBeneficio() {
    if (this.nuevoBeneficio.trim()) {
      this.beneficiosTemp.push(this.nuevoBeneficio.trim());
      this.nuevoBeneficio = '';
    }
  }

  eliminarBeneficio(index: number) {
    this.beneficiosTemp.splice(index, 1);
  }

  guardarNivel() {
    if (!this.nivelForm.valid) {
      Object.values(this.nivelForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.guardando = true;

    setTimeout(() => {
      const datosNivel = {
        ...this.nivelForm.value,
        beneficios: this.beneficiosTemp
      };

      if (this.modoEdicion && this.nivelSeleccionado) {
        const index = this.niveles.findIndex(n => n.id === this.nivelSeleccionado!.id);
        this.niveles[index] = {
          ...this.nivelSeleccionado,
          ...datosNivel
        };
        this.message.success('Nivel actualizado correctamente');
      } else {
        const nuevoNivel: Nivel = {
          id: Date.now().toString(),
          ...datosNivel
        };
        this.niveles.push(nuevoNivel);
        this.message.success('Nivel creado correctamente');
      }

      this.niveles.sort((a, b) => a.orden - b.orden);
      this.guardando = false;
      this.cerrarModal();
    }, 1000);
  }

  eliminarNivel(nivel: Nivel) {
    this.modal.confirm({
      nzTitle: '¿Eliminar nivel?',
      nzContent: `¿Estás seguro de eliminar el nivel "${nivel.nombre}"? Los referentes en este nivel permanecerán sin cambios hasta que alcancen otro nivel.`,
      nzOkText: 'Sí, eliminar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.niveles = this.niveles.filter(n => n.id !== nivel.id);
        this.message.success('Nivel eliminado correctamente');
      }
    });
  }

  cerrarModal() {
    this.modalVisible = false;
    this.nivelSeleccionado = null;
    this.beneficiosTemp = [];
    this.nivelForm.reset();
  }

  formatterPercent = (value: number): string => `${value}%`;
  parserPercent = (value: string): number => {
    const parsed = value.replace('%', '');
    return isNaN(Number(parsed)) ? 0 : Number(parsed);
  };
}
