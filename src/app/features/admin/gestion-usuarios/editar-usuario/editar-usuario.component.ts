import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AdminService } from '../../../../core/services/admin.service';
import { Usuario } from '../../../../core/models/usuario.interface';

@Component({
  selector: 'app-editar-usuario',
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
    NzGridModule,
    NzMessageModule,
    NzSpinModule,
  ],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.css',
})
export class EditarUsuarioComponent implements OnInit, OnDestroy {
  usuarioForm!: FormGroup;
  loading = true;
  guardando = false;
  passwordVisible = false;
  confirmPasswordVisible = false;
  usuarioId: number = 0;
  usuario: Usuario | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.usuarioId = parseInt(this.route.snapshot.params['id']);
    this.initForm();
    this.cargarUsuario();
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
        documento: [{ value: '', disabled: true }],
        telefono: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
        nuevaContrasena: ['', [Validators.minLength(6)]],
        confirmarContrasena: [''],
        activo: [true],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('nuevaContrasena');
    const confirmPassword = control.get('confirmarContrasena');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value === '' && confirmPassword.value === '') {
      return null;
    }

    if (confirmPassword.value === '') {
      return null;
    }

    return password.value === confirmPassword.value ? null : { mismatch: true };
  }

  /**
   * Cargar usuario desde backend
   */
  cargarUsuario() {
    this.loading = true;

    this.adminService
      .obtenerUsuario(this.usuarioId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (usuario) => {
          this.usuario = usuario;
          this.usuarioForm.patchValue({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            documento: usuario.numero_documento,
            telefono: usuario.telefono || '',
            correo: usuario.correo_electronico,
            activo: usuario.referente?.estado_referente === 'activo',
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar usuario:', error);
          this.message.error('Error al cargar datos del usuario');
          this.loading = false;
          this.router.navigate(['/admin/usuarios']);
        },
      });
  }

  /**
   * Guardar cambios
   */
  guardarCambios() {
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

    const datosActualizar: any = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo_electronico: formData.correo,
      telefono: formData.telefono,
    };

    // Solo incluir contraseña si se ingresó una nueva
    if (formData.nuevaContrasena) {
      datosActualizar.password = formData.nuevaContrasena;
    }

    this.adminService
      .actualizarUsuario(this.usuarioId, datosActualizar)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.message.success('Usuario actualizado exitosamente');
          this.guardando = false;
          this.router.navigate(['/admin/usuarios']);
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          this.message.error(error.error?.message || 'Error al actualizar usuario');
          this.guardando = false;
        },
      });
  }
}
