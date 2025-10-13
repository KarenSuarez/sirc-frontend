import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UsuarioService } from '../../../core/servicios/usuario.service';
import { Usuario } from '../../../core/modelos/usuario.interface';

interface MenuItem {
  label: string;
  route: string;
  icon: string;  // ahora usaremos los nombres de iconos de ng-zorro
  roles: string[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usuario: Usuario | null = null;
  showUserMenu = false;

  menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      route: '/dashboard',
      icon: 'home',
      roles: ['referente', 'asesor', 'admin', 'contador']
    },
    {
      label: 'Mis referidos',
      route: '/referidos',
      icon: 'team',
      roles: ['referente', 'asesor']
    },
    {
      label: 'Recompensas',
      route: '/recompensas',
      icon: 'gift',
      roles: ['referente']
    },
    {
      label: 'Puntos y categorías',
      route: '/gamificacion',
      icon: 'trophy',
      roles: ['referente']
    },
    {
      label: 'Mi perfil',
      route: '/auth/perfil',
      icon: 'user',
      roles: ['referente', 'asesor', 'admin', 'contador']
    }
  ];

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.usuarioService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  getFilteredMenuItems(): MenuItem[] {
    if (!this.usuario) return [];

    return this.menuItems.filter(item =>
      item.roles.includes(this.usuario!.rol)
    );
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.usuarioService.logout();
    this.router.navigate(['/auth/login']);
  }

  getRoleDisplayName(rol: string): string {
    const roles = {
      'referente': 'Referente',
      'asesor': 'Asesor de Ventas',
      'admin': 'Administrador',
      'contador': 'Contador'
    };
    return roles[rol as keyof typeof roles] || rol;
  }
}
