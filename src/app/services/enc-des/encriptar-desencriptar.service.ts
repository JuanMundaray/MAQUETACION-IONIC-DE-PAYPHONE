import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncriptarDesencriptarService {
  constructor() {}

  atRL(param: any, rl: any) {
    var aux_rl = Dll(rl);
    var M = 0,
      N = 0;
    var VE = 0;
    var TE = '';
    for (M = 0; M < param.length; M = M + 1) {
      N = M + 1;
      VE = param.substring(M, N).charCodeAt(0) + aux_rl;
      TE = TE + String.fromCharCode(VE);
    }
    return TE;
  }

  gtRl(param: any, rl: any) {
    var auxRl = Dll(rl);
    var M = 0,
      N = 0;
    var VE = 0;
    var TD = '';
    for (M = 0; M < param.length; M = M + 1) {
      N = M + 1;
      VE = param.substring(M, N).charCodeAt(0) - auxRl;
      TD = TD + String.fromCharCode(VE);
    }

    return TD;
  }

  replace_specials_characters(str: string) {
    if (str) {
      str = str.replace(/á|à|â|ã|ª/g, 'a');
      str = str.replace(/Á|À|Â|Ã/g, 'A');
      str = str.replace(/é|è|ê/g, 'e');
      str = str.replace(/É|È|Ê/g, 'E');
      str = str.replace(/í|ì|î/g, 'i');
      str = str.replace(/Í|Ì|Î/g, 'I');
      str = str.replace(/ó|ò|ô|õ|º/g, 'o');
      str = str.replace(/Ó|Ò|Ô|Õ/g, 'O');
      str = str.replace(/ú|ù|û/g, 'u');
      str = str.replace(/Ú|Ù|Û/g, 'U');

      str = str.replace(/ñ/g, 'n');
      str = str.replace(/Ñ/g, 'N');

      return str.replace(/[^0-9a-zA-Z ,@_.\[\{\-:\}\]\"\'\/=]/g, '').trim();
    } else {
      return str.trim();
    }
  }
}

function Dll(str: any) {
  var M;
  var N;
  var valorSub;
  var vTemp = 0;
  var ll = 0;
  if (str == '') {
    ll = 0;
  } else {
    for (M = 0; M < str.length; M = M + 1) {
      N = M + 1;
      valorSub = str.substring(M, N);
      vTemp = valorSub.charCodeAt(0);
      ll = ll + vTemp;
    }
  }
  return ll;
}