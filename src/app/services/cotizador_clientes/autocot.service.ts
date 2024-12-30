import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpServiceService } from '../httpServices/http-service.service';
import {AUTOCOTIZACIONES_API} from './autocotizador_apis'
 @Injectable({
  providedIn: 'root'
})
export class autocotizadorService {
  constructor(private http: HttpServiceService) { }

  updateAutocotizacion(data: any): Observable<void> {
    /* const paramsi = ["type", "item_model", "item_id", "quo_id","precio", "porc_eng","porc_int", "temporalidad","status"]; */
    return this.http.consulta(`${environment.url_api_cf + AUTOCOTIZACIONES_API.UPDATE}`, data, true);
  }

  getAutocotizaciones(data: any): Observable<void> {
    /* const paramsi = ["type", "data_search"]; */
    return this.http.consulta(`${environment.url_api_cf + AUTOCOTIZACIONES_API.GET}`, data, true);
  }

  storeAutocotizacion(data: any): Observable<void> {
    /* paramsi = ["type", "uid", "cus_id", "quo_id","user_ip"]; */
    return this.http.consulta(`${environment.url_api_cf + AUTOCOTIZACIONES_API.STORE}`, data, true);
  };
}
