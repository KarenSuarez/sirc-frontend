import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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

interface Referente {
  id: string;
  nombre: string;
  apellido: string;
  codigo: string;
  correo: string;
  telefono: string;
  nivel: string;
  puntos: number;
  totalReferidos: number;
  referidosActivos: number;
  referidosPendientes: number;
  comisionesGeneradas: number;
  saldoDisponible: number;
  fechaRegistro: Date;
}

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
    NzStatisticModule
  ],
  templateUrl: './referentes.component.html',
  styleUrl: './referentes.component.css'
})
export class ReferentesComponent implements OnInit {
  referentes: Referente[] = [];
  referentesFiltrados: Referente[] = [];
  loading = true;

  searchText = '';
  filtroActual = 'todos';
  ordenarPor = 'nombre';

  opcionesFiltro = [
    { label: 'Todos', value: 'todos' },
    { label: 'Top Performers', value: 'top' },
    { label: 'Con Pendientes', value: 'pendientes' },
    { label: 'Sin Actividad', value: 'inactivos' }
  ];

  modalDetalleVisible = false;
  referenteSeleccionado: Referente | null = null;

  constructor(
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.cargarReferentes();
  }

  cargarReferentes() {
    this.loading = true;

    // Simulación de datos
    setTimeout(() => {
      this.referentes = [
        {
          id: '1',
          nombre: 'María',
          apellido: 'González',
          codigo: 'REF-2024-001',
          correo: 'maria.gonzalez@email.com',
          telefono: '3001234567',
          nivel: 'Oro',
          puntos: 450,
          totalReferidos: 15,
          referidosActivos: 12,
          referidosPendientes: 3,
          comisionesGeneradas: 2400000,
          saldoDisponible: 1800000,
          fechaRegistro: new Date('2024-01-10')
        },
        {
          id: '2',
          nombre: 'Carlos',
          apellido: 'Ramírez',
          codigo: 'REF-2024-002',
          correo: 'carlos.ramirez@email.com',
          telefono: '3009876543',
          nivel: 'Plata',
          puntos: 320,
          totalReferidos: 10,
          referidosActivos: 7,
          referidosPendientes: 2,
          comisionesGeneradas: 1500000,
          saldoDisponible: 1200000,
          fechaRegistro: new Date('2024-01-15')
        },
        {
          id: '3',
          nombre: 'Pedro',
          apellido: 'Sánchez',
          codigo: 'REF-2024-003',
          correo: 'pedro.sanchez@email.com',
          telefono: '3005551234',
          nivel: 'Bronce',
          puntos: 180,
          totalReferidos: 6,
          referidosActivos: 4,
          referidosPendientes: 2,
          comisionesGeneradas: 800000,
          saldoDisponible: 600000,
          fechaRegistro: new Date('2024-02-01')
        },
        {
          id: '4',
          nombre: 'Ana',
          apellido: 'Martínez',
          codigo: 'REF-2024-004',
          correo: 'ana.martinez@email.com',
          telefono: '3007778888',
          nivel: 'Platino',
          puntos: 680,
          totalReferidos: 22,
          referidosActivos: 18,
          referidosPendientes: 4,
          comisionesGeneradas: 3600000,
          saldoDisponible: 2800000,
          fechaRegistro: new Date('2023-12-05')
        },
        {
          id: '5',
          nombre: 'Luis',
          apellido: 'Hernández',
          codigo: 'REF-2024-005',
          correo: 'luis.hernandez@email.com',
          telefono: '3004445555',
          nivel: 'Bronce',
          puntos: 100,
          totalReferidos: 3,
          referidosActivos: 2,
          referidosPendientes: 1,
          comisionesGeneradas: 400000,
          saldoDisponible: 300000,
          fechaRegistro: new Date('2024-02-15')
        }
      ];

      this.referentesFiltrados = [...this.referentes];
      this.ordenarReferentes();
      this.loading = false;
    }, 1000);
  }

  filtrarReferentes() {
    let resultados = [...this.referentes];

    // Filtro de búsqueda
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      resultados = resultados.filter(ref =>
        ref.nombre.toLowerCase().includes(search) ||
        ref.apellido.toLowerCase().includes(search) ||
        ref.codigo.toLowerCase().includes(search) ||
        ref.correo.toLowerCase().includes(search)
      );
    }

    this.referentesFiltrados = resultados;
    this.aplicarFiltroRapido();
  }

  aplicarFiltroRapido() {
    let resultados = this.searchText ? this.referentesFiltrados : [...this.referentes];

    switch (this.filtroActual) {
      case 'top':
        resultados = resultados.filter(ref => ref.referidosActivos >= 10);
        break;
      case 'pendientes':
        resultados = resultados.filter(ref => ref.referidosPendientes > 0);
        break;
      case 'inactivos':
        resultados = resultados.filter(ref => ref.totalReferidos === 0 || ref.referidosActivos === 0);
        break;
    }

    this.referentesFiltrados = resultados;
    this.ordenarReferentes();
  }

  ordenarReferentes() {
    switch (this.ordenarPor) {
      case 'nombre':
        this.referentesFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'referidos':
        this.referentesFiltrados.sort((a, b) => b.totalReferidos - a.totalReferidos);
        break;
      case 'conversiones':
        this.referentesFiltrados.sort((a, b) => b.referidosActivos - a.referidosActivos);
        break;
      case 'comisiones':
        this.referentesFiltrados.sort((a, b) => b.comisionesGeneradas - a.comisionesGeneradas);
        break;
      case 'nivel':
        const niveles = { 'Platino': 4, 'Oro': 3, 'Plata': 2, 'Bronce': 1 };
        this.referentesFiltrados.sort((a, b) =>
          (niveles[b.nivel as keyof typeof niveles] || 0) - (niveles[a.nivel as keyof typeof niveles] || 0)
        );
        break;
    }
  }

  calcularTotalReferidos(): number {
    return this.referentes.reduce((sum, ref) => sum + ref.totalReferidos, 0);
  }

  calcularTotalConversiones(): number {
    return this.referentes.reduce((sum, ref) => sum + ref.referidosActivos, 0);
  }

  calcularTotalComisiones(): number {
    return this.referentes.reduce((sum, ref) => sum + ref.comisionesGeneradas, 0);
  }

  calcularTasaConversion(referente: Referente): number {
    if (referente.totalReferidos === 0) return 0;
    return Math.round((referente.referidosActivos / referente.totalReferidos) * 100);
  }

  getProgressStatus(percent: number): 'success' | 'exception' | 'normal' | 'active' {
    if (percent >= 70) return 'success';
    if (percent >= 40) return 'normal';
    return 'exception';
  }

  getProgressColor(percent: number): string {
    if (percent >= 70) return '#52c41a';
    if (percent >= 40) return '#1890ff';
    return '#ff4d4f';
  }

  getNivelColor(nivel: string): string {
    const colores: { [key: string]: string } = {
      'Platino': '#E5E4E2',
      'Oro': '#FFD700',
      'Plata': '#C0C0C0',
      'Bronce': '#CD7F32'
    };
    return colores[nivel] || 'default';
  }

  verDetalleReferente(referente: Referente) {
    this.referenteSeleccionado = referente;
    this.modalDetalleVisible = true;
  }

  cerrarModalDetalle() {
    this.modalDetalleVisible = false;
    this.referenteSeleccionado = null;
  }

  verReferidos(event: Event, referente: Referente) {
    event.stopPropagation();
    this.router.navigate(['/asesor/referidos'], {
      queryParams: { referente: referente.codigo }
    });
  }

  contactarReferente(event: Event, referente: Referente) {
    event.stopPropagation();
    this.message.info(`Contactar a ${referente.nombre} ${referente.apellido}`);
  }

  verReferidosDetalle() {
    if (this.referenteSeleccionado) {
      this.cerrarModalDetalle();
      this.router.navigate(['/asesor/referidos'], {
        queryParams: { referente: this.referenteSeleccionado.codigo }
      });
    }
  }

  enviarEmailDetalle() {
    if (this.referenteSeleccionado) {
      window.location.href = `mailto:${this.referenteSeleccionado.correo}`;
    }
  }

  llamarReferenteDetalle() {
    if (this.referenteSeleccionado) {
      window.location.href = `tel:${this.referenteSeleccionado.telefono}`;
    }
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
