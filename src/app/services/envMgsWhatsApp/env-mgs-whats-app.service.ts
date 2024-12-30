import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertMessageService } from 'src/app/services/alert/alert-message.service';
import { HttpServiceService } from 'src/app/services/httpServices/http-service.service';

@Injectable({
  providedIn: 'root',
})
export class EnvMgsWhatsAppService {
  private urlapicel: string = environment.url_api_cel;

  constructor(
    private mensaje: AlertMessageService,
    private httpServ: HttpServiceService
  ) {}

  envMensaje(
    number: any,
    msg: any,
    urlPdf: string = '',
    id: string = 'VB6714475'
  ): boolean {
    const arrDat = {
      number: number,
      groupid: '',
      message: msg,
      token: '',
      application: '',
      globalmedia: urlPdf,
      groupmention: '',
      templateid: id,
    };

    var jsonData = JSON.stringify(arrDat);
    var urlEndPoint = this.urlapicel + '/sendMessage/whatsapp';

    this.httpServ
      .consulta(urlEndPoint, jsonData, true)
      .subscribe((response: any) => {
        if (response.ok) {
          return true;
        } else {
          this.mensaje.error('Oops', response.errorMessage);
          return false;
        }
      });
    return false;
  }
}
