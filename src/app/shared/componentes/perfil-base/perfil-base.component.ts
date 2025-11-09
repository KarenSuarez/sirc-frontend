import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

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

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioHelperService } from '../../../core/services/usuario-helper.service';
import { UsuarioAutenticado, Referente, PerfilReferenteCompleto } from '../../../core/models/usuario.interface';
import { environment } from '../../../../environments/environment';

interface UsuarioCompleto {
  id_usuario: number;
  numero_documento: string;
  id_tipo_documento: number;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  telefono?: string;
  fecha_registro: string;
  roles?: any[];
  referente?: any;
  tipoDocumento?: {
    id_tipo_documento: number;
    codigo_tipo: string;
    nombre_tipo: string;
  };
}

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
    NzDividerModule,
  ],
  template: '',
  styleUrls: ['./perfil-base.component.css'],
})
export class PerfilBaseComponent implements OnInit, OnDestroy {
  @Input() dashboardRoute: string = '/dashboard';

  perfilForm: FormGroup;
  passwordForm: FormGroup;
  usuario: UsuarioAutenticado | null = null;
  usuarioCompleto: UsuarioCompleto | null = null;
  perfilReferente: Referente | null = null;
  perfilCompleto: PerfilReferenteCompleto | null = null;
  isLoading = false;
  isEditMode = false;
  showPasswordForm = false;
  passwordVisible = false;
  confirmPasswordVisible = false;
  totalReferidos = 0;

  protected destroy$ = new Subject<void>();

  constructor(
    protected formBuilder: FormBuilder,
    protected authService: AuthService,
    protected usuarioHelper: UsuarioHelperService,
    protected message: NzMessageService,
    protected router: Router,
    protected http: HttpClient
  ) {
    this.perfilForm = this.createPerfilForm();
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit() {
    this.loadUserData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected createPerfilForm(): FormGroup {
    return this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      tipoDoc: [{ value: '', disabled: true }],
      documento: [{ value: '', disabled: true }],
      telefono: ['', [Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  protected createPasswordForm(): FormGroup {
    return this.formBuilder.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  protected passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  protected loadUserData() {
    this.usuario = this.authService.usuario();

    this.cargarUsuarioCompleto();

    if (this.usuarioHelper.esReferente) {
      this.cargarPerfilCompletoReferente();
    }
  }

  protected cargarUsuarioCompleto() {
    const url = `${environment.apiUrl}/auth/me`;

    this.http.get<UsuarioCompleto>(url).pipe(takeUntil(this.destroy$)).subscribe({
      next: (usuarioCompleto) => {
        console.log('👤 Usuario completo desde /auth/me:', usuarioCompleto);
        this.usuarioCompleto = usuarioCompleto;
        this.populateForm();
        this.perfilForm.disable();
      },
      error: (error) => {
        console.error('Error al cargar usuario completo:', error);
        this.message.error('Error al cargar datos del perfil');
      },
    });
  }

  protected cargarPerfilCompletoReferente() {
    this.usuarioHelper.obtenerPerfilCompletoReferente().pipe(takeUntil(this.destroy$)).subscribe({
      next: (perfilCompleto) => {
        this.perfilCompleto = perfilCompleto;
        this.perfilReferente = perfilCompleto.referente;
        console.log('📊 Perfil completo cargado:', perfilCompleto);
      },
      error: (error) => {
        console.error('Error al cargar perfil completo:', error);
      },
    });
  }

  protected populateForm() {
    if (this.usuarioCompleto) {
      const tipoDocTexto = this.usuarioCompleto.tipoDocumento
        ? `${this.usuarioCompleto.tipoDocumento.codigo_tipo} - ${this.usuarioCompleto.tipoDocumento.nombre_tipo}`
        : '';

      this.perfilForm.patchValue({
        nombre: this.usuarioCompleto.nombre,
        apellido: this.usuarioCompleto.apellido,
        correo: this.usuarioCompleto.correo_electronico,
        documento: this.usuarioCompleto.numero_documento,
        tipoDoc: tipoDocTexto,
        telefono: this.usuarioCompleto.telefono || '',
      });
    } else if (this.usuario) {
      this.perfilForm.patchValue({
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        correo: this.usuario.correo_electronico,
        documento: this.usuario.numero_documento,
        telefono: this.usuario.telefono || '',
      });
    }
  }

  enableEditMode() {
    this.isEditMode = true;
    this.perfilForm.enable();

    this.perfilForm.get('documento')?.disable();
    this.perfilForm.get('tipoDoc')?.disable();
  }

  cancelEdit() {
    this.isEditMode = false;
    this.perfilForm.disable();
    this.populateForm();
  }

  onSubmit() {
    if (!this.perfilForm.valid) {
      this.markFormGroupTouched(this.perfilForm);
      this.message.warning('Por favor, complete todos los campos correctamente');
      return;
    }

    this.isLoading = true;

    const formValue = this.perfilForm.getRawValue();
    const datosActualizar = {
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      correo_electronico: formValue.correo,
      telefono: formValue.telefono || null,
    };

    const url = `${environment.apiUrl}/auth/me`;

    this.http.put<any>(url, datosActualizar).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.message.success('Perfil actualizado exitosamente');
        this.usuarioCompleto = response.usuario;
        this.authService.obtenerUsuarioActual().subscribe();

        this.isLoading = false;
        this.isEditMode = false;
        this.perfilForm.disable();
        this.populateForm();
      },
      error: (error) => {
        console.error('Error al actualizar perfil:', error);
        this.isLoading = false;

        let mensaje = 'Error al actualizar perfil';
        if (error.status === 400) {
          mensaje = error.error?.message || 'El correo ya está en uso';
        }

        this.message.error(mensaje);
      },
    });
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
    Object.keys(formGroup.controls).forEach((key) => {
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
      referente: 'Referente',
      asesor_ventas: 'Asesor de Ventas',
      gerente_ventas: 'Gerente de Ventas',
      administrador: 'Administrador',
      contador: 'Contador',
    };

    const primerRol = this.usuario.roles[0]?.toLowerCase() || '';
    return roles[primerRol] || primerRol;
  }

  get iniciales(): string {
    return this.usuarioHelper.iniciales;
  }

  get nombreCompleto(): string {
    return this.usuarioHelper.nombreCompleto;
  }

  get codigoReferente(): string | undefined {
    return (
      this.usuario?.codigo_referente ||
      this.perfilCompleto?.referente?.codigo_referente ||
      this.perfilReferente?.codigo_referente
    );
  }

  get linkReferido(): string {
    if (!this.codigoReferente) return '';
    return `https://clarisa.com/registro?ref=${this.codigoReferente}`;
  }

  get nivelActual(): string {
    if (this.perfilCompleto?.nivel) {
      return this.perfilCompleto.nivel.nombre_nivel;
    }

    const puntos = this.perfilReferente?.puntos_actuales || 0;
    if (puntos >= 600) return 'Diamante';
    if (puntos >= 300) return 'Oro';
    if (puntos >= 100) return 'Plata';
    return 'Bronce';
  }

  copyReferralCode() {
    if (this.codigoReferente) {
      navigator.clipboard.writeText(this.codigoReferente);
      this.message.success('Código copiado');
    }
  }

  copyReferralLink() {
    if (this.linkReferido) {
      navigator.clipboard.writeText(this.linkReferido);
      this.message.success('Enlace copiado');
    }
  }
}
