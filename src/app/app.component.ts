import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './compartidos/componentes/navbar/navbar.component';
import { UsuarioService } from './core/servicios/usuario.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'sirc-frontend';
  showBackground = false;
  showNavbar = false;
  isLoggedIn = false;

  private authRoutes = [
    '/auth/login',
    '/auth/registro',
    '/auth/forgot-password'
  ];

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    // Suscribirse al estado de login
    this.usuarioService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.updateNavbarVisibility(this.router.url);
    });

    // Verificar ruta inicial
    this.checkRoute(this.router.url);

    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }

  private checkRoute(url: string): void {
    const isAuthRoute = this.authRoutes.some(route => url.includes(route));
    this.showBackground = isAuthRoute;
    this.updateNavbarVisibility(url);
  }

  private updateNavbarVisibility(url: string): void {
    const isAuthRoute = this.authRoutes.some(route => url.includes(route));
    // Mostrar navbar solo si el usuario está loggeado Y no está en rutas de auth
    this.showNavbar = this.isLoggedIn && !isAuthRoute;
  }
}
