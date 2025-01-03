import { Component, NgModule, OnInit,Input } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Subject } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert/alert-message.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { environment } from 'src/environments/environment';
import { HttpServiceService } from 'src/app/services/httpServices/http-service.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { InterpolationsService } from '../calculadora-enganches/interpolations.service';
declare var $: any;

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  standalone:false
})

export class CompaniesComponent  implements OnInit {
  @Input() perwrite!: boolean;
  @Input() perread!: boolean;
  @Input() peradm!: boolean;
  allPais: any = [];

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  allEmpresas: any = [];
  public fpdel = '';
  public fpnam = '';
  public epnam = '';
  public oldnamep = '';
  public oldabrep = '';
  public fpupd = '';
  public urlapicf: string = environment.url_api_cf;
  private jsonData: any;
  private urlEndPoint!: string;
  public isActiveConfigGlobal: boolean = true;
  public proname!: string;
  public user_id!: string;
  public cid!: string;
  public cnam!: string;
  public compID!: number;
  arrInterpolations: any;
  public isActiveSTX: any = true;
  
  public newEmpresaName!:string;
  public selectedCountry!:string;
  public editCompanyName!:string;
  public deleteCompanyName!:string;

  showEditEmpresasModal=false;
  showDeleteEmpresasModal=false;

  constructor(
    private mensaje: AlertMessageService,
    private spinner: SpinnerService,
    public func: FunctionsService,
    private httpServ: HttpServiceService,
    private intServ: InterpolationsService
  ) {}

  ngOnInit(): void {
    this.proname = this.func.readLocalStorage('user_proName');
    this.user_id = this.func.readLocalStorage('user_id');

    try {
      if (true || this.proname == 'Administrator') {
        this.initTable(); //iniciar los parametros para la tabla settings
        this.spinner.show(); //inicio de la animacion, va al inicio del metodo
        this.updateDATA();
      }
    } catch (e) {
      this.allEmpresas = [];
      //en caso de haber un error
      this.dtTrigger.next(0);
      this.mensaje.error('Oops', 'No hay registro');
    }
  }

  showAddModal = false;

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  saveEmpresa() {
    // Lógica para guardar la empresa
    this.closeAddModal();
  }


  initTable() {
    var btnS: any = [];

    if (true) {
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
        },
      ];
    }

    //=============== aqui se puede agregar para descargar la tabla ====== VER DOCUMENTACION
    this.dtOptions = {
      // Declare the use of the extension in the dom parameter Bfrtlip
      dom: 'Bfrtlip',
      buttons: btnS,
      destroy: true,
      language: {
        decimal: '',
        emptyTable: 'No hay información',
        info: 'Total _TOTAL_ ',
        infoEmpty: 'Mostrando 0 to 0 of 0 Entradas',
        infoFiltered: '(Filtrado de _MAX_ total entradas)',
        infoPostFix: '',
        thousands: ',',
        lengthMenu:
          "Mostrar <select class='badge bg-secondary m-2'>" +
          "<option class='fw-bold' value='10'>10</option>" +
          "<option class='fw-bold' value='30'>30</option>" +
          "<option class='fw-bold' value='50'>50</option>" +
          "<option class='fw-bold' value='100'>100</option>" +
          "<option class='fw-bold' value='1000'>1000</option>" +
          '</select> Resultados',
        loadingRecords: 'Cargando...',
        processing: 'Procesando...',
        search: '🔎',
        zeroRecords: 'Sin resultados encontrados',
        paginate: {
          first: 'Primero',
          last: 'Ultimo',
          next: 'Siguiente',
          previous: 'Anterior',
        },
      },
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  addEmpresas() {
    this.isActiveConfigGlobal = true;
    this.getCountries('');
    this.showAddModal=true;
  }

  requestAdd() {
    //obtener quien lo hizo user id de local
    var pname = $('#inpAddNombreP').val();
    var selectedCountry = $('#selCountry').val();
    //console.log("🚀 ~ file: companies.component.ts:140 ~ CompaniesComponent ~ requestAdd ~ selectedCountry:", selectedCountry)

    if (!pname) {
      this.mensaje.error('Oops', 'Ingresa correctamente el nombre');
    } else if (!selectedCountry) {
      this.mensaje.error('Oops', 'Ingresa correctamente el Pais');
    } else {
      this.spinner.show(); //inicio de la animacion, va al inicio del metodo
      var type = 'saveEmpresas';
      var fpname = this.func.crypt(pname, type);
      var fpabre = this.func.crypt(selectedCountry, type);
      var uid = this.func.crypt(this.user_id, type);

      const arrData = {
        type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
        use_uid: uid,
        com_name: fpname,
        com_contry: fpabre,
      };
      this.jsonData = JSON.stringify(arrData); //se crea el json
      this.urlEndPoint = this.urlapicf + '/save/config/cf/companies';

      /* ESTRUCTURA PARA EL ENVIO DE DATOS */
      this.httpServ
        .consulta(this.urlEndPoint, this.jsonData, true)
        .subscribe((data: any) => {
          $('#mdlAddEmpresas').modal('hide');
          this.spinner.hide(); //fin de la animacion, va al terminar el proceso
          if (data.ok == true) {
            this.mensaje.success('Exito', data.response);
            this.updateDATA();
          } else {
            this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
          }
        });
    }
    //request para agregar el Empresas
  }

  editEmpresas(id: any, name: any, cid: any, Cnam: any) {
    this.fpupd = id;
    this.epnam = name;
    this.oldnamep = name;
    this.cid = cid;
    this.getCountries(Cnam);
    this.showEditEmpresasModal=true;
    //$('#mdlEditEmpresas').modal('show');
  }

  closeEditEmpresasModal(){
    this.showEditEmpresasModal=false;
  }

  requestUpdate(id: any) {
    //obtener quien lo hizo user id de local
    var pname = $('#inpEdNombreP').val();
    var selectedCountry: any = this.cnam;
    // console.log("🚀 ~ file: companies.component.ts:197 ~ CompaniesComponent ~ requestUpdate ~ selectedCountry:",selectedCountry.COU_ID)

    if (!pname) {
      this.mensaje.error('Oops', 'Ingresa correctamente el nombre');
    } else if (!selectedCountry) {
      this.mensaje.error('Oops', 'Ingresa correctamente el Pais');
    } else {
      this.spinner.show(); //inicio de la animacion, va al inicio del metodo
      var type = 'updateEmpresas';
      var fpname = this.func.crypt(pname, type);
      var fpabre = this.func.crypt(selectedCountry.COU_ID, type);
      //console.log("🚀 ~ file: companies.component.ts:203 ~ CompaniesComponent ~ requestUpdate ~ fpabre:", fpabre)
      var cid = this.func.crypt(id, type);
      var uid = this.func.crypt(this.user_id, type);

      const arrData = {
        type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
        use_id: uid,
        com_id: cid,
        com_name: fpname,
        cou_id: fpabre,
      };
      this.jsonData = JSON.stringify(arrData); //se crea el json
      this.urlEndPoint = this.urlapicf + '/update/config/cf/companies';

      /* ESTRUCTURA PARA EL ENVIO DE DATOS */
      this.httpServ
        .consulta(this.urlEndPoint, this.jsonData, true)
        .subscribe((data: any) => {
          $('#mdlEditEmpresas').modal('hide');
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

  deleteEmpresas(id: any, nam: any) {
    this.fpdel = id;
    this.fpnam = nam;
    this.showDeleteEmpresasModal=true;
    //$('#mdlBorrEmpresas').modal('show');
  }
  closeDeleteEmpresasModal() {
    this.showDeleteEmpresasModal=false;
  }

  requestDelete(id: any) {
    //request para borrar el Empresas
    this.spinner.show(); //inicio de la animacion, va al inicio del metodo
    var type = 'deleteEmpresas';
    var pid = this.func.crypt(id, type);

    const arrData = {
      type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
      com_id: pid,
    };
    this.jsonData = JSON.stringify(arrData); //se crea el json
    this.urlEndPoint = this.urlapicf + '/delete/config/cf/companies';

    /* ESTRUCTURA PARA EL ENVIO DE DATOS */
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((data: any) => {
        $('#mdlBorrEmpresas').modal('hide');
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

  updateDATA() {
    var type = 'getEmpresas';
    var tipo = this.func.crypt('0', type); // 0 para poder ver todos

    const arrData = {
      type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
      sadm: tipo, //el valor debe ir encriptado
    };
    this.jsonData = JSON.stringify(arrData); //se crea el json
    this.urlEndPoint = this.urlapicf + '/get/config/cf/companies';

    /* ESTRUCTURA PARA EL ENVIO DE DATOS */
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((data: any) => {
        //console.log("🚀 ~ file: countries.component.ts:69 ~ CountriesComponent ~ .subscribe ~ data:", data)
        //// console.log("🚀 ~ file: reporte-ventas.component.ts:126 ~ ReporteVentasComponent ~ .subscribe ~ data", data)
        $('#tabcom').DataTable().destroy(); //reiniciamos las tabla
        this.spinner.hide(); //fin de la animacion, va al terminar el proceso
        if (data.ok == true) {
          var data2 = JSON.parse(this.func.decrypt(data.response, type));
          if (data2.length > 0) {
            this.allEmpresas = data2; //ngresamos la data
            // initiate our data table
            this.dtTrigger.next(0); //iniciamos los componentes
          } else {
            this.allEmpresas = [];
            //en caso de haber un error
            this.dtTrigger.next(0);
            this.mensaje.error('Oops', data.response);
          }
        } else {
          this.allEmpresas = [];
          //en caso de haber un error
          this.dtTrigger.next(0);
          //en caso de haber un error
          this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
        }
      });
  }

  getCountries(cnam: any) {
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
        if (data.ok == true) {
          var data2 = JSON.parse(this.func.decrypt(data.response, type));
          if (data2.length > 0) {
            this.allPais = data2; //ngresamos la data

            if (cnam) {
              //obtener el pais selccionado para el edit
              this.cnam = this.allPais.find(
                (country: { COU_NAME: string }) => country.COU_NAME === cnam
              );
            }
          } else {
            this.allPais = [];
            this.mensaje.error('Oops', data.response);
          }
        } else {
          this.allPais = [];
          this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
        }
      });
  }

  openCalculadora(
    user_type: number,
    user_id: any,
    sale_type: any,
    com_name: any
  ) {
    this.compID = user_id;
    this.intServ
      .getInterpolation(user_type, user_id, sale_type)
      .subscribe((data: any) => {
        if (data != null || data != undefined) {
          console.log(data);
          this.compID = user_id;
          if (data.response == 'Sin interpolación asignada.') {
            /*  this.mensaje.warning('Oops',data.response) */
            /*  console.log(JSON.parse(data.response)); */
            this.mensaje.warning(
              'Éxito',
              'Aún no hay configuraciones de este tipo'
            );
            this.arrInterpolations = [];
          } else {
            this.mensaje.success(
              'Éxito',
              'Configuracion obtenida exitosamente.'
            );
            this.arrInterpolations = JSON.parse(data.response);
            /* POR HACER */
          }
          $('#mdlCalculadora').modal('show');
        } else {
          console.log('error');
        }
      });
  }

  desactivarSTX(isactive: any) {
    this.isActiveSTX = isactive;
  }

}
