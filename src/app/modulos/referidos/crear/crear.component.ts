import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';


@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzAlertModule,
    NzSpinModule,
    NzIconModule,
    NzDatePickerModule,

  ],
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent {
  referidoForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  identityTypes = [
    { value: 'cc', label: 'Cédula de Ciudadanía' },
    { value: 'ce', label: 'Cédula de Extranjería' },
    { value: 'nit', label: 'NIT' },
    { value: 'passport', label: 'Pasaporte' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private message: NzMessageService
  ) {
    this.referidoForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      identityType: ['', [Validators.required]],
      identityNumber: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z\-]{6,20}$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      empresa: [''],
      cargo: [''],
      observaciones: ['']
    });
  }

  onSubmit() {
    if (this.referidoForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const referidoData = {
        nombre: `${this.referidoForm.get('firstName')?.value} ${this.referidoForm.get('lastName')?.value}`,
        correo: this.referidoForm.get('email')?.value,
        telefono: this.referidoForm.get('phone')?.value,
        tipoDoc: this.referidoForm.get('identityType')?.value,
        documento: this.referidoForm.get('identityNumber')?.value,
        empresa: this.referidoForm.get('empresa')?.value,
        cargo: this.referidoForm.get('cargo')?.value,
        observaciones: this.referidoForm.get('observaciones')?.value,
        estado: 'pendiente',
        fechaRegistro: new Date()
      };

      console.log('Datos del referido:', referidoData);

      // Simulación de llamada a API
      setTimeout(() => {
        this.isLoading = false;
        this.message.success('¡Referido creado exitosamente!');
        this.router.navigate(['/referidos/lista']);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  cancelar() {
    this.router.navigate(['/referidos/lista']);
  }

  clearError() {
    this.errorMessage = '';
  }

  private markFormGroupTouched() {
    Object.keys(this.referidoForm.controls).forEach(key => {
      const control = this.referidoForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para facilitar el acceso a los controles
  get firstName() { return this.referidoForm.get('firstName'); }
  get lastName() { return this.referidoForm.get('lastName'); }
  get identityType() { return this.referidoForm.get('identityType'); }
  get identityNumber() { return this.referidoForm.get('identityNumber'); }
  get email() { return this.referidoForm.get('email'); }
  get phone() { return this.referidoForm.get('phone'); }
  get empresa() { return this.referidoForm.get('empresa'); }
  get cargo() { return this.referidoForm.get('cargo'); }
  get observaciones() { return this.referidoForm.get('observaciones'); }
}
