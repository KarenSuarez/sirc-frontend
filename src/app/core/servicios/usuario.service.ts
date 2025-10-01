import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    this.checkStoredUser();
  }

  private checkStoredUser(): void {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      this.usuarioSubject.next(usuario);
      this.isLoggedInSubject.next(true);
    }
  }

  login(nit: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      // Simulación de autenticación - reemplazar con API real
      setTimeout(() => {
        if (nit === '12345678' && password === 'test123') {
          const usuario: Usuario = {
            id: '1',
            nombre: 'Luis Pepito Pérez',
            correo: 'luis.pepito@example.com',
            tipoDoc: 'CC',
            documento: '1001222333',
            telefono: '3213331111',
            fechaNacimiento: '1990-02-15',
            rol: 'referente',
            codigo: '1001200020002',
            link: 'https://clarisa-cloud.com/ref/1001200020002',
            puntos: 3000,
            referidos: 150,
            creditos: 350000,
            categoria: 'A'
          };

          this.setUsuario(usuario);
          observer.next(true);
        } else if (nit === '87654321' && password === 'test123') {
          const usuario: Usuario = {
            id: '2',
            nombre: 'María González',
            correo: 'maria.gonzalez@example.com',
            tipoDoc: 'CC',
            documento: '87654321',
            telefono: '3198765432',
            fechaNacimiento: '1985-05-20',
            rol: 'asesor',
            puntos: 0,
            referidos: 0,
            creditos: 0,
            categoria: ''
          };

          this.setUsuario(usuario);
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  private setUsuario(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  getCurrentUser(): Usuario | null {
    return this.usuarioSubject.value;
  }

  updateUsuario(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  hasRole(roles: string[]): boolean {
    const usuario = this.getCurrentUser();
    return usuario ? roles.includes(usuario.rol) : false;
  }
}
