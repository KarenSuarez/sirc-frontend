import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// NG-ZORRO imports
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule,
    NzSpinModule,
    NzAlertModule,
    NzTypographyModule,
    NzCheckboxModule,
    NzDividerModule,
    NzMessageModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  passwordVisible = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private message: NzMessageService
  ) {
    this.loginForm = this.formBuilder.group({
      nit: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.clearError();

      const loginData = {
        nit: this.loginForm.get('nit')?.value,
        password: this.loginForm.get('password')?.value,
        rememberMe: this.loginForm.get('rememberMe')?.value
      };

      console.log('Datos de login:', loginData);

      // Simulación de llamada a API
      setTimeout(() => {
        this.isLoading = false;

        // Simular validación (reemplazar con lógica real)
        if (loginData.nit === '12345678' && loginData.password === 'test123') {
          this.message.success('¡Bienvenido! Inicio de sesión exitoso');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'NIT/Cédula o contraseña incorrectos. Por favor, verifique sus credenciales.';
          this.message.error('Credenciales incorrectas');
        }
      }, 2000);
    } else {
      this.markFormGroupTouched();
      this.message.warning('Por favor, complete todos los campos requeridos');
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/registro']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  // Getters para fácil acceso a los controles del formulario
  get nit() {
    return this.loginForm.get('nit');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }
}
