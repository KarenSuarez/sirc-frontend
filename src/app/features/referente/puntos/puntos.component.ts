import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, forkJoin, takeUntil, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { AuthService } from '../../../core/services/auth.service';
import { UsuarioHelperService } from '../../../core/services/usuario-helper.service';
import { UsuarioAutenticado } from '../../../core/models/usuario.interface';
import {
  Nivel,
  Insignia,
  InsigniaReferente,
} from '../../../core/models/nivel.interface';
import { environment } from '../../../../environments/environment';

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
    NzAlertModule,
    NzSpinModule,
    NzEmptyModule,
  ],
  templateUrl: './puntos.component.html',
  styleUrls: ['./puntos.component.css'],
})
export class PuntosComponent implements OnInit, OnDestroy {
  usuario: UsuarioAutenticado | null = null;
  puntosActuales = 0;
  niveles: Nivel[] = [];
  insignias: InsigniaReferente[] = [];
  todasLasInsignias: Insignia[] = []

  logrosDesbloqueados: any[] = [];
  logrosBloqueados: any[] = [];
  nivelActual: any = null;
  siguienteNivel: any = null;
  progresoNivel: number = 0;
  puntosParaSiguienteNivel: number = 0;

  cargando = true;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private usuarioHelper: UsuarioHelperService,
    private http: HttpClient,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.usuario = this.authService.usuario();
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatos() {
    this.cargando = true;

    const nivelesUrl = `${environment.apiUrl}/niveles`;
    const misInsigniasUrl = `${environment.apiUrl}/insignias/mis-insignias`;
    const todasInsigniasUrl = `${environment.apiUrl}/insignias`;
    const perfilUrl = `${environment.apiUrl}/referente/perfil`;

    forkJoin({
      niveles: this.http.get<Nivel[]>(nivelesUrl).pipe(
        catchError((error) => {
          console.error('Error niveles:', error);
          return of([] as Nivel[]);
        })
      ),
      misInsignias: this.http.get<InsigniaReferente[]>(misInsigniasUrl).pipe(
        catchError((error) => {
          console.error('Error mis insignias:', error);
          return of([] as InsigniaReferente[]);
        })
      ),
      todasInsignias: this.http.get<Insignia[]>(todasInsigniasUrl).pipe(
        catchError((error) => {
          console.error('Error todas insignias:', error);
          return of([] as Insignia[]);
        })
      ),
      perfil: this.http.get<any>(perfilUrl).pipe(
        catchError((error) => {
          console.error('Error perfil:', error);
          return of({ progreso: { puntos_actuales: 0 } });
        })
      ),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.niveles = Array.isArray(data.niveles)
            ? data.niveles.sort((a, b) => a.orden_nivel - b.orden_nivel)
            : [];

          this.insignias = Array.isArray(data.misInsignias) ? data.misInsignias : [];

          this.todasLasInsignias = Array.isArray(data.todasInsignias)
            ? data.todasInsignias.filter(i => i.estado === 'activa')
            : [];

          this.puntosActuales = data.perfil?.progreso?.puntos_actuales || 0;

          this.calcularNivelActual();
          this.calcularSiguienteNivel();
          this.calcularProgreso();
          this.procesarInsignias();

          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar datos:', error);
          this.cargando = false;
          this.message.error('Error al cargar datos');
        },
      });
  }

  private calcularNivelActual() {
    const nivel = this.niveles.find(
      (n) =>
        this.puntosActuales >= n.puntos_minimos &&
        this.puntosActuales <= n.puntos_maximos
    );

    this.nivelActual = {
      nombre: nivel?.nombre_nivel || 'Bronce',
      icon: nivel?.icono_nivel || 'trophy',
      color: nivel?.color_nivel || '#CD7F32',
      beneficio: nivel?.beneficios_nivel || 'Sin beneficios',
    };
  }

  private calcularSiguienteNivel() {
    const currentIndex = this.niveles.findIndex(
      (n) =>
        this.puntosActuales >= n.puntos_minimos &&
        this.puntosActuales <= n.puntos_maximos
    );

    if (currentIndex >= this.niveles.length - 1) {
      this.siguienteNivel = null;
      this.puntosParaSiguienteNivel = 0;
      return;
    }

    const siguiente = this.niveles[currentIndex + 1];
    this.siguienteNivel = {
      nombre: siguiente.nombre_nivel,
      icon: siguiente.icono_nivel,
      color: siguiente.color_nivel,
      beneficio: siguiente.beneficios_nivel,
    };

    this.puntosParaSiguienteNivel = siguiente.puntos_minimos - this.puntosActuales;
  }

  private calcularProgreso() {
    const nivel = this.niveles.find(
      (n) =>
        this.puntosActuales >= n.puntos_minimos &&
        this.puntosActuales <= n.puntos_maximos
    );

    if (!nivel) {
      this.progresoNivel = 0;
      return;
    }

    const rango = nivel.puntos_maximos - nivel.puntos_minimos;
    const progreso = this.puntosActuales - nivel.puntos_minimos;
    const porcentaje = (progreso / rango) * 100;
    this.progresoNivel = Math.min(Math.round(porcentaje), 100);
  }

  private procesarInsignias() {
    const idsObtenidos = this.insignias.map((i) => i.id_insignia);

    this.logrosDesbloqueados = this.insignias
      .filter((i) => i && i.insignia)
      .map((i) => ({
        id: i.id_insignia,
        nombre: i.insignia.nombre_insignia || 'Sin nombre',
        descripcion: i.insignia.descripcion || 'Sin descripción',
        icon: i.insignia.icono_insignia || 'trophy',
        color: i.insignia.color_insignia || '#FFD700',
        rareza: i.insignia.rareza || 'comun',
        fecha: new Date(i.fecha_obtencion).toLocaleDateString('es-CO'),
      }));

    this.logrosBloqueados = this.todasLasInsignias
      .filter((insignia) => !idsObtenidos.includes(insignia.id_insignia))
      .map((insignia) => ({
        id: insignia.id_insignia,
        nombre: insignia.nombre_insignia || 'Sin nombre',
        descripcion: insignia.descripcion || 'Sin descripción',
        icon: insignia.icono_insignia || 'lock',
        color: insignia.color_insignia || '#d9d9d9',
        rareza: insignia.rareza || 'comun',
        criterio: insignia.criterio_obtencion || 'Criterio desconocido',
      }));
  }

  getNivelFondo(color: string): string {
    if (!color || color === '#FFFFFF') {
      return 'rgba(200, 200, 200, 0.08)';
    }

    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.08)`;
  }

  getRarezaColor(rareza: string): string {
    const colores: Record<string, string> = {
      comun: '#A8A8A8',
      rara: '#4169E1',
      epica: '#9370DB',
      legendaria: '#FF4500',
    };
    return colores[rareza] || '#A8A8A8';
  }
}
