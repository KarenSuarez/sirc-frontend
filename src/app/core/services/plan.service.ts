import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Plan } from '../models/referido.interface';

const PLAN_ENDPOINTS = {
  BASE: `${environment.apiUrl}/planes`,
};

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor(private http: HttpClient) {}

  listarActivos(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${PLAN_ENDPOINTS.BASE}?estado=activo`);
  }

  listar(): Observable<Plan[]> {
    return this.http.get<Plan[]>(PLAN_ENDPOINTS.BASE);
  }
}
