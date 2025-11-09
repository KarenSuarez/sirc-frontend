import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { Usuario } from '../../../core/models/usuario.interface';

interface Estadisticas {
  referidosMes: number;
  conversiones: number;
  tasaConversion: number;
}

interface Resumen {
  totalReferentes: number;
  totalReferidos: number;
  planesActivos: number;
  comisionesTotales: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  estadisticas: Estadisticas = {
    referidosMes: 0,
    conversiones: 0,
    tasaConversion: 0,
  };

  resumen: Resumen = {
    totalReferentes: 0,
    totalReferidos: 0,
    planesActivos: 0,
    comisionesTotales: 0,
  };

  ngOnInit() {
    this.cargarEstadisticas();
    this.cargarResumen();
  }

  cargarEstadisticas() {
    this.estadisticas = {
      referidosMes: 45,
      conversiones: 32,
      tasaConversion: 71,
    };
  }

  cargarResumen() {
    this.resumen = {
      totalReferentes: 28,
      totalReferidos: 156,
      planesActivos: 3,
      comisionesTotales: 8500000,
    };
  }
}
