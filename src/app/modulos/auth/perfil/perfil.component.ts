import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
 usuario = {
    nombre: 'Luis Pepito Pérez',
    correo: 'luis.pepito@example.com',
    tipoDoc: 'Documento',
    documento: '1001222333',
    telefono: '3213331111',
    fechaNacimiento: '30/Febrero/2026',
    codigo: '1001200020002',
    link: 'https://clariso-cloud/?=100120023003'
  };
  copiarLink() {
    navigator.clipboard.writeText(this.usuario.link);
    alert('¡Link copiado al portapapeles!');
  }
}
