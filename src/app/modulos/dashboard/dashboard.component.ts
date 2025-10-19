import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { UsuarioService } from '../../core/servicios/usuario.service';
import { Usuario } from '../../core/modelos/usuario.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzStatisticModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzAvatarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(
    private router: Router,
    private message: NzMessageService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.usuarioService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  copiarLink() {
    if (this.usuario?.link) {
      navigator.clipboard.writeText(this.usuario.link);
      this.message.success('¡Link copiado al portapapeles!');
    }
  }

  copiarCodigo() {
    if (this.usuario?.codigo) {
      navigator.clipboard.writeText(this.usuario.codigo);
      this.message.success('¡Código copiado al portapapeles!');
    }
  }

  navigateToProfile() {
    this.router.navigate(['/perfil']);
  }

  getDashboardTitle(): string {
    if (!this.usuario) return '';

    const titles = {
      'referente': 'Dashboard de Referente',
      'asesor': 'Dashboard de Ventas',
      'admin': 'Panel de Administración',
      'contador': 'Panel Contable'
    };

    return titles[this.usuario.rol] || 'Dashboard';
  }
}

