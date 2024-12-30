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
export class ReciboCompraConsignaService {
  private country: string = this.func.readLocalStorage('country');
  private urlapicf = environment.url_api_cf;
  private creditoFinalizado: boolean = false;

  constructor(
    private alert: AlertMessageService,
    private spinner: SpinnerService,
    private func: FunctionsService,
    private http: HttpServiceService
  ) {}


  async obtenerDataCliente(
    orderID: string | number
  ): Promise<any | undefined> {
    return new Promise<any | undefined>((resolve) => {
      let url = this.urlapicf + '/recibos/reciboPagosData/reciboContado'; // Ajusta la URL según tu endpoint
      let payload = JSON.stringify({
        type: 'getDataClienteConsigna',
        payment_id: this.func.crypt(orderID, 'getDataClienteConsigna'),
      });

      this.http.consulta(url, payload, false).subscribe((response: any) => {
        if (response.ok) {
          let dataCliente = response.response[0];

          // Crear objeto con los datos necesarios para el PDF
          let clientePDF = {
            MARCA: dataCliente.marca,
            MODELO: dataCliente.modelo,
            PRECIO_PUBLICO: dataCliente.monto,
            imei: dataCliente.imei,
            ref: dataCliente.id_pago,
            sucursal: dataCliente.sucursal,
            nombreUsuario: dataCliente.vendedor,
            fecha_pago: dataCliente.fecha_pago
          };

          resolve(clientePDF);
          this.finalReceiptPDF(clientePDF,3);
          return clientePDF;
        } else {
          console.log('Error obteniendo la información de la venta en consigna');
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

  async finalReceiptPDF(data:any, option:number = 1) {
    console.log(data)
    let finalReceiptPDF: any;
    this.spinner.show();
    let formattedDate;
    const auxfech = option === 3 
      ? new Date(data.fecha_pago.split('T')[0] + 'T00:00:00') 
      : new Date();

    // Ajustar a la zona horaria local
    const fechaLocal = new Date(auxfech.getTime() + auxfech.getTimezoneOffset() * 60000);

    const year = fechaLocal.getFullYear();
    const month = (fechaLocal.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaLocal.getDate().toString().padStart(2, '0');
    formattedDate = `${year}-${month}-${day}`;

    let formFech = this.func.longDateReceiptPDF(formattedDate);

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
                  text: 'RECIBO DE COMPRA',
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
          margin: [150, 5, 150, 0],
          style: 'header',
          table: {
            widths: ['35%', '65%'], // Ajuste de ancho de columnas
            body: [
              [
                { text: 'DESCRIPCIÓN', style: 'tbl2Tit', colSpan: 2, alignment: 'center' },
                {},
              ],
              [
                { text: 'MARCA:', style: 'tbl2Cont', alignment: 'left' },
                { text: `${data.MARCA}`, style: 'tbl2Cont', alignment: 'left' },
              ],
              [
                { text: 'MODELO:', style: 'tbl2Cont', alignment: 'left' },
                { text: `${data.MODELO}`, style: 'tbl2Cont', alignment: 'left' },
              ],
              [
                { text: 'IMEI:', style: 'tbl2Cont', alignment: 'left' },
                { text: `${data.imei}`, style: 'tbl2Cont', alignment: 'left' },
              ],
              [
                { text: 'PRECIO:', style: 'tbl2Cont', alignment: 'left' },
                { text: `${this.func.formatCurrency(data.PRECIO_PUBLICO, 1, this.country)}`, style: 'tbl2Cont', alignment: 'left' },
              ],
            ],
          },
          layout: {
            hLineWidth: function (i: any, node: any) {
              return i === 0 || i === node.table.body.length ? 1 : 1; // Bordes horizontales visibles
            },
            vLineWidth: function (i: any, node: any) {
              return 0; // Oculta las líneas verticales
            },
            hLineColor: function (i: any, node: any) {
              return '#FFFFFF'; // Sin color para los bordes horizontales
            },
          },
        },
        {
          margin: [0, 10, 0, 0],
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
        // {
        //   alignment: 'center',
        //   // image: await this.getBase64ImageFromURL(
        //   //   '../../../../assets/images/pagado_sello.png'
        //   // ),
        //   width: 100,
        // },
      ],
    
      styles: {
        header: {
          margin: [0, 0, 0, 0], // Ajuste de márgenes en el encabezado
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
    if (option === 1 || option === 3) {

      pdf.download(`ReciboPago-${formattedDate}-${data.nombreUsuario}`);
      this.alert.success(
        '¡Gracias por tu pago ' + `${data.nombreUsuario}` + '!',
        'Se ha descargado correctamente tu comprobante.'
      );

    } else {
      
      return new Promise<string>((resolve, reject) => {
        pdf.getBase64((base64Data: string) => {
          if (base64Data) {
            resolve(base64Data); // Retorna el PDF en base64
          } else {
            reject('Error al generar el PDF');
          }
        });
      });;

    }
    this.spinner.hide();

    return
  }
}
