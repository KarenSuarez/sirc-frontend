import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Subject, forkJoin, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AdminService } from '../../../../core/services/admin.service';
import { RolUsuario } from '../../../../core/models/usuario.interface';
import { TipoDocumento } from '../../../../core/models/tipo-documento.interface';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzCheckboxModule,
    NzDividerModule,
    NzAlertModule,
    NzGridModule,
    NzMessageModule,
    NzSpinModule,
  ],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css',
})
export class CrearUsuarioComponent implements OnInit, OnDestroy {
  usuarioForm!: FormGroup;
  guardando = false;
  cargando = true;
  passwordVisible = false;
  confirmPasswordVisible = false;

  rolesDisponibles: RolUsuario[] = [];
  tiposDocumento: TipoDocumento[] = [];
  asesoresDisponibles: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.cargarDatosIniciales();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    this.usuarioForm = this.fb.group(
      {
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        id_tipo_documento: [1, Validators.required],
        documento: ['', Validators.required],
        telefono: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        contrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmarContrasena: ['', [Validators.required]],
        rol: ['', Validators.required],
        tipo_referente: ['cliente_externo'],
        activo: [true],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('contrasena');
    const confirmPassword = control.get('confirmarContrasena');

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    return password.value === confirmPassword.value ? null : { mismatch: true };
  }

  /**
   * Cargar datos iniciales (roles, tipos de documento)
   */
  cargarDatosIniciales() {
    this.cargando = true;

    forkJoin({
      roles: this.adminService.listarRoles(),
      tiposDocumento: this.adminService.listarTiposDocumento(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.rolesDisponibles = data.roles;
          this.tiposDocumento = data.tiposDocumento;
          this.cargando = false;

          // Si no hay tipos de documento, usar valores por defecto
          if (this.tiposDocumento.length === 0) {
            this.tiposDocumento = [
              { id_tipo_documento: 1, codigo_tipo: 'CC', nombre_tipo: 'Cédula de Ciudadanía' },
              { id_tipo_documento: 2, codigo_tipo: 'CE', nombre_tipo: 'Cédula de Extranjería' },
              { id_tipo_documento: 3, codigo_tipo: 'PAS', nombre_tipo: 'Pasaporte' },
            ];
          }
        },
        error: (error) => {
          console.error('Error al cargar datos iniciales:', error);
          this.message.error('Error al cargar datos del formulario');
          this.cargando = false;

          // Usar valores por defecto
          this.tiposDocumento = [
            { id_tipo_documento: 1, codigo_tipo: 'CC', nombre_tipo: 'Cédula de Ciudadanía' },
          ];
        },
      });
  }

  /**
   * Guardar usuario
   */
  guardarUsuario() {
    if (!this.usuarioForm.valid) {
      Object.values(this.usuarioForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.guardando = true;

    const formData = this.usuarioForm.value;

    const datosUsuario = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo_electronico: formData.correo,
      password: formData.contrasena,
      numero_documento: formData.documento,
      id_tipo_documento: formData.id_tipo_documento,
      telefono: formData.telefono,
      roles: [formData.rol], // Array con el rol seleccionado
      tipo_referente: formData.rol === 'referente' || formData.rol === 'REF'
        ? formData.tipo_referente
        : undefined,
    };

    this.adminService
      .crearUsuario(datosUsuario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.message.success('Usuario creado exitosamente');
          this.guardando = false;
          this.router.navigate(['/admin/usuarios']);
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          this.message.error(error.error?.message || 'Error al crear usuario');
          this.guardando = false;
        },
      });
  }
  formatearNombreRol(nombreRol: string): string {
  const nombres: { [key: string]: string } = {
    'administrador': 'Administrador',
    'gerente_ventas': 'Gerente de Ventas',
    'asesor_ventas': 'Asesor de Ventas',
    'contador': 'Contador',
    'referente': 'Referente',
  };
  return nombres[nombreRol] || nombreRol;
}

  getRolDescripcion(rol: string): string {
    return this.adminService.obtenerDescripcionRol(rol);
  }

  esRolReferente(): boolean {
    const rol = this.usuarioForm.get('rol')?.value;
    return rol === 'referente' || rol === 'REF';
  }
}
