import { Injectable } from '@angular/core';
import { AlertMessageService } from '../alert/alert-message.service';
import { FunctionsService } from '../functions/functions.service';
import { environment } from 'src/environments/environment';
import { HttpServiceService } from '../httpServices/http-service.service';
import moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { SpinnerService } from '../spinner/spinner.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
moment.locale('es');
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class CobranzaService {
public datosCliente: any;
  cardSeleccionada: string;
  jsonData: string;
  urlEndPoint: string;
  urlapicf = environment.url_api_cf;
  oxxoResponse: { id_pago: any; nombre_cliente: any; fecha_antes: string; pago: any; referencia: any; fecha_expira: string; pagar_antes_de: any; barcode: any; };
  referenceOxxo: any;
  payment_id: any;
  pagarAntes: string;
  nexpayment: any;
  barcodeUrl: any;
  paynetResponse: { monto: any; fecha_recibo: string; direccion: any; email: any; name: any; phone: any; id_pago: any; id_orden: any; barcode: any; reference: any; };
  urlToRedirect: any;
  openIframe: any;
  montoPagar: any = 0;
  constructor(private mensaje: AlertMessageService, private func: FunctionsService, private httpServ: HttpServiceService, private sanitizer: DomSanitizer, private spinner: SpinnerService, private modalService: NgbModal) { }

  continuar() {
    if (this.cardSeleccionada == 'oxxo') {
      this.pagarOxxo();
    } else if (this.cardSeleccionada == 'paynet') {
      this.pagarPaynet();
    } else if (this.cardSeleccionada == 'tarjeta') {
      this.pagarTarjeta();
      // $('#openIframeModal').modal('show');
    } else if (this.cardSeleccionada == 'spei') {
      this.pagarSPEI()
    } else {
      this.mensaje.error('Oops', 'Selecciona un método de pago válido');
    }
  }

  // Esta función crea y devuelve un objeto con los datos necesarios
  // para realizar un pago OXXO a partir de los datos del cliente.
  createPayloadOxxo(): object {
  let cobranza_juridica = this.func.readLocalStorage('cobranza_juridica') != 'null' ? '1' : '0';
    // Extraer propiedades específicas del objeto datosCliente utilizando destructuración.
    const {
      ORD_ID,
      modelo_celular,
      ORD_PAYMENT,
      CUS_EMAIL,
      CUS_PNUMBER,
      nombre_cliente,
    } = this.datosCliente;

    // Devolver un objeto con los datos necesarios para el pago OXXO.
    return {
      orderID: ORD_ID, // ID de la orden
      productname: modelo_celular, // Modelo de celular
      pago: this.montoPagar || ORD_PAYMENT, // Método de pago de la orden
      email: CUS_EMAIL, // Correo electrónico del cliente
      payment_method_id: 'oxxo_cash', // Método de pago (OXXO en efectivo)
      qty: '1', // Cantidad (generalmente 1 en un pago)
      number: `+${CUS_PNUMBER}`, // Número de teléfono del cliente
      name: nombre_cliente, // Nombre del cliente
      currency: 'MXN', // Moneda (en este caso, pesos mexicanos)
      datPaymenttype: 'PARCIALIDAD', // Tipo de pago (efectivo en OXXO)
      cobranza: cobranza_juridica,
    };
  }

  // Esta función realiza el proceso de pago OXXO al realizar una solicitud HTTP al servidor.
  pagarOxxo(): void {
    // Se crea un objeto JSON con los datos necesarios para el pago OXXO
    this.jsonData = JSON.stringify(this.createPayloadOxxo());
    // Se selecciona la URL de la API según el entorno (producción o desarrollo)
    if (environment.process_with_conekta == 1) {
      this.urlEndPoint = this.urlapicf + '/create/order/payment';
    } else {
      this.urlEndPoint = this.urlapicf + '/create/order/paymentDEV';
    }

    // Se realiza una solicitud HTTP POST al servidor con los datos del pago OXXO
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((response: any) => {
        if (response.ok) {
          // Si la respuesta es exitosa, se procesa la información del pago OXXO
          this.payment_id = response.response.id;
          this.pagarAntes =
            moment(this.nexpayment).utc().format('dddd') +
            ', ' +
            moment(this.nexpayment).utc().format('DD-MM-YYYY');
          this.barcodeUrl =
            response.response.charges.data[0].payment_method.barcode_url;
          this.referenceOxxo =
            response.response.charges.data[0].payment_method.reference;

          // Se crea un objeto oxxoResponse con los datos del pago para mostrar al usuario
          this.oxxoResponse = {
            id_pago: response.response.id,
            nombre_cliente: this.datosCliente.nombre_cliente,
            fecha_antes: moment(this.nexpayment).utc().format('DD-MM-YYYY'),
            pago: this.montoPagar,
            referencia: this.referenceOxxo,
            fecha_expira: moment(
              response.response.charges.data[0].payment_method.expires_at * 1000
            )
              .utc()
              .format('DD-MM-YYYY'),
            pagar_antes_de: this.pagarAntes,
            barcode: this.barcodeUrl,
          };
          // Se muestra el modal de OXXO después de un pequeño retraso
          setTimeout(() => {
            $('#modal-oxxo').modal('show');
          }, 100);
        } else {
          // En caso de error, se muestra un mensaje de error al usuario
          this.mensaje.error('Oops', response.response);
        }
      });
  }

  createPayloadPaynet() { 
    let cobranza_juridica = this.func.readLocalStorage('cobranza_juridica') != 'null' ? '1' : '0';
    const timestamp = new Date().getTime();
    const strTimestamp = String(timestamp)
    const type = 'pagoPaynet';
    return {
      type: type,
      orderID: this.func.crypt(`${this.datosCliente.ORD_ID},${strTimestamp}`, type),
      name: this.func.crypt(this.datosCliente.nombre_cliente, type),
      email: this.func.crypt(this.datosCliente.CUS_EMAIL, type),
      pago: this.func.crypt(this.montoPagar, type),
      datPaymenttype: this.func.crypt('PARCIALIDAD', type),
      cobranza: cobranza_juridica,
    };
  }

  // Esta función realiza el proceso de pago Paynet al realizar una solicitud HTTP al servidor.
  pagarPaynet() {
    // Se crea un objeto JSON con los datos necesarios para el pago Paynet
    this.jsonData = JSON.stringify(this.createPayloadPaynet());

    // Se selecciona la URL de la API según el entorno (producción o desarrollo)
    if (environment.process_with_conekta == 1) {
      this.urlEndPoint = this.urlapicf + '/create/payment/method/paynetPRO';
    } else {
      this.urlEndPoint = this.urlapicf + '/create/payment/method/paynetDEV';
    }

    // Se realiza una solicitud HTTP POST al servidor con los datos del pago Paynet
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((response: any) => {
        // Comprueba si la respuesta no contiene un mensaje de error
        if (!response.errorMessage) {
          try {
            // En caso de éxito, muestra un mensaje de éxito al usuario
            this.mensaje.success(
              'Éxito',
              'Su ficha de pago se ha generado exitosamente'
            );

            // Procesa y almacena la información del pago Paynet
            this.paynetResponse = {
              monto: response.amount,
              fecha_recibo: moment(response.creation_date).format(
                'DD-MM-YYYY HH:mm:ss'
              ),
              direccion: response.customer.address,
              email: response.customer.email,
              name: response.customer.name,
              phone: response.customer.phone_number,
              id_pago: response.id,
              id_orden: response.order_id,
              barcode: response.payment_method.barcode_url,
              reference: response.payment_method.reference,
            };

            // Muestra el modal de Paynet después de un breve retraso
            this.cerrarModal();
            setTimeout(() => {
              $('#modal-paynet').modal('show');
            }, 100);
          } catch (error) {
            // En caso de un error inesperado, muestra un mensaje de error al usuario
            this.mensaje.error(
              'Oops',
              'No se ha podido procesar el pago correctamente'
            );
            console.log('error:', error);
          }
        } else {
          // En caso de un error en la respuesta, muestra un mensaje de error al usuario
          this.mensaje.error(
            'Oops',
            'No se ha podido procesar el pago correctamente'
          );
          console.log(response);
        }
      });
  }

  createPayloadPaynetCard() {  
    let cobranza_juridica = this.func.readLocalStorage('cobranza_juridica') != 'null' ? '1' : '0';
    const timestamp = new Date().getTime();
    const strTimestamp = String(timestamp)
    const type = 'pagoPaynet';
    return {
      type: type,
      orderID: this.func.crypt(`${this.datosCliente.ORD_ID},${strTimestamp}`, type),
      name: this.func.crypt(this.datosCliente.nombre_cliente, type),
      email: this.func.crypt(this.datosCliente.CUS_EMAIL, type),
      pago: this.func.crypt(this.montoPagar, type),
      datPaymenttype: this.func.crypt('PARCIALIDAD', type),
      method:"card",
      cobranza: cobranza_juridica,
    };
  }

  pagarTarjeta() {
    let data = this.createPayloadPaynetCard()
    this.jsonData = JSON.stringify(data)
    const mensaje = this.mensaje
    /* const spinner = this.spinner */
    if (environment.process_with_conekta == 1) {
      this.urlEndPoint = this.urlapicf + '/create/payment/method/paynetPRO';
    } else {
      this.urlEndPoint = this.urlapicf + '/create/payment/method/paynetDEV';
    }
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, false)
      .subscribe((response: any) => {
          if (response && typeof response?.payment_method !== "undefined") {
            mensaje.success('Éxito','Su recibo está siendo generado, espere un momento...')
            this.urlToRedirect = response?.payment_method?.url;
            const openIframe: any = document.getElementById('openIframe')
            const openIframeContainer: any = document.getElementById('openIframeContainer')
            openIframe?.addEventListener('load', function() {
              openIframeContainer?.classList.remove('d-none');
            });
            $('#openIframeModal').modal('show');
             this.spinner.hide() 
        } else {
          this.mensaje.error('Oops', response.response);
          console.error(response, 'respuesta fallida');
         this.spinner.hide()
        }
      });
  }

  createPayloadSPEI() { 
    let cobranza_juridica = this.func.readLocalStorage('cobranza_juridica') != 'null' ? '1' : '0';
    const timestamp = new Date().getTime();
    const strTimestamp = String(timestamp)
    let type = 'spei'
  const data = {
      type: type,
      orderID: this.func.crypt(`${this.datosCliente.ORD_ID},${strTimestamp}`, type),
      name: this.func.crypt(this.datosCliente.nombre_cliente, type),
      email: this.func.crypt(this.datosCliente.CUS_EMAIL, type),
      pago: this.func.crypt(this.montoPagar, type),
      datPaymenttype: this.func.crypt('PARCIALIDAD', type),
      method:"spei",
      cobranza: cobranza_juridica,
    }
    return data
  }

  pagarSPEI() {
    this.spinner.show();
    let data  = this.createPayloadSPEI();
    let jsonData = JSON.stringify(data);
    const mensaje = this.mensaje
    if (environment.process_with_conekta == 1) {
      this.urlEndPoint = this.urlapicf + '/create/payment/method/paynetPRO';
    } else {
      this.urlEndPoint = this.urlapicf + '/create/payment/method/paynetDEV';
    }this.httpServ
    .consulta(this.urlEndPoint, jsonData, false)
    .subscribe((response: any) => {
      if (typeof response.payment_method !== "undefined") {
        mensaje.success('Éxito','Su recibo está siendo generado, espere un momento...')
        this.urlToRedirect = this.sanitizer.bypassSecurityTrustResourceUrl(response.payment_method.url_spei);
        this.openIframe = true; 
        this.spinner.hide()
      } else {
        this.mensaje.error('Oops', response.errorMessage);
        console.log(response, 'respuesta fallida');
        this.spinner.hide()
      }
    });
}

cerrarModal() {
  this.modalService.dismissAll();
}
}
