import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioHelperService } from '../../../core/services/usuario-helper.service';

@Component({
  selector: 'app-perfil-referente',
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
  templateUrl: './perfil.component.html',
  styleUrls: ['../../../shared/componentes/perfil-base/perfil-base.component.css'],
})
export class PerfilComponent extends PerfilBaseComponent {
  constructor(
    formBuilder: FormBuilder,
    authService: AuthService,
    usuarioHelper: UsuarioHelperService,
    message: NzMessageService,
    router: Router,
    http: HttpClient
  ) {
    super(formBuilder, authService, usuarioHelper, message, router, http);
    this.dashboardRoute = '/referente/dashboard';
  }

  override copyReferralCode() {
    const codigo = this.codigoReferente;
    if (codigo) {
      navigator.clipboard.writeText(codigo);
      this.message.success('¡Código copiado al portapapeles!');
    } else {
      this.message.warning('No hay código de referido disponible');
    }
  }

  override copyReferralLink() {
    const link = this.linkReferido;
    if (link) {
      navigator.clipboard.writeText(link);
      this.message.success('¡Link copiado al portapapeles!');
    } else {
      this.message.warning('No hay enlace de referido disponible');
    }
  }
}
