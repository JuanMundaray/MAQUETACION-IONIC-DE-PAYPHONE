import { Component, OnInit,Input } from '@angular/core';
import { HttpServiceService } from 'src/app/services/httpServices/http-service.service';
import { AlertMessageService } from 'src/app/services/alert/alert-message.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-delete-session-user',
  templateUrl: './delete-session-user.component.html',
  styleUrls: ['./delete-session-user.component.scss'],
  standalone:false
})
export class DeleteSessionUserComponent  implements OnInit {
  @Input() perwrite: boolean = true;
  @Input() perread: boolean = true;
  @Input() peradm: boolean = true;
  private urlEndPoint!: string;
  private jsonData: any = [];
  public dataResponse: any = [];
  public urlapicf: string = environment.url_api_cf;

  constructor(
    private httpServ: HttpServiceService,
    private mensaje: AlertMessageService,
    private spinner: SpinnerService,
    private func: FunctionsService,
    public router: Router
  ) {}

  ngOnInit(): void {

    let session: any;
    try {
      session = this.func.readLocalStorage('login');
    } catch (error) {
      this.func.addLocalStorage('off', 'login');
    }

    if (session == 'off') this.router.navigateByUrl('login');
    else{
      this.spinner.show(); //inicio de la animacion, va al inicio del metodo
      this.urlEndPoint = this.urlapicf + '/get/users/session'; //se agrega el endpoint

      this.httpServ
        .consulta(this.urlEndPoint, this.jsonData, true)
        .subscribe((response: any) => {
          this.spinner.hide(); //fin de la animacion, va al terminar el proceso

          if (response.ok) {

            this.dataResponse = response.users_session;
            //console.log("🚀 ~ file: delete-session-user.component.ts:51 ~ DeleteSessionUserComponent ~ .subscribe ~ dataResponse:", this.dataResponse)

          } else {
            //en caso de haber un error
            this.mensaje.error('Oops', response.errorMessage); //alert que aparece en la esquina superior derecha
          }
        });
    }
  }

  endSession(id: any, idUser: any, user: any) {
    // console.log('endsession =====> ',id+" "+idUser+"  "+user );

    var idEnc: any;
    this.spinner.show(); //inicio de la animacion, va al inicio del metodo
    idEnc = this.func.crypt(idUser, 'logout');
    const arrData = {
      type: 'logout', //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
      userid: idEnc, //el valor debe ir encriptado
    };
    this.jsonData = JSON.stringify(arrData); //se crea el json
    this.urlEndPoint = this.urlapicf + '/auth/logoutcf'; //se agrega el endpoint

    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((response: any) => {
        this.spinner.hide(); //fin de la animacion, va al terminar el proceso
        if (response === 'se cerro la sesion correctamente') {
          $('#row' + id).remove();
          this.mensaje.success(
            '¡Exito!',
            'La session del usuario ' + user + ' fué cerrada correctamente.'
          );
        } else {
          //en caso de haber un error
          this.mensaje.error('Oops', response.errorMessage); //alert que aparece en la esquina superior derecha
        }
        // console.log(response);
      });
  }

}
