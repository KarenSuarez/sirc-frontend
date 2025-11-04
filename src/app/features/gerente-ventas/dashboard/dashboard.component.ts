import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { GerenteService } from '../../../core/services/gerente.service';
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
    NzSpaceModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  estadisticas: Estadisticas = {
    referidosMes: 0,
    conversiones: 0,
    tasaConversion: 0
  };

  resumen: Resumen = {
    totalReferentes: 0,
    totalReferidos: 0,
    planesActivos: 0,
    comisionesTotales: 0
  };
  cargando = false;
  error: string | null = null;
  constructor(private gerenteService: GerenteService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.error = null;

    // 🔹 Llamar a las estadísticas del backend
    this.gerenteService.getEstadisticas().subscribe({
      next: (data: any) => {
        this.estadisticas = {
          referidosMes: data.referidosMes ?? 0,
          conversiones: data.conversiones ?? 0,
          tasaConversion: data.tasaConversion ?? 0
        };
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        this.error = 'No se pudieron cargar las estadísticas.';
      }
    });

    // 🔹 Llamar al resumen del backend (si viene separado)
    this.gerenteService.getAsesores().subscribe({
      next: (data: any[]) => {
        this.resumen = {
          totalReferentes: data.length ?? 0,
          totalReferidos: data.reduce((acc, a) => acc + (a.referidos || 0), 0),
          planesActivos: 3, // TODO: reemplazar cuando el backend lo devuelva
          comisionesTotales: 8500000 // TODO: idem
        };
      },
      error: (err) => {
        console.error('Error al cargar resumen:', err);
        this.error = 'No se pudo cargar el resumen.';
      },
      complete: () => (this.cargando = false)
    });
  }

  
/*  ngOnInit() {
    this.cargarEstadisticas();
    this.cargarResumen();
  }
  cargarEstadisticas() {
    // Simulación de datos
    this.estadisticas = {
      referidosMes: 45,
      conversiones: 32,
      tasaConversion: 71
    };
  }

  cargarResumen() {
    // Simulación de datos
    this.resumen = {
      totalReferentes: 28,
      totalReferidos: 156,
      planesActivos: 3,
      comisionesTotales: 8500000
    };
  }
*/
}
