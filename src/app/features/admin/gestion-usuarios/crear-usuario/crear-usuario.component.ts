import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
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
import { NzMessageService } from 'ng-zorro-antd/message';

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
    NzMessageModule
  ],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css'
})
export class CrearUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  guardando = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  asesoresDisponibles = [
    { id: '1', nombre: 'Carlos Ramírez' },
    { id: '2', nombre: 'Ana López' },
    { id: '3', nombre: 'Pedro Martínez' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
      rol: ['', Validators.required],
      asesorAsignado: [''],
      generarCodigo: [true],
      activo: [true]
    }, { validators: this.passwordMatchValidator });
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

  guardarUsuario() {
    if (!this.usuarioForm.valid) {
      Object.values(this.usuarioForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.guardando = true;

    setTimeout(() => {
      this.message.success('Usuario creado exitosamente');
      this.guardando = false;
      this.router.navigate(['/admin/usuarios']);
    }, 1500);
  }

  getRolDescripcion(rol: string): string {
    const descripciones: { [key: string]: string } = {
      'admin': 'Acceso completo al sistema con capacidad de gestionar usuarios y configuraciones',
      'gerente_ventas': 'Puede gestionar planes, comisiones, niveles e insignias del sistema',
      'asesor_ventas': 'Puede gestionar referentes y referidos asignados',
      'contador': 'Puede gestionar retiros y generar reportes financieros',
      'referente': 'Puede registrar referidos y consultar sus comisiones'
    };
    return descripciones[rol] || '';
  }
}
