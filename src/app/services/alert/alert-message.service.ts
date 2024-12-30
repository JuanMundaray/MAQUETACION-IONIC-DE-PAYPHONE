import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const ToastII = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
});

@Injectable({
  providedIn: 'root',
})
export class AlertMessageService {
  constructor() {}

  success(tit: string, mens: string) {
    Toast.fire({
      icon: 'success',
      title: tit,
      text: mens,
    });
  }

  successHtml(tit: string, nombArch: string, imgPreview: any) {
    Toast.fire({
      icon: 'success',
      title: tit,
      html:
        '<div class="row"><div class="col p-0">' +
        '<img src="' +
        imgPreview +
        '" class="img-fluid rounded-2">' +
        '<p><strong>' +
        nombArch +
        ' se cargó correctamente</strong></p>' +
        '</div></div>',
    });
  }

  error(tit: string, mens: any) {
    Toast.fire({
      icon: 'error',
      title: tit,
      html: mens,
    });
  }

  warning(tit: string, mens: string) {
    Toast.fire({
      icon: 'warning',
      title: tit,
      text: mens,
    });
  }

  errorII(tit: string, mens: string) {
    Swal.fire({
      icon: 'error',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      showConfirmButton: false,
      title: tit,
      html: mens,
    });
  }

  alertSuccess(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
    });
  }

  alertWarning(
    title: string,
    messagge: string,
    nombIng: string,
    nombBd: string,
    porc: number
  ) {
    Swal.fire({
      title: title,
      icon: 'warning',
      width: '40em',
      html:
        '<h5>' +
        messagge +
        '</h5><hr>' +
        '<div class="row"><div class="col p-0">' +
        'Nombre Ingresado: <br><strong>' +
        nombIng +
        '</strong></div><div class="col p-0">' +
        'porcentaje: <br><strong>' +
        porc +
        '%' +
        '</strong></div></div>' +
        '<div class="row"><div class="col p-0">' +
        'Nombre registrado: <br><strong>' +
        nombBd +
        '</strong></div><div class="col p-0">' +
        'porcentaje: <br><strong>' +
        porc +
        '%' +
        '</strong></div></div><hr>',
      showCloseButton: true,
      focusConfirm: true,
      confirmButtonText: `
      <i class="bi bi-arrow-repeat"></i> Continuar...!`,
    });
  }
}
