import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
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
import { NzMessageService } from 'ng-zorro-antd/message';

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
    NzMessageModule
  ],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.css'
})
export class EditarUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  loading = true;
  guardando = false;
  passwordVisible = false;
  confirmPasswordVisible = false;
  usuarioId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.usuarioId = this.route.snapshot.params['id'];
    this.initForm();
    this.cargarUsuario();
  }

  initForm() {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      nuevaContrasena: ['', [Validators.minLength(6)]],
      confirmarContrasena: [''],
      activo: [true]
    }, { validators: this.passwordMatchValidator });
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

  cargarUsuario() {
    this.loading = true;

    // Simulación de carga de datos
    setTimeout(() => {
      const usuario = {
        nombre: 'María',
        apellido: 'González',
        documento: '9876543210',
        telefono: '3009876543',
        correo: 'maria.gonzalez@email.com',
        rol: 'referente',
        activo: true
      };

      this.usuarioForm.patchValue(usuario);
      this.loading = false;
    }, 1000);
  }

  guardarCambios() {
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
      this.message.success('Usuario actualizado exitosamente');
      this.guardando = false;
      this.router.navigate(['/admin/usuarios']);
    }, 1500);
  }
}
