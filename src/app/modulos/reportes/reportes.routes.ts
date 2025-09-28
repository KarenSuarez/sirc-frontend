import { Route } from '@angular/router';
import { IndicadoresComponent } from './indicadores/indicadores.component';
import { RankingComponent } from './ranking/ranking.component';

export const REPORTES_ROUTES: Route[] = [
  { path: 'indicadores', component: IndicadoresComponent },
  { path: 'ranking', component: RankingComponent },
];
