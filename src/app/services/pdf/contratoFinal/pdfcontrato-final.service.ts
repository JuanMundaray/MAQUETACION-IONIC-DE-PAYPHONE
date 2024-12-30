import { Injectable } from '@angular/core';
import moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { environment } from 'src/environments/environment';

const pdf = pdfMake;
pdf.vfs = pdfFonts.pdfMake.vfs;


@Injectable({
  providedIn: 'root'
})
export class PDFcontratoFinalService {
  public COMPANY_NAME:string=environment.COMPANY_NAME;
  public DocContratoB64 : any;
  public nombClient : any = "test";
  public DIR_PROPEX : any = "test";
  public CLIENT_DIREC : any = "test";
  public brand : any = "test";
  public model : any = "test";
  public imeiPhone : any = "test";
  public precioProducSIvaF : any = "test";
  public precioProducF : any = "test";
  public importIvaF : any = "test";
  public tasaIntOrd : any = "test";
  public rentEqSIvaF : any = "test";
  public rentEqCIvaF : any = "test";
  public nroPag : any = "test";
  public fech_1raParc : any = "test";
  public CDAD_SUC : any = "test";
  public hoy : any = moment();
  public d = this.hoy.date(); // Obtiene el día del mes como un número
  public m = this.hoy.format('MMMM').toUpperCase(); // Obtiene el nombre del mes en mayúsculas
  public y = this.hoy.year();
  public firmaDigital : any;
  public logo = 'data:img/png;base64,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';

  constructor() { }

  async generatePDF() {
    return new Promise((resolve, reject) => {
      pdfMake.createPdf(this.formatPDF()).getBase64((base) => {
        //console.log('Base: ', base);
        this.DocContratoB64 = base;
        //this.open();
        resolve(base); // Aquí deberías pasar un valor, como resolve(base)
      });
    });
  }

  open(){
    pdfMake.createPdf(this.formatPDF()).open();
  }

  formatPDF(): any {
    let hoy = new Date();
    let mes = hoy.getMonth() + 1;
    let fecha =
      hoy.getFullYear() +
      '-' +
      (mes < 10 ? '0' : '') +
      mes +
      '-' +
      (hoy.getDate() < 10 ? '0' : '') +
      hoy.getDate() +
      'T' +
      hoy.getHours() +
      hoy.getMinutes() +
      hoy.getSeconds();

    return {
      // footer: {
      //   fontSize: 7,
      //   color: '#807f7d',
      //   bold: true,
      //   alignment: 'center',
      text: this.COMPANY_NAME,
      // },

      content: [
        /**
         * CONTRATO DE ARRENDAMIENTO
         * */
        { image: this.logo, width: 180, style: 'image' },
        { text: 'CONTRATO DE ARRENDAMIENTO FINANCIERO', style: 'title' },
        {
          style: 'normal',
          text: [
            {
              text: 'CONTRATO DE ARRENDAMIENTO FINANCIERO QUE CELEBRAN POR UNA PARTE ',
            },
            { text: 'PROPEX LOGISTICS, S.A. DE C.V. ', style: 'bold' },
            { text: '(EN LO SUCESIVO ' },
            { text: '"EL ARRENDADOR"', style: 'subtitle' },
            { text: '), Y POR LA OTRA PARTE ' },
            { text: this.nombClient.toUpperCase(), style: 'bold' },
            { text: ' (EN LO SUCESIVO ' },
            { text: ' "EL ARRENDATARIO"', style: 'subtitle' },
            { text: '). EN CONJUNTO AL ' },
            { text: ' ARRENDADOR', style: 'bold' },
            { text: ' Y AL' },
            { text: ' ARRENDATARIO', style: 'bold' },
            { text: ' SE LES DENOMINARÁ ' },
            { text: '"LAS PARTES"', style: 'under' },
            {
              text: '\n\nEl presente Contrato se compone de (1) esta Carátula y (2) los Términos y Condiciones Generales adjuntos (en lo sucesivo denominados en forma conjunta como el “Contrato”). Mediante la firma de esta Carátula, las Partes convienen en sujetarse a los términos y condiciones establecidos en el presente Contrato.',
            },
          ],
          margin: [0, 0, 0, 10],
        },
        /**
         * table
         */
        {
          margin: [0, 0, 0, 30],
          table: {
            style: 'normal',
            widths: ['*'],
            body: [
              //declara 1
              [
                {
                  text: 'DECLARA EL ARRENDADOR QUE',
                  fontSize: 8,
                  bold: true,
                  margin: [0, 3],
                  fillColor: '#0000',
                  color: '#fff',
                },
              ],
              [
                {
                  text: [
                    { text: 'a) ', style: 'bold' },
                    {
                      text: 'Es una sociedad mercantil legalmente constituida y existente conforme a las leyes de los Estados Unidos Mexicanos, con domicilio en ',
                    },
                    { text: this.DIR_PROPEX, style: 'bold' },
                  ],
                  margin: [15, 3, 3, 3],
                  fontSize: '7',
                },
              ],
              [
                {
                  text: [
                    { text: 'b) ', style: 'bold' },
                    {
                      text: 'Su(s) apoderado(s) cuenta(n) con las facultades suficientes para celebrar el presente Contrato, mismas que a la fecha de celebración del presente no le(s) han sido modificadas, revocadas o restringidas en forma alguna.',
                    },
                  ],
                  margin: [15, 3, 3, 3],
                  fontSize: '7',
                },
              ],
              //declara 2
              [
                {
                  text: 'DECLARA EL ARRENDADOR QUE',
                  fontSize: 8,
                  bold: true,
                  margin: [0, 3],
                  fillColor: '#0000',
                  color: '#fff',
                },
              ],
              [
                {
                  text: [
                    { text: 'a) ', style: 'bold' },
                    {
                      text: 'Es una persona física con capacidad jurídica suficiente para contratar con domicilio en: ',
                    },
                    { text: this.CLIENT_DIREC, style: 'bold' },
                    {
                      text: ' Su(s) apoderado(s) cuenta(n) con las facultades suficientes para celebrar el presente Contrato, mismas que a la fecha de celebración del presente no le(s) han sido modificadas, revocadas o restringidas en forma alguna.',
                    },
                  ],
                  margin: [15, 3, 3, 3],
                  fontSize: '7',
                },
              ],
              [
                {
                  text: [
                    { text: 'b) ', style: 'bold' },
                    {
                      text: 'Su(s) apoderado(s) cuenta(n) con las facultades suficientes para celebrar el presente Contrato, mismas que a la fecha de celebración del presente no le(s) han sido modificadas, revocadas o restringidas en forma alguna.',
                    },
                  ],
                  margin: [15, 3, 3, 3],
                  fontSize: '7',
                },
              ],
              //identificación
              [
                {
                  text: 'IDENTIFICACIÓN DEL EQUIPO EN ARRENDAMIENTO FINANCIERO',
                  fontSize: 8,
                  bold: true,
                  margin: [0, 3],
                  fillColor: '#0000',
                  color: '#fff',
                },
              ],
              [
                {
                  text: [
                    { text: 'MARCA: ', style: 'bold' },
                    { text: this.brand, style: 'under' },
                    { text: '    MODELO: ', style: 'bold' },
                    { text: this.model, style: 'under' },
                    { text: '    IMEI: ', style: 'bold' },
                    { text: this.imeiPhone, style: 'under' },
                  ],
                  margin: [15, 3, 3, 3],
                  fontSize: '7',
                },
              ],
              //condiciones
              [
                {
                  text: 'CONDICIONES DEL FINANCIAMIENTO',
                  fontSize: 8,
                  bold: true,
                  margin: [0, 3],
                  fillColor: '#0000',
                  color: '#fff',
                },
              ],
              [
                {
                  table: {
                    widths: [30, 200, '*'],
                    body: [
                      [
                        {
                          text: 'A',
                          fontSize: '7',
                          alignment: 'center',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: 'Valor Final del Equipo sin IVA',
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: this.precioProducSIvaF,
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                        },
                      ],
                      [
                        {
                          text: 'B',
                          fontSize: '7',
                          alignment: 'center',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: 'Valor Final del Equipo con IVA',
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: this.precioProducF,
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                        },
                      ],
                      [
                        {
                          text: 'C',
                          fontSize: '7',
                          alignment: 'center',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: 'Importe del IVA',
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: this.importIvaF,
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                        },
                      ],
                      [
                        {
                          text: 'D',
                          fontSize: '7',
                          alignment: 'center',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: 'Tasa de Interés Ordinaria',
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: this.tasaIntOrd,
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                        },
                      ],
                      [
                        {
                          text: 'E',
                          fontSize: '7',
                          alignment: 'center',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: 'Renta del Equipo sin IVA',
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: this.rentEqSIvaF,
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                        },
                      ],
                      [
                        {
                          text: 'F',
                          fontSize: '7',
                          alignment: 'center',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: 'Renta del Equipo con IVA',
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: this.rentEqCIvaF,
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                        },
                      ],
                      [
                        {
                          text: 'G',
                          fontSize: '7',
                          alignment: 'center',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: 'Fecha del Pago Inicial',
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: `${this.d} DE ${this.m} DEL ${this.y}`,
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                        },
                      ],
                      [
                        {
                          text: 'H',
                          fontSize: '7',
                          alignment: 'center',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: 'Periodicidad de los Pagos',
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          margin: [0, 0, 0, 10],
                          columns: [
                            {
                              width: '*',
                              text: 'Quincenal',
                              fontSize: '7',
                              alignment: 'center',
                            },
                            {
                              width: '*',
                              text: 'Semanal\n\nX',
                              fontSize: '7',
                              alignment: 'center',
                            },
                            {
                              width: '*',
                              text: 'Mensual',
                              fontSize: '7',
                              alignment: 'center',
                            },
                          ],
                        },
                      ],
                      [
                        {
                          text: 'I',
                          fontSize: '7',
                          alignment: 'center',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: 'Número de Pagos de Renta',
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: this.nroPag,
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                        },
                      ],
                      [
                        {
                          text: 'J',
                          fontSize: '7',
                          alignment: 'center',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: 'Fecha de Inicio',
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: this.fech_1raParc,
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                        },
                      ],
                      [
                        {
                          text: 'K',
                          fontSize: '7',
                          alignment: 'center',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: 'Cargo por Gastos por administrativos',
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                          bold: true,
                        },
                        {
                          text: '$250.00 MXN',
                          fontSize: '7',
                          alignment: 'left',
                          margin: [0, 3],
                        },
                      ],
                    ],
                  },
                },
              ],
              //bloqueo
              [
                {
                  text: 'BLOQUEO',
                  fontSize: 8,
                  bold: true,
                  margin: [0, 3],
                  fillColor: '#0000',
                  color: '#fff',
                  pageBreak: 'before',
                },
              ],
              [
                {
                  text: [
                    {
                      text: 'El ARRENDADOR podrá restringir algunas funcionalidades técnicas del Equipo o inhabilitarlo totalmente en cualquier momento, excepto para llamar a un número local para emergencias y a un número de servicio al cliente, en los siguientes casos: ',
                    },
                    { text: 'a) ', style: 'bold' },
                    {
                      text: 'cuando el ARRENDATARIO incurra en mora o incumplimiento de pago de las Rentas del Equipo; ',
                    },
                    { text: 'b) ', style: 'bold' },
                    {
                      text: 'cuando el ARRENDATARIO haya proporcionado información falsa; ',
                    },
                    { text: 'c) ', style: 'bold' },
                    {
                      text: 'por mandato de la autoridad (administrativa y/o judicial), y/o ',
                    },
                    { text: 'd) ', style: 'bold' },
                    {
                      text: 'a solicitud del ARRENDATARIO por robo o extravío. La restricción o inhabilitación total del Equipo no se considerará falla de servicio ni defecto del Equipo.  El Equipo permanecerá restringido o inhabilitado para su uso hasta que el ARRENDATARIO subsane la causa que le dio origen. La restricción o inhabilitación se eliminará dentro de las 24 (veinticuatro) horas siguientes al momento en que se subsane la causa que le dio origen. El ARRENDATARIO no quedará exento del pago de los adeudos pendientes de liquidación, pudiendo el ARRENDADOR exigir el pago de éstos en una sola exhibición. De conformidad con el Aviso de Privacidad, el ARRENDATARIO autoriza que la aplicación y/o software de bloqueo acceda a las funciones que tienen como  objetivo recopilar e  intercambiar información basada en la localización del Equipo, mediante tecnología A-GPS  (Sistema de Posicionamiento Global Asistido) en aquellas ubicaciones en las que dicha tecnología esté  disponible, por lo que resulta necesario recabar, utilizar, trasmitir, tratar y almacenar los datos de  georreferencia del Equipo, incluyendo de manera enunciativa mas no limitativa,  la localización georreferenciada del Equipo e información relativa a esta, por lo que el ARRENDATARIO  acepta y otorga su consentimiento para que el ARRENDADOR acceda a estas. En caso de que el ARRENDATARIO se niegue a dar acceso a los datos antes mencionados, el ARRENDADOR no podrá proporcionarle los servicios en su totalidad, por lo que el acceso al servicio será limitado. En caso de que el Equipo este fuera de la zona de cobertura y/o sin acceso a una red inalámbrica WIFI, las funciones de la aplicación pueden no funcionar correctamente, estas se podrán utilizar una vez que se regrese al área de cobertura o se cuente con red inalámbrica, por lo que el ARRENDADOR no será responsable por ningún daño o perjuicio que pudiera ser ocasionado por no tener señal, de red necesaria para el uso de la aplicación.',
                    },
                  ],
                  margin: [3, 3, 3, 3],
                  fontSize: '7',
                  alignment: 'justify',
                },
              ],
              //autorizacion
              [
                {
                  text: 'CONSENTIMIENTO Y AUTORIZACIONES',
                  fontSize: 8,
                  bold: true,
                  margin: [0, 3],
                  fillColor: '#0000',
                  color: '#fff',
                },
              ],
              [
                {
                  text: [
                    {
                      text: 'Con la suscripción de este Contrato CONSIENTO que ',
                    },
                    { text: '(i) ', style: 'bold' },
                    {
                      text: 'Me fue explicado y proporcionada toda la información relativa al contenido y alcances del presente Contrato, incluyendo los Términos y Condiciones Generales en él contenidos, los cuales reconozco que me fueron enviados a mi correo electrónico proporcionado para tal efecto y que asimismo es de mi conocimiento que se encuentran disponibles en el registro de contratos de adhesión que lleva la Procuraduría Federal del Consumidor; y ',
                    },
                    { text: '(ii) AUTORIZO ', style: 'bold' },
                    {
                      text: '   X   ',
                      style: 'under',
                    },
                    { text: ' NO AUTORIZO', style: 'bold' },
                    {
                      text: '____  que el ARRENDADOR utilice mi información y/o datos personales con fines de publicidad y/o mercadotécnicos, así como para recibir por cualquier medio, publicidad sobre bienes, productos o servicios ofrecidos por el ARRENDADOR y/o terceros de conformidad con el Aviso de Privacidad.',
                    },
                  ],
                  margin: [3, 3, 3, 3],
                  fontSize: '7',
                  alignment: 'justify',
                },
              ],
              //autorizacion de consultas
              [
                {
                  text: 'AUTORIZACIÓN DE CONSULTAS EN SOCIEDADES DE INFORMACIÓN CREDITICIA (BURÓ DE CRÉDITO)',
                  fontSize: 8,
                  bold: true,
                  margin: [0, 3],
                  fillColor: '#0000',
                  color: '#fff',
                },
              ],
              [
                {
                  text: [
                    {
                      text: 'Autorizo expresamente a Propex Logistics, S.A. DE C.V. (“Propex”), para que lleve a cabo investigaciones sobre mi comportamiento crediticio en las Sociedades de Información Crediticias (SIC) que estime conveniente. Conozco la naturaleza y alcance de la información que se solicitará, del uso que se le dará y que se podrán realizar consultas periódicas de mi historial crediticio. Consiento que esta autorización tenga una vigencia de 3 años contados a partir de hoy, y en su caso mientras mantengamos relación jurídica. Acepto que este documento quede bajo propiedad de Propex y/o SIC Consultada para efectos de control y cumplimiento del artículo 28 de la LRSIC.',
                    },
                  ],
                  margin: [3, 3, 3, 3],
                  fontSize: '7',
                  alignment: 'justify',
                  border: [true, true, true, false],
                },
              ],
              [
                {
                  image: this.firmaDigital,
                  width: 100,
                  alignment: 'center',
                  border: [true, false, true, false],
                  margin: [0, 0, 0, 0],
                },
              ],
              [
                {
                  text: [
                    {
                      text: this.nombClient.toUpperCase(),
                    },
                  ],
                  border: [true, false, true, false],
                  margin: [0, 10, 3, 3],
                  fontSize: '7',
                  alignment: 'center',
                  bold: true,
                },
              ],
              //leido
              [
                {
                  text: [
                    {
                      text: 'LEÍDO QUE FUE EL PRESENTE CONTRATO Y ENTERADAS LAS PARTES DE SU CONTENIDO Y ALCANCE LEGAL, LO FIRMAN POR DUPLICADO, EN LA CIUDAD DE ',
                    },
                    {
                      text: this.CDAD_SUC,
                      style: 'bold',
                    },
                    {
                      text: ', EL DÍA ',
                    },
                    {
                      text: `${this.d} DE ${this.m} DEL ${this.y}`,
                      style: 'bold',
                    },
                  ],
                  margin: [3, 3, 3, 3],
                  fontSize: '7',
                  alignment: 'justify',
                },
              ],
            ],
          },
        },

        /**
         * TERMINOS Y CONDICIONES
         * */
        { image: this.logo, width: 180, style: 'image' },
        { text: 'CONTRATO DE ARRENDAMIENTO FINANCIERO', style: 'title' },
        { text: 'TÉRMINOS Y CONDICIONES GENERALES', style: 'title' },
        //1
        {
          style: 'normal',
          text: [
            { text: '1. ', style: 'bold' },
            { text: 'OBJETO.', style: 'subtitle' },
            {
              text: ' A solicitud del ARRENDATARIO, el ARRENDADOR ha adquirido el Equipo descrito en la Carátula de este Contrato a efecto de conceder su uso y goce temporal, a plazo forzoso, al ARRENDATARIO, quien se obliga a pagar como contraprestación la Renta del Equipo señalada en la letra F, precisamente en la periodicidad establecida en la letra H, del apartado Condiciones del Financiamiento de la Carátula de este Contrato, a efecto de cubrir el valor de adquisición del Equipo, las cargas financieras, IVA y demás accesorios. Al finalizar el Contrato el ARRENDATARIO adoptará alguna de las opciones terminales establecidas más adelante.',
            },
          ],
        },
        //2
        {
          style: 'normal',
          text: [
            { text: '\n\n2. ', style: 'bold' },
            {
              text: 'CONTRAPRESTACIONES.',
              style: ['subtitle'],
            },
            {
              text: ' Ambas partes convienen que la fecha de aplicación del primer pago periódico de la Renta será pagadero a la fecha de firma del presente Contrato y los pagos subsiguientes serán pagaderos el mismo día de cada semana/quincena/mes subsecuente hasta que la Renta sea cubierta en su totalidad, sin que el ARRENDATARIO pueda efectuar deducción alguna de los importes que procedan, aún en el caso de que el ARRENDATARIO no haya hecho uso del Equipo durante alguna o más porciones del tiempo fijo del arrendamiento. Para efectos de la aplicación de las Rentas en favor del ARRENDADOR deberá estarse a lo previsto en la cláusula 3 del presente Contrato. El ARRENDADOR podrá, pero no estará obligada a, enviar eventualmente al ARRENDATARIO un estado de cuenta en el que se hagan constar los cargos y abonos que correspondan a los movimientos realizados en el período de que se trate. Las Partes convienen que los datos y cifras que aparezcan en los mencionados estados de cuenta tendrán carácter meramente informativo, como una atención y servicio que el ARRENDADOR podrá proporcionar al ARRENDATARIO, quien deberá cubrir el importe establecido en dichos estados de cuenta como saldo actual en los términos de este Contrato. El ARRENDATARIO reconoce que las cifras contempladas en dichos estados de cuenta serán definitivas y obligatorias una vez certificadas por el contador del ARRENDADOR.',
            },
            {
              text: '\n\nEl ARRENDATARIO realizará los pagos de la Renta a través de cualquiera de los medios descritos en la Carátula o los que posteriormente acurden las Partes. La fecha para realizar cada pago será en la periodicidad establecida en la Carátula, comenzando en la fecha de firma del presente Contrato. Si la totalidad o una parte de un pago no se realiza para su fecha de vencimiento, el Equipo será bloqueado automáticamente por el ARRENDADOR, tal como se describe en el apartado BLOQUEO de la Carátula y el ARRENDATARIO no podrá utilizar el Equipo, excepto para llamar a un número local para emergencias y a un número de servicio al cliente, y permanecerá bloqueado hasta que el ARRENDATARIO ponga su cuenta al corriente. El ARRENDATARIO reconoce y conviene en que el ARRENDADOR tendrá derecho a instalar la aplicación y/o el Software de bloqueo propio o de un tercero subcontratado en el Equipo.',
            },
            {
              text: '\n\nEl ARRENDATARIO reconoce y acepta que el ARRENDADOR podrá usar sus datos proporcionados para realizar acciones de cobranza, conforme al Aviso de Privacidad del ARRENDADOR.',
            },
            {
              text: '\n\nContra cada pago del ARRENDATARIO, el ARRENDADOR emitirá un comprobante por la cantidad correspondiente.',
            },
          ],
        },
        //3
        {
          style: 'normal',
          text: [
            { text: '\n\n3. ', style: 'bold' },
            {
              text: 'APLICACIÓN DE LOS PAGOS.',
              style: ['subtitle'],
            },
            {
              text: ' Los pagos que realice el ARRENDATARIO conforme al presente Contrato serán aplicados a los siguientes conceptos:\n\n',
            },
          ],
        },
        {
          style: 'normal',
          margin: [30, 0, 0, 0],
          type: 'lower-alpha',
          ol: [
            ') Cargos por gestión de Cobranza,',
            ') A los intereses ordinarios,',
            ') Al monto de principal de la Renta.',
          ],
          text: '\n\nA todos los pagos arriba señalados se les deberá agregar el correspondiente impuesto al valor agregado.',
        },
        //4
        {
          style: 'normal',
          text: [
            { text: '\n\n4. ', style: 'bold' },
            {
              text: 'PAGOS ADELANTADOS.',
              style: ['subtitle'],
            },
            {
              text: ' El ARRENDATARIO podrá pagar la Renta Total del Equipo en cualquier momento, antes de la fecha de vencimiento del último pago programado, sin penalización alguna. En caso de que el ARRENDATARIO entregue una cantidad mayor a la cantidad semanal por pagar, todo excedente que pague se acreditará a su próximo pago.',
            },
          ],
        },
        //5
        {
          style: 'normal',
          text: [
            { text: '\n\n5. ', style: 'bold' },
            {
              text: 'GARANTÍA.',
              style: ['subtitle'],
            },
            {
              text: ' En caso que durante la vigencia del presente Contrato el Equipo sufra desperfectos que no hubieren sido provocados por golpes o uso inadecuado de parte del ARRENDATARIO (en adelante, el “Defecto de Fabricación”), el ARRENDATARIO deberá notificar directamente al ARRENDADOR quien informará de manera detallada el procedimiento para que el ARRENDATARIO haga efectiva la garantía la cual será válida por un plazo de 90 días contados a partir de la firma del presente Contrato, y será ofrecida directamente por el Fabricante del Equipo, en caso de que sea aplicable.',
            },
            {
              text: '\n\nEn cualquier caso, posterior a la notificación a que se refiere el párrafo anterior, el ARRENDATARIO siempre deberá hacer válida la garantía, válida por un plazo de 90 días contados a partir de la firma del presente Contrato, directamente en el mismo local comercial en el cual fue adquirido el Equipo y en el caso de no obtener respuesta satisfactoria durante la vigencia de la garantía establecida, ponerse en contacto de inmediato con el ARRENDADOR para que sea indicado del procedimiento a seguir con su reparación.',
            },
            {
              text: '\n\nPor el contrario, el ARRENDATARIO reconoce que dicha garantía no se podrá hacer efectiva en los centros de atención al cliente de la empresa operadora del Equipo, ni en cualquier otro lugar que no le fuere expresamente descrito por parte del ARRENDADOR.',
            },
            {
              text: '\n\nEl ARRENDADOR podrá apoyar al ARRENDATARIO con la garantía, válida por un plazo de 90 días contados a partir de la firma del presente Contrato, del Equipo únicamente en los casos en los que el operador de telefonía móvil donde se adquirió el Equipo haga válida la garantía, en casos contrarios, el ARRENDADOR se deslinda de toda responsabilidad.',
            },
          ],
        },
        //6
        {
          style: 'normal',
          text: [
            { text: '\n\n6. ', style: 'bold' },
            {
              text: 'USO DEL EQUIPO.',
              style: ['subtitle'],
            },
            {
              text: ' El ARRENDATARIO conviene en mantener el Equipo en buenas condiciones en todo momento mientras esté sujeto a esté Contrato. En caso de cualquier daño o desperfecto al Equipo percibido por parte del ARRENDATARIO, éste deberá notificar directamente al ARRENDADOR quien informará de manera detallada el procedimiento de solicitud de garantía o Plan de Reparación contra Daño.',
            },
            {
              text: '\n\nEl ARRENDATARIO está de acuerdo que en caso de que el Equipo quede “bloqueado por TI” debido a múltiples intentos fallidos al ingresar la contraseña de acceso existe la posibilidad de tener que hacer un pago, a cuenta del ARRENDATARIO, para poder desbloquear el Equipo, debiéndose seguir el procedimiento respectivo ante el ARRENDADOR, y con el apoyo del establecimiento en el que se hubiera adquirido el Equipo.',
            },
            {
              text: '\n\nEl ARRENDADOR no se hace responsable por el olvido de la contraseña, misma acción que provocará un bloqueo continuo del equipo y en caso de que tenga que ser reemplazada la tarjeta lógica, el ARRENDATARIO tendrá que cubrir el costo de la reparación.                  ',
            },
          ],
        },
        //7
        {
          style: 'normal',
          text: [
            { text: '\n\n7. ', style: 'bold' },
            {
              text: 'RIESGOS.',
              style: ['subtitle'],
            },
            {
              text: ' El ARRENDATARIO asume el riesgo de: (i) los vicios o defectos ocultos de cada Equipo que de cualquier forma afecten o impidan su uso parcial o total; (ii) la pérdida o deterioro parcial o total de cada Equipo, aunque ésta se realice por caso fortuito o fuerza mayor; (iii) en general, todos los riesgos, pérdidas, robos, menoscabos, destrucción o daños de cada Equipo, sea parcial o total.',
            },
            {
              text: '\n\nEn caso de que se presente cualquiera de las eventualidades señaladas, el ARRENDATARIO no queda liberado del pago de las obligaciones a su cargo conforme a este Contrato y demás instrumentos que de él se deriven, debiendo cubrirlas en la forma convenida, en particular, aquélla relativa al pago total de la Renta estipulada.',
            },
            {
              text: '\n\nEn este acto el ARRENDATARIO renuncia a cualquier acción o derecho derivados de lo anterior que pudiera ejercitar en contra del ARRENDADOR, obligándose el ARRENDATARIO a sacar en paz y a salvo a el ARRENDADOR, sus directivos, funcionarios y empleados de cualquier reclamación, queja, requerimiento, demanda y/o denuncia que se formule por terceros en contra de el ARRENDADOR con motivo del uso de cada Equipo.',
            },
          ],
        },
        //8
        {
          style: 'normal',
          text: [
            { text: '\n\n8. ', style: 'bold' },
            {
              text: 'PROHIBICIÓN DE ALTERAR EQUIPO.',
              style: ['subtitle'],
            },
            {
              text: ` El ARRENDATARIO conviene en no modificar, ni permitir que otros modifiquen el Equipo y/o el IMEI del mismo ni realizar cualquier alteración o manipulación del Equipo de manera que afecte directa o indirectamente la aplicación de ${this.COMPANY_NAME} y/o la aplicación o el Software de bloqueo. Todo intento de modificar, o cualquier modificación realizada al Equipo que pudiera afectar el funcionamiento pretendido del la aplicación de ${this.COMPANY_NAME} y/o la aplicación o el Software de bloqueo, será una causa de rescisión de este Contrato que motivará su terminación anticipada, y el ARRENDATARIO deberá pagar de manera inmediata la totalidad de las Rentas remanentes, sin perjuicio del pago de los daños y perjuicios que le pudiese causar al ARRENDADOR. En caso de que el ARRENDADOR detecte un intento de modificación en el Equipo por parte del ARRENDATARIO, el ARRENDADOR podrá bloquearlo, rescindir el presente Contrato y exigir el pago inmediato de la totalidad de las Rentas remanentes.`,
            },
            {
              text: 'El ARRENDATARIO reconoce que cualquier intento, por sí o por terceras personas, de desbloqueo, de alteración del IMEI, o cualquier otra no autorizada al funcionamiento del Equipo, cuya propiedad correponde al ARRENDADOR de conformidad con el presente Contrato, constituye un daño en propiedad ajena, conducta ilícita que puede ser objeto de sanción de conformidad con las leyes penales aplicables.',
              style: 'bold',
            },
          ],
        },
        //9
        {
          style: 'normal',
          text: [
            { text: '\n\n9. ', style: 'bold' },
            {
              text: 'INCUMPLIMIENTO Y RECURSOS.',
              style: ['subtitle'],
            },
            {
              text: `El ARRENDATARIO estará en incumplimiento de este Contrato y por tanto será causa de rescisión y motivo de pago de daños y perjuicios si: (i) No realiza un pago total de la parcialidad requerida a su fecha de vencimiento; (ii) Intenta modificar o permite que otros modifiquen el Equipo, su IMEI y/o la aplicación de ${this.COMPANY_NAME} y/o la aplicación y/o Software de bloqueo; (iii) si el ARRENDATARIO incumple cualquier acuerdo, obligación o declaración aquí mencionada; (iv) de cualquier otra manera incumple en el desempeño de cualquier obligación. Cualquier incumplimiento provocará la rescisión y consecuente terminación anticipada del Contrato sin responsabilidad alguna para el ARRENDADOR (la “Terminación Anticipada”). En virtud de dicha Terminación Anticipada, el ARRENDADOR tiene el derecho a bloquear el Equipo y requerir inmediatamente el pago de la totalidad de las Rentas remanentes.`,
            },
            {
              text: '\n\nFrente a cualquier incumplimiento, el ARRENDATARIO reconoce y se hace sabedor que ello motivará el bloqueo del Equipo, con las consecuencias inherentes que ello implique, como es la imposibilidad de acceso parcial o total al Equipo durante el tiempo que subsista el incumplimiento.',
            },
          ],
        },
        //10
        {
          style: 'normal',
          text: [
            { text: '\n\n10. ', style: 'bold' },
            {
              text: 'OPCIONES TERMINALES.',
              style: ['subtitle'],
            },
            {
              text: ' Las partes acuerdan que en términos de lo dispuesto en el artículo 410 y demás relativos de la Ley General de Títulos y Operaciones de Crédito, a la terminación de la vigencia del presente Contrato, siempre y cuando el ARRENDATARIO se encuentre al corriente con la totalidad de las obligaciones que contrajo en favor del ARRENDADOR, el ARRENDATARIO podrá adoptar por alguna de las siguientes opciones terminales: ',
            },
            {
              text: ' (i)',
              style: 'bold',
            },
            {
              text: 'Comprar el Equipo al Arrendador, a valor de $1.00 M.N. (Un Peso 00/100 Moneda Nacional);',
            },
            {
              text: ' (ii)',
              style: 'bold',
            },
            {
              text: 'Participar con el ARRENDADOR en el precio de la venta del Equipo a un tercero. El precio de venta a un tercero será a valor de mercado;',
            },
            {
              text: ' (iii)',
              style: 'bold',
            },
            {
              text: ' Obtener del Arrendador una o varias prórrogas en el plazo de vigencia del Contrato en lo que se refiere al Equipo, en cuyo caso la renta que se cause deberá acordarse por escrito entre ambas Partes y será inferior a los pagos periódicos que originalmente fueron realizados.',
            },
            {
              text: '\n\nCualquiera de las opciones arriba mencionadas que sea adoptada por el ARRENDATARIO deberá ser notificada por escrito al ARRENDADOR por lo menos con un mes de anticipación al vencimiento del Contrato y, en caso de no hacerlo, se entenderá que el ARRENDATARIO conviene con el ARRENDADOR en adquirir el Equipo, debiendo en este caso pagar el monto descrito en el inciso (i) de la presente cláusula. Lo anterior, salvo pacto en contrario por escrito.',
            },
          ],
        },
        //11
        {
          style: 'normal',
          text: [
            { text: '\n\n11. ', style: 'bold' },
            {
              text: 'CESIÓN.',
              style: ['subtitle'],
            },
            {
              text: ' El ARRENDATARIO no podrá ceder parcial ni totalmente las obligaciones y derechos derivados de este Contrato, salvo autorización previa, expresa y escrita del ARRENDADOR. El ARRENDADOR podrá ceder sus derechos y obligaciones derivados de este Contrato, sin necesidad de autorización del ARRENDATARIO, a cualquiera de sus afiliadas, subsidiarias o a cualquiera persona de su mismo grupo de interés económico.',
            },
          ],
        },
        //12
        {
          style: 'normal',
          text: [
            { text: '\n\n12. ', style: 'bold' },
            {
              text: 'ACCESO A DOCUMENTOS Y NOTIFICACIONES.',
              style: ['subtitle'],
            },
            {
              text: ' Al firmar el presente Contrato, el ARRENDATARIO confirma que tiene acceso a su cuenta de correo o en la aplicación de Celufío, donde están a su disposición una copia de este Contrato, los Términos y Condiciones, el Aviso de Privacidad y otra información relacionada.',
            },
            {
              text: '\n\nAl menos que otra cosa se especifique en el presente Contrato, todas las comunicaciones relacionadas con el presente Contrato serán efectuadas mediante correo electrónico a las direcciones proporcionado por las Partes en el presente, pudiendo también ser notificadas en los domicilios respectivos que las partes indican si así lo considera necesario la parte que vaya a realizar la comunicación. ',
            },
            {
              text: '\n\nLas Partes expresamente establecen que cualquier comunicación relacionada con el inicio de algún procedimiento ya sea que éste se tramite ante los tribunales judiciales, administrativos, o cualquier otra dependencia, como puede la Procuraduría Federal del Consumidor, las notificaciones forzosamente deberán de realizarse en los domicilios señalados en la parte inicial del presente Contrato. ',
            },
            {
              text: '\n\nEl Arrendatario da su consentimiento para recibir comunicaciones relacionadas con este Contrato, en formato electrónico, ya sea mediante el Equipo, correo electrónico o mensaje de texto.',
            },
          ],
        },
        //13
        {
          style: 'normal',
          text: [
            { text: '\n\n13. ', style: 'bold' },
            {
              text: 'VARIOS.',
              style: ['subtitle'],
            },
            {
              text: ' El ARRENDATARIO conviene en que, si el ARRENDADOR acepta cantidades menores que las adeudadas o prorroga las fechas de vencimiento de pago de las Rentas de este Contrato, el hecho de hacerlo no representará una renuncia posterior del ARRENDADOR para ejercer los términos y condiciones del Contrato en la forma en que están escritos. El ARRENDATARIO conviene en que este Contrato establece todos los acuerdos entre las Partes, y que ninguna modificación de este Contrato tendrá validez si no es por escrito y está firmada por ambas Partes. El ARRENDATARIO conviene que, si se determina que alguna disposición de este Contrato no tiene validez, esto no afectará la validez de otras disposiciones del Contrato, y que las demás disposiciones del Contrato seguirán siendo vinculantes y ejecutables.',
            },
          ],
        },
        //14
        {
          style: 'normal',
          text: [
            { text: '\n\n14. ', style: 'bold' },
            {
              text: 'PLAN DE REPARACIÓN CONTRA DAÑOS.',
              style: ['subtitle'],
            },
            {
              text: ' El Equipo cuenta con un Plan de Reparación contra Daño vigente durante los siguientes 90 días contados a partir de la fecha de celebración del presente Contrato. La protección cubre al Equipo por todo aquel detrimento causados por acciones que impidan el correcto funcionamiento del Equipo, mismo que consiste en desempeñar todas las funciones de fábrica del Equipo, así como el mantener las condiciones necesarias para permitir a la aplicación de bloqueo operar. No incluirá en ningún caso algún tipo de daño estético o modificaciones realizadas a los Equipos por cualquier persona, así como Defectos de Fabricación a consecuencia del desperfecto, deterioro normal por uso o desgaste, pérdida de datos o información, así como pérdida y/o robo del Equipo. El Plan de Reparación contra Daño está vigente a partir de la fecha de compra señalada en el ticket o comprobante de compra correspondiente y durante un período no mayor a 90 días contados a partir de la fecha señalada en el ticket o comprobante de compra.',
            },
            {
              text: '\n\nEn caso de que el Equipo sufra un Daño durante la vigencia señaladam el ARRENDATARIO deberá notificar al ARRENDADOR quien le informará de manera detallada el procedimiento para reparación. El ARRENDATARIO cuenta con el Plan de Reparación Contra Daño, siempre y cuando (i) dicho Equipo haya sido adquirido de forma legítima conforme a este Contrato, (ii) el Equipo hubiese sufrido un Daño de conformidad con las estipulaciones establecidas por parte del ARRENDADOR, (iii) el ARRENDATARIO haya liquidado sus parcialidades a la fecha de vencimiento y (iv) se encuentre dentro del período de garantía.',
              style: 'bold',
            },
          ],
        },
        //15
        {
          style: 'normal',
          text: [
            { text: '\n\n15. ', style: 'bold' },
            {
              text: 'PRIVACIDAD.',
              style: ['subtitle'],
            },
            {
              text: ' El ARRENDATARIO reconoce que el ARRENDADOR ha puesto a su disposición el Aviso de Privacidad vigente, mismo que puede ser consultado en la página en Internet del ARRENDADOR, así como, que ha sido informado, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y su Reglamento, sobre la identidad y domicilio del ARRENDADOR; los datos personales que el ARRENDADOR recabará; las finalidades primarias y secundarias del tratamiento de dichos datos; los medios ofrecidos para limitar el uso o divulgación de sus datos y/o revocar su consentimiento, así como, para ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO); las transferencias de sus datos, que en su caso, se efectúan para el cumplimiento de las obligaciones derivadas del presente Contrato.',
            },
            {
              text: '\n\nEl ARRENDADOR, conforme a la normatividad aplicable, podrá realizar cambios o actualizaciones a su Aviso de Privacidad, mismos que dará a conocer al ARRENDATARIO a través de su página en Internet, por lo que el ARRENDATARIO será responsable de revisar periódicamente la página en Internet del ARRENDADOR para tener conocimiento de dichos cambios y/o actualizaciones.',
            },
            {
              text: '\n\nEl ARRENDADOR en ningún momento utilizará los datos personales del ARRENDATARIO para realizarle llamadas con la finalidad de promocionar productos y/o servicios a menos que el ARRENDATARIO otorgue su consentimiento expreso a través de los medios electrónicos disponibles.',
            },
          ],
        },
        //16
        {
          style: 'normal',
          text: [
            { text: '\n\n16. ', style: 'bold' },
            {
              text: 'MEDIOS ELECTRÓNICOS Y NUEVAS TECNOLOGÍAS.',
              style: ['subtitle'],
            },
            {
              text: ' Las Partes acuerdan que los servicios ofrecidos por el ARRENDADOR (propios o de terceros); así como el presente Contrato podrán ser suscritos a través de medios electrónicos, biométricos, digitales, a distancia a través de Internet y/o de cualquier nueva tecnología futura que la el ARRENDADOR ponga a disposición del ARRENDATARIO.',
            },
            {
              text: '\n\nEn el uso de medios digitales, electrónico, a distancia y/o de nuevas tecnologías, el ARRENDADOR podrá utilizar los medios de autenticación y manifestación de la voluntad que permitan validar que el ARRENDATARIO es quien efectivamente dice ser y que éste ha solicitado el servicio y/o firmado el Contrato. Para lo anterior, el ARRENDADOR podrá hacer el envío de un Token al número de teléfono asociado al Equipo del ARRENDATARIO. El ARRENDATARIO es el único responsable del manejo y uso del Equipo y la línea telefónica asociada a él, por lo que en toda transacción en la que sea proporcionado el Token enviado por el ARRENDADOR al ARRENDATARIO se reputará válida, hecha por el ARRENDATARIO y por otorgado el consentimeinto para realizar la transacción para la que se haya generado el Token.',
            },
            {
              text: '\n\nDe igual forma, el ARRENDADOR podrá hacer uso de tecnologías para reconocimiento facial, obtención de huellas digitales y/o cualquier otro elemento biométrico que permita autenticar al ARRENDATARIO en sus transacciones a distancia y/o a través de Internet, así como para dar cumplimiento a las obligaciones previstas en la Ley.',
            },
            {
              text: '\n\nEn caso de que el ARRENDATARIO llegara a proporcionar información falsa o inexacta, se considerará como incumpliendo a lo establecido en el presente Contrato y, en consecuencia, el ARRENDADOR podrá darlo por terminado sin responsabilidad para éste, procediendo al cobro inmediato de la totalidad de los montos adeudados por el ARRENDATARIO sin perjuicio de la penalización y/o los daños y perjuicios que sean aplicables.',
            },
            {
              text: '\n\nLas Partes acuerdan que, cuando sea requerida la firma autógrafa, ésta será sustituida por una de carácter electrónico, digital, numérico, alfanumérico, biométrico o de acuerdo a la tecnología utilizada; por lo que las constancias documentales o técnicas en donde sea aplicada, tendrán la fuerza, validez y efectos que la legislación mercantil aplicable le atribuya.',
            },
            {
              text: '\n\nEl ARRENDATARIO autoriza expresamente al ARRENDADOR, para que pueda confirmar los Datos Personales proporcionados acudiendo a entidades públicas, compañías especializadas o centrales de riesgo.',
            },
            {
              text: '\n\nEl ARRENDADOR reconoce y manifiesta que toda la información biométrica capturada tendrá el carácter de confidencial y será tratada de conformidad al Aviso de Privacidad del ARRENDADOR.',
            },
            {
              text: '\n\nEn caso de la celebración del Contrato o la contratación de servicios a través del medios electrónicos, digitales, de Internet y/o cualquier otra nueva tecnología, las Partes acuerdan que los documentos, constancias, confirmaciones y/o cualquier otro análogo que se genere con motivo de la transacción será puesto a disposición a través de, y/o enviado al, ARRENDATARIO al correo electrónico que haya proporcionado, siendo responsabilidad del ARRENDATARIO el cerciorarse que su correo electrónico no evite la recepción de correos del ARRENDADOR y/o éstos sean catalogados como correo no deseado, “Junk”, “Bulk” o “SPAM”.',
            },
            {
              text: '\n\nLas Partes acuerdan que todas las transacciones generadas por el ARRENDATARIO a través del portal, página de Internet y/o plataforma que el ARRENDADOR habilite para tal efecto, se entenderán como una solicitud expresa del mismo, por lo que el ARRENDATARIO será el único responsable de las transacciones realizadas a través de las referidas páginas en Internet y/o plataformas, así como, del cuidado y resguardo de sus claves de acceso a los referidos portales.',
            },
            {
              text: '\n\nLos canales de venta a través de medios electrónicos y/o de cualquier tecnología que el ARRENDADOR ponga a disposición del ARRENDATARIO contarán con funcionalidades técnicas de seguridad a fin de garantizar la protección y confidencialidad de los datos personales e información crediticia que sea recabada a través de éstos medios.',
            },
            {
              text: '\n\nEl portal de y/o la página en Internet del ARRENDADOR contarán con certificados de seguridad y el sello de confianza correspondiente.',
            },
          ],
        },
        //17
        {
          style: 'normal',
          text: [
            { text: '\n\n17. ', style: 'bold' },
            {
              text: 'NOTIFICACIONES.',
              style: ['subtitle'],
            },
            {
              text: ' Cualquier notificación o requerimiento relacionado con este Convenio deberá realizarse de manera escrita y entregarse de forma personal, por correo certificado con acuse de recibo o por servicio de mensajería especializada con acuse de recibo, en los domicilios señalados en la Caratula de este Convenio.',
            },
            {
              text: '\n\nLas Partes deberán informarse por escrito cualquier cambio de domicilio que tuvieren y en caso de no hacerlo, los avisos y notificaciones de cualquier índole que dirijan al último domicilio indicado surtirán todos los efectos legales a que haya lugar.',
            },
          ],
        },
        //18
        {
          style: 'normal',
          text: [
            { text: '\n\n18. ', style: 'bold' },
            {
              text: 'ACUERDO TOTAL.',
              style: ['subtitle'],
            },
            {
              text: ' Este Contrato constituye el acuerdo total entre las Partes respecto del objeto del mismo y anula todo Contrato o convenio anterior que hubiese existido previamente entre las Partes.',
            },
          ],
        },
        //19
        {
          style: 'normal',
          text: [
            { text: '\n\n19. ', style: 'bold' },
            {
              text: 'JURISDICCIÓN Y LEY APLICABLE.',
              style: ['subtitle'],
            },
            {
              text: ' Las Partes reconocen la competencia en la vía administrativa de la Procuraduría Federal del Consumidor en cuanto a la interpretación y cumplimiento del Contrato de acuerdo a sus atribuciones expresas. En caso de no llegar a una solución por la vía administrativa, las Partes acuerdan someterse a la jurisdicción de los Tribunales competentes en el Estado de Jalisco o en la Ciudad de México, a elección de la parte actora, renunciando expresamente a cualquier otro fuero o jurisdicción que les pudiera corresponder en razón de sus domicilios presentes o futuros o por cualquier otra causa.',
            },
            {
              text: '\n\nCuando el ARRENDATARIO haya iniciado un procedimiento conciliatorio ante la Procuraduría Federal del Consumidor, el ARRENDADOR se abstendrá de suspender los servicios contratados, siempre y cuando haya sido previa y formalmente notificado del inicio del mismo. En éste caso el ARRENDATARIO no quedará exento del cumplimiento de las obligaciones de pago, salvo que como resultado del procedimiento la Procuraduría haya determinado su improcedencia.',
            },
          ],
        },
      ],

      styles: {
        title: {
          fontSize: 11,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        subtitle: {
          bold: true,
          decoration: 'underline',
        },
        bold: {
          bold: true,
        },
        under: {
          decoration: 'underline',
        },
        normal: {
          fontSize: 8,
          alignment: 'justify',
        },
        image: {
          margin: [0, 0, 0, 20],
          alignment: 'center',
        },
      },
    };
  }
}
