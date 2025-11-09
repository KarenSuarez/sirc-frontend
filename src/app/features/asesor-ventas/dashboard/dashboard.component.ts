import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioHelperService } from '../../../core/services/usuario-helper.service';
import { UsuarioAutenticado } from '../../../core/models/usuario.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  usuario: UsuarioAutenticado | null = null;

  constructor(
    private authService: AuthService,
    public usuarioHelper: UsuarioHelperService
  ) {}

  ngOnInit() {
    this.usuario = this.authService.usuario();
  }

  get nombreCompleto(): string {
    return this.usuarioHelper.nombreCompleto;
  }

  get iniciales(): string {
    return this.usuarioHelper.iniciales;
  }
}
