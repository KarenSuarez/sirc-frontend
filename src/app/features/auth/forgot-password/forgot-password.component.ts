import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzAlertModule,
    NzSpinModule,
    NzDividerModule,
    NzIconModule,
    NzResultModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  emailSent = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  clearError() {
    this.errorMessage = '';
  }

  clearSuccess() {
    this.successMessage = '';
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const email = this.forgotPasswordForm.get('email')?.value;

      // Simulación servicio de recuperación de contraseña
      console.log('Solicitar reset para email:', email);

      // Simulación de llamada a API
      setTimeout(() => {
        this.isLoading = false;

        // Simulación respuesta exitosa
        this.emailSent = true;
        this.successMessage = `Se ha enviado un enlace de recuperación a ${email}`;

        // O podrías presentarse un error:
        // this.errorMessage = 'No se encontró una cuenta con ese correo electrónico';
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

 navigateToRegister(): void {
    this.router.navigate(['/auth/registro']);
  }

  resendEmail() {
    this.emailSent = false;
    this.successMessage = '';
    this.errorMessage = '';
    // Resetear el formulario pero mantener el email
    const currentEmail = this.forgotPasswordForm.get('email')?.value;
    this.forgotPasswordForm.reset();
    this.forgotPasswordForm.patchValue({ email: currentEmail });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }
}
