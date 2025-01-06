import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert/alert-message.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { environment } from 'src/environments/environment';
import { HttpServiceService } from 'src/app/services/httpServices/http-service.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
  standalone:false
})
export class CountriesComponent  implements OnInit {
    @Input() perwrite: boolean = true;
    @Input() perread: boolean = true;
    @Input() peradm: boolean = true;
  
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject<any>();
    allPais: any = [];
    public fpdel = "";
    public fpnam = "";
    public epnam = "";
    public oldnamep = "";
    public oldabrep = "";
    public fpupd = "";
    public urlapicf: string = environment.url_api_cf;
    private jsonData: any;
    private urlEndPoint!: string;
    public isActiveConfigGlobal: boolean = true;
    public proname!: string;
    public user_id!: string;
  
    public showAddPaisModal = false;
    public showEditarPaisModal = false;
    public showDeletePaisModal = false;
  
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
        this.allPais = [];
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
  
    addPais() {
      this.isActiveConfigGlobal = true;
      this.showAddPaisModal = true;
      //$('#mdlAddPais').modal('show');
    }
    closeAddPaisModal(){
      this.showAddPaisModal = false;
    }
  
    requestAdd() {
      //obtener quien lo hizo user id de local
      var pname = $('#inpAddNombreP').val();
      var pabre = $('#inpAddAbreP').val();
  
  
      if (!pname) {
        this.mensaje.error('Oops', "Ingresa correctamente el nombre");
      } 
      
      else if (!pabre) {
        this.mensaje.error('Oops', "Ingresa correctamente el acceso");
      } 
      
      else {
        this.spinner.show(); //inicio de la animacion, va al inicio del metodo
        var type = 'savePais';
        var fpname = this.func.crypt(pname, type);
        var fpabre = this.func.crypt(pabre, type);
        var uid = this.func.crypt(this.user_id, type);
  
        const arrData = {
          type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
          use_uid: uid,
          con_name: fpname,
          con_abbr: fpabre,
        
        };
        
        this.jsonData = JSON.stringify(arrData); //se crea el json
        this.urlEndPoint = this.urlapicf + '/save/config/cf/countries';
  
        /* ESTRUCTURA PARA EL ENVIO DE DATOS */
        this.httpServ
          .consulta(this.urlEndPoint, this.jsonData, true)
          .subscribe((data: any) => {
            //$('#mdlAddPais').modal('hide');
            this.showAddPaisModal = true;
            this.spinner.hide(); //fin de la animacion, va al terminar el proceso
            if (data.ok == true) {
              this.mensaje.success('Exito', data.response);
              this.updateDATA();
            } else {
              this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
            }
          });
  
      }
      //request para agregar el pais
    }
  
    editPais(id: any, name: any, abre: any) {
      this.fpupd = id;
      this.epnam = name;
      this.oldnamep = name;
      this.oldabrep = abre;
  
      //$('#mdlEditPais').modal('show');
      this.showEditarPaisModal = true;
    }

    closeEditarPaisModal(){
      this.showEditarPaisModal = false;
    }
  
  
    requestUpdate(id: any) {
      //obtener quien lo hizo user id de local
      var pname = $('#inpEdNombreP').val();
      var pabre = $('#inpEdabreP').val();
      if (!pname) {
        this.mensaje.error('Oops', "Ingresa correctamente el nombre");
      } else if (!pabre) {
        this.mensaje.error('Oops', "Ingresa correctamente la abreviatura");
      } else {
  
        this.spinner.show(); //inicio de la animacion, va al inicio del metodo
        var type = 'updatePais';
        var fpname = this.func.crypt(pname, type);
        var fpabre = this.func.crypt(pabre, type);
        var pid = this.func.crypt(id, type);
  
        const arrData = {
          type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
          cou_id: pid,
          cou_name: fpname,
          cou_abre: fpabre
        };
        this.jsonData = JSON.stringify(arrData); //se crea el json
        this.urlEndPoint = this.urlapicf + '/update/config/cf/countries';
  
        /* ESTRUCTURA PARA EL ENVIO DE DATOS */
        this.httpServ
          .consulta(this.urlEndPoint, this.jsonData, true)
          .subscribe((data: any) => {
            //$('#mdlEditPais').modal('hide');
            this.showEditarPaisModal = true;
            this.spinner.hide(); //fin de la animacion, va al terminar el proceso
            if (data.ok == true) {
              this.mensaje.success('Exito', data.response);
              this.updateDATA();
            } else {
              if (data.ok == false) {
                this.mensaje.error('Oops', data.response); //alert que aparece en la esquina superior derecha
              } else {
                this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
              }
  
            }
          });
      }
  
    }
  
  
    updateDATA() {
      var type = 'getPaises';
      var tipo = this.func.crypt('0', type); // 0 para poder ver todos
  
      const arrData = {
        type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
        sadm: tipo, //el valor debe ir encriptado
      };
      this.jsonData = JSON.stringify(arrData); //se crea el json
      this.urlEndPoint = this.urlapicf + '/get/config/cf/countries';
  
      /* ESTRUCTURA PARA EL ENVIO DE DATOS */
      this.httpServ
        .consulta(this.urlEndPoint, this.jsonData, true)
        .subscribe((data: any) => {
          //console.log("🚀 ~ file: countries.component.ts:69 ~ CountriesComponent ~ .subscribe ~ data:", data)
          //// console.log("🚀 ~ file: reporte-ventas.component.ts:126 ~ ReporteVentasComponent ~ .subscribe ~ data", data)
          //$('#tabcou').DataTable().destroy(); //reiniciamos las tabla
          this.spinner.hide(); //fin de la animacion, va al terminar el proceso
          if (data.ok == true) {
            var data2 = JSON.parse(this.func.decrypt(data.response, type));
            if (data2.length > 0) {
              //console.log("🚀 ~ file: countries.component.ts:75 ~ CountriesComponent ~ .subscribe ~ data2:", data2)
  
              this.allPais = data2; //ngresamos la data
              // initiate our data table
              this.dtTrigger.next(0); //iniciamos los componentes
            } else {
              this.allPais = [];
              //en caso de haber un error
              this.dtTrigger.next(0);
              this.mensaje.error('Oops', data.response);
            }
  
          } else {
            this.allPais = [];
            //en caso de haber un error
            this.dtTrigger.next(0);
            //en caso de haber un error
            this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
          }
        });
  
  
    }
  
    deletePais(id: any, nam: any) {
      this.fpdel = id;
      this.fpnam = nam;
      //$('#mdlBorrPais').modal('show');
      this.showDeletePaisModal = true;
  
    }

    closeDeletePaisModal(){
      this.showEditarPaisModal = false;
    }
  
    requestDelete(id: any) {
  
      //request para borrar el pais
      this.spinner.show(); //inicio de la animacion, va al inicio del metodo
      var type = 'deletePais';
      var pid = this.func.crypt(id, type);
  
      const arrData = {
        type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
        cou_id: pid
      };
      this.jsonData = JSON.stringify(arrData); //se crea el json
      this.urlEndPoint = this.urlapicf + '/delete/config/cf/countries';
  
      /* ESTRUCTURA PARA EL ENVIO DE DATOS */
      this.httpServ
        .consulta(this.urlEndPoint, this.jsonData, true)
        .subscribe((data: any) => {
          this.showDeletePaisModal = false;
          //$('#mdlBorrPais').modal('hide');
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
  
  
}
