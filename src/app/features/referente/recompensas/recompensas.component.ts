import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioHelperService } from '../../../core/services/usuario-helper.service';
import { ComisionService } from '../../../core/services/comision.service';
import { RetiroService } from '../../../core/services/retiro.service';
import { UsuarioAutenticado } from '../../../core/models/usuario.interface';
import { Comision } from '../../../core/models/comision.interface';
import { SolicitudRetiro } from '../../../core/models/retiro.interface';

@Component({
  selector: 'app-recompensas',
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
    NzAlertModule,
    NzSpinModule,
    NzEmptyModule,
    NzDividerModule,
  ],
  templateUrl: './recompensas.component.html',
  styleUrl: './recompensas.component.css',
})
export class RecompensasComponent implements OnInit, OnDestroy {
  usuario: UsuarioAutenticado | null = null;
  saldoDisponible = 0;
  comisiones: Comision[] = [];
  solicitudesRetiro: SolicitudRetiro[] = [];
  cargando = true;

  retiroForm: FormGroup;
  isModalVisible = false;
  procesandoRetiro = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private usuarioHelper: UsuarioHelperService,
    private comisionService: ComisionService,
    private retiroService: RetiroService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {
    this.retiroForm = this.createRetiroForm();
  }

  ngOnInit() {
    this.usuario = this.authService.usuario();
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createRetiroForm(): FormGroup {
    return this.fb.group({
      monto_solicitado: ['', [Validators.required, Validators.min(50000)]],
      metodo_retiro: ['retiro', [Validators.required]],
      cuenta_destino: [''],
      banco_destino: [''],
    });
  }

  cargarDatos() {
    this.cargando = true;
    this.cargarSaldo();
    this.cargarComisiones();
    this.cargarSolicitudes();
  }

  cargarSaldo() {
    this.usuarioHelper
      .obtenerSaldoDisponible()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (saldo) => {
          this.saldoDisponible = saldo;
        },
        error: (error) => {
          console.error('Error al cargar saldo:', error);
          this.saldoDisponible = 0;
        },
      });
  }

  cargarComisiones() {
    this.comisionService
      .listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comisiones) => {
          this.comisiones = comisiones;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar comisiones:', error);
          this.comisiones = [];
          this.cargando = false;
        },
      });
  }

  cargarSolicitudes() {
    this.retiroService
      .listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (solicitudes) => {
          this.solicitudesRetiro = solicitudes;
        },
        error: (error) => {
          console.error('Error al cargar solicitudes:', error);
          this.solicitudesRetiro = [];
        },
      });
  }

  get recompensas() {
    return this.comisiones.map((c) => ({
      fecha: new Date(c.fecha_movimiento).toLocaleDateString('es-CO'),
      referidoNombre: c.referido
        ? `${c.referido.nombre_referido} ${c.referido.apellido_referido}`
        : 'N/A',
      plan: c.referido?.plan?.nombre_plan || 'N/A',
      monto: c.monto_comision,
      estado: c.estado_comision,
    }));
  }

  get totalPendiente(): number {
    return this.comisiones
      .filter((c) => c.estado_comision === 'pendiente')
      .reduce((sum, c) => sum + c.monto_comision, 0);
  }

  get totalPagado(): number {
    return this.comisiones
      .filter((c) => c.estado_comision === 'pagada')
      .reduce((sum, c) => sum + c.monto_comision, 0);
  }

  showRetiroModal() {
    if (this.saldoDisponible < 50000) {
      this.message.warning(
        'Debes tener al menos $50.000 para solicitar un retiro'
      );
      return;
    }
    this.isModalVisible = true;
    this.retiroForm.reset({ metodo_retiro: 'retiro' });
  }

  handleCancel() {
    this.isModalVisible = false;
    this.retiroForm.reset({ metodo_retiro: 'retiro' });
  }

  handleOk() {
    if (!this.retiroForm.valid) {
      this.markFormGroupTouched();
      this.message.warning('Por favor complete todos los campos requeridos');
      return;
    }

    const formValue = this.retiroForm.value;

    if (formValue.monto_solicitado > this.saldoDisponible) {
      this.message.error('El monto excede tu saldo disponible');
      return;
    }

    this.procesandoRetiro = true;

    const solicitudData = {
      metodo_retiro: formValue.metodo_retiro,
      monto_solicitado: Number(formValue.monto_solicitado),
      cuenta_destino: formValue.cuenta_destino || undefined,
      banco_destino: formValue.banco_destino || undefined,
    };

    this.retiroService
      .crear(solicitudData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.procesandoRetiro = false;
          this.message.success('¡Solicitud de retiro creada exitosamente!');
          this.isModalVisible = false;
          this.retiroForm.reset({ metodo_retiro: 'retiro' });

          this.cargarSaldo();
          this.cargarSolicitudes();
        },
        error: (error) => {
          this.procesandoRetiro = false;
          console.error('Error al crear solicitud:', error);

          let mensaje = 'Error al crear solicitud de retiro';
          if (error.status === 400) {
            mensaje =
              error.error?.message || 'Saldo insuficiente o datos inválidos';
          }

          this.message.error(mensaje);
        },
      });
  }

  getEstadoColor(estado: string): string {
    const colores: Record<string, string> = {
      pendiente: 'orange',
      pagada: 'green',
      cancelada: 'red',
      aprobada: 'green',
      rechazada: 'red',
      procesada: 'blue',
      en_revision: 'cyan',
    };
    return colores[estado] || 'default';
  }

  getEstadoTexto(estado: string): string {
    const textos: Record<string, string> = {
      pendiente: 'Pendiente',
      pagada: 'Pagada',
      cancelada: 'Cancelada',
      aprobada: 'Aprobada',
      rechazada: 'Rechazada',
      procesada: 'Procesada',
      en_revision: 'En Revisión',
    };
    return textos[estado] || estado;
  }

  onMetodoChange(value: string) {
    if (value === 'retiro') {
      this.retiroForm
        .get('cuenta_destino')
        ?.setValidators([Validators.required]);
      this.retiroForm
        .get('banco_destino')
        ?.setValidators([Validators.required]);
    } else {
      this.retiroForm.get('cuenta_destino')?.clearValidators();
      this.retiroForm.get('banco_destino')?.clearValidators();
    }
    this.retiroForm.get('cuenta_destino')?.updateValueAndValidity();
    this.retiroForm.get('banco_destino')?.updateValueAndValidity();
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.retiroForm.controls).forEach((key) => {
      const control = this.retiroForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }
}
