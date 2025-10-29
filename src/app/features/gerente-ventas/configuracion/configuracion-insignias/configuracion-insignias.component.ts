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
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

interface Insignia {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  rareza: string;
  criterios: string[];
  recompensa: string;
  activa: boolean;
  destacada: boolean;
  usuariosObtenidos: number;
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
    NzTabsModule
  ],
  templateUrl: './configuracion-insignias.component.html',
  styleUrl: './configuracion-insignias.component.css'
})
export class ConfiguracionInsigniasComponent implements OnInit {
  insignias: Insignia[] = [];
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
    { label: 'Bandera', value: 'flag' }
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarInsignias();
  }

  initForm() {
  this.insigniaForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    icono: ['star'],
    color: ['#4A90E2'],
    rareza: ['Común'],
    descripcionRecompensa: [''],
    destacada: [false]
  });
}

  cargarInsignias() {
    this.loading = true;

    setTimeout(() => {
      this.insignias = [
        {
          id: '1',
          nombre: 'Primer Referido',
          descripcion: 'Registra tu primer referido en el sistema',
          icono: 'star',
          color: '#52c41a',
          rareza: 'Común',
          criterios: ['Registrar al menos 1 referido'],
          recompensa: '50 puntos extra',
          activa: true,
          destacada: false,
          usuariosObtenidos: 24
        },
        {
          id: '2',
          nombre: 'Vendedor del Mes',
          descripcion: 'El referente con más conversiones del mes',
          icono: 'trophy',
          color: '#FFD700',
          rareza: 'Épica',
          criterios: [
            'Ser el referente con más conversiones del mes',
            'Mínimo 5 conversiones en el mes'
          ],
          recompensa: 'Bono de $100,000 + 200 puntos',
          activa: true,
          destacada: true,
          usuariosObtenidos: 3
        },
        {
          id: '3',
          nombre: 'Racha de Oro',
          descripcion: 'Mantén 3 meses consecutivos con al menos 5 referidos activos',
          icono: 'fire',
          color: '#ff4d4f',
          rareza: 'Rara',
          criterios: [
            '3 meses consecutivos',
            'Mínimo 5 referidos activos cada mes'
          ],
          recompensa: '+3% permanente en comisiones',
          activa: true,
          destacada: true,
          usuariosObtenidos: 8
        },
        {
          id: '4',
          nombre: 'Nivel Platino',
          descripcion: 'Alcanza el nivel Platino',
          icono: 'crown',
          color: '#E5E4E2',
          rareza: 'Legendaria',
          criterios: ['Alcanzar nivel Platino', 'Mantener el nivel por 1 mes'],
          recompensa: 'Acceso a programa VIP + 500 puntos',
          activa: true,
          destacada: true,
          usuariosObtenidos: 2
        },
        {
          id: '5',
          nombre: 'Conversión Perfecta',
          descripcion: 'Logra una tasa de conversión del 100%',
          icono: 'thunderbolt',
          color: '#722ed1',
          rareza: 'Épica',
          criterios: [
            'Convertir el 100% de tus referidos',
            'Mínimo 10 referidos registrados'
          ],
          recompensa: 'Bono de $200,000',
          activa: true,
          destacada: false,
          usuariosObtenidos: 1
        },
        {
          id: '6',
          nombre: 'Embajador',
          descripcion: 'Supera los 50 referidos activos',
          icono: 'rocket',
          color: '#1890ff',
          rareza: 'Rara',
          criterios: ['50 referidos activos simultáneamente'],
          recompensa: 'Título de Embajador + beneficios exclusivos',
          activa: true,
          destacada: true,
          usuariosObtenidos: 5
        }
      ];

      this.loading = false;
    }, 1000);
  }

  mostrarModalCrear() {
    this.modoEdicion = false;
    this.insigniaSeleccionada = null;
    this.criteriosTemp = [];
    this.insigniaForm.reset({
      icono: 'star',
      color: '#4A90E2',
      rareza: 'Común',
      tipoCriterio: 'referidos',
      tipoRecompensa: 'ninguna',
      destacada: false,
      cantidadReferidos: 0,
      cantidadConversiones: 0,
      montoComisiones: 0,
      puntosExtra: 0,
      porcentajeBono: 0,
      montoRecompensa: 0
    });
    this.modalVisible = true;
  }

  editarInsignia(insignia: Insignia) {
    this.modoEdicion = true;
    this.insigniaSeleccionada = insignia;
    this.criteriosTemp = [...insignia.criterios];
    this.insigniaForm.patchValue({
      nombre: insignia.nombre,
      descripcion: insignia.descripcion,
      icono: insignia.icono,
      color: insignia.color,
      rareza: insignia.rareza,
      destacada: insignia.destacada
    });
    this.modalVisible = true;
  }

  agregarCriterio() {
    if (this.nuevoCriterio.trim()) {
      this.criteriosTemp.push(this.nuevoCriterio.trim());
      this.nuevoCriterio = '';
    }
  }

  eliminarCriterio(index: number) {
    this.criteriosTemp.splice(index, 1);
  }

  guardarInsignia() {
    if (!this.insigniaForm.valid) {
      Object.values(this.insigniaForm.controls).forEach(control => {
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

    setTimeout(() => {
      const datosInsignia = {
        ...this.insigniaForm.value,
        criterios: this.criteriosTemp,
        recompensa: this.generarTextoRecompensa()
      };

      if (this.modoEdicion && this.insigniaSeleccionada) {
        const index = this.insignias.findIndex(i => i.id === this.insigniaSeleccionada!.id);
        this.insignias[index] = {
          ...this.insigniaSeleccionada,
          ...datosInsignia
        };
        this.message.success('Insignia actualizada correctamente');
      } else {
        const nuevaInsignia: Insignia = {
          id: Date.now().toString(),
          ...datosInsignia,
          activa: true,
          usuariosObtenidos: 0
        };
        this.insignias.push(nuevaInsignia);
        this.message.success('Insignia creada correctamente');
      }

      this.guardando = false;
      this.cerrarModal();
    }, 1000);
  }

  generarTextoRecompensa(): string {
  const form = this.insigniaForm.value;
  return form.descripcionRecompensa || 'Reconocimiento especial';
}

  cambiarEstadoInsignia(insignia: Insignia) {
    const estado = insignia.activa ? 'activada' : 'desactivada';
    this.message.success(`Insignia ${estado} correctamente`);
  }

  verDetalles(insignia: Insignia) {
    this.modal.info({
      nzTitle: insignia.nombre,
      nzContent: `
        <div style="padding: 16px 0;">
          <p><strong>Descripción:</strong> ${insignia.descripcion}</p>
          <p><strong>Rareza:</strong> ${insignia.rareza}</p>
          <p><strong>Usuarios que la tienen:</strong> ${insignia.usuariosObtenidos}</p>
          <p><strong>Recompensa:</strong> ${insignia.recompensa}</p>
        </div>
      `,
      nzOkText: 'Cerrar'
    });
  }

  eliminarInsignia(insignia: Insignia) {
    this.modal.confirm({
      nzTitle: '¿Eliminar insignia?',
      nzContent: `¿Estás seguro de eliminar la insignia "${insignia.nombre}"? Los usuarios que ya la tienen la conservarán, pero no se otorgará a nuevos usuarios.`,
      nzOkText: 'Sí, eliminar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.insignias = this.insignias.filter(i => i.id !== insignia.id);
        this.message.success('Insignia eliminada correctamente');
      }
    });
  }

  cerrarModal() {
    this.modalVisible = false;
    this.insigniaSeleccionada = null;
    this.criteriosTemp = [];
    this.insigniaForm.reset();
  }

  getRarezaColor(rareza: string): string {
    const colores: { [key: string]: string } = {
      'Común': 'default',
      'Poco Común': 'green',
      'Rara': 'blue',
      'Épica': 'purple',
      'Legendaria': 'gold'
    };
    return colores[rareza] || 'default';
  }

  formatterCurrency = (value: number): string => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  parserCurrency = (value: string): number => {
    const parsed = value.replace(/\$\s?|(,*)/g, '');
    return isNaN(Number(parsed)) ? 0 : Number(parsed);
  };

  formatterPercent = (value: number): string => `${value}%`;
  parserPercent = (value: string): number => {
    const parsed = value.replace('%', '');
    return isNaN(Number(parsed)) ? 0 : Number(parsed);
  };
}
