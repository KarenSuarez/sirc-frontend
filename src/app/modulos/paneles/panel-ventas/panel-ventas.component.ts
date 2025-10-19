import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UsuarioService } from '../../../core/servicios/usuario.service';
import { Usuario } from '../../../core/modelos/usuario.interface';

@Component({
  selector: 'app-panel-ventas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './panel-ventas.component.html',
  styleUrls: ['./panel-ventas.component.css']
})
export class PanelVentasComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuarioActual();
  }
}
