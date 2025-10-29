import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.interface';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
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
  filteredMenuItems: MenuItem[] = [];

  private baseMenuItems: MenuItem[] = [
    {
      label: 'Mis referidos',
      route: '/referente/referidos',
      icon: 'team',
      roles: ['referente']
    },
    {
      label: 'Recompensas',
      route: '/referente/recompensas',
      icon: 'gift',
      roles: ['referente']
    },
    {
      label: 'Puntos y categorías',
      route: '/referente/puntos',
      icon: 'trophy',
      roles: ['referente']
    },
    {
      label: 'Gestión de referidos',
      route: '/asesor/referidos',
      icon: 'usergroup-add',
      roles: ['asesor']
    },
    {
      label: 'Gestión de referentes',
      route: '/asesor/referentes',
      icon: 'team',
      roles: ['asesor']
    },
    {
      label: 'Configuración',
      route: '/gerente/configuracion',
      icon: 'setting',
      roles: ['gerente']
    },
    {
      label: 'Análisis de ventas',
      route: '/gerente/analiticas',
      icon: 'line-chart',
      roles: ['gerente']
    },
    // {
    //   label: 'Equipo de ventas',
    //   route: '/gerente/equipo',
    //   icon: 'eye',
    //   roles: ['gerente']
    // },
    {
      label: 'Gestión de usuarios',
      route: '/admin/usuarios',
      icon: 'user',
      roles: ['admin']
    },
    // {
    //   label: 'Reportes del sistema',
    //   route: '/admin/logs',
    //   icon: 'setting',
    //   roles: ['admin']
    // },
    {
      label: 'Gestión de retiros',
      route: '/contador/retiros',
      icon: 'file-text',
      roles: ['contador']
    },
    {
      label: 'Reportes financieros',
      route: '/contador/reportes',
      icon: 'bar-chart',
      roles: ['contador']
    }
  ];

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.usuarioService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      this.updateMenuItems();
    });
  }

  private updateMenuItems(): void {
    if (!this.usuario) {
      this.filteredMenuItems = [];
      return;
    }

    const dynamicItems: MenuItem[] = [
      {
        label: 'Inicio',
        route: this.getDashboardRoute(),
        icon: 'home',
        roles: ['referente', 'asesor', 'gerente', 'contador', 'admin']
      },
      {
        label: 'Mi perfil',
        route: this.getProfileRoute(),
        icon: 'user',
        roles: ['referente', 'asesor', 'gerente', 'contador']
      }
    ];

    const allItems = [
      dynamicItems[0],
      ...this.baseMenuItems,
      dynamicItems[1]
    ];

    this.filteredMenuItems = allItems.filter(item =>
      item.roles.includes(this.usuario!.rol)
    );
  }

  getFilteredMenuItems(): MenuItem[] {
    return this.filteredMenuItems;
  }

  private getDashboardRoute(): string {
    if (!this.usuario) return '/dashboard';

    const roleRoutes: { [key: string]: string } = {
      'referente': '/referente/dashboard',
      'asesor': '/asesor/dashboard',
      'gerente': '/gerente/dashboard',
      'contador': '/contador/dashboard',
      'admin': '/admin/dashboard'
    };

    return roleRoutes[this.usuario.rol] || '/dashboard';
  }

  private getProfileRoute(): string {
    if (!this.usuario) return '/perfil';

    const roleRoutes: { [key: string]: string } = {
      'referente': '/referente/perfil',
      'asesor': '/asesor/perfil',
      'gerente': '/gerente/perfil',
      'contador': '/contador/perfil',
      'admin': '/admin/perfil'
    };

    return roleRoutes[this.usuario.rol] || '/perfil';
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
      'gerente': 'Gerente de Ventas',
      'contador': 'Contador'
    };
    return roles[rol as keyof typeof roles] || rol;
  }
}
