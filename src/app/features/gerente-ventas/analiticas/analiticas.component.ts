import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin, takeUntil } from 'rxjs';

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

import { GerenteService } from '../../../core/services/gerente.service';
import {
  KPIsGenerales,
  KPIsReferentes,
  KPIsComisiones,
  TopReferente,
  ComisionPorPlan,
} from '../../../core/models/kpi.interface';

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
    NzAlertModule,
  ],
  templateUrl: './analiticas.component.html',
  styleUrl: './analiticas.component.css',
})
export class AnaliticasComponent implements OnInit, OnDestroy {
  rangoFechas: Date[] = [];
  cargandoGraficos = false;
  cargandoTabla = false;

  kpis: KPI = {
    totalReferidos: 0,
    referidosTendencia: 0,
    tasaConversion: 0,
    comisionesTotales: 0,
    referentesActivos: 0,
  };

  datosReferidosMes: DatoMes[] = [];
  maxReferidosMes = 0;

  estadosDistribucion: EstadoDistribucion[] = [];
  planesTop: PlanTop[] = [];
  referentesTop: ReferenteTop[] = [];
  datosResumen: Resumen[] = [];
  insights: Insight[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private gerenteService: GerenteService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.inicializarFechas();
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  inicializarFechas() {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    this.rangoFechas = [hace30Dias, hoy];
  }

  /**
   * Cargar todos los datos desde el backend
   */
  cargarDatos() {
    this.cargandoGraficos = true;
    this.cargandoTabla = true;

    forkJoin({
      generales: this.gerenteService.obtenerKPIsGenerales(),
      referentes: this.gerenteService.obtenerKPIsReferentes(),
      comisiones: this.gerenteService.obtenerKPIsComisiones(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.procesarKPIsGenerales(data.generales);
          this.procesarKPIsReferentes(data.referentes);
          this.procesarKPIsComisiones(data.comisiones);
          this.generarInsights(data.generales);

          this.cargandoGraficos = false;
          this.cargandoTabla = false;
        },
        error: (error) => {
          console.error('Error al cargar analíticas:', error);
          this.message.error('Error al cargar analíticas');
          this.cargandoGraficos = false;
          this.cargandoTabla = false;
        },
      });
  }

  /**
   * Procesar KPIs generales
   */
  procesarKPIsGenerales(data: KPIsGenerales) {
    this.kpis.totalReferidos = data.referidos.total;
    this.kpis.referentesActivos = data.usuarios.referentes.activos;
    this.kpis.comisionesTotales = data.comisiones.total;

    // Calcular tasa de conversión
    if (data.referidos.total > 0) {
      this.kpis.tasaConversion = parseFloat(
        ((data.referidos.activos / data.referidos.total) * 100).toFixed(1)
      );
    }

    // Tendencia (simulada - debería venir del backend)
    this.kpis.referidosTendencia = 12.5;

    // Distribución por estados
    this.estadosDistribucion = [
      {
        nombre: 'Activos',
        cantidad: data.referidos.activos,
        porcentaje: Math.round((data.referidos.activos / data.referidos.total) * 100),
        color: '#52c41a',
        icono: 'check-circle',
        destacado: true,
      },
      {
        nombre: 'Pendientes',
        cantidad: data.referidos.pendientes,
        porcentaje: Math.round((data.referidos.pendientes / data.referidos.total) * 100),
        color: '#faad14',
        icono: 'clock-circle',
        destacado: false,
      },
    ];
  }

  /**
   * Procesar KPIs de referentes
   */
  procesarKPIsReferentes(data: KPIsReferentes) {
    // Top referentes
    this.referentesTop = data.top_puntos.slice(0, 5).map((ref, index) => ({
      nombre: `${ref.usuario.nombre} ${ref.usuario.apellido}`,
      iniciales: `${ref.usuario.nombre.charAt(0)}${ref.usuario.apellido.charAt(0)}`.toUpperCase(),
      referidos: 0, // Esto debería venir de top_referidos
      conversiones: 0, // Calculado
      nivel: this.obtenerNivelPorPuntos(ref.puntos_actuales || 0),
      nivelColor: this.obtenerColorNivel(ref.puntos_actuales || 0),
    }));

    // Combinar con datos de referidos
    data.top_referidos.slice(0, 5).forEach((refReferidos, index) => {
      if (this.referentesTop[index]) {
        this.referentesTop[index].referidos = refReferidos.total_referidos;
      }
    });

    // Datos para gráfico de meses (simulados - deberían venir del backend)
    this.datosReferidosMes = [
      { mes: 'Ene', valor: 12 },
      { mes: 'Feb', valor: 18 },
      { mes: 'Mar', valor: 25 },
      { mes: 'Abr', valor: 20 },
      { mes: 'May', valor: 32 },
      { mes: 'Jun', valor: 28 },
    ];
    this.maxReferidosMes = Math.max(...this.datosReferidosMes.map((d) => d.valor));
  }

  /**
   * Procesar KPIs de comisiones
   */
  procesarKPIsComisiones(data: KPIsComisiones) {
    // Top planes
    this.planesTop = data.por_plan.slice(0, 3).map((plan, index) => {
      const maxIngresos = Math.max(
        ...data.por_plan.map((p) => p.monto_total)
      );
      const ingresos = plan.monto_total;

      return {
        nombre: plan.nombre_plan,
        ventas: plan.cantidad_comisiones,
        ingresos: ingresos,
        porcentaje: Math.round((ingresos / maxIngresos) * 100),
        color: this.obtenerColorPlan(index),
      };
    });

    // Resumen por periodo (simulado - debería venir del backend)
    this.datosResumen = [
      {
        periodo: 'Noviembre 2024',
        referidos: 28,
        conversiones: 19,
        tasaConversion: 68,
        comisiones: data.ultimos_30_dias,
        promedioReferido: data.promedio_comision,
      },
    ];
  }

  /**
   * Generar insights automáticos
   */
  generarInsights(data: KPIsGenerales) {
    this.insights = [];

    // Tasa de conversión
    const tasaConversion = (data.referidos.activos / data.referidos.total) * 100;
    if (tasaConversion >= 60) {
      this.insights.push({
        tipo: 'success',
        titulo: 'Excelente tasa de conversión',
        descripcion: `La tasa de conversión del ${tasaConversion.toFixed(1)}% está por encima del promedio de la industria (45-55%). ¡Sigue así!`,
      });
    }

    // Referentes activos
    if (data.usuarios.referentes.activos > 20) {
      this.insights.push({
        tipo: 'info',
        titulo: 'Crecimiento sostenido',
        descripcion: `Tienes ${data.usuarios.referentes.activos} referentes activos. Considera aumentar los incentivos para mantener el momentum.`,
      });
    }

    // Comisiones pendientes
    if (data.comisiones.pendientes > 0) {
      this.insights.push({
        tipo: 'warning',
        titulo: 'Comisiones pendientes',
        descripcion: `Hay $${data.comisiones.pendientes.toLocaleString('es-CO')} en comisiones pendientes de pago.`,
      });
    }
  }

  /**
   * Obtener nivel por puntos
   */
  obtenerNivelPorPuntos(puntos: number): string {
    if (puntos >= 1000) return 'Platino';
    if (puntos >= 500) return 'Oro';
    if (puntos >= 200) return 'Plata';
    return 'Bronce';
  }

  /**
   * Obtener color del nivel
   */
  obtenerColorNivel(puntos: number): string {
    if (puntos >= 1000) return 'purple';
    if (puntos >= 500) return 'gold';
    if (puntos >= 200) return 'default';
    return 'orange';
  }

  /**
   * Obtener color del plan
   */
  obtenerColorPlan(index: number): string {
    const colores = ['#1890ff', '#52c41a', '#722ed1'];
    return colores[index] || '#4A90E2';
  }

  /**
   * Cambiar rango de fechas
   */
  cambiarRangoFechas() {
    if (this.rangoFechas && this.rangoFechas.length === 2) {
      this.message.info('Actualizando datos...');
      this.cargarDatos();
    }
  }

  /**
   * Exportar reporte
   */
  exportarReporte() {
    this.message.success('Generando reporte... Se descargará en breve');
    // Aquí iría la lógica de exportación
  }

  /**
   * Obtener medalla
   */
  getMedalIcon(index: number): string {
    return 'trophy';
  }

  /**
   * Obtener color de medalla
   */
  getMedalColor(index: number): string {
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    return colors[index];
  }

  /**
   * Obtener color de progreso
   */
  getProgressColorByValue(value: number): string {
    if (value >= 70) return '#52c41a';
    if (value >= 50) return '#1890ff';
    if (value >= 30) return '#faad14';
    return '#ff4d4f';
  }

  percentFormat = (percent: number): string => `${percent}%`;
}
