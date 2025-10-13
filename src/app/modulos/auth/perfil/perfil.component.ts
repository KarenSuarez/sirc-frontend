import { Component, OnInit } from '@angular/core';
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
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { UsuarioService } from '../../../core/servicios/usuario.service';
import { Usuario } from '../../../core/modelos/usuario.interface';

@Component({
  selector: 'app-perfil',
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
    NzUploadModule,
    NzIconModule,
    NzSpinModule,
    NzDividerModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
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
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private message: NzMessageService,
    private router: Router
  ) {
    this.perfilForm = this.createPerfilForm();
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit() {
    this.loadUserData();
  }

  private createPerfilForm(): FormGroup {
    return this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      tipoDoc: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  private createPasswordForm(): FormGroup {
    return this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  private loadUserData() {
    this.usuarioService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.usuario = usuario;
        this.populateForm();
      }
    });
  }

  private populateForm() {
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
    this.populateForm(); // Restaurar valores originales
  }

  onSubmit() {
    if (this.perfilForm.valid && this.usuario) {
      this.isLoading = true;

      // Simular llamada a API
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

      // Simular cambio de contraseña
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

  private markFormGroupTouched(formGroup: FormGroup) {
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
    this.router.navigate(['/dashboard']);
  }

  copyReferralCode() {
    if (this.usuario?.codigo) {
      navigator.clipboard.writeText(this.usuario.codigo);
      this.message.success('¡Código copiado al portapapeles!');
    }
  }

  copyReferralLink() {
    if (this.usuario?.link) {
      navigator.clipboard.writeText(this.usuario.link);
      this.message.success('¡Link copiado al portapapeles!');
    }
  }

  getRoleDisplayName(): string {
    if (!this.usuario) return '';

    const roles = {
      'referente': 'Referente',
      'asesor': 'Asesor de Ventas',
      'admin': 'Administrador',
      'contador': 'Contador'
    };

    return roles[this.usuario.rol] || this.usuario.rol;
  }
}
