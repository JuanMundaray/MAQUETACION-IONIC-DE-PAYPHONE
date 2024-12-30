import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert/alert-message.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { environment } from 'src/environments/environment';
import { HttpServiceService } from 'src/app/services/httpServices/http-service.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { IonicModule } from '@ionic/angular';
declare var $: any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  standalone:false
})
export class RolesComponent  implements OnInit {
  perwrite: boolean = true;
  perread: boolean = true;
  peradm: boolean = true;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  allRol: any = [];
  public fpdel = "";
  public fpnam = "";
  public epnam = "";
  public oldnamep = "";
  public oldaccessp = "";
  public fpupd = "";
  public urlapicf: string = environment.url_api_cf;
  private jsonData: any;
  private urlEndPoint!: string;
  public proname!:string;
  public com_id!:string;
  public user_id!: string;
  public showAddModal = false;
  public showEditModal = false;
  public showDeleteModal = false;

  constructor(
    private mensaje: AlertMessageService,
    private spinner: SpinnerService,
    public func: FunctionsService,
    private httpServ: HttpServiceService,
  ) { }

  ngOnInit(): void {

    this.proname = this.func.readLocalStorage('user_proName');
    this.com_id = this.func.readLocalStorage('data_userCompaniaid');
    this.user_id = this.func.readLocalStorage('user_id');


    if (this.perread) { // validar que tenga acceso de lectura
      this.initTable();
      this.spinner.show(); //inicio de la animacion, va al inicio del metodo

      //aqui va un request para los roles
      try {


        if (this.perread ) {
          this.initTable(); //iniciar los parametros para la tabla settings
          this.spinner.show(); //inicio de la animacion, va al inicio del metodo
          this.updateDATA();
        }

      } catch (e) {
        this.allRol = [];
        //en caso de haber un error
        this.dtTrigger.next(0);
        this.mensaje.error('Oops', 'No hay registro');
      }
    }
  }

  initTable() {

    var btnS: any = [];

    if (this.perwrite) {
      btnS = [
        {
          extend: 'csv',
          text: '<img src="../../../../assets/images/logos/excel.png" alt="">',
          titleAttr: 'Excel',
        },
        {
          extend: 'pdfHtml5',
          text: '<img src="../../../../assets/images/logos/pdf.png" alt="">',
          titleAttr: 'PDF',
        }

      ]
    }

    //=============== aqui se puede agregar para descargar la tabla ====== VER DOCUMENTACION
    this.dtOptions = {
      // Declare the use of the extension in the dom parameter
      dom: "Bfrtlip",
      buttons:btnS,
      destroy: true,
      language: {
        "decimal": "",
        "emptyTable": "No hay información",
        "info": "Total _TOTAL_ ",
        "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
        "infoFiltered": "(Filtrado de _MAX_ total entradas)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Mostrar <select class='badge bg-secondary m-2'>" +
          "<option class='fw-bold' value='10'>10</option>" +
          "<option class='fw-bold' value='30'>30</option>" +
          "<option class='fw-bold' value='50'>50</option>" +
          "<option class='fw-bold' value='100'>100</option>" +
          "<option class='fw-bold' value='1000'>1000</option>" +
          "</select> Resultados",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "search": "🔎",
        "zeroRecords": "Sin resultados encontrados",
        "paginate": {
          "first": "Primero",
          "last": "Ultimo",
          "next": "Siguiente",
          "previous": "Anterior"
        }
      }
    };

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  addRol() {
    //$('#mdladdRol').modal('show');
    this.showAddModal = false;
  }

  requestAdd() {

    var rname = $('#inpAddNombreR').val();
    var raccess = $('#inpAddAccesoR').val();

    if (!rname) {
      this.mensaje.error('Oops', "Ingresa correctamente el nombre");
    } else if (!raccess) {
      this.mensaje.error('Oops', "Ingresa correctamente el acceso");
    } else {

      this.spinner.show(); //inicio de la animacion, va al inicio del metodo
      var type = 'saverol';
      var fpname = this.func.crypt(rname, type);
      var fpaccess = this.func.crypt(raccess, type);
      var fglobal = this.func.crypt("1", type);
      var uid = this.func.crypt(this.user_id, type);
      var fcompid = this.func.crypt(this.com_id, type);

      const arrData = {
        type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
        use_uid: uid,
        rol_name: fpname,
        rol_access: fpaccess,
        rol_apply: fglobal,
        rol_com_id: fcompid,
      };
      this.jsonData = JSON.stringify(arrData); //se crea el json
      this.urlEndPoint = this.urlapicf + '/create/adm/config/roles';

      /* ESTRUCTURA PARA EL ENVIO DE DATOS */
      this.httpServ
        .consulta(this.urlEndPoint, this.jsonData, true)
        .subscribe((data: any) => {

          this.spinner.hide(); //fin de la animacion, va al terminar el proceso
          if (data.ok == true) {
            $('#mdladdRol').modal('hide');
            this.mensaje.success('Exito', data.response);
            this.updateDATA();
          } else {
            this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
          }
        });

    }

  }

  editperm(id: any, activo: any, name: any, acceso: any) {
    this.fpupd = id;
    this.epnam = name;
    this.oldnamep = name;
    this.oldaccessp = acceso;

    this.showEditModal = true;
    //$('#mdlEditRol').modal('show');
  }
  closeEditModal() {
    this.showEditModal = false;
  }

  requestUpdate(id: any) {


    var rename = $('#inpEdNombreR').val();
    var reaccess = $('#inpEdAccesoR').val();

    if (!rename) {
      this.mensaje.error('Oops', "Ingresa correctamente el nombre");this.closeEditModal();
    } else if (!reaccess) {
      this.mensaje.error('Oops', "Ingresa correctamente el acceso");
    } else {

    this.spinner.show(); //inicio de la animacion, va al inicio del metodo
    var type = 'updaterol';
    var reid = this.func.crypt(id , type);
    var fpname = this.func.crypt(rename, type);
    var fpaccess = this.func.crypt(reaccess, type);
    var fcompid = this.func.crypt(this.com_id, type);

    const arrData = {
      type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
      rol_id: reid,
      rol_name: fpname,
      rol_access: fpaccess,
      rol_com_id: fcompid,
    };
    this.jsonData = JSON.stringify(arrData); //se crea el json
    this.urlEndPoint = this.urlapicf + '/update/roles';

    /* ESTRUCTURA PARA EL ENVIO DE DATOS */
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((data: any) => {
        $('#mdlEditRol').modal('hide');
        this.spinner.hide(); //fin de la animacion, va al terminar el proceso
        if (data.ok == true) {
          this.mensaje.success('Exito', data.response);
          this.updateDATA();
        } else {
          if (data.ok == false) {
            this.mensaje.error('Oops', data.response); //alert que aparece en la esquina superior derecha
          }else{
            this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
          }

        }
      });
    }

  }

  deleteperm(id: any, nam: any) {
    this.fpdel = id;
    this.fpnam = nam;
    this.showDeleteModal = true;
    //$('#mdlBorrRol').modal('show');

  }
  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  requestDelete(id: any) {


        this.spinner.show(); //inicio de la animacion, va al inicio del metodo
        var type = 'deleterol';
        var pid = this.func.crypt(id, type);

        const arrData = {
          type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
          rol_id: pid
        };
        this.jsonData = JSON.stringify(arrData); //se crea el json
        this.urlEndPoint = this.urlapicf + '/delete/adm/config/roles';

        /* ESTRUCTURA PARA EL ENVIO DE DATOS */
        this.httpServ
          .consulta(this.urlEndPoint, this.jsonData, true)
          .subscribe((data: any) => {
            $('#mdlBorrRol').modal('hide');
            this.spinner.hide(); //fin de la animacion, va al terminar el proceso
            if (data.ok == true) {
              this.mensaje.success('Exito', data.response);
              this.updateDATA();
            } else {

              this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha

            }
          });

  }


  updateDATA(){
    var type = 'getrols';
    var rap:string;
    if( this.proname=='Administrator'){
       rap = this.func.crypt('1', type); // 1 para poder ver todos
    }else{
       rap = this.func.crypt('0', type); // 0 para poder ver por compañia
    }

    var rci = this.func.crypt(this.com_id, type);

    const arrData = {
      type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
      rol_com_id: rci, //el valor debe ir encriptado
      rol_apply: rap, //el valor debe ir encriptado
    };

    this.jsonData = JSON.stringify(arrData); //se crea el json
    this.urlEndPoint = this.urlapicf + '/get/allroles';

    /* ESTRUCTURA PARA EL ENVIO DE DATOS */
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((data: any) => {
        //// console.log("🚀 ~ file: reporte-ventas.component.ts:126 ~ ReporteVentasComponent ~ .subscribe ~ data", data)
        $('#tabrol').DataTable().destroy(); //reiniciamos las tabla
        this.spinner.hide(); //fin de la animacion, va al terminar el proceso
        if (data.ok == true) {
          var data2 = JSON.parse(this.func.decrypt(data.response, type));
          if (data2.length > 0) {

            var uniqueRoles = data2.filter((role:any, index:any, self:any) => {
              return index === self.findIndex((r:any) => r.ROL_ID === role.ROL_ID);
            });

            this.allRol =uniqueRoles;
           // console.log("🚀 ~ file: roles.component.ts:93 ~ RolesComponent ~ .subscribe ~ allRol:", this.allRol)
            // initiate our data table
            this.dtTrigger.next(0); //iniciamos los componentes
          } else {
            this.allRol = [];
            //en caso de haber un error
            this.dtTrigger.next(0);
            this.mensaje.error('Oops', data.response);
          }

        } else {

          if (data.ok == false) {
            this.allRol = [];
            //en caso de haber un error
            this.dtTrigger.next(0);
            this.mensaje.error('Oops', data.response);
          }else{
            this.allRol = [];
            //en caso de haber un error
            this.dtTrigger.next(0);
            //en caso de haber un error
            this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
          }

        }
      });

  }

  // Abrir modal para agregar rol
  closeAddModal() {
    this.showAddModal = false;
  }

}
