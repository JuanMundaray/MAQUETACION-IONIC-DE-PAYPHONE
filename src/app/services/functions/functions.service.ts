import { Injectable } from '@angular/core';
import { EncriptarDesencriptarService } from 'src/app/services/enc-des/encriptar-desencriptar.service';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AlertMessageService } from '../alert/alert-message.service';
import { environment } from 'src/environments/environment';
import { HttpServiceService } from '../httpServices/http-service.service';
import { takeUntil } from 'rxjs/operators';
import { SpinnerService } from '../spinner/spinner.service';
declare var $: any;
@Injectable({
  providedIn: 'root',
})
export class FunctionsService {
  public COMPANY_NAME:string=environment.COMPANY_NAME;
  private arrMes: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  private arrDia = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  private country = this.readLocalStorage('country');
  private disenio = new Subject<boolean>();
  public disenio$: Observable<boolean> = this.disenio.asObservable();

  private nroEtapaCredito = new Subject<string>();
  public nroEtapaCredito$ = this.nroEtapaCredito.asObservable();

  private objTit = new Subject<any>();
  public objTit$ = this.objTit.asObservable();

  //* observable para que las sucursales se actualice automatiamente en el home.
  private valueSubject = new BehaviorSubject<string>(""); // Valor inicial
  currentValue$ = this.valueSubject.asObservable(); 

  constructor(
    public encriptarDesencriptar: EncriptarDesencriptarService,
    public localStorage: LocalStorageService,
    public alert: AlertMessageService,
    public httpServ: HttpServiceService,
    public spinner: SpinnerService
  ) {}

  /**********************************************/
  /*              VARIABLES GLOBALES            */
  /**********************************************/

 //* Método para actualizar el valor de las sucusales en el home

 updateValueBranch(newValue: string) {
  this.valueSubject.next(newValue);
}

  setDisenioVar(value: any) {
    this.disenio.next(value);
  }

  setNroEtapaCreditoVar(value: string) {
    this.nroEtapaCredito.next(value);
  }

  setObjTit(value: any) {
    this.objTit.next(value);
  }

  /**********************************************/

  onlynumbers(event: any) {
    const pattern = /[0-9,.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      this.alert.error('Oops', 'Solo puedes escribir números en este campo');
      event.preventDefault();
    }
  }

  onlyLetters(event: any) {
    const pattern = /[a-z, A-Z]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      this.alert.error('Oops', 'Solo puedes escribir letras en este campo');
      event.preventDefault();
    }
  }

  formatCurrency(
    num: any,
    type: any,
    country: string,
    simb: boolean = true,
    dPart: boolean = true
  ) {
    // console.log('🚀 - FunctionsService - formatCurrency - country:', country);

    //type = 1  redondear hacia arriba
    //type = 2  respetar decimales

    let simb1: any = '';
    let simb2: any = '';
    let decimalPart, enterPart;
    let nro = '';
    let i;
    let dec: number = 2;
    let numero: any;

    switch (country) {
      case 'MX':
        simb1 = 'MXN';
        simb2 = '$';
        break;

      case 'GTM':
        simb1 = 'Q';
        simb2 = 'Q';
        break;

      case 'VZLA':
        simb1 = 'Bs.';
        simb2 = 'VES';
        break;
    }

    // Parsear el número y conservar el signo '-' si es negativo
    let isNegative = false;
    if (typeof num === 'string' && num.startsWith('-')) {
      isNegative = true;
      num = num.substring(1); // Eliminar el signo '-' para la conversión
    }
    num = parseFloat(num).toFixed(2);

    if (dec > 0) {
      if (num.includes(',')) {
        var ext = num.split(',')[1];
        if (ext.includes('.')) {
          enterPart =
            num.split(',')[0].toString() + ext.split('.')[0].toString();
          decimalPart = ext.split('.')[1];
        } else {
          enterPart = num.split(',')[0].toString() + ext.toString();
          decimalPart = '00';
        }
      } else {
        if (num.includes('.')) {
          enterPart = num.split('.')[0];
          decimalPart = num.split('.')[1];
        } else {
          enterPart = num.toString();
          decimalPart = '00';
        }
      }
    }

    if (type == 1) {
      var nume = enterPart + '.' + decimalPart;

      enterPart = Math.ceil(parseFloat(nume)).toString().split('.')[0];

      decimalPart = '00';
    }

    var numElem = enterPart.length;
    if (numElem > 1) {
      for (i = 0; i < numElem; i++) {
        nro = nro + enterPart[i];
      }
      num = nro;
    }
    var array = Math.floor(num).toString().split('');
    var index = -3;
    while (array.length + index > 0) {
      array.splice(index, 0, ',');
      index -= 4;
    }
    enterPart = array.join('');
    if (isNaN(parseFloat(enterPart))) enterPart = '0';

    if (simb) {
      if (isNegative) {
        numero = '-' + simb2 + enterPart + '.' + decimalPart + ' ' + simb1;
      } else {
        numero = simb2 + enterPart + '.' + decimalPart + ' ' + simb1;
      }
    } else {
      numero = isNegative
        ? '-' + enterPart + '.' + decimalPart
        : enterPart + '.' + decimalPart;
    }
    if (!dPart) {
      if (!Number.isInteger(numero)) {
        numero = Math.trunc(numero).toString();
      }
    }
    return numero;
  }

  getCurrency(): string {
   const country = this.readLocalStorage('country');
   let currency;
   switch (country) {
    case 'MX':
      currency = 'MXN'
      break;

    case 'GTM':
      currency = 'Q';
      break;

    case 'VZLA':
      currency = 'VES';
      break;

      default:
      currency = 'MXN';
  }
  return currency
  }

  returnNumOring(num: any) {
    var numero: any;
    numero = parseInt(String(num).replace(/[^\d.]/g, ''));
    return numero;
  }

  roundNumbers(aux: any) {
    return Math.ceil(aux);
    /*var num = parseInt(aux);
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);*/
  }

  nroTelf(event: any) {
    const pattern = /[+0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      this.alert.error('Oops', 'Solo puedes escribir numeros en este campo');
      event.preventDefault();
    }
  }

  email(txt: string) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (pattern.test(txt)) {
      return true;
    } else {
      return false;
    }
  }

  validateMobil() {
    var dispositivo = navigator.userAgent;
    let regexp =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    let isMobileDevice = regexp.test(dispositivo);
    if (!isMobileDevice) {
      return false;
    } else {
      return true;
    }
  }

   longDateReceiptPDF(date: any, type: any = 0) {
     const parts = date?.split('-');
     let fecha: any = new Date(
       parseInt(parts[0]),
       parseInt(parts[1]) - 1,
       parseInt(parts[2])
     );

     if (isNaN(fecha.getTime())) {
       console.log('🚀 - FunctionsService - longDate - Fecha no válida:', date);
       return null;
     }

     if (typeof date === 'number') {
       fecha = new Date(
         parseInt(parts[0]),
         parseInt(parts[1]) - 1,
         parseInt(parts[2])
       ); // Creamos un objeto Date a partir de los milisegundos
       fecha = fecha.toISOString().split('T')[0]; // Convertimos la fecha a ISO y tomamos solo la parte de la fecha
     } else {
       fecha = new Date(
         parseInt(parts[0]),
         parseInt(parts[1]) - 1,
         parseInt(parts[2])
       );  //Si date no es un número, lo tratamos como una cadena de fecha
     }

     // Convertimos la fecha a formato ISO y tomamos solo la parte de la fecha

     let formFech: any;
     fecha = new Date(
       parseInt(parts[0]),
       parseInt(parts[1]) - 1,
       parseInt(parts[2])
     );

     if (type === 0) {
        // fecha = date.toISOString().split('T')[0];
       formFech =
         this.arrDia[fecha.getDay()] +
         ', ' +
         (fecha.getDate() < 10 ? '0' : '') +
         fecha.getDate() +
         ' de ' +
         this.arrMes[fecha.getMonth()] +
         ' de ' +
         fecha.getFullYear();
     } else {
       formFech =
         this.arrDia[fecha.getDay()] +
         ', ' +
         this.convertNumberToWords(fecha.getDate(), 1) +
         ' de ' +
         this.arrMes[fecha.getMonth()] +
         ' del año ' +
         this.convertNumberToWords(fecha.getFullYear(), 1);
     }
     return formFech;
   }

   longDate(date: any, type: any = 0) {
    // Si el input es un string con formato 'YYYY-MM-DD', lo desglosamos en componentes
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-').map(Number);
        // Nota: En JavaScript, el mes es 0-indexado, por lo que enero es 0 y diciembre es 11
        date = new Date(year, month - 1, day);
    } else {
        date = new Date(date);
    }

    if (isNaN(date.getTime())) {
        console.log('🚀 - FunctionsService - longDate - Fecha no válida:', date);
        return null;
    }

    let formFech: any;

    if (type === 0) {
        formFech =
            this.arrDia[date.getDay()] + ', ' +
            (date.getDate() < 10 ? '0' : '') + date.getDate() + ' de ' +
            this.arrMes[date.getMonth()] + ' de ' +
            date.getFullYear();
    } else {
        formFech =
            this.arrDia[date.getDay()] + ', ' +
            this.convertNumberToWords(date.getDate(), 1) + ' de ' +
            this.arrMes[date.getMonth()] + ' del año ' +
            this.convertNumberToWords(date.getFullYear(), 1);
    }
    return formFech;
}



  obtener1raParcGTM(): string {
    const fechaActual = new Date();

    const nuevaFecha = new Date(
      fechaActual.getTime() + 14 * 24 * 60 * 60 * 1000
    );

    const nombreDia = this.arrDia[nuevaFecha.getDay()];

    const dia = nuevaFecha.getDate();
    const mes = nuevaFecha.getMonth();
    const anio = nuevaFecha.getFullYear();

    return `${nombreDia}, ${dia} de ${this.arrMes[mes]} de ${anio}`;
  }

  shortDate(date: any) {
    var day: any;
    var shortDate: any;
    var letterMonth: any = [
      'ENE',
      'FEB',
      'MAR',
      'ABR',
      'MAY',
      'JUN',
      'JUL',
      'AGO',
      'SEP',
      'OCT',
      'NOV',
      'DIC',
    ];
    var month: number;
    var year: any;
    var auxDate: any = [];
    auxDate = date.split('-');
    day = auxDate[2];
    month = parseInt(auxDate[1]);
    year = auxDate[0];
    return (shortDate = day + letterMonth[month - 1] + year);
  }

  formatDate(date: Date, type: number = 0): string {
    let fecha: string;
    const fech = new Date(date);
    const year = fech.getFullYear();
    const month = fech.getMonth() + 1;
    const day = fech.getDate() + 1;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    if (type === 0) {
      fecha = `${year}-${formattedMonth}-${formattedDay}`;
    } else {
      fecha = `${formattedDay}/${formattedMonth}/${year}`;
    }
    return fecha;
  }

  subtractOneDay() {
    let newDate: string;
    const fechaActual = new Date();

    let nuevaFecha = new Date(fechaActual);
    nuevaFecha.setDate(fechaActual.getDate() - 1);

    const dia = nuevaFecha.getDate().toString().padStart(2, '0');
    const mes = (nuevaFecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = nuevaFecha.getFullYear();
    newDate = `${anio}-${mes}-${dia}`;
    return newDate;
  }

  formatFechaActual() {
    let newDate: string;

    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaActual.getFullYear();
    newDate = `${anio}-${mes}-${dia}`;
    return newDate;
  }

  crypt(ele: any, key: string) {
    try {
      const encryptedData = this.encriptarDesencriptar.atRL(btoa(ele), key);
      return encryptedData;
    } catch (error) {
      console.error(`Error encriptando(${ele}): ===>`, error);
      return 'null'; // O manejar el error de acuerdo a tus necesidades
    }
  }

  decrypt(ele: any, key: string) {
    try {
      const decryptedData =
        this.encriptarDesencriptar.replace_specials_characters(
          atob(this.encriptarDesencriptar.gtRl(ele, key))
        );
      return decryptedData;
    } catch (error) {
      console.error(`Error desencriptando(${ele}): ===>`, error);
      return 'null'; // O manejar el error de acuerdo a tus necesidades
    }
  }

  addLocalStorage(data: any, nombVar: string): void {
    try {
      var dataEnc = this.encriptarDesencriptar.atRL(
        btoa(data),
        'celuCreditLocalStorage'
      );
      this.localStorage.setItem(nombVar, dataEnc);
    } catch (error) {
      console.log(`Error al agregar a localstore: ${nombVar} ==> ${error}`);
    }
  }

  readLocalStorage(nombVar: any) {
    if (this.localStorage.getItem(nombVar)) {
      return this.encriptarDesencriptar.replace_specials_characters(
        atob(
          this.encriptarDesencriptar.gtRl(
            this.localStorage.getItem(nombVar),
            'celuCreditLocalStorage'
          )
        )
      );
    } else {
      console.log(`No existe en localstore ${nombVar}`);
      return 'null';
    }
  }

  deleteLocalStorage(nombre: string) {
    this.localStorage.removeItem(nombre);
  }

  borrarVariablesLs(variables: string[]) {
    variables.forEach(key => this.deleteLocalStorage(key));
   };

  
  checkItemLocalStorage(item: string) {
    if (this.localStorage.getItem(item)) return true;
    return false;
  }

  dateSession() {
    let mes: string;
    let dia: string;
    let fechaInicial;
    let auxFecha: any = new Date();

    if (auxFecha.getMonth() < 10) mes = '0' + auxFecha.getMonth();
    else mes = auxFecha.getMonth();

    if (auxFecha.getDate() < 10) dia = '0' + auxFecha.getDate();
    else dia = auxFecha.getDate();

    fechaInicial = auxFecha.getFullYear() + '-' + mes + '-' + dia;

    return fechaInicial;
  }

  validateSession() {
    let session = this.readLocalStorage('login');
    return session != 'on' ? false : true;
  }

  sumarDias(fecha: any, dias: number) {
    let resultDate: string = '';
    const parts = fecha.split('-');
    const initialDateObj = new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2])
    );;
    const resultDateObj = new Date(
      initialDateObj.getTime() + dias * 24 * 60 * 60 * 1000
    );

    const year = resultDateObj.getFullYear();
    const month = ('0' + (resultDateObj.getMonth() + 1)).slice(-2);
    const day = ('0' + resultDateObj.getDate()).slice(-2);
    return (resultDate = `${year}-${month}-${day}`);
  }

  addCodPais(country: string, nro: any) {
    let auxCod: string = '';
    var nroTel: any;
    var auxNro: any;
    auxCod = nro.substr(0, 1);
    if (auxCod == '+') {
      auxCod = nro.substr(1, 3);
      auxNro = nro.substring(4);
    } else {
      auxCod = nro.substr(0, 3);
      auxNro = nro.substring(3);
    }

    if (auxCod == '521' || auxCod == '502' || auxCod == '58') {
      nroTel = auxCod + auxNro;
    } else {
      var cod: string = '';
      switch (country) {
        case 'MX':
        case 'mx':
          cod = '521';
          break;
        case 'GTM':
          cod = '502';
          break;
        case 'VEN':
          cod = '58';
          break;
      }
      nroTel = cod + nro;
    }
    return nroTel;
  }

  getCountryCodeByDomain(domain: any) {
    // obtener el codigo de pais desde el dominio
    let arrUrl: any = domain.split('.');
    return arrUrl[arrUrl.length - 1];
  }

  getSubdomainByDomain(domain: any) {
    // obtener el tipo de cuente con el subdominio
    let arrUrl: any = domain.split('.');
    return arrUrl[0];
  }

  identDispMovil() {
    let disp: boolean;
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      disp = true;
      //// console.log('Estás usando un dispositivo móvil!!');
    } else {
      disp = false;
      //// console.log('No estás usando un móvil');
    }
    return disp;
  }

  cleanSalesProcess() {
    this.localStorage.removeItem('active_sale');

    //eliminar datos de OCR
    this.localStorage.removeItem('client_url_img_frontal'); //ID frontal del comprador
    this.localStorage.removeItem('client_url_img_trasero'); //ID trasero del comprador
    this.localStorage.removeItem('client_url_img_selfie'); //Selfie del cliente
    this.localStorage.removeItem('client_url_img_signature'); // FIRMA CLIENTE
    //eliminar datos preaprobacion
    if (this.localStorage.getItem('preaprobado_enganche'))
      this.localStorage.removeItem('preaprobado_enganche');
    if (this.localStorage.getItem('preaprobado'))
      this.localStorage.removeItem('preaprobado');
    if (this.localStorage.getItem('preaprobado_device_id'))
      this.localStorage.removeItem('preaprobado_device_id');
    if (this.localStorage.getItem('preaprobado_codigo'))
      this.localStorage.removeItem('preaprobado_codigo');
    if (this.localStorage.getItem('tipodeventa'))
      this.localStorage.removeItem('tipodeventa');

    //eliminar datos de enrolamiento : QrInstalacionAppComponent()
    if (this.localStorage.getItem('enrolado_devicetoken'))
      this.localStorage.removeItem('enrolado_devicetoken');
    if (this.localStorage.getItem('enrolado_eid'))
      this.localStorage.removeItem('enrolado_eid');
    if (this.localStorage.getItem('enrolado_devicetoken'))
      this.localStorage.removeItem('enrolado_devicetoken');
    if (this.localStorage.getItem('enrolado_eid'))
      this.localStorage.removeItem('enrolado_eid');
    if (this.localStorage.getItem('chargerType'))
      this.localStorage.removeItem('chargerType');
    if (this.localStorage.getItem('imeiPhone'))
      this.localStorage.removeItem('imeiPhone');
    if (this.localStorage.getItem('inpTag'))
      this.localStorage.removeItem('inpTag');
    if (this.localStorage.getItem('numAprov'))
      this.localStorage.removeItem('numAprov');
    if (this.localStorage.getItem('enrol_plataform'))
      this.localStorage.removeItem('enrol_plataform');
    if (this.localStorage.getItem('numAprovSincodPais'))
      this.localStorage.removeItem('numAprovSincodPais');

    // Delete data of consigna
    localStorage.removeItem('imeiConsigna');
    localStorage.removeItem('consigna');

    //eliminar informacion de datos validar venta: QrValidaVentaComponent()
    if (this.localStorage.getItem('urlPhotoPagare'))
      this.localStorage.removeItem('urlPhotoPagare');
    if (this.localStorage.getItem('urlPhotoValidateClient'))
      this.localStorage.removeItem('urlPhotoValidateClient');
    if (this.localStorage.getItem('final_tag'))
      this.localStorage.removeItem('final_tag');
  }

  edosMex() {
    let arrState = [
      { abr: 'AGS', name: 'AGUASCALIENTES', id: 39 },
      { abr: 'BC', name: 'BAJA CALIFORNIA NORTE', id: 42 },
      { abr: 'BCS', name: 'BAJA CALIFORNIA SUR', id: 40 },
      { abr: 'CAMP', name: 'CAMPECHE', id: 38 },
      { abr: 'CHIS', name: 'CHIAPAS', id: 41 },
      { abr: 'CHIH', name: 'CHIHUAHUA', id: 265 },
      { abr: 'COAH', name: 'COAHUILA', id: 137 },
      { abr: 'COL', name: 'COLIMA', id: 3 },
      { abr: 'CDMX', name: 'CIUDAD DE MÉXICO', id: 36 },
      { abr: 'DGO', name: 'DURANGO', id: 136 },
      { abr: 'GTO', name: 'GUANAJUATO', id: 67 },
      { abr: 'GRO', name: 'GUERRERO', id: 133 },
      { abr: 'HGO', name: 'HIDALGO', id: 100 },
      { abr: 'JAL', name: 'JALISCO', id: 1 },
      { abr: 'MEX', name: 'MÉXICO', id: 46 },
      { abr: 'MICH', name: 'MICHOACÁN', id: 2 },
      { abr: 'MOR', name: 'MORELOS', id: 266 },
      { abr: 'NAY', name: 'NAYARIT', id: 166 },
      { abr: 'NL', name: 'NUEVO LEÓN', id: 267 },
      { abr: 'OAX', name: 'OAXACA', id: 44 },
      { abr: 'PUE', name: 'PUEBLA', id: 68 },
      { abr: 'QRO', name: 'QUERÉTARO', id: 232 },
      { abr: 'QROO', name: 'QUINTANA ROO', id: 138 },
      { abr: 'SLP', name: 'SAN LUIS POTOSÍ', id: 37 },
      { abr: 'SIN', name: 'SINALOA', id: 140 },
      { abr: 'SON', name: 'SONORA', id: 43 },
      { abr: 'TAB', name: 'TABASCO', id: 69 },
      { abr: 'TAMP', name: 'TAMAULIPAS', id: 298 },
      { abr: 'TLAX', name: 'TLAXCALA', id: 134 },
      { abr: 'VER', name: 'VERACRUZ', id: 45 },
      { abr: 'YUC', name: 'YUCATÁN', id: 199 },
      { abr: 'ZAC', name: 'ZACATECAS', id: 139 },
    ];
    return arrState;
  }

  edosGtm() {
    let arrDepartamentos: any = [
      { abr: 'AV', name: 'Alta Verapaz' },
      { abr: 'BV', name: 'Baja Verapaz' },
      { abr: 'CM', name: 'Chimaltenango' },
      { abr: 'CQ', name: 'Chiquimula' },
      { abr: 'EP', name: 'El Progreso' },
      { abr: 'ES', name: 'Escuintla' },
      { abr: 'GU', name: 'Guatemala' },
      { abr: 'HU', name: 'Huehuetenango' },
      { abr: 'IZ', name: 'Izabal' },
      { abr: 'JA', name: 'Jalapa' },
      { abr: 'JU', name: 'Jutiapa' },
      { abr: 'PE', name: 'Petén' },
      { abr: 'QZ', name: 'Quetzaltenango' },
      { abr: 'QC', name: 'Quiché' },
      { abr: 'RE', name: 'Retalhuleu' },
      { abr: 'SA', name: 'Sacatepéquez' },
      { abr: 'SM', name: 'San Marcos' },
      { abr: 'SR', name: 'Santa Rosa' },
      { abr: 'SO', name: 'Sololá' },
      { abr: 'SU', name: 'Suchitepéquez' },
      { abr: 'TO', name: 'Totonicapán' },
      { abr: 'ZA', name: 'Zacapa' },
    ];
    return arrDepartamentos;
  }

  meses() {
    let arrMes = [
      { nro: '01', abr: 'ENE', name: 'Enero' },
      { nro: '02', abr: 'FEB', name: 'Febrero' },
      { nro: '03', abr: 'MAR', name: 'Marzo' },
      { nro: '04', abr: 'ABR', name: 'Abril' },
      { nro: '05', abr: 'MAY', name: 'Mayo' },
      { nro: '06', abr: 'JUN', name: 'Junio' },
      { nro: '07', abr: 'JUL', name: 'Julio' },
      { nro: '08', abr: 'AGO', name: 'Agosto' },
      { nro: '09', abr: 'SEP', name: 'Septiembre' },
      { nro: '10', abr: 'OCT', name: 'Octubre' },
      { nro: '11', abr: 'NOV', name: 'Noviembre' },
      { nro: '12', abr: 'DIC', name: 'Diciembre' },
    ];
    return arrMes;
  }

  formatFechaReportes(arrData: any, dato: string) {
    const dataResponse = Object.entries(arrData);
    var arrDataResponse: any = [];
    var auxArr: any = [];
    var fecha: any;
    var arrFecha: any;

    Object.keys(dataResponse).forEach((key, index) => {
      arrDataResponse = dataResponse[index][1];
      Object.keys(arrDataResponse).forEach((key) => {
        if (key == dato) {
          switch (dato) {
            case 'fecha_venta':
              fecha = arrData[index].fecha_venta;
              break;

            case 'fecha_parcialidad':
              fecha = arrData[index].fecha_parcialidad;
              break;

            case 'fecha':
              fecha = arrData[index].fecha;
              break;
          }
          arrFecha = fecha.split('T');
          fecha = this.longDate(arrFecha[0]);
          switch (dato) {
            case 'fecha_venta':
              arrData[index].fecha_venta = fecha;
              break;

            case 'fecha_parcialidad':
              arrData[index].fecha_parcialidad = fecha;
              break;

            case 'fecha':
              arrData[index].fecha = fecha;
              break;
          }
        }
      });
      auxArr[index] = arrData[index];
    });
    return auxArr;
  }

  calcularEdad(fechaNacimiento: any) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      let timer = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearInterval(timer);
            resolve(position);
          },
          (error) => console.log('Error getting location:', error)
        );
      }, 60000);
    });
  }

  // funciones para validar permisos
  hasAccess(permission: string, perm: any): boolean {
    // Check if the permission is present in the list of permissions obtained from the backend
    return perm.find(
      (permiso: { PER_ACCESS: string }) => permiso.PER_ACCESS === permission
    );
  }

  // convierte numeros a letras
  convertNumberToWords(number: any, onlynumbers: any = 0) {
    let result: string;

    const ones: string[] = [
      '',
      'uno',
      'dos',
      'tres',
      'cuatro',
      'cinco',
      'seis',
      'siete',
      'ocho',
      'nueve',
      'diez',
      'once',
      'doce',
      'trece',
      'catorce',
      'quince',
      'dieciséis',
      'diecisiete',
      'dieciocho',
      'diecinueve',
    ];

    const tens: string[] = [
      '',
      '',
      'veinte',
      'treinta',
      'cuarenta',
      'cincuenta',
      'sesenta',
      'setenta',
      'ochenta',
      'noventa',
    ];

    const hundreds: string[] = [
      '',
      'ciento',
      'doscientos',
      'trescientos',
      'cuatrocientos',
      'quinientos',
      'seiscientos',
      'setecientos',
      'ochocientos',
      'novecientos',
    ];

    const thousands: string[] = [
      '',
      'mil',
      'millón',
      'millones',
      'mil millones',
    ];

    if (number === 0) {
      result = 'cero';
      return result;
    }

    if (number < 0 || number >= 1000000000) {
      result = 'Número fuera de rango';
      return result;
    }

    const billions = Math.floor(number / 1000000000);
    const millions = Math.floor((number % 1000000000) / 1000000);
    const thousandsNum = Math.floor((number % 1000000) / 1000);
    const onesNum = Math.floor(number) % 1000;
    const decimals = Math.round((number - Math.floor(number)) * 100);

    let words = '';

    if (billions > 0) {
      words +=
        (billions === 1
          ? 'un'
          : this.convertNumberLessThanThousand(
              billions,
              ones,
              tens,
              hundreds
            )) +
        ' ' +
        thousands[4] +
        ' ';
    }

    if (millions > 0) {
      words +=
        (millions === 1
          ? 'un'
          : this.convertNumberLessThanThousand(
              millions,
              ones,
              tens,
              hundreds
            )) +
        ' ' +
        (millions === 1 ? thousands[2] : thousands[3]) +
        ' ';
    }

    if (thousandsNum > 0) {
      if (thousandsNum === 1) {
        words += 'mil ';
      } else {
        words +=
          this.convertNumberLessThanThousand(
            thousandsNum,
            ones,
            tens,
            hundreds
          ) +
          ' ' +
          thousands[1] +
          ' ';
      }
    }

    if (onesNum > 0) {
      words +=
        this.convertNumberLessThanThousand(onesNum, ones, tens, hundreds) + ' ';
    }

    if ((onlynumbers = 0)) {
      words += 'PESOS ';

      words =
        words.toUpperCase() +
        'CON ' +
        decimals.toString().padStart(2, '0') +
        '/100 m.n';
    }

    result = words.trim();

    return result;
  }

  /**
   * @param numeroTelefono
   * @returns
   */
  obtenerNumeroLimpio(numeroTelefono: string) {
    // Expresión regular para validar y eliminar el código "521" al principio
    const regex = /^521(.{10})$/;

    // Verificar si el número de teléfono coincide con la expresión regular
    const coincidencia = numeroTelefono.match(regex);

    if (coincidencia) {
      // Extraer el número limpio sin el código "521"
      const numeroLimpio = coincidencia[1];
      return numeroLimpio;
    } else {
      return null; // Devuelve null si el número de teléfono no es válido
    }
  }

  private convertNumberLessThanThousand(
    num: number,
    ones: string[],
    tens: string[],
    hundreds: string[]
  ): string {
    let words = '';

    if (num >= 100) {
      const hundred = Math.floor(num / 100);
      words += hundreds[hundred] + ' ';
      num %= 100;
    }

    if (num >= 20) {
      const ten = Math.floor(num / 10);
      words += tens[ten] + ' ';
      num %= 10;
    }

    if (num > 0) {
      words += ones[num] + ' ';
    }

    return words.trim();
  }

  async shortenLink(urlToShorten: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const arrData = {
        longUrl: urlToShorten
      };
      let jsonData = JSON.stringify(arrData); // se crea el json
      let endpoint = 'https://api.celucenter.com/get/shorturl/g'; // se agrega el endpoint

      /* ESTRUCTURA PARA EL ENVIO DE DATOS */
      this.httpServ.consulta(endpoint, jsonData, true).subscribe(
        (response: any) => {
          resolve(response.urlshort);
        },
        (error: any) => {
          console.error('Error al acortar la URL:', error);
          reject(error);
        }
      );
    });
  }

  async shortenLinkCelfio(urlToShorten: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const arrData = {
        longUrl: urlToShorten,
        app: this.COMPANY_NAME
      };
      let jsonData = JSON.stringify(arrData); // se crea el json
      let endpoint = 'https://api.celucenter.com/get/shorturl/g'; // se agrega el endpoint

      /* ESTRUCTURA PARA EL ENVIO DE DATOS */
      this.httpServ.consulta(endpoint, jsonData, true).subscribe(
        (response: any) => {
          resolve(response.urlshort);
        },
        (error: any) => {
          console.error('Error al acortar la URL:', error);
          reject(error);
        }
      );
    });
  }

  validations = (object: any) => {
    try {
      return this.hasNullOrUndefinedOrEmptyStrings(object);
    } catch (err) {
      return err;
    }
  };

  isNullOrUndefinedOrEmptyString(value: any) {
    return (
      value == null ||
      value == undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      value == 'null' ||
      value == 'undefined' ||
      value == 'null null'
    );
  }

  hasNullOrUndefinedOrEmptyStrings(obj: any): any {
    let data;
    let i: number = 0;
    let keys: any[] = [];
    let flagInpEmpty: boolean = false;

    for (const key in obj) {
      if (
        obj.hasOwnProperty(key) &&
        obj[key] !== null &&
        obj[key] !== undefined
      ) {
        if (typeof obj[key] === 'object') {
          const subResult = this.hasNullOrUndefinedOrEmptyStrings(obj[key]);
          if (subResult !== true) {
            return (data = { hasErr: subResult, msg: 'Sin problemas' });
          }
        } else if (this.isNullOrUndefinedOrEmptyString(obj[key])) {
          flagInpEmpty = true;
          keys[i] = `${key}`;
          console.error(
            'Oops',
            `el parametro ${key} no puede estar vacío ni ser null`
          );
          i++;
        }
      } else {
        flagInpEmpty = true;
        console.error(
          'Oops',
          `el parametro ${key} no puede ser null o undefined`
        );
        keys[i] = `${key}`;
        i++;
      }
    }
    if (!flagInpEmpty) return (data = { hasErr: false, msg: 'Sin problemas' });
    else {
      if (i == 1)
        return (data = {
          hasErr: true,
          msg: `El valor: ${keys[0]} necesita ser definido.`,
          inp: keys,
        });
      else
        return (data = {
          hasErr: true,
          msg: `Debe llenar todos los campos.`,
          inp: keys,
        });
    }
  }

  abrCountry(country: string) {
    let pais: string = '';
    if (country) {
      switch (country) {
        case 'MEXICO':
          pais = 'MX';
          break;
        case 'GUATEMALA':
          pais = 'GTM';
          break;
        case 'VENEZUELA':
          pais = 'VZLA';
          break;
      }
    }
    return pais;
  }

  userIsAdmin() {
    let proName = this.readLocalStorage('user_proName');
    if (proName === 'Administrador' || proName === 'Administrator') {
      return true;
    } else {
      return false;
    }
  }

  loaderStart() {
    this.spinner.show();
  }

  loaderStop() {
    this.spinner.hide();
  }

  /**Funcion consulta */
  httpR(url: string, data: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const unsubscribe = new Subject();

      this.httpServ
        .consulta(url, data, true)
        .pipe(takeUntil(unsubscribe))
        .subscribe(
          (response: any) => {
            // Puedes realizar alguna lógica adicional aquí antes de resolver la promesa si es necesario
            resolve(response);
          },
          (error: any) => {
            // El error ya ha sido manejado en httpServ, puedes manejarlo de forma específica aquí si es necesario
            this.alert.error('Server', error.message);
            console.error('Error en la suscripción:', error);
            reject(error);
          } /*,
          () => {
            // Complete handler, se llama cuando la suscripción se completa (puede ser útil según tu lógica)
            unsubscribe.complete();
          }*/
        );

      // // Agrega la suscripción a ngUnsubscribe para que se desuscriba correctamente si el componente se destruye
      // this.ngUnsubscribe.pipe(takeUntil(unsubscribe)).subscribe(() => {
      //   unsubscribe.next();
      //   unsubscribe.complete();
      // });
    });
  }

  //obtener url base64
  async urlToBase64(url: string) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error al convertir la URL en base64:', error);
      throw error;
    }
  }

  varVacia(valor: any): boolean {
    // Este metodo devuelve true si el valor es nulo, indefinido, una cadena vacía o solo contiene espacios en blanco; de lo contrario, devuelve false.
    return (
      valor === null ||
      valor === undefined ||
      valor === '' ||
      valor === 'undefined' ||
      valor === 'null' ||
      /^\s*$/.test(valor)
    );
  }

  abrirModal(id: string) {
    $(`#${id}`).modal('show');
  }

  cerrarModal(id: string) {
    $(`#${id}`).modal('hide');
  } 

  //funcion para manejar los errores por defecto de la lambda
  errorType(response: any, peticion?: string) {
    if (response.errorType) {
      this.alert.error('Ups!', 'Servicio: ' + response.errorMessage);
      console.log(`Peticion: ${peticion}`, response);
      return true;
    }
    return false;
  }
}
