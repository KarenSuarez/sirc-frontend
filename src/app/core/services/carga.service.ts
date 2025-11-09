import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CargaService {
  private cargandoSignal = signal<boolean>(false);
  private contadorPeticiones = 0;

  readonly estaCargando = this.cargandoSignal.asReadonly();

  constructor() {}

  iniciar(): void {
    this.contadorPeticiones++;
    this.cargandoSignal.set(true);
  }

  finalizar(): void {
    this.contadorPeticiones = Math.max(0, this.contadorPeticiones - 1);

    if (this.contadorPeticiones === 0) {
      setTimeout(() => {
        if (this.contadorPeticiones === 0) {
          this.cargandoSignal.set(false);
        }
      }, 200);
    }
  }

  detener(): void {
    this.contadorPeticiones = 0;
    this.cargandoSignal.set(false);
  }

  obtenerEstado(): boolean {
    return this.cargandoSignal();
  }
}
