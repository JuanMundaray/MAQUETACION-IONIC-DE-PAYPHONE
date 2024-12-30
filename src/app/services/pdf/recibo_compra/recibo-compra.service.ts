import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { ReciboCompra } from '../interfaces/interfaces_recibos';
import { AlertMessageService } from '../../alert/alert-message.service';
import { EnvMgsWhatsAppService } from '../../envMgsWhatsApp/env-mgs-whats-app.service';
import { environment } from 'src/environments/environment';
import { FunctionsService } from '../../functions/functions.service';
import { HttpServiceService } from '../../httpServices/http-service.service';
@Injectable({
  providedIn: 'root',
})
export class ReciboCompraService {
  private country: string = this.func.readLocalStorage('country');
  urlapicf: string = environment.url_api_cf;
  fechaCompra: any;
  fechaFormateada: string;
  fechaCompraISO: any;
  curpCliente: any;
  /*   cliente: DetallesCliente = { ========== EJEMPLO DE CLIENTE =================
    nombClient: 'JESUS ALBERTO VALDEZ RAMOS',
    curp: 'VARJ850501HSRLMS03',
    phone10: '6622006421',
    ordTag: 'ZYJEM8B',
    imeiPhone : '350350680708059',
    model : 'SAMSUNG A34 5G 6 GB 128 GB 5G',
    enganchef : '$910.00 MXN',
    parcialidadF :  '$326.00 MXN',
    temporalidad : '39',
    sucursal : 'CELUCENTER 2 JAM1 GUAYMAS',
    vendedor : 'Judith Alejandra Rubio',
    arrDates : [
      'Miércoles, 13 de Diciembre de 2023',
      'Miércoles, 20 de Diciembre de 2023',
      'Miércoles, 27 de Diciembre de 2023',
      'Miércoles, 03 de Enero de 2024',
      'Miércoles, 10 de Enero de 2024',
      'Miércoles, 17 de Enero de 2024',
      'Miércoles, 24 de Enero de 2024',
      'Miércoles, 31 de Enero de 2024',
      'Miércoles, 07 de Febrero de 2024',
      'Miércoles, 14 de Febrero de 2024',
      'Miércoles, 21 de Febrero de 2024',
      'Miércoles, 28 de Febrero de 2024',
      'Miércoles, 06 de Marzo de 2024',
      'Miércoles, 13 de Marzo de 2024',
      'Miércoles, 20 de Marzo de 2024',
      'Miércoles, 27 de Marzo de 2024',
      'Miércoles, 03 de Abril de 2024',
      'Miércoles, 10 de Abril de 2024',
      'Miércoles, 17 de Abril de 2024',
      'Miércoles, 24 de Abril de 2024',
      'Miércoles, 01 de Mayo de 2024',
      'Miércoles, 08 de Mayo de 2024',
      'Miércoles, 15 de Mayo de 2024',
      'Miércoles, 22 de Mayo de 2024',
      'Miércoles, 29 de Mayo de 2024',
      'Miércoles, 05 de Junio de 2024',
      'Miércoles, 12 de Junio de 2024',
      'Miércoles, 19 de Junio de 2024',
      'Miércoles, 26 de Junio de 2024',
      'Miércoles, 03 de Julio de 2024',
      'Miércoles, 10 de Julio de 2024',
      'Miércoles, 17 de Julio de 2024',
      'Miércoles, 24 de Julio de 2024',
      'Miércoles, 31 de Julio de 2024',
      'Miércoles, 07 de Agosto de 2024',
      'Miércoles, 14 de Agosto de 2024',
      'Miércoles, 21 de Agosto de 2024',
      'Miércoles, 28 de Agosto de 2024',
      'Miércoles, 04 de Septiembre de 2024'
    ]
    ,
  } */

  constructor(
    private spinner: SpinnerService,
    private alert: AlertMessageService,
    private whatsapp: EnvMgsWhatsAppService,
    private func: FunctionsService,
    private http: HttpServiceService
  ) {
    this.country = this.func.readLocalStorage('country');
  }

  obtenerDiaSemana = (fechaString: any) => {
    const fecha = new Date(fechaString);
    const opcionesDia: any = { weekday: 'long', timeZone: 'UTC' };
    const diaSemana = new Intl.DateTimeFormat('es-ES', opcionesDia).format(
      fecha
    );
    return diaSemana;
  };

  /**********************************************/
  /* generar recibo de venta */
  /**********************************************/
  async obtenerDataCliente(
    orderID: string | number
  ): Promise<ReciboCompra | undefined> {
    return new Promise<ReciboCompra | undefined>((resolve) => {
      let url = this.urlapicf + '/recibos/reciboPagosData/reciboCompra';
      let payload = JSON.stringify({
        type: 'getDataCliente',
        order_id: this.func.crypt(orderID, 'getDataCliente'),
      });
      this.http.consulta(url, payload, false).subscribe((response: any) => {
        if (response.ok) {
          let dataCliente = response.response[0];
          const {
            CURP,
            FECHA_COMPRA,
            ORD_ID,
            ORD_IMEI,
            device_id,
            enganche,
            modelo_celular,
            monto_parcialidades,
            nombre_cliente,
            sucursal,
            telefono_cliente,
            temporalidad,
            vendedor,
          } = dataCliente;
          this.curpCliente = CURP;
          let fechaSinFormato = FECHA_COMPRA;
          this.fechaCompraISO = fechaSinFormato;
          // Obtener la parte de la fecha (sin la hora)
          this.fechaCompra = fechaSinFormato.split('T')[0];
          this.fechaFormateada = new Date(this.fechaCompra).toLocaleDateString(
            'es-ES',
            {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              timeZone: 'UTC',
            }
          );
          // Fecha de compra en formato ISO 8601
          const fechaCompra = fechaSinFormato;
          // Cantidad de días entre pagos (temporalidad)
          const temporalidadDias = this.country == 'MX' ? 7 : 15;
          // Número de pagos
          const numeroPagos = temporalidad;

          // Función para formatear una fecha
          const formatearFecha = (fecha: any) => {
            const opcionesFecha: any = {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'UTC',
            };
            return new Intl.DateTimeFormat('es-ES', opcionesFecha).format(
              fecha
            );
          };
          const obtenerProximaFechaPago = (
            fecha: any,
            temporalidadDias: any
          ) => {
            const proximaFecha = new Date(fecha);
            proximaFecha.setDate(fecha.getDate() + temporalidadDias);

            return proximaFecha;
          };
          // Función para generar y mostrar los pagos
          const generarPagos = () => {
            const fechasPagos = [];
            let fechaActual = obtenerProximaFechaPago(
              new Date(fechaCompra),
              temporalidadDias
            );
            for (let i = 0; i < numeroPagos; i++) {
              const fechaFormateada = formatearFecha(fechaActual);
              fechasPagos.push(fechaFormateada);
              // Obtener la próxima fecha de pago
              fechaActual = obtenerProximaFechaPago(
                fechaActual,
                temporalidadDias
              );
            }
            return fechasPagos;
          };
          // Obtener y mostrar los pagos generados
          const pagosGenerados = generarPagos();
          let clientePDF: ReciboCompra = {
            arrDates: pagosGenerados,
            curp: CURP,
            enganchef: this.func.formatCurrency(enganche, 1, this.country),
            imeiPhone: ORD_IMEI,
            model: modelo_celular,
            vendedor,
            temporalidad,
            ordTag: device_id,
            nombClient: nombre_cliente,
            phone10: telefono_cliente.slice(3),
            sucursal,
            parcialidadF: this.func.formatCurrency(
              monto_parcialidades,
              1,
              this.country
            ),
          };
          resolve(dataCliente);
          this.finalReceiptPDF(clientePDF);
          return clientePDF;
        } else {
          console.log('error obteniendo la información de la venta');
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

  async finalReceiptPDF(datosCliente: ReciboCompra) {
    let cliente = datosCliente;

    this.spinner.show();
    let date = this.fechaFormateada;
    let weekDay = this.obtenerDiaSemana(this.fechaCompraISO).toUpperCase();

    var finalReceiptPDF: any = {
      content: [
        {
          columns: [
            {
              image: await this.getBase64ImageFromURL(
                '../../../../assets/images/logo.png'
              ),
              margin: [0, 30, 0, 0],
              width: 150,
            },
            {
              stack: [
                {
                  image: await this.getBase64ImageFromURL(
                    '../../../../assets/images/resumenFinalPDF/qr-code-logo.png'
                  ),
                  margin: [290, 6, 4, 2],
                  fit: [80, 80],
                },
                {
                  alignment: 'right',
                  color: '#ff9900',
                  text: '¡Descarga nuestra app!',
                  margin: [0, -5, 0, 0],
                  fontSize: 8,
                },
              ],
            },
          ],
          fontSize: 20,
        },
        {
          // border-bottom-canvas
          margin: [0, 3, 0, 0],
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 595.28,
              y2: 0,
              lineWidth: 1,
              color: '#bebebe',
            },
          ],
        },
        {
          margin: [0, 10, 0, 0],
          table: {
            widths: ['*'],
            body: [
              [
                {
                  alignment: 'center',
                  text: 'RECIBO DE COMPRA',
                  style: 'tableCell',
                  border: [true, true, true, true], // [top, right, bottom, left]
                  fillColor: '#00ace6',
                  color: '#ffffff',
                  fontSize: 15,
                },
              ],
            ],
          },
          layout: 'noBorders',
        },
        {
          columns: [
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: ['98%'], // Ancho de la tabla establecido en 100%
                body: [
                  [
                    {
                      alignment: 'center',
                      text: 'Datos personales',
                      fillColor: '#009933',
                      color: '#ffffff',
                      fontSize: 10,
                    },
                  ],
                  [
                    {
                      text: `Nombre Completo: ${cliente.nombClient}`,
                      fillColor: '#80ff80',
                      margin: [4, 0, 0, 0],
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text:
                        this.country === 'MX'
                          ? 'CURP: ' + this.curpCliente
                          : 'CUI: ' + cliente.curp,
                      fillColor: '#80ff80',
                      margin: [4, 0, 0, 0],
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: `Número telefonico: ${cliente.phone10}`,
                      fillColor: '#80ff80',
                      margin: [4, 0, 0, 0],
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: `DeviceID: ${cliente.ordTag}`,
                      fillColor: '#80ff80',
                      margin: [4, 0, 0, 0],
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: `IMEI: ${cliente.imeiPhone}`,
                      fillColor: '#80ff80',
                      margin: [4, 0, 0, 0],
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: `Modelo Celular: ${cliente.model}`,
                      fillColor: '#80ff80',
                      margin: [4, 0, 0, 0],
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                ],
              },
              layout: 'noBorders',
              style: 'tableStyle',
            },
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: ['98%'], // Ancho de la tabla establecido en 100%
                height: '*',
                body: [
                  [
                    {
                      text: 'Datos del crédito',
                      color: '#ffffff',
                      fillColor: '#ff9900',
                      alignment: 'center',
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: `Fecha de compra: ${date}`,
                      fillColor: '#ffc266',
                      margin: [4, 0, 0, 0],
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: `Enganche: ${cliente.enganchef}`,
                      fillColor: '#ffc266',
                      margin: [4, 0, 0, 0],
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: `Parcialidad: ${cliente.parcialidadF}`,
                      fillColor: '#ffc266',
                      margin: [4, 0, 0, 0],
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text:
                        this.country === 'MX'
                          ? 'Plazo: ' + cliente.temporalidad + ' SEMANAS'
                          : 'Plazo: ' + cliente.temporalidad + ' QUINCENAS',
                      fillColor: '#ffc266',
                      margin: [4, 0, 0, 0],
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: `Sucursal: ${cliente.sucursal}`,
                      fillColor: '#ffc266',
                      margin: [4, 0, 0, 0],
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: `Vendedor: ${cliente.vendedor}`,
                      fillColor: '#ffc266',
                      margin: [4, 0, 0, 0],
                      fontSize: 10,
                      bold: true,
                    },
                  ],
                ],
              },
              layout: 'noBorders',
              style: 'tableStyle',
            },
          ],
        },
        {
          margin: [0, 10, 0, 0],
          fillColor: '#03688a', // Color de fondo personalizado
          table: {
            widths: ['*'],
            body: [
              [
                {
                  columns: [
                    {
                      margin: [180, 0, 0, 0],
                      width: 'auto',
                      text:
                        this.country === 'MX'
                          ? 'DÍA DE PAGO:'
                          : 'PAGOS A REALIZAR',
                      border: [true, true, false, true],
                      color: '#ffffff',
                      fontSize: 15,
                      alignment: 'center', // Alineación centrada
                    },
                    {
                      margin: [-5, 0, 0, 0],
                      width: 'auto',
                      text: this.country === 'MX' ? `(${weekDay})` : '',
                      border: [false, true, true, true],
                      color: '#ffffff',
                      fontSize: 15,
                    },
                  ],
                  columnGap: 10, // Espacio entre las columnas
                  layout: 'noBorders',
                  style: 'table',
                },
              ],
            ],
          },
          layout: 'noBorders',
        },

        {
          margin: [0, 5, 0, 0],
          table: {
            headerRows: 0,
            body: cliente.arrDates.map((date: string, i: number) => {
              i += 1;
              return [
                {
                  fillColor: i % 2 == 0 ? '#ffffff' : '#b3b3b3',
                  columns: [
                    {
                      text: `${i})     ${date}`,
                      bold: true,
                      margin: [0, 5, 0, 0],
                    },
                    {
                      text: `${cliente.parcialidadF}`,
                      bold: true,
                      margin: [20, 5, 0, 0],
                    },
                    {
                      canvas: [
                        {
                          type: 'polyline',
                          lineWidth: 1,
                          closePath: true,
                          points: [
                            { x: 0, y: 0 },
                            { x: 10, y: 0 },
                            { x: 10, y: 10 },
                            { x: 0, y: 10 },
                          ],
                        },
                      ],
                      margin: [0, 5, 0, 0],
                    },
                  ],
                },
              ];
            }),
          },
        },
      ],
      styles: {
        tableStyle: {
          table: {
            body: {
              // Aplica el estilo alternado a las filas pares
              even: { fillColor: '#0000ff' },
            },
          },
        },
        boldText: {
          bold: true,
        },
        columnStyle: {
          columnGap: 20,
        },
        tableHeader: {
          bold: true,
          fillColor: '#f3f3f3',
          alignment: 'center',
        },
        tableBody: {
          alignment: 'center',
        },
        infoText: {
          color: '#2196f3',
          fontSize: 10,
          bold: true,
          margin: [0, 10, 0, 0],
        },
        checkboxLabel: {
          fontSize: 10,
          margin: [0, 5, 0, 0],
        },
        buttonText: {
          fontSize: 12,
          fillColor: '#2196f3',
          color: '#ffffff',
          margin: [0, 10, 0, 0],
        },
        arrowIcon: {
          fontSize: 12,
          bold: true,
        },
        rowStyle: {
          margin: [0, 20, 0, 0],
        },
      },
    };

    if (this.country === 'MX') {
      finalReceiptPDF.content.push(
        {
          margin: [0, 10, 0, 0],
          table: {
            widths: ['*'],
            body: [
              [
                {
                  alignment: 'center',
                  text: 'MÉTODOS DE PAGO',
                  style: 'tableCell',
                  border: [true, true, true, true], // [top, right, bottom, left]
                  fillColor: '#00ace6',
                  color: '#ffffff',
                  fontSize: 15,
                },
              ],
            ],
          },
          layout: 'noBorders',
        },
        {
          columns: [
            {
              width: '25%',
              margin: [0, 10, 0, 0],
              stack: [
                {
                  text: 'Tiendas OXXO:',
                  fontSize: 10,
                  decoration: 'underline',
                  color: '#8c8c8c',
                  bold: true,
                  margin: [25, 0, 0, 0],
                },
                {
                  image: await this.getBase64ImageFromURL(
                    '../../../../assets/images/resumenFinalPDF/oxxo_logo.png'
                  ),
                  fit: [75, 85],
                  margin: [20, 0, 0, 0],
                },
              ],
            },
            {
              width: '25%',
              margin: [0, 10, 0, 0],
              stack: [
                {
                  text: 'Efectivo en nuestras sucursales:',
                  fontSize: 10,
                  bold: true,
                  decoration: 'underline',
                  color: '#8c8c8c',
                  alignment: 'center',
                  margin: [-15, 0, 0, 0],
                },
                {
                  image: await this.getBase64ImageFromURL(
                    '../../../../assets/images/logo.png'
                  ),
                  fit: [85, 85],
                  margin: [20, 15, 0, 0],
                },
              ],
            },
            {
              width: '25%',
              margin: [0, 10, 0, 0],
              stack: [
                {
                  text: 'Paynet:',
                  fontSize: 10,
                  bold: true,
                  decoration: 'underline',
                  color: '#8c8c8c',
                  margin: [40, 0, 0, 0],
                },
                {
                  image: await this.getBase64ImageFromURL(
                    '../../../../assets/images/resumenFinalPDF/logo_paynet1.png'
                  ),
                  fit: [75, 85],
                  margin: [20, 25, 0, 0],
                },
              ],
            },
            {
              width: '25%',
              stack: [
                {
                  text: 'Tarjetas de débito y crédito:',
                  decoration: 'underline',
                  fontSize: 10,
                  color: '#8c8c8c',
                  bold: true,
                  margin: [20, 10, 0, 0],
                },
                {
                  image: await this.getBase64ImageFromURL(
                    '../../../../assets/images/resumenFinalPDF/credit-card.png'
                  ),
                  fit: [75, 85],
                  margin: [20, 15, 0, 0],
                },
              ],
            },
          ],
        },
        {
          alignment: 'center',
          stack: [
            {
              text: 'Tiendas Afiliadas Paynet:',
              fontSize: 10,
              bold: true,
              decoration: 'underline',
              color: '#8c8c8c',
              margin: [-15, 0, 0, 0],
            },
            {
              alignment: 'center',
              margin: [10, 5, 0, 0],
              table: {
                layout: 'noBorders',
                body: [
                  [
                    {
                      image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/resumenFinalPDF/7Eleven.png'
                      ),
                      fit: [35, 35],
                      width: '10%',
                      margin: [4, 2, 4, 2],
                    },
                    {
                      image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/resumenFinalPDF/we.png'
                      ),
                      fit: [35, 35],
                      width: '10%',
                      margin: [4, 6, 4, 2],
                    },
                    {
                      image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/resumenFinalPDF/bodega-aurrera.png'
                      ),
                      fit: [35, 35],
                      width: '10%',
                      margin: [4, 4, 4, 2],
                    },
                    {
                      image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/resumenFinalPDF/Circle_K_logo_.png'
                      ),
                      fit: [35, 35],
                      width: '10%',
                      margin: [4, 6, 4, 2],
                    },
                    {
                      image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/resumenFinalPDF/farmacia-guadalawara.png'
                      ),
                      fit: [35, 35],
                      width: '10%',
                      margin: [4, 2, 4, 2],
                    },
                    {
                      image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/resumenFinalPDF/farmacias-del-ahorro.png'
                      ),
                      fit: [35, 35],
                      width: '10%',
                      margin: [4, 2, 4, 2],
                    },
                    {
                      image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/resumenFinalPDF/kiosko.png'
                      ),
                      fit: [35, 35],
                      width: '10%',
                      margin: [4, 2, 4, 2],
                    },
                    {
                      image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/resumenFinalPDF/sams-club.png'
                      ),
                      fit: [35, 35],
                      width: '10%',
                      margin: [4, 2, 4, 2],
                    },
                    {
                      image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/resumenFinalPDF/wallmart.png'
                      ),
                      width: '10%',
                      margin: [4, 6, 4, 2],
                      fit: [35, 35],
                    },
                    {
                      image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/resumenFinalPDF/systienda.png'
                      ),
                      fit: [35, 35],
                      width: '10%',
                      margin: [4, 6, 4, 2],
                    },
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ],
        },
        {
          columns: [
            {
              stack: [
                {
                  margin: [0, 5, 0, 0],
                  text: 'Si tienes alguna duda puedes comunicarte a través de nuestros canales de atención al cliente de 9:00AM A 9:00PM:',
                  fontSize: 10,
                },
                {
                  margin: [0, 3, 0, 0],
                  columns: [
                    {
                      width: 'auto',
                      image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/resumenFinalPDF/whatsapp_logo.png'
                      ),
                      fit: [15, 15],
                    },
                    {
                      width: 'auto',
                      text:
                        this.country === 'MX'
                          ? ' - 3321011918'
                          : ' - +521 3321011918',
                      fontSize: 10,
                      margin: [5, 0, 0, 0], // Ajusta los márgenes según tus necesidades
                    },
                    {
                      width: 'auto',
                      image:
                        this.country === 'MX'
                          ? await this.getBase64ImageFromURL(
                              '../../../../assets/images/resumenFinalPDF/teléfono_logo.jpg'
                            )
                          : '',
                      fit: [10, 10],
                      margin: [10, 0, 0, 0], // Ajusta los márgenes según tus necesidades
                    },
                    {
                      width: 'auto',
                      text:
                        this.country === 'MX'
                          ? ' - 3321011918'
                          : ' - +521 3321011918',
                      fontSize: 10,
                      margin: [5, 0, 0, 0], // Ajusta los márgenes según tus necesidades
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          margin: [0, 10, 0, 0],
          table: {
            widths: ['*'],
            body: [
              [
                {
                  alignment: 'center',
                  stack: [
                    {
                      text:
                        this.country === 'MX'
                          ? 'También puedes generar tus referencias de pago desde cualquier dispositivo ingresando a:'
                          : 'También puedes ver tu historial de pagos desde cualquier dispositivo ingresando a:',
                      fontSize: 10,
                    },
                    {
                      text: `https://pagos.payphone.mx/clientes/${cliente.imeiPhone}`,
                      link: `https://pagos.payphone.mx/clientes/${cliente.imeiPhone}`,
                      color: '#FFFFFF',
                      alignment: 'center',
                    },
                  ],
                  style: 'tableCell',
                  border: [true, true, true, true], // [top, right, bottom, left]
                  fillColor: '#009933',
                  color: '#ffffff',
                  fontSize: 15,
                },
              ],
            ],
          },
          layout: 'noBorders',
        }
      );
    } else {
      finalReceiptPDF.content.push(
        {
          margin: [0, 10, 0, 0],
          table: {
            widths: ['*'],
            body: [
              [
                {
                  alignment: 'center',
                  text: 'MÉTODOS DE PAGO',
                  style: 'tableCell',
                  border: [true, true, true, true], // [top, right, bottom, left]
                  fillColor: '#00ace6',
                  color: '#ffffff',
                  fontSize: 15,
                },
              ],
            ],
          },
          layout: 'noBorders',
        },
        {
          columns: [
            {
              width: '25%',
              margin: [0, 10, 0, 0],
              stack: [
                {
                  text: 'Efectivo en nuestras sucursales:',
                  fontSize: 10,
                  bold: true,
                  decoration: 'underline',
                  color: '#8c8c8c',
                  alignment: 'center',
                  margin: [-15, 0, 0, 0],
                },
                {
                  image: await this.getBase64ImageFromURL(
                    '../../../../assets/images/logo.png'
                  ),
                  fit: [85, 85],
                  margin: [20, 15, 0, 0],
                },
              ],
            },
          ],
        },
        {
          columns: [
            {
              stack: [
                {
                  margin: [0, 10, 0, 0],
                  text: 'Si tienes alguna duda puedes comunicarte a través de nuestros canales de atención al cliente de 9:00AM A 9:00PM:',
                  fontSize: 10,
                },
                {
                  margin: [0, 3, 0, 0],
                  columns: [
                    {
                      width: 'auto',
                      image: await this.getBase64ImageFromURL(
                        '../../../../assets/images/resumenFinalPDF/whatsapp_logo.png'
                      ),
                      fit: [15, 15],
                    },
                    {
                      width: 'auto',
                      text: ' +521-3321012446',
                      fontSize: 10,
                      margin: [5, 0, 0, 0], // Ajusta los márgenes según tus necesidades
                    },
                  ],
                },
              ],
            },
            {
              margin: [0, 10, 0, 0],
              table: {
                widths: ['*'],
                body: [
                  [
                    {
                      alignment: 'center',
                      stack: [
                        {
                          text: 'Puedes acceder a tu historial de pagos desde cualquier dispositivo para revisarlo a traves de:',
                          fontSize: 10,
                        },
                        {
                          text: `https://pagos.payphone.mx/clientes/${cliente.imeiPhone}`,
                          link: `https://pagos.payphone.mx/clientes/${cliente.imeiPhone}`,
                          color: '#FFFFFF',
                          alignment: 'center',
                        },
                      ],
                      style: 'tableCell',
                      border: [true, true, true, true], // [top, right, bottom, left]
                      fillColor: '#009933',
                      color: '#ffffff',
                      fontSize: 15,
                    },
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ],
        }
      );
    }

    const pdf = pdfMake
      .createPdf(finalReceiptPDF)
      .download(`Recibo_de_compra_${this.curpCliente}`);
    this.spinner.hide();
    this.alert.success('Éxito', 'su recibo ha sido generado exitosamente.');
  }
}
