import { Injectable } from '@angular/core';
import { FunctionsService } from '../functions/functions.service';

@Injectable({
  providedIn: 'root'
})
export class TestUsersService {
  userPhone = this.func.readLocalStorage('user_phone')
  incodeReq: boolean = true;
  isTest: boolean = false;
  isCapacitacion: boolean = false;
  imeisTest : Array<string> = ['0123456789ABCDX','866184061173329','868378062216008']
  constructor(private func: FunctionsService) {
    this.userPhone = this.func.readLocalStorage('user_phone')
  }


  setup() {
   if (this.userPhone == '5210102030405') {
    this.isTest = true
   } else if (this.userPhone == '5211234567899') {
    this.isCapacitacion = true
   } else {
    this.isTest = false
    this.isCapacitacion = false
    return
   }
  }

  setTestingData() {
    this.func.addLocalStorage('Nombre', 'name');
    this.func.addLocalStorage('Apellido', 'firstname');
    this.func.addLocalStorage('Segundo Apellido', 'lastname');
    this.func.addLocalStorage('Dirección Prueba', 'address');
    this.func.addLocalStorage('0000000000000000001', 'curp');
    this.func.addLocalStorage('01-01-1900', 'dateofbirth');
    this.func.addLocalStorage('s/d', 'gender');
    this.func.addLocalStorage('Dirección Prueba','splitAddress');
    this.func.addLocalStorage('Calle Prueba','street');
    this.func.addLocalStorage('Colonia Prueba','colony');
    this.func.addLocalStorage('0000','postalCode');
    this.func.addLocalStorage('Ciudad Prueba','city');
    this.func.addLocalStorage( 'Estado Prueba','state');
    this.func.addLocalStorage('9999-9998','quote_id')
    this.func.addLocalStorage('test.url','client_url_img_frontal' );
    this.func.addLocalStorage( 'test.url','client_url_img_trasero' );
    this.func.addLocalStorage('test.url', 'client_url_img_selfie');
    this.func.addLocalStorage('test.url','client_url_img_signature');
    this.func.addLocalStorage('30', 'client_age');
    this.func.addLocalStorage('00','flow_id')
    this.func.addLocalStorage('test_incode_id','incode_id')
    this.func.addLocalStorage('on', 'login');
    this.func.addLocalStorage('devcf','cuentaActiva')
  }

  setTestingScore() {
    this.func.addLocalStorage('550', 'score');
  }
}
