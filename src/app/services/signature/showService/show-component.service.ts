import { Injectable } from '@angular/core';

declare var $: any;
declare var jQuery: any;
declare var informacionCliente:boolean;

@Injectable({
  providedIn: 'root',
})

export class ShowComponentService {

  constructor() {}

  public avanzar(obj:any):any {
    $('#' + obj.idOculta).fadeOut(300);
    $('#' + obj.idOculta).css('display', 'none');
    $('#' + obj.idMuestra).fadeIn(500);
  }
}

