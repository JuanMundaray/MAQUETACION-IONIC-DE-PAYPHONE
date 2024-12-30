import { Injectable } from '@angular/core';

declare var $: any;
declare var jQuery: any;

@Injectable({
  providedIn: 'root',
})
export class EyeService {
  constructor() {}

  cambioEye(nro: string, id: string) {
    if ($('#eye' + nro).hasClass('bi-eye-slash')) {
      //muestra caracteres
      $('#eye' + nro).removeClass('bi-eye-slash');
      $('#eye' + nro).addClass('bi-eye');
      $('#' + id).get(0).type = 'text';
    } else {
      $('#eye' + nro).removeClass('bi-eye');
      $('#eye' + nro).addClass('bi-eye-slash');
      $('#' + id).get(0).type = 'password';
    }
  }
}
