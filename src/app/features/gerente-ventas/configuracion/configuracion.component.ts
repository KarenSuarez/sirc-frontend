import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, forkJoin, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { PlanService } from '../../../core/services/plan.service';
import { NivelService } from '../../../core/services/nivel.service';
import { InsigniaService } from '../../../core/services/insignia.service';

interface Estadisticas {
  planesActivos: number;
  nivelesConfigurados: number;
  insigniasDisponibles: number;
}

interface Alerta {
  tipo: 'success' | 'info' | 'warning' | 'error';
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzAlertModule,
    NzToolTipModule,
    NzMessageModule,
    NzModalModule,
    NzSpinModule,
  ],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css',
})
export class ConfiguracionComponent implements OnInit, OnDestroy {
  cargando = true;

  estadisticas: Estadisticas = {
    planesActivos: 0,
    nivelesConfigurados: 0,
    insigniasDisponibles: 0,
  };

  alertas: Alerta[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private planService: PlanService,
    private nivelService: NivelService,
    private insigniaService: InsigniaService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar estadísticas desde backend
   */
  cargarEstadisticas() {
    this.cargando = true;

    forkJoin({
      planes: this.planService.listarPlanesConFiltros('activo'),
      niveles: this.nivelService.listarNiveles(),
      insignias: this.insigniaService.listarInsignias('activa'),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.estadisticas = {
            planesActivos: data.planes.length,
            nivelesConfigurados: data.niveles.length,
            insigniasDisponibles: data.insignias.length,
          };

          this.generarAlertas(data);
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar estadísticas:', error);
          this.message.error('Error al cargar estadísticas de configuración');
          this.cargando = false;
        },
      });
  }

  /**
   * Generar alertas automáticas
   */
  generarAlertas(data: any) {
    this.alertas = [];

    // Verificar planes
    if (data.planes.length === 0) {
      this.alertas.push({
        tipo: 'warning',
        titulo: 'Sin planes activos',
        descripcion:
          'No hay planes activos en el sistema. Crea al menos un plan para que los referentes puedan generar comisiones.',
      });
    } else if (data.planes.length < 3) {
      this.alertas.push({
        tipo: 'info',
        titulo: 'Pocos planes disponibles',
        descripcion:
          'Se recomienda tener al menos 3 planes con diferentes rangos de precio para maximizar las conversiones.',
      });
    }

    // Verificar niveles
    if (data.niveles.length < 4) {
      this.alertas.push({
        tipo: 'info',
        titulo: 'Sistema de niveles básico',
        descripcion:
          'Considera agregar más niveles de gamificación para motivar a los referentes a largo plazo.',
      });
    }

    // Verificar insignias
    if (data.insignias.length < 5) {
      this.alertas.push({
        tipo: 'info',
        titulo: 'Pocas insignias disponibles',
        descripcion:
          'Crear más insignias puede aumentar el engagement de los referentes.',
      });
    }

    // Si todo está bien
    if (this.alertas.length === 0) {
      this.alertas.push({
        tipo: 'success',
        titulo: 'Sistema optimizado',
        descripcion:
          'El sistema de gamificación está funcionando correctamente y motivando a los referentes.',
      });
    }
  }

  /**
   * Reiniciar gamificación
   */
  resetearGamificacion() {
    this.modal.confirm({
      nzTitle: '¿Reiniciar Sistema de Gamificación?',
      nzContent:
        'Esta acción reiniciará todos los puntos e insignias de los referentes. Esta acción es irreversible. ¿Deseas continuar?',
      nzOkText: 'Sí, reiniciar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.message.warning('Reiniciando sistema de gamificación...');
        // Aquí iría la lógica de reinicio
      },
    });
  }

  /**
   * Exportar configuración
   */
  exportarConfiguracion() {
    this.message.success('Exportando configuración...');
    // Aquí iría la lógica de exportación
  }

  /**
   * Importar configuración
   */
  importarConfiguracion() {
    this.message.info('Abriendo selector de archivos...');
    // Aquí iría la lógica de importación
  }

  /**
   * Ver historial de cambios
   */
  verHistorialCambios() {
    this.message.info('Cargando historial de cambios...');
    // Aquí iría la navegación al historial
  }
}
