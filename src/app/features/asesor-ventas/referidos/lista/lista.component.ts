import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

import { AsesorService } from '../../../../core/services/asesor.service';
import {
  Referido,
  EstadoReferido,
} from '../../../../core/models/referido.interface';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzCardModule,
    NzSpaceModule,
    NzDropDownModule,
    NzMenuModule,
    NzInputModule,
    NzSelectModule,
    NzMessageModule,
    NzToolTipModule,
    NzStatisticModule,
    NzGridModule,
    NzDescriptionsModule,
  ],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css',
})
export class ListaComponent implements OnInit, OnDestroy {
  referidos: Referido[] = []; // Todos los referidos (sin filtrar)
  referidosFiltrados: Referido[] = []; // Referidos después de aplicar filtros
  loading = true;

  total = 0; // Total de referidos filtrados (para paginación)
  totalGeneral = 0; // Total de todos los referidos (para estadísticas)
  pageSize = 20;
  pageIndex = 1;

  searchText = '';
  filtroEstado: EstadoReferido | '' = '';
  filtroReferente = '';

  estadisticas = {
    pendientes: 0,
    contactados: 0,
    activos: 0,
    no_interesados: 0,
  };

  // Control de filas expandidas
  expandedRows = new Set<number>();

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private asesorService: AsesorService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    // Leer parámetros de query (si vienen desde dashboard)
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['estado']) {
          this.filtroEstado = params['estado'] as EstadoReferido;
        }
        if (params['referente']) {
          this.filtroReferente = params['referente'];
        }
        this.cargarDatos();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar datos: referidos filtrados + estadísticas totales
   */
  cargarDatos() {
    this.loading = true;

    // Cargar TODOS los referidos de una vez (sin filtros del backend)
    forkJoin({
      todosLosReferidos: this.asesorService.listarReferidos(undefined, 1000, 1), // Cargar todos
      totalPendientes: this.asesorService.listarReferidos('pendiente', 1, 1),
      totalContactados: this.asesorService.listarReferidos('contactado', 1, 1),
      totalActivos: this.asesorService.listarReferidos('activo', 1, 1),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Response completo:', response);

          // Guardar TODOS los referidos
          this.referidos = response.todosLosReferidos.referidos;
          this.totalGeneral = response.todosLosReferidos.total;

          // Estadísticas totales
          this.estadisticas = {
            pendientes: response.totalPendientes.total,
            contactados: response.totalContactados.total,
            activos: response.totalActivos.total,
            no_interesados: 0,
          };

          // Aplicar filtros del lado del cliente
          this.aplicarFiltrosCliente();

          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar datos:', error);
          this.message.error('Error al cargar datos');
          this.loading = false;
        },
      });
  }

  /**
   * Cargar referidos desde backend
   */
  cargarReferidos() {
    this.cargarDatos();
  }

  /**
   * Obtener referidos paginados (del lado del cliente)
   */
  getReferidosPaginados(): Referido[] {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.referidosFiltrados.slice(startIndex, endIndex);
  }

  /**
   * Aplicar filtros
   */
  aplicarFiltros() {
    this.pageIndex = 1; // Resetear a página 1
    this.aplicarFiltrosCliente();
  }

  /**
   * Aplicar filtros del lado del cliente
   */
  aplicarFiltrosCliente() {
    let resultados = [...this.referidos];

    // Filtro por texto de búsqueda
    if (this.searchText && this.searchText.trim()) {
      const search = this.searchText.toLowerCase().trim();
      resultados = resultados.filter(
        (ref) =>
          ref.nombre_referido.toLowerCase().includes(search) ||
          ref.apellido_referido.toLowerCase().includes(search) ||
          ref.correo_referido.toLowerCase().includes(search) ||
          ref.numero_documento_referido.toLowerCase().includes(search) ||
          (ref.empresa_referido && ref.empresa_referido.toLowerCase().includes(search)) ||
          (ref.telefono_referido && ref.telefono_referido.toLowerCase().includes(search))
      );
    }

    // Filtro por estado
    if (this.filtroEstado) {
      resultados = resultados.filter(
        (ref) => ref.estado_referido === this.filtroEstado
      );
    }

    // Guardar resultados filtrados
    this.referidosFiltrados = resultados;
    this.total = resultados.length;
  }

  /**
   * Limpiar filtros
   */
  limpiarFiltros() {
    this.searchText = '';
    this.filtroEstado = '';
    this.filtroReferente = '';
    this.pageIndex = 1;
    this.aplicarFiltrosCliente();
  }

  /**
   * Cambio de página
   */
  onPageChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.cargarReferidos();
  }

  /**
   * Cambio de tamaño de página
   */
  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.cargarReferidos();
  }

  /**
   * Filtrar por estado
   */
  filtrarPorEstado(estado: EstadoReferido | '') {
    this.filtroEstado = estado;
    this.pageIndex = 1;
    this.aplicarFiltrosCliente();
  }

  /**
   * Toggle detalle de referido
   */
  toggleDetalle(referido: Referido) {
    if (this.expandedRows.has(referido.id_referido)) {
      this.expandedRows.delete(referido.id_referido);
    } else {
      this.expandedRows.add(referido.id_referido);
    }
  }

  /**
   * Verificar si la fila está expandida
   */
  isExpanded(referido: Referido): boolean {
    return this.expandedRows.has(referido.id_referido);
  }

  /**
   * Editar referido
   */
  editarReferido(referido: Referido) {
    this.router.navigate([`/asesor/referidos/${referido.id_referido}/editar`]);
  }

  /**
   * Obtener color del estado
   */
  getEstadoColor(estado: string): string {
    const colores: Record<string, string> = {
      pendiente: 'orange',
      contactado: 'blue',
      activo: 'green',
      no_interesado: 'red',
      inactivo: 'default',
    };
    return colores[estado] || 'default';
  }

  /**
   * Obtener texto del estado
   */
  getEstadoTexto(estado: string): string {
    const textos: Record<string, string> = {
      pendiente: 'Pendiente',
      contactado: 'Contactado',
      activo: 'Activo',
      no_interesado: 'No Interesado',
      inactivo: 'Inactivo',
    };
    return textos[estado] || estado;
  }

  /**
   * Formatear fecha
   */
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Obtener nombre completo del referido
   */
  getNombreCompleto(referido: Referido): string {
    return `${referido.nombre_referido} ${referido.apellido_referido}`;
  }

  /**
   * Obtener código del referente
   */
  getCodigoReferente(referido: Referido): string {
    return referido.referente?.codigo_referente || 'N/A';
  }

  /**
   * Obtener nombre del referente
   */
  getNombreReferente(referido: Referido): string {
    if (referido.referente?.usuario) {
      return `${referido.referente.usuario.nombre} ${referido.referente.usuario.apellido}`;
    }
    return 'N/A';
  }
}
