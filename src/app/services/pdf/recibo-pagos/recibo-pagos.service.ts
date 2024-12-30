import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
import { FunctionsService } from '../../functions/functions.service';
import { HttpServiceService } from '../../httpServices/http-service.service';
import { ReciboPago } from '../interfaces/interfaces_recibos';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { AlertMessageService } from '../../alert/alert-message.service';
import * as pdfMake from 'pdfmake/build/pdfmake';

declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class ReciboPagosService {
  private country: string = this.func.readLocalStorage('country');
  private urlapicf = environment.url_api_cf;
  private creditoFinalizado: boolean = false;

  constructor(
    private alert: AlertMessageService,
    private spinner: SpinnerService,
    private func: FunctionsService,
    private httpServ: HttpServiceService
  ) {}

  async obtenerDataCliente(
    paymentID: string | number,
  ): Promise<ReciboPago | undefined> {
    return new Promise<ReciboPago | undefined>((resolve) => {
      let url = this.urlapicf + '/recibos/reciboPagosData/reciboPagos';
      //let url = this.urlapicf + '/get/reciboPagosData/reciboPagos'; //(cambio de joel mismo dia, 5pm)
      let payload = JSON.stringify({
        type: 'getDataCliente',
        payment_id: this.func.crypt(paymentID, 'getDataCliente'),
      });
      this.httpServ.consulta(url, payload, false).subscribe((response: any) => {
        if (response.ok) {
          let nuevaFechaPago: string = '';
          let dataCliente = response.response[0];
          let {
            CURP,
            device_id,
            nombre_cliente,
            telefono_cliente,
            parcialidades_pagadas,
            parcialidades_pendientes,
            sucursal,
            vendedor,
            fecha_pago,
            monto,
            id_pago,
          } = dataCliente;
         let parPending = Number(parcialidades_pendientes);
         parPending == 0 ? this.creditoFinalizado = true : this.creditoFinalizado = false;
          // Obtener la parte de la fecha (sin la hora)
          let fechaSolo = fecha_pago.split('T')[0];

          this.country === 'MX'
            ? (nuevaFechaPago = this.func.sumarDias(fecha_pago, 7))
            : (nuevaFechaPago = this.func.sumarDias(fecha_pago, 15));

          let clientePDF: ReciboPago = {
            nombCliente: nombre_cliente,
            nombClient: nombre_cliente,
            clientPhone: telefono_cliente,
            clientCurp: CURP,
            deviceId: device_id,
            parcialPend: parcialidades_pendientes,
            parcialCanc: parcialidades_pagadas,
            nombreUsuario: vendedor,
            pamountF: this.func.formatCurrency(monto, 1, this.country),
            ref: id_pago,
            sucursal: sucursal,
            fechVenc: nuevaFechaPago,
            formFech: fechaSolo,
          };


          let jsonData: string = JSON.stringify(clientePDF);

          this.func.addLocalStorage(jsonData, 'dataReciboPago');
          this.finalReceiptPDF()
        } else {
          console.log('error al intentar obtener la informacion del pago');
          resolve(undefined);
          return;
        }
      });
    });
  }

  getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = url;
    });
  }

  async finalReceiptPDF() {
    let finalReceiptPDF: any;
    this.spinner.show();
    // let data: any;
    let dataReciboPago = JSON.parse(this.func.readLocalStorage('dataReciboPago'));
    let fecha = dataReciboPago?.formFech;
    if (!fecha) {
      fecha = new Date().toISOString().split('T')[0];
    }
    let formFech = this.func.longDateReceiptPDF(fecha);

    let fe: any = new Date();
    let formattedDate: string = fe.toISOString().split('T')[0];
    let formattedTime: string = fe.toTimeString().split(' ')[0];
    let arrFe: any = formattedDate.split('-');
    let arrTime: any = formattedTime.split(':');
    let data: any
    let auxFe: any =
    arrFe[2] +
    arrFe[1] +
    arrFe[0] +
      'T' +
      arrTime[0] +
      arrTime[1] +
      arrTime[2];
        data = JSON.parse(this.func.readLocalStorage('dataPagoParc'));
        data === null ? data = dataReciboPago : data = data;

    /**********************************************/
    /*   CONSTRUCCION DEL RECIBO EN FORMATO PDF   */
    /**********************************************/

    finalReceiptPDF = {
      pageSize: 'A4',
      defaultStyle: {
        columnGap: 8,
      },
      content: [
        {
          alignment: 'justify',
          style: 'header',
          columns: [
            {
              image: await this.getBase64ImageFromURL(
                '../../../../assets/images/logo.png'
              ),
              margin: [0, 15, 0, 0],
              width: 150,
            },
            {
              table: {
                widths: ['50%', '50%'],
                style: 'tableBottomBorder',
                body: [
                  [
                    { text: 'SUCURSAL', style: 'rowStyleTit' },
                    { text: 'FECHA', style: 'rowStyleTit' },
                  ],
                  [
                    { text: `${data.sucursal}`, style: 'rowStyleCont' },
                    {
                      text: `${formFech}`,
                      style: 'rowStyleCont',
                    },
                  ],
                  [
                    { text: 'NOMBRE DEL VENDEDOR', style: 'rowStyleTit' },
                    { text: 'NRO. DE REFERENCIA', style: 'rowStyleTit' },
                  ],
                  [
                    { text: `${data.nombreUsuario}`, style: 'rowStyleCont' },
                    { text: `${data.ref}`, style: 'rowStyleCont' },
                  ],
                ],
              },
              layout: {
                hLineWidth: function (i: any, node: any) {
                  return i === node.table.body.length ? 1 : 0;
                },
                hLineColor: function (i: any, node: any) {
                  return i === node.table.body.length ? '#dee2e6' : '#FFFFFF'; // Color de borde azul en el último borde inferior
                },
                vLineWidth: function (i: any, node: any) {
                  return 0; // Oculta las líneas verticales
                },
              },
            },
          ],
        },
        {
          margin: [-25, 10, -25, 0],
          style: 'header',
          table: {
            widths: '100%',
            body: [
              [
                {
                  text: 'RECIBO DE PAGO',
                  alignment: 'center',
                  fontSize: 13,
                  bold: true,
                  style: 'rowStyleTit',
                },
              ],
            ],
          },
          layout: { defaultBorder: false },
        },
        {
          alignment: 'justify',
          margin: [-25, 5, -25, 0],
          style: 'header',
          columns: [
            {
              table: {
                alignment: 'justify',
                widths: ['33%', '67%'],
                body: [
                  [
                    { text: 'SUCURSAL', style: 'tbl1Tit', colSpan: 2 },
                    { text: '' },
                  ],
                  [
                    { text: 'Nombre Completo:', style: 'tbl1Cont' },
                    { text: `${data.nombClient}`, style: 'tbl1Cont' },
                  ],
                  [
                    {
                      text:
                        this.country === 'MX'
                          ? 'CURP:'
                          : this.country === 'GTM'
                          ? 'CUI:'
                          : 'CI:',
                      style: 'tbl1Cont',
                    },
                    { text: `${data.clientCurp}`, style: 'tbl1Cont' },
                  ],
                  [
                    { text: 'Nro. Teléfono', style: 'tbl1Cont' },
                    { text: `${data.clientPhone}`, style: 'tbl1Cont' },
                  ],
                  [
                    { text: 'Device ID:', style: 'tbl1Cont' },
                    { text: `${data.deviceId}`, style: 'tbl1Cont' },
                  ],
                ],
              },
              layout: {
                hLineWidth: function (i: any, node: any) {
                  return i === 0 ? 0 : 1; // Ocultar el borde superior
                },
                vLineWidth: function (i: any, node: any) {
                  return 0; // Ocultar los bordes verticales
                },
                hLineColor: function (i: any, node: any) {
                  return '#f2f2f2'; // Color rojo para los bordes horizontales
                },
              },
            },
            {
              table: {
                alignment: 'justify',
                widths: ['44%', '56%'],
                body: [
                  [
                    { text: 'DATOS DEL CRÉDITO', style: 'tbl2Tit', colSpan: 2 },
                    { text: '' },
                  ],
                  [
                    { text: 'Monto abonado:', style: 'tbl2Cont' },
                    { text: `${data.montoPagado === undefined ? data.pamountF : data.montoPagado}`, style: 'tbl2Cont' },
                  ],
                  [
                    { text: 'Parcialidades Pagadas:', style: 'tbl2Cont' },
                    {
                      text: `${data.parcialCanc}`,
                      style: 'tbl2Cont',
                    },
                  ],
                  [
                    { text: 'Parcialidades Pendientes', style: 'tbl2Cont' },
                    {
                      text: `${data.parcialPend}`,
                      style: 'tbl2Cont',
                    },
                  ],
                  [
                    {
                      text: this.creditoFinalizado
                        ? 'Felicidades por finalizar su crédito'
                        : 'Próxima fecha de pago:',
                      style: 'tbl2Cont',
                    },
                    {
                      text: this.creditoFinalizado ? '' : `${data.fechVenc}`,
                      style: 'tbl2Cont',
                    },
                  ],
                ],
              },
              layout: {
                hLineWidth: function (i: any, node: any) {
                  return i === 0 ? 0 : 1; // Ocultar el borde superior
                },
                vLineWidth: function (i: any, node: any) {
                  return 0; // Ocultar los bordes verticales
                },
                hLineColor: function (i: any, node: any) {
                  return '#f2f2f2'; // Color rojo para los bordes horizontales
                },
              },
            },
          ],
        },
        {
          margin: [-25, 5, -25, 0],
          style: 'header',
          table: {
            widths: '100%',
            body: [
              [
                {
                  text: 'PAGO EN EFECTIVO',
                  alignment: 'center',
                  fontSize: 13,
                  bold: true,
                  style: 'rowStyleTit',
                },
              ],
            ],
          },
          layout: { defaultBorder: false },
        },
      ],

      styles: {
        header: {
          margin: [-25, 0, -25, 0], //izq, sup, der, inf
        },
        tableBottomBorder: {
          border: [false, false, false, true],
          borderColor: '#0d6efd',
        },
        rowStyleTit: {
          fontSize: 10,
          bold: true,
          margin: [0, 1, 0, 1],
          fillColor: '#0d6efd',
          color: '#fff',
          alignment: 'center',
        },
        rowStyleCont: {
          margin: [0, 4, 0, 4],
          alignment: 'center',
        },
        tbl1Tit: {
          fontSize: 10,
          bold: true,
          margin: [0, 1, 0, 1],
          fillColor: '#81bc3a',
          color: '#fff',
          alignment: 'center',
        },
        tbl1Cont: {
          fontSize: 10,
          bold: true,
          margin: [0, 1, 0, 1],
          fillColor: '#bce788',
          color: '#000',
          alignment: 'justify',
        },
        tbl2Tit: {
          fontSize: 10,
          bold: true,
          margin: [0, 1, 0, 1],
          fillColor: '#f49900',
          color: '#fff',
          alignment: 'center',
        },
        tbl2Cont: {
          fontSize: 10,
          bold: true,
          margin: [0, 1, 0, 1],
          fillColor: '#fcdba4',
          color: '#000',
          alignment: 'justify',
        },
      },
    };

    /**********************************************/

    const pdf: any = await pdfMake.createPdf(finalReceiptPDF);
    pdf.download(`ReciboPago-${auxFe}-${data.clientCurp}`);
    this.spinner.hide();

    this.alert.success(
      '¡Gracias por tu pago ' + `${data.nombCliente}` + '!',
      'Se ha descargado correctamente tu comprobante.'
    );
    this.func.deleteLocalStorage('dataPagoParc');
    this.func.deleteLocalStorage('dataReciboPago');
  }
}
