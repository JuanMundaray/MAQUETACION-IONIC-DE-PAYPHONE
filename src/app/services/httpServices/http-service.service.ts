import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, firstValueFrom, throwError } from 'rxjs';
import { SpinnerService } from '../spinner/spinner.service';
import { finalize, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {

  private activeRequests = 0;

  constructor(private http: HttpClient, private spinner: SpinnerService) {}

  consulta(url: string, jsonData: any, flagActAnim: boolean): Observable<void> {
    if (!url || typeof url !== 'string') {
      // Manejar el caso en el que la URL no es válida
      console.error('La URL proporcionada no es válida');
      return throwError('La URL proporcionada no es válida');
    }
    if (flagActAnim) {
      if (this.activeRequests === 0) {
        this.spinner.show();
      }
      this.activeRequests++;
    }
    return this.http.post<void>(url, jsonData).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejar errores aquí según tus necesidades
        console.error('Error en la solicitud de consulta:', error);
        return throwError(error);
      }),
      finalize(() => {
        if (flagActAnim) {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.spinner.hide();
          }else{
            this.spinner.timer = 60;
          }
        }
      })
    );
  }

  async consultaasync(url: string, jsonData: any, type: any) {
    this.spinner.show();
    try {
      if (type === 'get') {
        return await firstValueFrom(this.http.get(url, jsonData));
      } else {
        return await firstValueFrom(this.http.post(url, jsonData));
      }
    } finally {
      this.spinner.hide();
    }
  }

  consultaGET(url: string, jsonData: any, flagActAnim: boolean): Observable<any> {
    if (!url || typeof url !== 'string') {
      // Manejar el caso en el que la URL no es válida
      console.error('La URL proporcionada no es válida');
      return throwError('La URL proporcionada no es válida');
    }
    if (flagActAnim) this.spinner.show();
    return this.http.get<any>(url, jsonData).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejar errores aquí según tus necesidades
        console.error('Error en la solicitud de consulta:', error);
        return throwError(error);
      }),
      finalize(() => {
        if (flagActAnim) this.spinner.hide();
      })
    );
  }
}
