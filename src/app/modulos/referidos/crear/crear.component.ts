import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearComponent {
  usuario = {
    codigo: '1001200020002',
    link: 'https://clariso-cloud/?=100120023003'
  };

  mostrarModal = false; // controla el modal

  nuevoReferido = {
    nit: '',
    correo: ''
  };

  copiarLink() {
    navigator.clipboard.writeText(this.usuario.link);
    alert('¡Link copiado al portapapeles!');
  }

   abrirModal() {
    this.mostrarModal = true;
  }
   cerrarModal() {
    this.mostrarModal = false;
  }
  guardarReferido() {
    console.log('Nuevo referido:', this.nuevoReferido);
    this.cerrarModal();
    alert('Referido agregado correctamente');
  }
}
