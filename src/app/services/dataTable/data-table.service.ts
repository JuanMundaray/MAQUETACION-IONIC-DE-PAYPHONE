import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class DataTableService {
  constructor() { }

public dataTable: any;

// Método para inicializar la tabla.
initializeDataTable(tableID: string, ord?: any, date?: number[], orderableCols?: number[]): void {
  $(document).ready(() => {
    this.setupDataTable(tableID, date, orderableCols, ord);
  });
}

// Método para setear la tabla
// fecha: posición en la tabla de la ó las fechas en (formato de array) a formatear para que el filtrado se haga de manera correcta.
// colsNoOrdenables: Posición en la tabla
setupDataTable(tableID: string, fecha: number[] = [], colsNoOrdenables: number[] = [], ord: string = ''): void {
  let table = $(`#${tableID}`) as any; // Selecciona la tabla
  this.dataTable = table.DataTable({
    columnDefs: [
      // La columnas del array no serán ordenables.
      { orderable: false, targets: colsNoOrdenables },
      // Todas las columnas tendrán centrado el texto
      { className: 'text-center', targets: '_all'},
      { className: "align-middle", targets: '_all'},
      // La columnas del array ya tendrán formateo por fecha.
      {
        targets: fecha,
        render: function (data: any, type: any) {
          // formateo para poder filtrar las fechas correctamente
          if (type === 'sort' || type === 'type') {
            return moment(data, 'DD/MM/YYYY').format('YYYYMMDD');
          } else {
            return data;
          }
        },
      },
    ],
    buttons: [
      {
        extend: 'excelHtml5',
        text: '<img src="../../../../assets/images/logos/excel.png" alt="">',
        titleAttr: 'Excel',
        className: 'btn me-md-2',
      },
      {
        extend: 'pdfHtml5',
        text: '<img src="../../../../assets/images/logos/pdf.png" alt="">',
        titleAttr: 'PDF',
        className: 'btn me-md-2',
        orientation: 'landscape',
      },{
        extend: 'copy',
        text: '<img style="width:30px; heigth:30px;" src="https://www.shareicon.net/download/2016/07/06/111514_clipboard.ico" alt="">',
        titleAttr: 'Copiar',
        className: 'btn mt-md-2 me-md-3',
      },
    ],
    language: {
      // pre-cargado del lenguaje de la tabla
      url: '//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json',
    },
    dom: 'Bfrtilp',
  });
  this.dataTable.order([0, ord]).draw();
}

setupCustomDataTable(tableID: string, columnDefs?: {}[], buttons?: {}[]) {
  let table = $(`#${tableID}`) as any; // Selecciona la tabla
  this.dataTable = table.DataTable({
    columnDefs: columnDefs,
    buttons: buttons,
    language: {
      // pre-cargado del lenguaje de la tabla
      url: '//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json',
    },
    dom: 'Blftrip',
  });
  this.dataTable.order([0, 'desc']).draw();
}

// Método para destruir la tabla
destroyDataTable(): void {
    this.dataTable.destroy();
    this.dataTable = null; // Limpiar la referencia
}

// Método para reinicializar la tabla
reinitDataTable(tableID: string): void {
  this.destroyDataTable();
  setTimeout(() => {
    this.setupDataTable(tableID);
  }, 1000);
}

}
