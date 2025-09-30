import { Component } from '@angular/core';
import { EstadoComponent } from "../estado/estado.component";

@Component({
  selector: 'app-lista',
  imports: [EstadoComponent],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent {
 totalReferidos = 55;

  referidos = [
    { id: '1001', estado: 'Aprobado', nombre: 'David Esteban', asesor: 'Pedro Pérez', recomendado: 'Carlos Beltrán', correo: 'david@example.com' },
    { id: '1002', estado: 'Pendiente', nombre: 'Laura Gómez', asesor: 'María Ruiz', recomendado: 'Ana Díaz', correo: 'laura@example.com' },
    { id: '1003', estado: 'Rechazado', nombre: 'Juan Torres', asesor: 'Pedro Pérez', recomendado: 'Carlos Beltrán', correo: 'juan@example.com' },
  ];
}
