import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { UsuarioService } from '../../../core/servicios/usuario.service';
import { Usuario } from '../../../core/modelos/usuario.interface';

interface Nivel {
  nombre: string;
  letra: string;
  puntosMinimos: number;
  puntosMaximos: number;
  beneficio: string;
  color: string;
  icon: string;
}

interface Logro {
  id: string;
  nombre: string;
  descripcion: string;
  icon: string;
  desbloqueado: boolean;
  fecha?: string;
}

@Component({
  selector: 'app-puntos',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzProgressModule,
    NzTagModule,
    NzIconModule,
    NzBadgeModule,
    NzAlertModule
  ],
  templateUrl: './puntos.component.html',
  styleUrls: ['./puntos.component.css']
})
export class PuntosComponent implements OnInit {
  usuario: Usuario | null = null;

  niveles: Nivel[] = [
    { nombre: 'Bronce', letra: 'B', puntosMinimos: 0, puntosMaximos: 20, beneficio: 'Sin beneficio adicional', color: '#CD7F32', icon: 'trophy' },
    { nombre: 'Plata', letra: 'P', puntosMinimos: 21, puntosMaximos: 50, beneficio: '+5% sobre las ventas', color: '#C0C0C0', icon: 'star' },
    { nombre: 'Oro', letra: 'O', puntosMinimos: 51, puntosMaximos: 100, beneficio: '+10% sobre las ventas', color: '#FFD700', icon: 'crown' },
    { nombre: 'Platino', letra: 'Pt', puntosMinimos: 101, puntosMaximos: 200, beneficio: '+15% sobre las ventas', color: '#E5E4E2', icon: 'rocket' },
    { nombre: 'Diamante', letra: 'D', puntosMinimos: 201, puntosMaximos: 9999, beneficio: '+20% sobre las ventas', color: '#B9F2FF', icon: 'fire' }
  ];

  logros: Logro[] = [
    { id: '1', nombre: 'Primer Referido', descripcion: 'Registra tu primer referido exitoso', icon: 'user-add', desbloqueado: true, fecha: '2025-01-10' },
    { id: '2', nombre: '5 Referidos', descripcion: 'Alcanza 5 referidos exitosos', icon: 'team', desbloqueado: true, fecha: '2025-01-15' },
    { id: '3', nombre: '10 Referidos', descripcion: 'Alcanza 10 referidos exitosos', icon: 'user-switch', desbloqueado: false },
    { id: '4', nombre: 'Nivel Oro', descripcion: 'Alcanza el nivel Oro', icon: 'crown', desbloqueado: true, fecha: '2025-01-20' },
    { id: '5', nombre: '$1M en Comisiones', descripcion: 'Genera $1.000.000 en comisiones', icon: 'dollar', desbloqueado: false },
  ];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuarioActual();
  }

  get puntosActuales(): number {
    return this.usuario?.puntos || 0;
  }

  get nivelActual(): Nivel {
    return this.niveles.find(n =>
      this.puntosActuales >= n.puntosMinimos && this.puntosActuales <= n.puntosMaximos
    ) || this.niveles[0];
  }

  get siguienteNivel(): Nivel | null {
    const currentIndex = this.niveles.indexOf(this.nivelActual);
    return currentIndex < this.niveles.length - 1 ? this.niveles[currentIndex + 1] : null;
  }

  get progresoNivel(): number {
    const nivel = this.nivelActual;
    const rango = nivel.puntosMaximos - nivel.puntosMinimos;
    const progreso = this.puntosActuales - nivel.puntosMinimos;
    return Math.min((progreso / rango) * 100, 100);
  }

  get puntosParaSiguienteNivel(): number {
    if (!this.siguienteNivel) return 0;
    return this.siguienteNivel.puntosMinimos - this.puntosActuales;
  }

  get logrosDesbloqueados(): Logro[] {
    return this.logros.filter(l => l.desbloqueado);
  }

  get logrosBloqueados(): Logro[] {
    return this.logros.filter(l => !l.desbloqueado);
  }
}
