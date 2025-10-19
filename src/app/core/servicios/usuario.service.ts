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

  // Usuarios mock para pruebas (eliminar cuando tengas backend)
  private usuariosMock: Usuario[] = [
    {
      id: '1',
      nombre: 'Juan Pérez',
      correo: 'juan@clarisa.com',
      tipoDoc: 'CC',
      documento: '1234567890',
      telefono: '3001234567',
      fechaNacimiento: '1990-01-01',
      rol: 'referente',
      codigo: 'REF-001',
      link: 'https://clarisa.com/ref/REF-001',
      puntos: 150,
      referidos: 5,
      creditos: 500000,
      categoria: 'Oro',
      avatar: ''
    },
    {
      id: '2',
      nombre: 'María García',
      correo: 'maria@clarisa.com',
      tipoDoc: 'CC',
      documento: '9876543210',
      telefono: '3009876543',
      fechaNacimiento: '1985-05-15',
      rol: 'asesor',
      avatar: ''
    },
    {
      id: '3',
      nombre: 'Carlos Rodríguez',
      correo: 'carlos@clarisa.com',
      tipoDoc: 'CC',
      documento: '5555555555',
      telefono: '3005555555',
      fechaNacimiento: '1980-08-20',
      rol: 'admin',
      avatar: ''
    },
    {
      id: '4',
      nombre: 'Ana Martínez',
      correo: 'ana@clarisa.com',
      tipoDoc: 'CC',
      documento: '7777777777',
      telefono: '3007777777',
      fechaNacimiento: '1992-12-10',
      rol: 'contador',
      avatar: ''
    }
  ];

  // Credenciales mock (NIT/Documento : Contraseña)
  private credencialesMock: { [key: string]: string } = {
    '1234567890': 'test123', // Referente
    '9876543210': 'test123', // Asesor
    '5555555555': 'test123', // Admin
    '7777777777': 'test123'  // Contador
  };

  constructor() {
    this.loadUsuarioFromStorage();
  }

  private loadUsuarioFromStorage(): void {
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      const usuario = JSON.parse(usuarioData);
      this.usuarioSubject.next(usuario);
      this.isLoggedInSubject.next(true);
    }
  }

  /**
   * Método de login con datos mock
   * @param nit - NIT o cédula del usuario
   * @param password - Contraseña del usuario
   * @returns Observable con el resultado del login
   */
  login(nit: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        // Verificar credenciales mock
        if (this.credencialesMock[nit] === password) {
          // Buscar usuario por documento
          const usuario = this.usuariosMock.find(u => u.documento === nit);

          if (usuario) {
            this.setUsuario(usuario);
            observer.next(true);
          } else {
            observer.next(false);
          }
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000); // Simular delay de 1 segundo
    });
  }

  setUsuario(usuario: Usuario): void {
    this.usuarioSubject.next(usuario);
    this.isLoggedInSubject.next(true);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  /**
   * Actualiza la información del usuario
   * @param usuarioActualizado - Usuario con datos actualizados
   */
  updateUsuario(usuarioActualizado: Usuario): void {
    // Actualizar en el array mock (en producción esto sería una llamada HTTP)
    const index = this.usuariosMock.findIndex(u => u.id === usuarioActualizado.id);
    if (index !== -1) {
      this.usuariosMock[index] = usuarioActualizado;
    }

    // Actualizar el usuario actual en el BehaviorSubject y localStorage
    this.usuarioSubject.next(usuarioActualizado);
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
  }

  /**
   * Cambia la contraseña del usuario (mock)
   * @param currentPassword - Contraseña actual
   * @param newPassword - Nueva contraseña
   * @returns Observable con el resultado
   */
  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const usuario = this.getUsuarioActual();

        if (!usuario) {
          observer.next(false);
          observer.complete();
          return;
        }

        // Verificar contraseña actual
        if (this.credencialesMock[usuario.documento] === currentPassword) {
          // Actualizar contraseña en mock
          this.credencialesMock[usuario.documento] = newPassword;
          observer.next(true);
        } else {
          observer.next(false);
        }

        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.usuarioSubject.next(null);
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('usuario');
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * Obtiene la ruta del panel según el rol del usuario
   * @param rol - Rol del usuario
   * @returns Ruta del panel correspondiente
   */
  getPanelRouteByRole(rol: string): string {
    const panelRoutes: { [key: string]: string } = {
      'referente': '/paneles/referente',
      'asesor': '/paneles/asesor',
      'admin': '/paneles/admin',
      'contador': '/paneles/contador'
    };

    return panelRoutes[rol] || '/dashboard';
  }
}
