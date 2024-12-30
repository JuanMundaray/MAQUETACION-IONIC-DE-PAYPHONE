import { Injectable } from '@angular/core';
import { FunctionsService } from '../functions/functions.service';
import { environment } from 'src/environments/environment';
import { AlertMessageService } from '../alert/alert-message.service';
import { HttpServiceService } from '../httpServices/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class ReferidosService {
public imgReferente: string;
public imgReferenteS3: string;
public urlapicf: string = environment.url_api_cf;
public pnumber_referente: string;
public APIS_REFERIDOS = {
  penalizacion: this.urlapicf + '/referidos/penalizacion',
  registrarPago: this.urlapicf + '/referidos/registrar-pago',
  registrarReferido: this.urlapicf + '/referidos/registrar-referido',
  actualizarReferencia: this.urlapicf + '/referidos/update-referencia',
}
  constructor(private func: FunctionsService, private httpServ: HttpServiceService, private mensaje: AlertMessageService ) { }


  
  generarPayloadPenalizacion() 
  /* "id_vendedor", "id_orden", "id_sucursal" */{
    let type = 'penalizacion';
    return JSON.stringify({
      type,
      id_vendedor: this.func.crypt(this.func.readLocalStorage('user_id'), type),
      id_orden: this.func.crypt(this.func.readLocalStorage('referral_orderid'), type),
      id_sucursal: this.func.crypt(this.func.readLocalStorage('data_userSucursalid'), type),
    })
  }

  generarPenalizacion() {
    const payload = this.generarPayloadPenalizacion();
    const url = this.APIS_REFERIDOS.penalizacion;
    return this.httpServ.consulta(url,payload,true)
  }

  generarPayloadRegistrarReferido() {
    let type = 'registrarReferido';
    return JSON.stringify({
      type,
      id_vendedor: this.func.crypt(this.func.readLocalStorage('user_id'), type),
      id_orden_referente: this.func.crypt(this.func.readLocalStorage('referral_orderid'), type),
      id_quote_referido: this.func.crypt(this.func.readLocalStorage('quoteid'), type),
    })
  }

  registrarReferido() {
    const payload = this.generarPayloadRegistrarReferido();
    const url = this.APIS_REFERIDOS.registrarReferido;
    return this.httpServ.consulta(url,payload,true)
  }

  generarPayloadActualizarReferenciaPenalizacion() {
    let type = 'actualizarReferencia';
    /* "id_referencia", "id_quote_referido" 
    id_vendedor: event.id_vendedor,
    id_orden: event.id_orden,
    id_sucursal: event.id_sucursal,*/
    return JSON.stringify({
      type,
      id_referencia: this.func.crypt(this.func.readLocalStorage('id_referencia'), type),
      id_vendedor: this.func.crypt(this.func.readLocalStorage('user_id'), type),
      id_orden: this.func.crypt(this.func.readLocalStorage('referral_orderid'), type),
      id_quote_referido: this.func.crypt(this.func.readLocalStorage('quoteid'), type),
      id_sucursal: this.func.crypt(this.func.readLocalStorage('data_userSucursalid'), type),
      penalizacion: this.func.crypt('penalizacion', type),
    })
  }

  generarPayloadActualizarReferenciaCompleta() {
    let type = 'actualizarReferencia';
    return JSON.stringify({
      type,
      id_referencia: this.func.crypt(this.func.readLocalStorage('id_referencia'), type),
      id_vendedor: this.func.crypt(this.func.readLocalStorage('user_id'), type),
      id_orden: this.func.crypt(this.func.readLocalStorage('referral_orderid'), type),
      id_quote_referido: this.func.crypt(this.func.readLocalStorage('quoteid'), type),
      id_sucursal: this.func.crypt(this.func.readLocalStorage('data_userSucursalid'), type),
      id_orden_referido: this.func.crypt(this.func.readLocalStorage('orderid_referido'), type),
    })
  }

  actualizarReferenciaPenalizacion() {
    const payload = this.generarPayloadActualizarReferenciaPenalizacion();
    const url = this.APIS_REFERIDOS.actualizarReferencia;
    return this.httpServ.consulta(url,payload,true)
  }

  actualizarReferenciaCompleta() {
    const payload = this.generarPayloadActualizarReferenciaCompleta();
    const url = this.APIS_REFERIDOS.actualizarReferencia;
    return this.httpServ.consulta(url,payload,true)
  }

  createPayloadReferidos() {
    let type = 'registrarTransaccionReferidos';
    const pay_ord_id = this.func.crypt(this.func.readLocalStorage('referral_orderid'),type);
    const customer_id = this.func.crypt(this.func.readLocalStorage('referral_customerid'),type);
    const pay_currency = this.func.getCurrency()
    const company_id = this.func.crypt(this.func.readLocalStorage('data_userCompaniaid'),type);
    const bof_id = this.func.crypt(this.func.readLocalStorage('data_userSucursalid'),type);
    const payload = {
      type,
      pay_ord_id,
      customer_id,
      pay_currency,
      company_id,
      bof_id,
    }
    return payload;
   };

   registrarPago() {
    const payload = this.createPayloadReferidos();
    const url = this.APIS_REFERIDOS.registrarPago;
    return this.httpServ.consulta(url,payload,true)
   } 

   borrarVariablesReferidos() {
    const keys = ['referido', 'referral_orderid', 'id_referencia','referral_customerid'];
    keys.forEach(key => this.func.deleteLocalStorage(key));
   };
}
