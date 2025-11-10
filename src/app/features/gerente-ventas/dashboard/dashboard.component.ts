import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';

import { GerenteService } from '../../../core/services/gerente.service';
import { PlanService } from '../../../core/services/plan.service';
import { NivelService } from '../../../core/services/nivel.service';
import { InsigniaService } from '../../../core/services/insignia.service';
import { DashboardKPIs } from '../../../core/models/kpi.interface';

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
    NzSpinModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  cargando = true;

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

  private destroy$ = new Subject<void>();

  constructor(
    private gerenteService: GerenteService,
    private planService: PlanService,
    private nivelService: NivelService,
    private insigniaService: InsigniaService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar todos los datos del dashboard
   */
  cargarDatos() {
    this.cargando = true;

    forkJoin({
      dashboard: this.gerenteService.obtenerDashboardKPIs(),
      planes: this.planService.listarPlanesConFiltros('activo'),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.procesarDashboardKPIs(data.dashboard);
          this.resumen.planesActivos = data.planes.length;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar dashboard:', error);
          this.message.error('Error al cargar datos del dashboard');
          this.cargando = false;
        },
      });
  }

  /**
   * Procesar KPIs del dashboard
   */
  procesarDashboardKPIs(data: DashboardKPIs) {
    // Resumen
    this.resumen.totalReferentes = data.generales.referentes.activos;
    this.resumen.totalReferidos = data.generales.referidos.total;
    this.resumen.comisionesTotales = data.generales.comisiones_total;

    // Estadísticas (calculadas - estos datos deberían venir del backend)
    this.estadisticas.referidosMes = data.generales.referidos.activos;
    this.estadisticas.conversiones = data.generales.referidos.activos;

    // Calcular tasa de conversión
    if (data.generales.referidos.total > 0) {
      this.estadisticas.tasaConversion = Math.round(
        (data.generales.referidos.activos / data.generales.referidos.total) * 100
      );
    }
  }
}
