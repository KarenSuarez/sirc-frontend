import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { AuthService } from '../../../core/services/auth.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { RegisterData } from '../../../core/models/auth-response.interface';
import { environment } from '../../../../environments/environment';

interface TipoDocumento {
  id_tipo_documento: number;
  codigo_tipo: string;
  nombre_tipo: string;
}

@Component({
  selector: 'app-register',
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
    NzDividerModule,
    NzIconModule,
    NzCheckboxModule,
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  passwordVisible = false;
  confirmPasswordVisible = false;
  tiposDocumento: TipoDocumento[] = [];
  cargandoTipos = false;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private notificacion: NotificacionService,
    private http: HttpClient
  ) {
    this.registerForm = this.createForm();
  }

  ngOnInit() {
    this.cargarTiposDocumento();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        apellido: ['', [Validators.required, Validators.minLength(2)]],
        id_tipo_documento: ['', [Validators.required]],
        numero_documento: [
          '',
          [Validators.required, Validators.pattern(/^[0-9A-Za-z\-]{6,20}$/)],
        ],
        correo_electronico: ['', [Validators.required, Validators.email]],
        telefono: ['', [Validators.pattern(/^[0-9]{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        esClienteClarisa: [false],
        aceptaTerminos: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
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
          this.notificacion.error('Error al cargar tipos de documento');
        },
      });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (confirmPassword?.errors?.['passwordMismatch']) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
      return null;
    }
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      this.markFormGroupTouched();
      this.notificacion.advertencia(
        'Por favor, completa todos los campos correctamente'
      );
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValues = this.registerForm.value;

    const tipo_referente = formValues.esClienteClarisa
      ? 'cliente_interno'
      : 'cliente_externo';

    const registerData: RegisterData = {
      nombre: formValues.nombre,
      apellido: formValues.apellido,
      correo_electronico: formValues.correo_electronico,
      password: formValues.password,
      numero_documento: formValues.numero_documento,
      id_tipo_documento: Number(formValues.id_tipo_documento),
      telefono: formValues.telefono || undefined,
      roles: ['referente'],
      tipo_referente,
    };

    this.authService
      .register(registerData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.notificacion.exito(
            '¡Registro exitoso! Ahora puedes iniciar sesión'
          );

          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;

          let mensaje = 'Error al registrar usuario';

          if (error.status === 400) {
            mensaje =
              error.error?.message ||
              'Ya existe un usuario con ese documento o correo';
          } else if (error.status === 500) {
            mensaje = 'Error del servidor. Intenta nuevamente';
          }

          this.errorMessage = mensaje;
          this.notificacion.error(mensaje);
        },
      });
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  clearError() {
    this.errorMessage = '';
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  get nombre() {
    return this.registerForm.get('nombre');
  }
  get apellido() {
    return this.registerForm.get('apellido');
  }
  get id_tipo_documento() {
    return this.registerForm.get('id_tipo_documento');
  }
  get numero_documento() {
    return this.registerForm.get('numero_documento');
  }
  get correo_electronico() {
    return this.registerForm.get('correo_electronico');
  }
  get telefono() {
    return this.registerForm.get('telefono');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
  get esClienteClarisa() {
    return this.registerForm.get('esClienteClarisa');
  }
  get aceptaTerminos() {
    return this.registerForm.get('aceptaTerminos');
  }
}
