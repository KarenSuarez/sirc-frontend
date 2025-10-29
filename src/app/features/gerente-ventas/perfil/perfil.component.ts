import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { PerfilBaseComponent } from '../../../shared/componentes/perfil-base/perfil-base.component';
import { UsuarioService } from '../../../core/services/usuario.service';


@Component({
  selector: 'app-perfil-gerente',
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
  templateUrl: './perfil.component.html',
  styleUrls: ['../../../shared/componentes/perfil-base/perfil-base.component.css']
})
export class PerfilComponent extends PerfilBaseComponent {
  constructor(
    formBuilder: FormBuilder,
    usuarioService: UsuarioService,
    message: NzMessageService,
    router: Router
  ) {
    super(formBuilder, usuarioService, message, router);
    this.dashboardRoute = '/gerente/dashboard';
  }
}
