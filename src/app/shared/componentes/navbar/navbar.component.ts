import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioHelperService } from '../../../core/services/usuario-helper.service';
import { UsuarioAutenticado } from '../../../core/models/usuario.interface';


interface MenuItem {
  label: string;
  route: string;
  icon: string;
  roles: string[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, NzIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  usuario: UsuarioAutenticado | null = null;
  showUserMenu = false;
  filteredMenuItems: MenuItem[] = [];
  puntosReferente = 0;

  private destroy$ = new Subject<void>();

  private baseMenuItems: MenuItem[] = [
    {
      label: 'Mis referidos',
      route: '/referente/referidos',
      icon: 'team',
      roles: ['referente'],
    },
    {
      label: 'Recompensas',
      route: '/referente/recompensas',
      icon: 'gift',
      roles: ['referente'],
    },
    {
      label: 'Puntos y niveles',
      route: '/referente/puntos',
      icon: 'trophy',
      roles: ['referente'],
    },
    {
      label: 'Gestión de referidos',
      route: '/asesor/referidos',
      icon: 'usergroup-add',
      roles: ['asesor_ventas'],
    },
    {
      label: 'Gestión de referentes',
      route: '/asesor/referentes',
      icon: 'team',
      roles: ['asesor_ventas'],
    },
    {
      label: 'Configuración',
      route: '/gerente/configuracion',
      icon: 'setting',
      roles: ['gerente_ventas'],
    },
    {
      label: 'Análisis de ventas',
      route: '/gerente/analiticas',
      icon: 'line-chart',
      roles: ['gerente_ventas'],
    },
    {
      label: 'Gestión de usuarios',
      route: '/admin/usuarios',
      icon: 'user',
      roles: ['administrador'],
    },
    {
      label: 'Gestión de retiros',
      route: '/contador/retiros',
      icon: 'file-text',
      roles: ['contador'],
    },
    {
      label: 'Reportes financieros',
      route: '/contador/reportes',
      icon: 'bar-chart',
      roles: ['contador'],
    },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    public usuarioHelper: UsuarioHelperService
  ) {}

  ngOnInit() {
    this.authService.usuario$
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario) => {
        this.usuario = usuario;
        this.updateMenuItems();
        this.cargarPuntosReferente();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
        roles: [
          'referente',
          'asesor_ventas',
          'gerente_ventas',
          'contador',
          'administrador',
        ],
      },
      {
        label: 'Mi perfil',
        route: this.getProfileRoute(),
        icon: 'user',
        roles: ['referente', 'asesor_ventas', 'gerente_ventas', 'contador'],
      },
    ];

    const allItems = [dynamicItems[0], ...this.baseMenuItems, dynamicItems[1]];

    this.filteredMenuItems = allItems.filter((item) =>
      this.tieneAlgunRol(item.roles)
    );
  }

  private cargarPuntosReferente(): void {
    if (this.usuarioHelper.esReferente) {
      this.usuarioHelper.obtenerPuntosActuales().subscribe({
        next: (puntos) => {
          this.puntosReferente = puntos;
        },
        error: (error) => {
          console.error('Error al cargar puntos:', error);
        },
      });
    }
  }

  getFilteredMenuItems(): MenuItem[] {
    return this.filteredMenuItems;
  }

  private getDashboardRoute(): string {
    return this.authService.obtenerDashboardRuta();
  }

  getProfileRoute(): string {
    if (!this.usuario) return '/perfil';

    const roleRoutes: { [key: string]: string } = {
      referente: '/referente/perfil',
      asesor_ventas: '/asesor/perfil',
      gerente_ventas: '/gerente/perfil',
      contador: '/contador/perfil',
      administrador: '/admin/perfil',
    };

    const primerRol = this.usuario.roles[0]?.toLowerCase() || '';
    return roleRoutes[primerRol] || '/perfil';
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
    });
  }

  private tieneAlgunRol(roles: string[]): boolean {
    return this.authService.tieneAlgunRol(roles);
  }

  get nombreCompleto(): string {
    return this.usuarioHelper.nombreCompleto;
  }

  get iniciales(): string {
    return this.usuarioHelper.iniciales;
  }

  get rolDisplay(): string {
    const primerRol = this.usuario?.roles[0] || '';
    return this.getRoleDisplayName(primerRol);
  }

  get esReferente(): boolean {
    return this.usuarioHelper.esReferente;
  }

  getRoleDisplayName(rol: string): string {
    const roles: Record<string, string> = {
      referente: 'Referente',
      asesor_ventas: 'Asesor de Ventas',
      administrador: 'Administrador',
      gerente_ventas: 'Gerente de Ventas',
      contador: 'Contador',
    };
    return roles[rol.toLowerCase()] || rol;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.user-profile');
    if (!clickedInside) {
      this.showUserMenu = false;
    }
  }

    @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.user-profile');
    if (!clickedInside) {
      this.showUserMenu = false;
    }
  }

}
