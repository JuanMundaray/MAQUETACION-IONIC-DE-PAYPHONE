import { Injectable } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';


@Injectable({
  providedIn: 'root',
})
export class PdfServicesService {
  constructor() {}

  crearPDF(DATA: any, complement: any) {
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
    //const DATA = document.getElementById('htmlData');
    const doc = new jspdf('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3,
    };
    html2canvas(DATA!, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        // Add image Canvas to PDF
        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(fecha + '-' + complement + '.pdf');
      });
  }
}
