import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      nit: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const loginData = {
        nit: this.loginForm.get('nit')?.value,
        password: this.loginForm.get('password')?.value
      };

      // Aquí se integra con el servicio de autenticación
      console.log('Datos de login:', loginData);

      // Simulación de llamada a API
      setTimeout(() => {
        this.isLoading = false;
        // Si el login es exitoso, redirigir
        // this.router.navigate(['/dashboard']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  navigateToRegister() {
    this.router.navigate(['auth/register']);
  }

  get nit() { return this.loginForm.get('nit'); }
  get password() { return this.loginForm.get('password'); }
}
