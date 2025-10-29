import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

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
    NzModalModule
  ],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent implements OnInit {
  estadisticas: Estadisticas = {
    planesActivos: 0,
    nivelesConfigurados: 0,
    insigniasDisponibles: 0
  };

  alertas: Alerta[] = [];

  constructor(
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.cargarEstadisticas();
    this.cargarAlertas();
  }

  cargarEstadisticas() {
    // Simulación de datos
    this.estadisticas = {
      planesActivos: 3,
      nivelesConfigurados: 4,
      insigniasDisponibles: 8
    };
  }

  cargarAlertas() {
    // Simulación de alertas
    this.alertas = [
      {
        tipo: 'info',
        titulo: 'Sistema optimizado',
        descripcion: 'El sistema de gamificación está funcionando correctamente y motivando a los referentes.'
      },
      {
        tipo: 'warning',
        titulo: 'Revisar niveles',
        descripcion: 'Es recomendable revisar los requisitos de puntos para los niveles cada trimestre.'
      }
    ];
  }

  resetearGamificacion() {
    this.modal.confirm({
      nzTitle: '¿Reiniciar Sistema de Gamificación?',
      nzContent: 'Esta acción reiniciará todos los puntos e insignias de los referentes. Esta acción es irreversible. ¿Deseas continuar?',
      nzOkText: 'Sí, reiniciar',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.message.warning('Reiniciando sistema de gamificación...');
        // Aquí iría la lógica de reinicio
      }
    });
  }

  exportarConfiguracion() {
    this.message.success('Exportando configuración...');
    // Aquí iría la lógica de exportación
  }

  importarConfiguracion() {
    this.message.info('Abriendo selector de archivos...');
    // Aquí iría la lógica de importación
  }

  verHistorialCambios() {
    this.message.info('Cargando historial de cambios...');
    // Aquí iría la navegación al historial
  }
}
