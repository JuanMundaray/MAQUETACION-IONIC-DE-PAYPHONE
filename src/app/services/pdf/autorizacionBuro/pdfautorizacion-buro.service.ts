import { Injectable } from '@angular/core';
import moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const pdf = pdfMake;
pdf.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PDFautorizacionBuroService {
  public clientLastname : string = 'test';
  public clientName : string = 'test';
  public clientCurp : string = 'test';
  public pdfFechaConsulta : string = moment().format('MM-DD-YYYY');
  public DocAutorizacionB64 : any;
  public firmaDigital : any;

  constructor() { }

  async generatePDF() {
    return new Promise((resolve, reject) => {
      pdfMake.createPdf(this.formatPDF()).getBase64((base) => {
        //console.log('Base: ', base);
        this.DocAutorizacionB64 = base;
        console.log("autorizacion",base)
        //this.open();
        resolve(base); // Aquí deberías pasar un valor, como resolve(base)
      });
    });
  }

  open(){
    pdfMake.createPdf(this.formatPDF()).open();
  }
  
  formatPDF(): any{
    console.log(this.firmaDigital)
    return {
      content: [
        /**
         * title
         */
        {
          text: 'Autorización para solicitar Reportes de Crédito',
          fontSize: 14,
          alignment: 'center',
          margin: [0, 0, 0, 25],
          bold: true,
        },
        /**
         * parrafo 1
         */
        {
          margin: [0, 0, 0, 20],
          style: 'normal',
          text: [
            {
              text: 'Por este conducto autorizo expresamente a ',
            },
            {
              text: 'PROPEX LOGISTICS SA DE CV ',
              bold: true,
            },
            {
              text: ', para que por conducto de sus funcionarios facultados lleve a cabo Investigaciones, sobre mi comportamiento Crediticio en las Sociedades de Información Crediticia que estime conveniente.',
            },
          ],
        },
        /**
         * parrafo 2
         */
        {
          margin: [0, 0, 0, 20],
          style: 'normal',
          text: [
            {
              text: 'Así mismo, declaro que conozco la naturaleza y alcance de la información que se solicitará, del uso que ',
            },
            {
              text: 'PROPEX LOGISTICS SA DE CV ',
              bold: true,
            },
            {
              text: ', hará de tal información y de que ésta podrá realizar consultas periódicas de mi historial crediticio, consintiendo que esta autorización se encuentre vigente por un período de 3 años contados a partir de la fecha de su expedición y en todo caso durante el tiempo que mantengamos relación jurídica.',
            },
          ],
        },
        /**
         * segmento info personal
         */
        {
          margin: [0, 30, 0, 30],
          style: 'normal',
          table: {
            body: [
              [
                {
                  text: 'Persona física',
                  border: [false, false, false, false],
                },
                {
                  text: 'X',
                },
              ],
            ],
          },
        },
        {
          style: 'normal',
          margin: [0, 0, 0, 1],
          text: [
            {
              text: 'Nombre del Cliente Persona Física:',
              bold: true,
            },
            {
              text: `\n\nApellidos: `,
            },
            {
              text: this.clientLastname,
              bold: true,
            },
            {
              text: `\n\nNombre(s): `,
            },
            {
              text: this.clientName,
              bold: true,
            },
            {
              text: `\n\nCURP: `,
            },
            {
              text: this.clientCurp,
              bold: true,
            },
          ],
        },
        {
          text: '_______________________________________________________________________________________________',
        },
        /**
         * fech<a
         */
        {
          style: 'normal',
          margin: [0, 30, 0, 30],
          text: `Fecha de consulta: ${this.pdfFechaConsulta}`,
          bold: true,
        },
        /**
         * parrafo 3
         */
        {
          margin: [0, 0, 0, 200],
          style: 'normal',
          text: [
            {
              text: 'Estoy consciente y acepto que este documento quede bajo propiedad de ',
            },
            {
              text: 'PROPEX LOGISTICS SA DE CV ',
              bold: true,
            },
            {
              text: 'para efectos de control y cumplimiento del artículo 28 de la Ley para Regular a Las Sociedades de Información Crediticia.',
            },
          ],
        },
        /**
         * parrafo 3
         */
        {
          image: this.firmaDigital,
          width: 100,
          alignment: 'center'
        },
        {
          margin: [0, 0, 0, 200],
          style: 'normal',
          text: [
            {
              text: '_________________________________________________________________________',
              alignment: 'center',
            },
            {
              text: '\nFirma del Cliente',
              bold: true,
              alignment: 'center',
            },
          ],
        },
      ],
      styles: {
        normal: {
          fontSize: 10,
          alignment: 'justify',
        },
      },
    };
  }
}
