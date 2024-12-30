import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert/alert-message.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { environment } from 'src/environments/environment';
import { HttpServiceService } from 'src/app/services/httpServices/http-service.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss'],
  standalone:false
})
export class PermisosComponent  implements OnInit {
  perwrite: boolean = true;
  perread: boolean= true;
  peradm: boolean=true;


  // Variables para manejar los modales
  isAddModalOpen = false;
  isEditModalOpen = false;

  newPermission = {
    name: '',
    access:''
  };

  editPermission = {
    name: '',
    access:'',
    isActiveGlobal:''
  };


  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  allPerm: any = [];
  public fpdel = "";
  public fpnam = "";
  public epnam = "";
  public oldnamep = "";
  public oldaccessp = "";
  public fpupd = "";
  public urlapicf: string = environment.url_api_cf;
  private jsonData: any;
  private urlEndPoint!: string;
  public isActiveConfigGlobal: boolean = true;
  public proname!: string;
  public user_id!: string;



  constructor(
    private mensaje: AlertMessageService,
    private spinner: SpinnerService,
    public func: FunctionsService,
    private httpServ: HttpServiceService,
  ) { }

  ngOnInit(): void {

    this.proname = this.func.readLocalStorage('user_proName');
    this.user_id = this.func.readLocalStorage('user_id');

    try {
      if (this.perread && this.proname == 'Administrator') {
        this.initTable(); //iniciar los parametros para la tabla settings
        this.spinner.show(); //inicio de la animacion, va al inicio del metodo
        this.updateDATA();
      }

    } catch (e) {
      this.allPerm = [];
      //en caso de haber un error
      this.dtTrigger.next(0);
      this.mensaje.error('Oops', 'No hay registro');
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
      // Declare the use of the extension in the dom parameter Bfrtlip
      dom: "Bfrtlip",
      buttons: btnS,
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

  addPerm() {
    this.isActiveConfigGlobal = true;
    this.isAddModalOpen = true;
    //$('#mdlAddPerm').modal('show');
  }

  requestAdd() {
    //obtener quien lo hizo user id de local
    var pname = $('#inpAddNombreP').val();
    var paccess = $('#inpAddAccesoP').val();
   // console.log("🚀 ~ file: permisos.component.ts:184 ~ PermisosComponent ~ requestUpdate ~ isActiveConfigGlobal:", this.isActiveConfigGlobal)

    if (!pname) {
      this.mensaje.error('Oops', "Ingresa correctamente el nombre");
    } else if (!paccess) {
      this.mensaje.error('Oops', "Ingresa correctamente el acceso");
    } else {

      this.spinner.show(); //inicio de la animacion, va al inicio del metodo
      var type = 'saveperm';
      var fpname = this.func.crypt(pname, type);
      var fpaccess = this.func.crypt(paccess, type);
      var fglobal = this.func.crypt(this.isActiveConfigGlobal, type);
      var uid = this.func.crypt(this.user_id, type);

      const arrData = {
        type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
        use_uid: uid,
        per_name: fpname,
        per_access: fpaccess,
        per_apply: fglobal,
      };
      this.jsonData = JSON.stringify(arrData); //se crea el json
      this.urlEndPoint = this.urlapicf + '/create/adm/config/permission';

      /* ESTRUCTURA PARA EL ENVIO DE DATOS */
      this.httpServ
        .consulta(this.urlEndPoint, this.jsonData, true)
        .subscribe((data: any) => {

          this.spinner.hide(); //fin de la animacion, va al terminar el proceso
          if (data.ok == true) {
            this.mensaje.success('Exito', data.response);
            this.updateDATA();
          } else {
            this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
          }
        });

    }
    //request para agregar el permiso
  }

  editperm(id: any, activo: any, name: any, acceso: any) {
    this.fpupd = id;
    this.epnam = name;
    this.oldnamep = name;
    this.oldaccessp = acceso;
    this.isActiveConfigGlobal = activo == 1 ? true : false;
    //console.log("🚀 ~ file: permisos.component.ts:67 ~ PermisosComponent ~ editperm ~ acceso:", acceso)
    //console.log("🚀 ~ file: permisos.component.ts:67 ~ PermisosComponent ~ editperm ~ name:", name)
    //console.log("🚀 ~ file: permisos.component.ts:67 ~ PermisosComponent ~ editperm ~ activo:", activo)

    this.isEditModalOpen = true;
  }


  requestUpdate(id: any) {
    //obtener quien lo hizo user id de local
    var pname = $('#inpEdNombreP').val();
    var paccess = $('#inpEdAccesoP').val();

    if (!pname) {
      this.mensaje.error('Oops', "Ingresa correctamente el nombre");
    } else if (!paccess) {
      this.mensaje.error('Oops', "Ingresa correctamente el acceso");
    } else {

    this.spinner.show(); //inicio de la animacion, va al inicio del metodo
    var type = 'updateperm';
    var fpname = this.func.crypt(pname, type);
    var fpaccess = this.func.crypt(paccess, type);
    var cfgb = this.isActiveConfigGlobal == true ? 1 : 0;
    var fglobal = this.func.crypt(cfgb, type);
    var pid = this.func.crypt(id, type);

    const arrData = {
      type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
      per_id: pid,
      per_name: fpname,
      per_access: fpaccess,
      per_apply: fglobal,
    };
    this.jsonData = JSON.stringify(arrData); //se crea el json
    this.urlEndPoint = this.urlapicf + '/update/Permissions';

    /* ESTRUCTURA PARA EL ENVIO DE DATOS */
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((data: any) => {
        //$('#mdlEditPerm').modal('hide');
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
    //$('#mdlBorrPerm').modal('show');

  }

  requestDelete(id: any) {

    //request para borrar el permiso
    this.spinner.show(); //inicio de la animacion, va al inicio del metodo
    var type = 'deleteperm';
    var pid = this.func.crypt(id, type);

    const arrData = {
      type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
      per_id: pid
    };
    this.jsonData = JSON.stringify(arrData); //se crea el json
    this.urlEndPoint = this.urlapicf + '/delete/adm/config/permission';

    /* ESTRUCTURA PARA EL ENVIO DE DATOS */
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((data: any) => {
        //$('#mdlBorrPerm').modal('hide');
        this.spinner.hide(); //fin de la animacion, va al terminar el proceso
        if (data.ok == true) {
          this.mensaje.success('Exito', data.response);
          this.updateDATA();
        } else {

          this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha

        }
      });

  }

  toggleActiveGlobal(isactive: any) {
    this.isActiveConfigGlobal = isactive;
  }

  updateDATA(){
    var type = 'getperm';
    var tipo = this.func.crypt('0', type); // 0 para poder ver todos

    const arrData = {
      type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
      per_apply: tipo, //el valor debe ir encriptado
    };
    this.jsonData = JSON.stringify(arrData); //se crea el json
    this.urlEndPoint = this.urlapicf + '/get/allpermissions';

    /* ESTRUCTURA PARA EL ENVIO DE DATOS */
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((data: any) => {
        //// console.log("🚀 ~ file: reporte-ventas.component.ts:126 ~ ReporteVentasComponent ~ .subscribe ~ data", data)
       // $('#tabper').DataTable().destroy(); //reiniciamos las tabla
        this.spinner.hide(); //fin de la animacion, va al terminar el proceso
        if (data.ok == true) {
          var data2 = JSON.parse(this.func.decrypt(data.response, type));
          if (data2.length > 0) {

            this.allPerm = data2; //ngresamos la data
            // initiate our data table
            this.dtTrigger.next(0); //iniciamos los componentes
          } else {
            this.allPerm = [];
            //en caso de haber un error
            this.dtTrigger.next(0);
            this.mensaje.error('Oops', data.response);
          }

        } else {
          this.allPerm = [];
          //en caso de haber un error
          this.dtTrigger.next(0);
          //en caso de haber un error
          this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
        }
      });


  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

}
