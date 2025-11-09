import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import es from '@angular/common/locales/es';

import { routes } from './app.routes';
import { es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { cargaInterceptor } from './core/interceptors/carga.interceptor';

registerLocaleData(es);

const ngZorroConfig: NzConfig = {
  theme: {
    primaryColor: '#1890ff',
  },
  message: {
    nzTop: 24,
    nzDuration: 3000,
    nzMaxStack: 3,
  },
  notification: {
    nzTop: 24,
    nzBottom: 24,
    nzDuration: 4500,
    nzMaxStack: 4,
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzI18n(es_ES),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),

    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor, cargaInterceptor])
    ),

    provideNzConfig(ngZorroConfig),
  ],
};
