import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin, takeUntil } from 'rxjs';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AsesorService } from '../../../core/services/asesor.service';
import { ReferenteConMetricas } from '../../../core/models/referente.interface';

@Component({
  selector: 'app-referentes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzInputModule,
    NzIconModule,
    NzTagModule,
    NzDividerModule,
    NzProgressModule,
    NzButtonModule,
    NzSegmentedModule,
    NzSelectModule,
    NzSpinModule,
    NzModalModule,
    NzDescriptionsModule,
    NzStatisticModule,
  ],
  templateUrl: './referentes.component.html',
  styleUrl: './referentes.component.css',
})
export class ReferentesComponent implements OnInit, OnDestroy {
  referentes: ReferenteConMetricas[] = [];
  referentesFiltrados: ReferenteConMetricas[] = [];
  loading = true;

  searchText = '';
  filtroActual = 'todos';
  ordenarPor = 'nombre';

  opcionesFiltro = [
    { label: 'Todos', value: 'todos' },
    { label: 'Top Performers', value: 'top' },
    { label: 'Con Pendientes', value: 'pendientes' },
    { label: 'Sin Actividad', value: 'inactivos' },
  ];

  modalDetalleVisible = false;
  referenteSeleccionado: ReferenteConMetricas | null = null;

  // Paginación
  pageSize = 50;
  pageIndex = 1;
  total = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private asesorService: AsesorService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.cargarReferentes();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar referentes desde backend
   */
  cargarReferentes() {
    this.loading = true;

    this.asesorService
      .listarReferentes(this.pageSize, this.pageIndex)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.referentes = response.referentes;
          this.total = response.total;
          this.referentesFiltrados = [...this.referentes];
          this.ordenarReferentes();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar referentes:', error);
          this.message.error('Error al cargar referentes');
          this.loading = false;
        },
      });
  }

  /**
   * Filtrar referentes por texto
   */
  filtrarReferentes() {
    let resultados = [...this.referentes];

    // Filtro de búsqueda
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      resultados = resultados.filter(
        (ref) =>
          ref.usuario.nombre.toLowerCase().includes(search) ||
          ref.usuario.apellido.toLowerCase().includes(search) ||
          ref.codigo_referente.toLowerCase().includes(search) ||
          ref.usuario.correo_electronico.toLowerCase().includes(search)
      );
    }

    this.referentesFiltrados = resultados;
    this.aplicarFiltroRapido();
  }

  /**
   * Aplicar filtro rápido (todos, top, pendientes, inactivos)
   */
  aplicarFiltroRapido() {
    let resultados = this.searchText
      ? this.referentesFiltrados
      : [...this.referentes];

    switch (this.filtroActual) {
      case 'top':
        resultados = resultados.filter(
          (ref) => ref.metricas.referidos_activos >= 10
        );
        break;
      case 'pendientes':
        const pendientes = resultados.filter(
          (ref) =>
            ref.metricas.total_referidos > ref.metricas.referidos_activos
        );
        resultados = pendientes.length > 0 ? pendientes : resultados;
        break;
      case 'inactivos':
        resultados = resultados.filter(
          (ref) =>
            ref.metricas.total_referidos === 0 ||
            ref.metricas.referidos_activos === 0
        );
        break;
    }

    this.referentesFiltrados = resultados;
    this.ordenarReferentes();
  }

  /**
   * Ordenar referentes
   */
  ordenarReferentes() {
    switch (this.ordenarPor) {
      case 'nombre':
        this.referentesFiltrados.sort((a, b) =>
          a.usuario.nombre.localeCompare(b.usuario.nombre)
        );
        break;
      case 'referidos':
        this.referentesFiltrados.sort(
          (a, b) => b.metricas.total_referidos - a.metricas.total_referidos
        );
        break;
      case 'conversiones':
        this.referentesFiltrados.sort(
          (a, b) => b.metricas.referidos_activos - a.metricas.referidos_activos
        );
        break;
      case 'comisiones':
        this.referentesFiltrados.sort(
          (a, b) =>
            b.total_comisiones_historico - a.total_comisiones_historico
        );
        break;
      case 'nivel':
        this.referentesFiltrados.sort(
          (a, b) => b.puntos_actuales - a.puntos_actuales
        );
        break;
    }
  }

  /**
   * Calcular total de referidos
   */
  calcularTotalReferidos(): number {
    return this.referentes.reduce(
      (sum, ref) => sum + ref.metricas.total_referidos,
      0
    );
  }

  /**
   * Calcular total de conversiones
   */
  calcularTotalConversiones(): number {
    return this.referentes.reduce(
      (sum, ref) => sum + ref.metricas.referidos_activos,
      0
    );
  }

  /**
   * Calcular total de comisiones
   */
  calcularTotalComisiones(): number {
    return this.referentes.reduce(
      (sum, ref) => sum + parseFloat(ref.total_comisiones_historico.toString()),
      0
    );
  }

  /**
   * Calcular tasa de conversión
   */
  calcularTasaConversion(referente: ReferenteConMetricas): number {
    if (referente.metricas.total_referidos === 0) return 0;
    return Math.round(
      (referente.metricas.referidos_activos /
        referente.metricas.total_referidos) *
        100
    );
  }

  /**
   * Calcular referidos pendientes
   */
  calcularReferidosPendientes(referente: ReferenteConMetricas): number {
    return (
      referente.metricas.total_referidos - referente.metricas.referidos_activos
    );
  }

  /**
   * Obtener status del progreso
   */
  getProgressStatus(
    percent: number
  ): 'success' | 'exception' | 'normal' | 'active' {
    if (percent >= 70) return 'success';
    if (percent >= 40) return 'normal';
    return 'exception';
  }

  /**
   * Obtener color del progreso
   */
  getProgressColor(percent: number): string {
    if (percent >= 70) return '#52c41a';
    if (percent >= 40) return '#1890ff';
    return '#ff4d4f';
  }

  /**
   * Obtener nivel del referente (basado en puntos)
   */
  getNivel(referente: ReferenteConMetricas): string {
    const puntos = referente.puntos_actuales;

    if (puntos >= 600) return 'Platino';
    if (puntos >= 400) return 'Oro';
    if (puntos >= 200) return 'Plata';
    return 'Bronce';
  }

  /**
   * Obtener color del nivel
   */
  getNivelColor(nivel: string): string {
    const colores: { [key: string]: string } = {
      Platino: '#E5E4E2',
      Oro: '#FFD700',
      Plata: '#C0C0C0',
      Bronce: '#CD7F32',
    };
    return colores[nivel] || 'default';
  }

  /**
   * Ver detalle del referente
   */
  verDetalleReferente(referente: ReferenteConMetricas) {
    this.referenteSeleccionado = referente;
    this.modalDetalleVisible = true;
  }

  /**
   * Cerrar modal de detalle
   */
  cerrarModalDetalle() {
    this.modalDetalleVisible = false;
    this.referenteSeleccionado = null;
  }

  /**
   * Ver referidos del referente
   */
  verReferidos(event: Event, referente: ReferenteConMetricas) {
    event.stopPropagation();
    this.router.navigate(['/asesor/referidos'], {
      queryParams: { referente: referente.codigo_referente },
    });
  }

  /**
   * Contactar referente
   */
  contactarReferente(event: Event, referente: ReferenteConMetricas) {
    event.stopPropagation();
    window.location.href = `mailto:${referente.usuario.correo_electronico}`;
  }

  /**
   * Ver referidos desde modal
   */
  verReferidosDetalle() {
    if (this.referenteSeleccionado) {
      this.cerrarModalDetalle();
      this.router.navigate(['/asesor/referidos'], {
        queryParams: { referente: this.referenteSeleccionado.codigo_referente },
      });
    }
  }

  /**
   * Enviar email desde modal
   */
  enviarEmailDetalle() {
    if (this.referenteSeleccionado) {
      window.location.href = `mailto:${this.referenteSeleccionado.usuario.correo_electronico}`;
    }
  }

  /**
   * Llamar desde modal
   */
  llamarReferenteDetalle() {
    if (
      this.referenteSeleccionado &&
      this.referenteSeleccionado.usuario.telefono
    ) {
      window.location.href = `tel:${this.referenteSeleccionado.usuario.telefono}`;
    }
  }

  /**
   * Formatear fecha
   */
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Obtener nombre completo
   */
  getNombreCompleto(referente: ReferenteConMetricas): string {
    return `${referente.usuario.nombre} ${referente.usuario.apellido}`;
  }

  /**
   * Obtener iniciales
   */
  getIniciales(referente: ReferenteConMetricas): string {
    return `${referente.usuario.nombre.charAt(0)}${referente.usuario.apellido.charAt(0)}`.toUpperCase();
  }
}
