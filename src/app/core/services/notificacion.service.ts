import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export type TipoNotificacion = 'success' | 'error' | 'warning' | 'info';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {
  constructor(
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  exito(mensaje: string): void {
    this.message.success(mensaje);
  }

  error(mensaje: string): void {
    this.message.error(mensaje);
  }

  advertencia(mensaje: string): void {
    this.message.warning(mensaje);
  }

  info(mensaje: string): void {
    this.message.info(mensaje);
  }

  cargando(mensaje: string = 'Cargando...'): string {
    return this.message.loading(mensaje, { nzDuration: 0 }).messageId;
  }

  removerMensaje(id: string): void {
    this.message.remove(id);
  }

  notificarExito(titulo: string, mensaje: string): void {
    this.notification.success(titulo, mensaje);
  }

  notificarError(titulo: string, mensaje: string): void {
    this.notification.error(titulo, mensaje);
  }

  notificarAdvertencia(titulo: string, mensaje: string): void {
    this.notification.warning(titulo, mensaje);
  }

  notificarInfo(titulo: string, mensaje: string): void {
    this.notification.info(titulo, mensaje);
  }

  notificar(
    tipo: TipoNotificacion,
    titulo: string,
    mensaje: string,
    duracion: number = 4500
  ): void {
    this.notification.create(tipo, titulo, mensaje, { nzDuration: duracion });
  }

  limpiarTodo(): void {
    this.message.remove();
    this.notification.remove();
  }
}
