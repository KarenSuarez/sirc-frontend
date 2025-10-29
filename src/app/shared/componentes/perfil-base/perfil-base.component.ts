import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.interface';

@Component({
  selector: 'app-perfil-base',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzDatePickerModule,
    NzAvatarModule,
    NzIconModule,
    NzSpinModule,
    NzDividerModule
  ],
  template: '',
  styleUrls: ['./perfil-base.component.css']
})
export class PerfilBaseComponent implements OnInit {
  @Input() dashboardRoute: string = '/dashboard';

  perfilForm: FormGroup;
  passwordForm: FormGroup;
  usuario: Usuario | null = null;
  isLoading = false;
  isEditMode = false;
  showPasswordForm = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  tiposDocumento = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PP', label: 'Pasaporte' }
  ];

  constructor(
    protected formBuilder: FormBuilder,
    protected usuarioService: UsuarioService,
    protected message: NzMessageService,
    protected router: Router
  ) {
    this.perfilForm = this.createPerfilForm();
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit() {
    this.loadUserData();
  }

  protected createPerfilForm(): FormGroup {
    return this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      tipoDoc: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  protected createPasswordForm(): FormGroup {
    return this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  protected passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  protected loadUserData() {
    this.usuarioService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.usuario = usuario;
        this.populateForm();
      }
    });
  }

  protected populateForm() {
    if (this.usuario) {
      this.perfilForm.patchValue({
        nombre: this.usuario.nombre,
        correo: this.usuario.correo,
        tipoDoc: this.usuario.tipoDoc,
        documento: this.usuario.documento,
        telefono: this.usuario.telefono,
        fechaNacimiento: this.usuario.fechaNacimiento
      });
    }
  }

  enableEditMode() {
    this.isEditMode = true;
    this.perfilForm.enable();
  }

  cancelEdit() {
    this.isEditMode = false;
    this.perfilForm.disable();
    this.populateForm();
  }

  onSubmit() {
    if (this.perfilForm.valid && this.usuario) {
      this.isLoading = true;

      setTimeout(() => {
        const updatedUser: Usuario = {
          ...this.usuario!,
          ...this.perfilForm.value
        };

        this.usuarioService.updateUsuario(updatedUser);
        this.message.success('Perfil actualizado exitosamente');
        this.isLoading = false;
        this.isEditMode = false;
        this.perfilForm.disable();
      }, 1000);
    } else {
      this.markFormGroupTouched(this.perfilForm);
      this.message.warning('Por favor, complete todos los campos correctamente');
    }
  }

  onPasswordSubmit() {
    if (this.passwordForm.valid) {
      this.isLoading = true;

      setTimeout(() => {
        this.message.success('Contraseña actualizada exitosamente');
        this.passwordForm.reset();
        this.showPasswordForm = false;
        this.isLoading = false;
      }, 1000);
    } else {
      this.markFormGroupTouched(this.passwordForm);
      this.message.warning('Por favor, complete todos los campos correctamente');
    }
  }

  protected markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  goBack() {
    this.router.navigate([this.dashboardRoute]);
  }

  getRoleDisplayName(): string {
    if (!this.usuario) return '';

    const roles: Record<string, string> = {
      'referente': 'Referente',
      'asesor': 'Asesor de Ventas',
      'gerente': 'Gerente de Ventas',
      'admin': 'Administrador',
      'contador': 'Contador'
    };

    return roles[this.usuario.rol] || this.usuario.rol;
  }
}
