import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageService } from 'ng-zorro-antd/message';

interface KPI {
  totalReferidos: number;
  referidosTendencia: number;
  tasaConversion: number;
  comisionesTotales: number;
  referentesActivos: number;
}

interface DatoMes {
  mes: string;
  valor: number;
}

interface EstadoDistribucion {
  nombre: string;
  cantidad: number;
  porcentaje: number;
  color: string;
  icono: string;
  destacado: boolean;
}

interface PlanTop {
  nombre: string;
  ventas: number;
  ingresos: number;
  porcentaje: number;
  color: string;
}

interface ReferenteTop {
  nombre: string;
  iniciales: string;
  referidos: number;
  conversiones: number;
  nivel: string;
  nivelColor: string;
}

interface Resumen {
  periodo: string;
  referidos: number;
  conversiones: number;
  tasaConversion: number;
  comisiones: number;
  promedioReferido: number;
}

interface Insight {
  tipo: 'success' | 'info' | 'warning' | 'error';
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-analiticas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzStatisticModule,
    NzIconModule,
    NzButtonModule,
    NzDatePickerModule,
    NzProgressModule,
    NzTagModule,
    NzTableModule,
    NzSpinModule,
    NzAlertModule
  ],
  templateUrl: './analiticas.component.html',
  styleUrl: './analiticas.component.css'
})
export class AnaliticasComponent implements OnInit {
  rangoFechas: Date[] = [];
  cargandoGraficos = false;
  cargandoTabla = false;

  kpis: KPI = {
    totalReferidos: 0,
    referidosTendencia: 0,
    tasaConversion: 0,
    comisionesTotales: 0,
    referentesActivos: 0
  };

  datosReferidosMes: DatoMes[] = [];
  maxReferidosMes = 0;

  estadosDistribucion: EstadoDistribucion[] = [];
  planesTop: PlanTop[] = [];
  referentesTop: ReferenteTop[] = [];
  datosResumen: Resumen[] = [];
  insights: Insight[] = [];

  constructor(private message: NzMessageService) {}

  ngOnInit() {
    this.inicializarFechas();
    this.cargarDatos();
  }

  inicializarFechas() {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    this.rangoFechas = [hace30Dias, hoy];
  }

  cargarDatos() {
    this.cargarKPIs();
    this.cargarDatosReferidosMes();
    this.cargarEstadosDistribucion();
    this.cargarPlanesTop();
    this.cargarReferentesTop();
    this.cargarResumen();
    this.cargarInsights();
  }

  cargarKPIs() {
    // Simulación de datos
    this.kpis = {
      totalReferidos: 156,
      referidosTendencia: 12.5,
      tasaConversion: 68.4,
      comisionesTotales: 8500000,
      referentesActivos: 28
    };
  }

  cargarDatosReferidosMes() {
    this.cargandoGraficos = true;

    setTimeout(() => {
      this.datosReferidosMes = [
        { mes: 'Ene', valor: 12 },
        { mes: 'Feb', valor: 18 },
        { mes: 'Mar', valor: 25 },
        { mes: 'Abr', valor: 20 },
        { mes: 'May', valor: 32 },
        { mes: 'Jun', valor: 28 }
      ];

      this.maxReferidosMes = Math.max(...this.datosReferidosMes.map(d => d.valor));
      this.cargandoGraficos = false;
    }, 800);
  }

  cargarEstadosDistribucion() {
    const total = 156;

    this.estadosDistribucion = [
      {
        nombre: 'Activos',
        cantidad: 89,
        porcentaje: Math.round((89 / total) * 100),
        color: '#52c41a',
        icono: 'check-circle',
        destacado: true
      },
      {
        nombre: 'Contactados',
        cantidad: 35,
        porcentaje: Math.round((35 / total) * 100),
        color: '#1890ff',
        icono: 'phone',
        destacado: false
      },
      {
        nombre: 'Pendientes',
        cantidad: 24,
        porcentaje: Math.round((24 / total) * 100),
        color: '#faad14',
        icono: 'clock-circle',
        destacado: false
      },
      {
        nombre: 'Rechazados',
        cantidad: 8,
        porcentaje: Math.round((8 / total) * 100),
        color: '#ff4d4f',
        icono: 'close-circle',
        destacado: false
      }
    ];
  }

  cargarPlanesTop() {
    this.planesTop = [
      {
        nombre: 'Plan Profesional',
        ventas: 45,
        ingresos: 6750000,
        porcentaje: 50,
        color: '#1890ff'
      },
      {
        nombre: 'Plan Básico',
        ventas: 32,
        ingresos: 2560000,
        porcentaje: 36,
        color: '#52c41a'
      },
      {
        nombre: 'Plan Empresarial',
        ventas: 12,
        ingresos: 3600000,
        porcentaje: 13,
        color: '#722ed1'
      }
    ];
  }

  cargarReferentesTop() {
    this.referentesTop = [
      {
        nombre: 'María González',
        iniciales: 'MG',
        referidos: 15,
        conversiones: 12,
        nivel: 'Oro',
        nivelColor: 'gold'
      },
      {
        nombre: 'Carlos Ramírez',
        iniciales: 'CR',
        referidos: 12,
        conversiones: 10,
        nivel: 'Plata',
        nivelColor: 'default'
      },
      {
        nombre: 'Ana Martínez',
        iniciales: 'AM',
        referidos: 11,
        conversiones: 9,
        nivel: 'Platino',
        nivelColor: 'purple'
      },
      {
        nombre: 'Pedro Sánchez',
        iniciales: 'PS',
        referidos: 8,
        conversiones: 6,
        nivel: 'Plata',
        nivelColor: 'default'
      },
      {
        nombre: 'Luis Hernández',
        iniciales: 'LH',
        referidos: 7,
        conversiones: 5,
        nivel: 'Bronce',
        nivelColor: 'orange'
      }
    ];
  }

  cargarResumen() {
    this.cargandoTabla = true;

    setTimeout(() => {
      this.datosResumen = [
        {
          periodo: 'Junio 2024',
          referidos: 28,
          conversiones: 19,
          tasaConversion: 68,
          comisiones: 1850000,
          promedioReferido: 66071
        },
        {
          periodo: 'Mayo 2024',
          referidos: 32,
          conversiones: 23,
          tasaConversion: 72,
          comisiones: 2100000,
          promedioReferido: 65625
        },
        {
          periodo: 'Abril 2024',
          referidos: 20,
          conversiones: 14,
          tasaConversion: 70,
          comisiones: 1400000,
          promedioReferido: 70000
        },
        {
          periodo: 'Marzo 2024',
          referidos: 25,
          conversiones: 18,
          tasaConversion: 72,
          comisiones: 1750000,
          promedioReferido: 70000
        }
      ];

      this.cargandoTabla = false;
    }, 1000);
  }

  cargarInsights() {
    this.insights = [
      {
        tipo: 'success',
        titulo: 'Excelente tasa de conversión',
        descripcion: 'La tasa de conversión del 68.4% está por encima del promedio de la industria (45-55%). ¡Sigue así!'
      },
      {
        tipo: 'info',
        titulo: 'Crecimiento sostenido',
        descripcion: 'Los referidos han aumentado un 12.5% este mes comparado con el anterior. Considera aumentar los incentivos para mantener el momentum.'
      },
      {
        tipo: 'warning',
        titulo: 'Atención a pendientes',
        descripcion: 'Hay 24 referidos pendientes de contacto. Asigna recursos para reducir este número y mejorar la conversión.'
      }
    ];
  }

  cambiarRangoFechas() {
    if (this.rangoFechas && this.rangoFechas.length === 2) {
      this.message.info('Actualizando datos...');
      this.cargarDatos();
    }
  }

  exportarReporte() {
    this.message.success('Generando reporte... Se descargará en breve');
    // Aquí iría la lógica de exportación
  }

  getMedalIcon(index: number): string {
    const icons = ['trophy', 'trophy', 'trophy'];
    return icons[index];
  }

  getMedalColor(index: number): string {
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    return colors[index];
  }

  getProgressColorByValue(value: number): string {
    if (value >= 70) return '#52c41a';
    if (value >= 50) return '#1890ff';
    if (value >= 30) return '#faad14';
    return '#ff4d4f';
  }

  percentFormat = (percent: number): string => `${percent}%`;
}
