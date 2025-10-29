import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
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

interface Referido {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  tipoDoc: string;
  documento: string;
  estado: 'pendiente' | 'contactado' | 'activo' | 'rechazado';
  fechaRegistro: Date;
  fechaContacto?: Date;
  referenteCodigo: string;
  referenteNombre: string;
  puntos?: number;
  plan?: string;
  valorPlan?: number;
}

interface ReferenteUnico {
  codigo: string;
  nombre: string;
}

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
    NzToolTipModule
  ],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent implements OnInit {
  referidos: Referido[] = [];
  referidosFiltrados: Referido[] = [];
  referentesUnicos: ReferenteUnico[] = [];
  loading = true;

  // Filtros
  searchText = '';
  filtroEstado = '';
  filtroReferente = '';
  filtroPlan = '';

  constructor(
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.cargarReferidos();
  }

  cargarReferidos() {
    this.loading = true;
    // Simulación de datos - aquí iría la llamada al servicio
    setTimeout(() => {
      this.referidos = [
        {
          id: 'REF-001',
          nombre: 'Juan Pérez García',
          correo: 'juan.perez@email.com',
          telefono: '3001234567',
          tipoDoc: 'CC',
          documento: '12345678',
          estado: 'activo',
          fechaRegistro: new Date('2024-01-15'),
          fechaContacto: new Date('2024-01-16'),
          referenteCodigo: 'REF-2024-001',
          referenteNombre: 'María González',
          puntos: 150,
          plan: 'Plan Profesional',
          valorPlan: 150000
        },
        {
          id: 'REF-002',
          nombre: 'María López Rodríguez',
          correo: 'maria.lopez@email.com',
          telefono: '3009876543',
          tipoDoc: 'CC',
          documento: '87654321',
          estado: 'contactado',
          fechaRegistro: new Date('2024-01-20'),
          fechaContacto: new Date('2024-01-21'),
          referenteCodigo: 'REF-2024-002',
          referenteNombre: 'Carlos Ramírez'
        },
        {
          id: 'REF-003',
          nombre: 'Carlos Ramírez Santos',
          correo: 'carlos.ramirez@email.com',
          telefono: '3005551234',
          tipoDoc: 'CC',
          documento: '11223344',
          estado: 'pendiente',
          fechaRegistro: new Date('2024-01-25'),
          referenteCodigo: 'REF-2024-001',
          referenteNombre: 'María González'
        },
        {
          id: 'REF-004',
          nombre: 'Ana Martínez Díaz',
          correo: 'ana.martinez@email.com',
          telefono: '3007778888',
          tipoDoc: 'CC',
          documento: '99887766',
          estado: 'activo',
          fechaRegistro: new Date('2024-02-01'),
          fechaContacto: new Date('2024-02-02'),
          referenteCodigo: 'REF-2024-003',
          referenteNombre: 'Pedro Sánchez',
          puntos: 100,
          plan: 'Plan Básico',
          valorPlan: 80000
        },
        {
          id: 'REF-005',
          nombre: 'Luis Hernández Torres',
          correo: 'luis.hernandez@email.com',
          telefono: '3004445555',
          tipoDoc: 'CC',
          documento: '55667788',
          estado: 'rechazado',
          fechaRegistro: new Date('2024-02-05'),
          fechaContacto: new Date('2024-02-06'),
          referenteCodigo: 'REF-2024-002',
          referenteNombre: 'Carlos Ramírez'
        }
      ];

      this.extractReferentesUnicos();
      this.referidosFiltrados = [...this.referidos];
      this.loading = false;
    }, 1000);
  }

  extractReferentesUnicos() {
    const referentesMap = new Map<string, string>();
    this.referidos.forEach(ref => {
      if (!referentesMap.has(ref.referenteCodigo)) {
        referentesMap.set(ref.referenteCodigo, ref.referenteNombre);
      }
    });

    this.referentesUnicos = Array.from(referentesMap.entries()).map(([codigo, nombre]) => ({
      codigo,
      nombre
    }));
  }

  filtrarReferidos() {
    let resultados = [...this.referidos];

    // Filtro por texto de búsqueda
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      resultados = resultados.filter(ref =>
        ref.nombre.toLowerCase().includes(search) ||
        ref.correo.toLowerCase().includes(search) ||
        ref.documento.includes(search) ||
        ref.telefono.includes(search)
      );
    }

    // Filtro por estado
    if (this.filtroEstado) {
      resultados = resultados.filter(ref => ref.estado === this.filtroEstado);
    }

    // Filtro por referente
    if (this.filtroReferente) {
      resultados = resultados.filter(ref => ref.referenteCodigo === this.filtroReferente);
    }

    // Filtro por plan
    if (this.filtroPlan) {
      if (this.filtroPlan === 'sin-plan') {
        resultados = resultados.filter(ref => !ref.plan);
      } else {
        resultados = resultados.filter(ref => ref.plan?.toLowerCase().includes(this.filtroPlan));
      }
    }

    this.referidosFiltrados = resultados;
  }

  limpiarFiltros() {
    this.searchText = '';
    this.filtroEstado = '';
    this.filtroReferente = '';
    this.filtroPlan = '';
    this.filtrarReferidos();
  }

  contarPorEstado(estado: string): number {
    return this.referidosFiltrados.filter(ref => ref.estado === estado).length;
  }

  editarReferido(referido: Referido) {
    this.router.navigate(['/asesor/referidos', referido.id, 'editar']);
  }

  verDetalle(referido: Referido) {
    this.message.info(`Ver detalles de ${referido.nombre}`);
  }

  llamarReferido(referido: Referido) {
    window.location.href = `tel:${referido.telefono}`;
  }

  enviarEmail(referido: Referido) {
    window.location.href = `mailto:${referido.correo}`;
  }

  verHistorial(referido: Referido) {
    this.message.info(`Ver historial de ${referido.nombre}`);
  }

  getEstadoColor(estado: string): string {
    const colores = {
      'pendiente': 'orange',
      'contactado': 'blue',
      'activo': 'green',
      'rechazado': 'red'
    };
    return colores[estado as keyof typeof colores] || 'default';
  }

  getEstadoTexto(estado: string): string {
    const textos = {
      'pendiente': 'Pendiente',
      'contactado': 'Contactado',
      'activo': 'Activo',
      'rechazado': 'Rechazado'
    };
    return textos[estado as keyof typeof textos] || estado;
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
