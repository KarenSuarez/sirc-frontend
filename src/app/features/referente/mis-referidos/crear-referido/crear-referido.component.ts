import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ReferidoService } from '../../../../core/services/referido.service';
import { CrearReferidoDTO } from '../../../../core/models/referido.interface';
import { TipoDocumento } from '../../../../core/models/referido.interface';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-crear-referido',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzAlertModule,
    NzSpinModule,
    NzIconModule,
  ],
  templateUrl: './crear-referido.component.html',
  styleUrl: './crear-referido.component.css',
})
export class CrearReferidoComponent implements OnInit, OnDestroy {
  referidoForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  tiposDocumento: TipoDocumento[] = [];
  cargandoTipos = false;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private referidoService: ReferidoService,
    private http: HttpClient
  ) {
    this.referidoForm = this.createForm();
  }

  ngOnInit() {
    this.cargarTiposDocumento();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      nombre_referido: ['', [Validators.required, Validators.minLength(2)]],
      apellido_referido: ['', [Validators.required, Validators.minLength(2)]],
      id_tipo_documento: ['', [Validators.required]],
      numero_documento_referido: [
        '',
        [Validators.required, Validators.pattern(/^[0-9A-Za-z\-]{6,20}$/)],
      ],
      correo_referido: ['', [Validators.required, Validators.email]],
      telefono_referido: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      empresa_referido: [''],
      cargo_referido: [''],
      observaciones: [''],
    });
  }

  cargarTiposDocumento() {
    this.cargandoTipos = true;
    const url = `${environment.apiUrl}/tipos-documento`;

    this.http
      .get<TipoDocumento[]>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tipos) => {
          this.tiposDocumento = tipos;
          this.cargandoTipos = false;
        },
        error: (error) => {
          console.error('Error al cargar tipos de documento:', error);
          this.cargandoTipos = false;
          this.message.error('Error al cargar tipos de documento');
        },
      });
  }

  onSubmit() {
    if (!this.referidoForm.valid) {
      this.markFormGroupTouched();
      this.message.warning(
        'Por favor, completa todos los campos correctamente'
      );
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValues = this.referidoForm.value;

    const referidoData: CrearReferidoDTO = {
      nombre_referido: formValues.nombre_referido,
      apellido_referido: formValues.apellido_referido,
      correo_referido: formValues.correo_referido,
      telefono_referido: formValues.telefono_referido,
      numero_documento_referido: formValues.numero_documento_referido,
      id_tipo_documento: Number(formValues.id_tipo_documento),
      empresa_referido: formValues.empresa_referido || undefined,
      cargo_referido: formValues.cargo_referido || undefined,
      observaciones: formValues.observaciones || undefined,
    };

    this.referidoService
      .crear(referidoData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.message.success('¡Referido creado exitosamente!');

          setTimeout(() => {
            this.router.navigate(['referente/referidos']);
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;

          let mensaje = 'Error al crear referido';

          if (error.status === 400) {
            mensaje =
              error.error?.message || 'Ya existe un referido con ese documento';
          } else if (error.status === 403) {
            mensaje = 'No tienes un perfil de referente activo';
          } else if (error.status === 500) {
            mensaje = 'Error del servidor. Intenta nuevamente';
          }

          this.errorMessage = mensaje;
          this.message.error(mensaje);
        },
      });
  }

  cancelar() {
    this.router.navigate(['referente/referidos']);
  }

  clearError() {
    this.errorMessage = '';
  }

  private markFormGroupTouched() {
    Object.keys(this.referidoForm.controls).forEach((key) => {
      const control = this.referidoForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  get nombre_referido() {
    return this.referidoForm.get('nombre_referido');
  }
  get apellido_referido() {
    return this.referidoForm.get('apellido_referido');
  }
  get id_tipo_documento() {
    return this.referidoForm.get('id_tipo_documento');
  }
  get numero_documento_referido() {
    return this.referidoForm.get('numero_documento_referido');
  }
  get correo_referido() {
    return this.referidoForm.get('correo_referido');
  }
  get telefono_referido() {
    return this.referidoForm.get('telefono_referido');
  }
  get empresa_referido() {
    return this.referidoForm.get('empresa_referido');
  }
  get cargo_referido() {
    return this.referidoForm.get('cargo_referido');
  }
  get observaciones() {
    return this.referidoForm.get('observaciones');
  }
}
