import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/servicios/usuario.service';
import { Usuario } from '../../../core/modelos/usuario.interface';
import { NzAlertModule } from 'ng-zorro-antd/alert';

interface Recompensa {
  id: string;
  fecha: string;
  referidoNombre: string;
  plan: string;
  monto: number;
  estado: 'pendiente' | 'pagado' | 'procesando';
}

interface SolicitudRetiro {
  id: string;
  fecha: string;
  monto: number;
  metodo: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

@Component({
  selector: 'app-monetarias',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzCardModule,
    NzStatisticModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    NzTagModule,
    NzModalModule,
    NzInputModule,
    NzSelectModule,
    NzFormModule,
    NzAlertModule
  ],
  templateUrl: './monetarias.component.html',
  styleUrls: ['./monetarias.component.css']
})
export class MonetariasComponent implements OnInit {
  usuario: Usuario | null = null;

  // Datos mock de recompensas
  recompensas: Recompensa[] = [
    { id: '1', fecha: '2025-01-10', referidoNombre: 'Carlos Pérez', plan: 'Plan Pro', monto: 49000, estado: 'pagado' },
    { id: '2', fecha: '2025-01-15', referidoNombre: 'Ana López', plan: 'Plan Basic', monto: 29000, estado: 'pendiente' },
    { id: '3', fecha: '2025-01-20', referidoNombre: 'Miguel Torres', plan: 'Plan Plus', monto: 88000, estado: 'procesando' },
  ];

  // Datos mock de solicitudes de retiro
  solicitudesRetiro: SolicitudRetiro[] = [
    { id: '1', fecha: '2025-01-05', monto: 150000, metodo: 'Transferencia Bancaria', estado: 'aprobado' },
    { id: '2', fecha: '2025-01-18', monto: 80000, metodo: 'Bono de descuento', estado: 'pendiente' },
  ];

  retiroForm: FormGroup;
  isModalVisible = false;

  constructor(
    private usuarioService: UsuarioService,
    private modal: NzModalService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {
    this.retiroForm = this.fb.group({
      monto: ['', [Validators.required, Validators.min(50000)]],
      metodo: ['transferencia', [Validators.required]],
      numeroCuenta: [''],
      banco: ['']
    });
  }

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuarioActual();
  }

  get saldoDisponible(): number {
    return this.usuario?.creditos || 0;
  }

  get totalPendiente(): number {
    return this.recompensas
      .filter(r => r.estado === 'pendiente' || r.estado === 'procesando')
      .reduce((sum, r) => sum + r.monto, 0);
  }

  get totalPagado(): number {
    return this.recompensas
      .filter(r => r.estado === 'pagado')
      .reduce((sum, r) => sum + r.monto, 0);
  }

  showRetiroModal() {
    if (this.saldoDisponible < 50000) {
      this.message.warning('Debes tener al menos $50.000 para solicitar un retiro');
      return;
    }
    this.isModalVisible = true;
  }

  handleCancel() {
    this.isModalVisible = false;
    this.retiroForm.reset({ metodo: 'transferencia' });
  }

  handleOk() {
    if (this.retiroForm.valid) {
      const formValue = this.retiroForm.value;

      if (formValue.monto > this.saldoDisponible) {
        this.message.error('El monto excede tu saldo disponible');
        return;
      }

      // Simular solicitud de retiro
      this.message.success('Solicitud de retiro enviada exitosamente');
      this.isModalVisible = false;
      this.retiroForm.reset({ metodo: 'transferencia' });

      // Agregar a la lista de solicitudes (mock)
      const nuevaSolicitud: SolicitudRetiro = {
        id: (this.solicitudesRetiro.length + 1).toString(),
        fecha: new Date().toISOString().split('T')[0],
        monto: formValue.monto,
        metodo: formValue.metodo === 'transferencia' ? 'Transferencia Bancaria' : 'Bono de descuento',
        estado: 'pendiente'
      };

      this.solicitudesRetiro = [nuevaSolicitud, ...this.solicitudesRetiro];
    } else {
      this.message.warning('Por favor complete todos los campos requeridos');
    }
  }

  getEstadoColor(estado: string): string {
    const colores: any = {
      'pendiente': 'orange',
      'pagado': 'green',
      'procesando': 'blue',
      'aprobado': 'green',
      'rechazado': 'red'
    };
    return colores[estado] || 'default';
  }

  onMetodoChange(value: string) {
    if (value === 'transferencia') {
      this.retiroForm.get('numeroCuenta')?.setValidators([Validators.required]);
      this.retiroForm.get('banco')?.setValidators([Validators.required]);
    } else {
      this.retiroForm.get('numeroCuenta')?.clearValidators();
      this.retiroForm.get('banco')?.clearValidators();
    }
    this.retiroForm.get('numeroCuenta')?.updateValueAndValidity();
    this.retiroForm.get('banco')?.updateValueAndValidity();
  }
}
