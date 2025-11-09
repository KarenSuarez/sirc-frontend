import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlmacenamientoService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly REMEMBER_KEY = 'remember_me';

  constructor() {}

  guardarToken(token: string, recordar: boolean = false): void {
    if (recordar) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  obtenerToken(): string | null {
    return (
      localStorage.getItem(this.TOKEN_KEY) ||
      sessionStorage.getItem(this.TOKEN_KEY)
    );
  }

  eliminarToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  guardarUsuario(usuario: any, recordar: boolean = false): void {
    const usuarioString = JSON.stringify(usuario);
    if (recordar) {
      localStorage.setItem(this.USER_KEY, usuarioString);
    } else {
      sessionStorage.setItem(this.USER_KEY, usuarioString);
    }
  }

  obtenerUsuario<T = any>(): T | null {
    const usuarioString =
      localStorage.getItem(this.USER_KEY) ||
      sessionStorage.getItem(this.USER_KEY);

    if (!usuarioString) return null;

    try {
      return JSON.parse(usuarioString) as T;
    } catch {
      return null;
    }
  }

  eliminarUsuario(): void {
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  guardarRecordar(recordar: boolean): void {
    localStorage.setItem(this.REMEMBER_KEY, recordar.toString());
  }

  debeRecordar(): boolean {
    return localStorage.getItem(this.REMEMBER_KEY) === 'true';
  }

  limpiarSesion(): void {
    this.eliminarToken();
    this.eliminarUsuario();
  }

  limpiarTodo(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

  guardar(key: string, valor: any, recordar: boolean = false): void {
    const valorString = JSON.stringify(valor);
    if (recordar) {
      localStorage.setItem(key, valorString);
    } else {
      sessionStorage.setItem(key, valorString);
    }
  }

  obtener<T = any>(key: string): T | null {
    const valorString =
      localStorage.getItem(key) || sessionStorage.getItem(key);

    if (!valorString) return null;

    try {
      return JSON.parse(valorString) as T;
    } catch {
      return valorString as any;
    }
  }

  eliminar(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}
