import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: ApiOptions): Observable<T> {
    return this.http.get<T>(url, options);
  }

  post<T>(url: string, body: any, options?: ApiOptions): Observable<T> {
    return this.http.post<T>(url, body, options);
  }

  put<T>(url: string, body: any, options?: ApiOptions): Observable<T> {
    return this.http.put<T>(url, body, options);
  }

  patch<T>(url: string, body: any, options?: ApiOptions): Observable<T> {
    return this.http.patch<T>(url, body, options);
  }

  delete<T>(url: string, options?: ApiOptions): Observable<T> {
    return this.http.delete<T>(url, options);
  }

  buildParams(params: { [key: string]: any }): HttpParams {
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }

  buildHeaders(headers: { [key: string]: string }): HttpHeaders {
    let httpHeaders = new HttpHeaders();

    Object.keys(headers).forEach((key) => {
      httpHeaders = httpHeaders.set(key, headers[key]);
    });

    return httpHeaders;
  }

  downloadBlob(url: string, options?: ApiOptions): Observable<Blob> {
    return this.http.get(url, {
      ...options,
      responseType: 'blob',
    });
  }

  downloadArrayBuffer(
    url: string,
    options?: ApiOptions
  ): Observable<ArrayBuffer> {
    return this.http.get(url, {
      ...options,
      responseType: 'arraybuffer',
    });
  }

  getText(url: string, options?: ApiOptions): Observable<string> {
    return this.http.get(url, {
      ...options,
      responseType: 'text',
    });
  }
}
