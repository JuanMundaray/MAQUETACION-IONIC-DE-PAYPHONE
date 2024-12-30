import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AlertMessageService } from 'src/app/services/alert/alert-message.service';
import { HttpServiceService } from 'src/app/services/httpServices/http-service.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

declare var $: any;

@Component({
  selector: 'app-users-admins',
  templateUrl: './users-admins.component.html',
  styleUrls: ['./users-admins.component.scss'],
  standalone:false
})
export class UsersAdminsComponent implements OnInit {
  //obtener informacion de permisos
  @Input() perwrite!: boolean;
  @Input() perread!: boolean;
  @Input() peradm!: boolean;
  @Input() permission!: boolean;
  allPais: any = [];
  allEmpresas: any = [];
  public showAddAdminModal!:boolean;
  public fic: any;
  public perwritemdl!: boolean;
  public perreadmdl!: boolean;
  public peradmmdl!: boolean;
  public useidactual!: string;
  public peridactual!: string;
  public isNew: boolean = true;
  public isActiveConfigFinancia: boolean = true;
  public min = 0;
  public maxi = 200;
  public maxe = 90;
  public proname!: string;
  public com_id!: string;
  public user_id!: string;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  allUsers: any = [];
  public hiddenButtons: boolean = true;
  public hiddenInputs: boolean = false;
  private codPais!: string;
  private urlEndPoint!: string;
  private jsonData: any;
  private userId: any;
  public maxLen: any = 11;
  public passwdVend: any;
  public idAnverso: any;
  public idReverso: any;
  public fotAdmin: any;
  public compDom: any;
  public imgIdAnv: boolean = false;
  public imgIdRev: boolean = false;
  public imgSelfieVend: boolean = false;
  public imgCompDom: boolean = false;
  public btnOtherVend: boolean = true;
  public urlapicel: string = environment.url_api_cel;
  public urlapicf: string = environment.url_api_cf;
  public newAdminForm!: FormGroup;
  public newBtnAdminForm!: FormGroup;
  public classNameInpSup: any = ['col-12', 'col-lg-4'];
  public classNameInpInf: any = ['col-12', 'col-lg-4'];
  public classNameRow: any = ['row', 'mb-2'];
  public classDivNewVend: any = [
    'position-absolute',
    'd-flex',
    'justify-content-end',
  ];
  public classDivMisVend: any = [
    'position-absolute',
    'd-flex',
    'justify-content-end',
    'mt-lg-5',
  ];
  public classBtnNewVend: any = ['btn', 'btn-outline-success'];
  public classBtnMisVend: any = ['btn', 'btn-outline-primary'];
  public classBtnBsuqFech: any = ['col-lg-2', 'p-0', 'divBtnBusq'];
  public classOpc: any = [
    'position-absolute',
    'd-flex',
    'justify-content-end',
    'mt-lg-5',
    'pt-5',
  ];

  constructor(
    private func: FunctionsService,
    public router: Router,
    private readonly fb: FormBuilder,
    private readonly fbII: FormBuilder,
    private mensaje: AlertMessageService,
    private spinner: SpinnerService,
    private httpServ: HttpServiceService
  ) {}

  ngOnInit(): void {
    let session: any;
    try {
      session = this.func.readLocalStorage('login');
    } catch (error) {
      this.func.addLocalStorage('off', 'login');
    }

    if (session == 'off') this.router.navigateByUrl('login');
    else {
      this.codPais = this.func.getCountryCodeByDomain(location.hostname);
      if (this.codPais == 'localhost') this.codPais = 'mx';

      //obtener variables de local

      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      ) {
        this.classNameInpSup = ['col-12', 'col-lg-4', 'mt-2'];
        this.classNameInpInf = ['col-12', 'col-lg-6', 'mt-2'];
        this.classNameRow = ['row'];
        this.classDivNewVend = ['col-12'];
        this.classDivMisVend = ['col-12 mt-3'];
        this.classBtnBsuqFech = ['col-12', 'mt-2', 'd-grid'];
        this.classBtnNewVend = ['btn', 'btn-sm', 'btn-outline-success'];
        this.classBtnMisVend = ['btn', 'btn-sm', 'btn-outline-primary'];
        this.classOpc = [
          'col-12',
          'd-flex',
          'justify-content-center',
          'mt-3',
          'mt-lg-5',
          'mb-2',
        ];
      }

      //request para obtener los usuarios tipo backoofice

      if (this.perread) {
        // validar que tenga acceso de lectura
        this.initTable(); //iniciar los parametros para la tabla settings
        this.updateDATA();
      }

      this.newAdminForm = this.initForm();
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
        },
      ];
    }
    //=============== aqui se puede agregar para descargar la tabla ====== VER DOCUMENTACION
    this.dtOptions = {
      // Declare the use of the extension in the dom parameter
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

  initForm(): FormGroup {
    var valida: any = {
      userAdmin: ['', [Validators.required]],
      nombAdmin: ['', [Validators.required]],
      apellAdmin: ['', [Validators.required]],
      nroTelfAdmin: ['', [Validators.required, Validators.maxLength(11)]],
      emailAdmin: ['', [Validators.required, Validators.email]],
    };

    if (this.proname === 'Administrator') {
      valida.comAdmin = ['', [Validators.required]];
      valida.couAdmin = ['', [Validators.required]];
    }

    return this.fb.group(valida);
  }

  keyPress(event: any, type: string) {
    if (type == 'n') this.func.onlynumbers(event);
    else if (type == 't') this.func.nroTelf(event);
    else this.func.onlyLetters(event);
  }

  onSubmit(): void {
    // crear el usuario
    // alert("crear");

    this.spinner.show(); //inicio de la animacion, va al inicio del metodo

    let typeUser: any = this.func.crypt('Admin', 'dataUserAdmin');
    let userId: any = this.func.readLocalStorage('user_id');
    let useUid: any = this.func.crypt(userId, 'dataUserAdmin');
    let user: any = this.func.crypt($('#inpUser').val(), 'dataUserAdmin');
    let nomb: any = this.func.crypt(
      $('#inpNomb').val() + ' ' + $('#inpApell').val(),
      'dataUserAdmin'
    );
    let nroTelf: any = this.func.crypt(
      this.func.addCodPais(this.codPais, $('#inpNroTelf').val()),
      'dataUserAdmin'
    );
    let email: any = this.func.crypt($('#inpEmail').val(), 'dataUserAdmin');
    let countryId = this.func.readLocalStorage('data_userPaisid');
    console.log(
      '🚀 ~ file: users-admins.component.ts:258 ~ UsersAdminsComponent ~ onSubmit ~ countryId:',
      countryId
    );
    let selectedCountry = this.func.crypt(countryId, 'dataUserAdmin');
    let companyId = this.func.readLocalStorage('data_userCompaniaid');
    console.log(
      '🚀 ~ file: users-admins.component.ts:261 ~ UsersAdminsComponent ~ onSubmit ~ companyId:',
      companyId
    );
    var selectedCompany = this.func.crypt(companyId, 'dataUserAdmin');

    if (this.proname == 'Administrator') {
      // si es admin full tomar los valores de los inputs
      var countryIdinp = $('#selCountry').val();
      console.log(
        '🚀 ~ file: users-admins.component.ts:266 ~ UsersAdminsComponent ~ onSubmit ~ countryIdinp:',
        countryIdinp
      );
      selectedCountry = this.func.crypt(countryIdinp, 'dataUserAdmin');

      var companyIdinp = $('#selCompany').val();
      console.log(
        '🚀 ~ file: users-admins.component.ts:269 ~ UsersAdminsComponent ~ onSubmit ~ companyIdinp:',
        companyIdinp
      );
      selectedCompany = this.func.crypt(companyIdinp, 'dataUserAdmin');
    }

    const arrData = {
      type: 'dataUserAdmin',
      type_user: typeUser,
      use_uid: useUid,
      name: nomb,
      email: email,
      user: user,
      pnumber: nroTelf,
      country_id: selectedCountry,
      company_id: selectedCompany,
    };
    console.log(
      '🚀 ~ file: users-admins.component.ts:308 ~ UsersAdminsComponent ~ onSubmit ~ arrData:',
      arrData
    );

    this.jsonData = JSON.stringify(arrData); //se crea el json

    this.urlEndPoint = this.urlapicf + '/save/user/admins'; //se agrega el endpoint

    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((response: any) => {
        this.spinner.hide(); //fin de la animacion, va al terminar el proceso
        if (response.ok) {
          $('#mdlAddAdmin').modal('hide');
          var data2 = this.func.decrypt(response.clave, 'dataUserAdmin');
          var data3 = this.func.decrypt(response.last_pro_id, 'dataUserAdmin');
          // valida proceso exitoso
          this.userId = data3;
          this.passwdVend = data2;
          this.onSubmitII();
        } else {
          this.mensaje.error('Oops', response.errorMessage);
        }
      });
  }

  onSubmitII(): void {
    $('#btnAcep').prop('hidden', true);
    let nombre: any = '';
    let nomb: any = $('#inpNomb').val();
    let apell: any = $('#inpApell').val();
    let nroTelefono: any;

    if (
      $('#inpNroTelf').val() == '050256309902' ||
      $('#inpNroTelf').val() == '584148087184' ||
      $('#inpNroTelf').val() == '584267937660'
    ) {
      nroTelefono = $('#inpNroTelf').val();
    } else {
      nroTelefono = this.func.addCodPais(this.codPais, $('#inpNroTelf').val());
    }
    nombre = nomb + ' ' + apell;

    // this.mensaje.success('Éxito', 'El vendedor fue ingresado correctamente');
    var mensaje =
      nombre + '|' +
      nroTelefono + '|' +
      this.passwdVend + '|' +
      'admin';

    const arrDat = {
      number: nroTelefono,
      groupid: '',
      message: mensaje,
      token: '',
      application: '',
      globalmedia: '',
      groupmention: '',
      templateid:"VB6714475"
    };
    this.jsonData = JSON.stringify(arrDat); //se crea el json
    this.urlEndPoint = this.urlapicel + '/sendMessage/whatsapp';

    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((response: any) => {
        this.spinner.hide();
        if (response.ok) {
          this.updateDATA();
          this.mensaje.success(
            'Éxito!',
            'El vendedor fue registrado correctamente y sus datos de acceso a la plataforma se enviaron correctamente a ' +
              nombre
          );
        } else {
          this.mensaje.error('Oops', response.errorMessage); //alert que aparece en la esquina superior derecha
        }
      });
  }

  openMdl() {
    //$('#mdlAddAdmin').modal('show');
    this.showAddAdminModal = true;

    if (this.proname == 'Administrator') {
      //solo si es admin full

      var type2 = 'getPaises';
      var tipo = this.func.crypt('0', type2); // 0 para poder ver todos

      const arrData = {
        type: type2, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
        sadm: tipo, //el valor debe ir encriptado
      };
      this.jsonData = JSON.stringify(arrData); //se crea el json
      this.urlEndPoint = this.urlapicf + '/get/config/cf/countries';

      /* ESTRUCTURA PARA EL ENVIO DE DATOS */
      this.httpServ
        .consulta(this.urlEndPoint, this.jsonData, true)
        .subscribe((data: any) => {
          if (data.ok == true) {
            var data2 = JSON.parse(this.func.decrypt(data.response, type2));
            if (data2.length > 0) {
              this.allPais = data2; //ngresamos la data

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
                  if (data.ok == true) {
                    var data2 = JSON.parse(
                      this.func.decrypt(data.response, type)
                    );
                    if (data2.length > 0) {
                      this.allEmpresas = data2; //ngresamos la data
                    } else {
                      this.allEmpresas = [];
                      this.mensaje.error('Oops', data.response);
                    }
                  } else {
                    this.allEmpresas = [];
                    this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
                  }
                });
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
  }

  closeAddAdminModal(){
    this.showAddAdminModal = false;
  }

  mdlEditaAdmin(idUser: any, name: any) {
    $('#idso').html(this.func.crypt(idUser, 'edAdmins'));
    var phone10 = $('#t' + idUser)
      .html()
      .slice(-10);
    $('#inpEdTelf').val(phone10);
    $('#inpEdEmail').val($('#e' + idUser).html());
    $('#lblName').val(name);
    $('#mdlEditAdmin').modal('show');
  }

  guardaEdAdmin() {
    let telf: any = $('#inpEdTelf').val();
    var cod: string = this.codPais;
    var nvoNum: any = this.func.addCodPais(cod, telf);
    let email: any = $('#inpEdEmail').val();
    let idSoEd = this.func.decrypt($('#idso').html(), 'edAdmins');
    let idSoEdEnc = $('#idso').html();
    let userId = this.func.readLocalStorage('user_id');

    if (!telf) {
      this.mensaje.error('Oops', 'Ingresa correctamente el numero de telefono');
    } else if (!email) {
      this.mensaje.error('Oops', 'Ingresa correctamente el correo');
    } else {
      let userIdEnc = this.func.crypt(userId, 'edAdmins');
      let telfEnc: any = this.func.crypt(nvoNum, 'edAdmins');
      let emailEnc: any = this.func.crypt(email, 'edAdmins');

      this.spinner.show();

      const arrData = {
        type: 'edAdmins',
        use_uid: userIdEnc,
        email: emailEnc,
        pnumber: telfEnc,
        id_user_edit: idSoEdEnc,
      };
      this.jsonData = JSON.stringify(arrData);
      this.urlEndPoint = this.urlapicf + '/update/user/data';

      /* ESTRUCTURA PARA EL ENVIO DE DATOS */
      this.httpServ
        .consulta(this.urlEndPoint, this.jsonData, true)
        .subscribe((response: any) => {
          this.updateDATA();
          this.spinner.hide();
          console.log('response Admins: ', response);
          if (response.ok) {
            $('#t' + idSoEd).html($('#inpEdTelf').val());
            $('#e' + idSoEd).html($('#inpEdEmail').val());
            this.mensaje.success('Exito...!', response.response);
            $('#mdlEditAdmin').modal('hide');
          } else {
            this.mensaje.error('Oops', response.response);
          }
        });
    }
  }

  borraAdmin(idUser: any, idPf: any) {
    let user_id = this.func.readLocalStorage('user_id');
    if (idUser == user_id) {
      this.mensaje.error('Oops', 'No tiene los permisos para eliminarse');
    } else {
      $('#idSoD').html(this.func.crypt(idUser, 'delRegAdmin'));
      $('#nombreSo').html($('#name' + idUser).html());
      $('#mdlBorrSo').modal('show');
    }
  }

  borraRegistroAd() {
    this.spinner.show();
    let userId = this.func.readLocalStorage('user_id');
    let userIdEnc = this.func.crypt(userId, 'delRegAdmin');
    let idPf = this.func.decrypt($('#idSoD').html(), 'delRegAdmin');
    let idPfEnc = $('#idSoD').html();

    const arrData = {
      type: 'delRegAdmin',
      use_uid: userIdEnc,
      us_id: idPfEnc,
    };
    console.log(
      '🚀 ~ file: companies.component.ts:589 ~ CompaniesComponent ~ borraRegistroAd ~ arrData:',
      arrData
    );
    this.jsonData = JSON.stringify(arrData);
    this.urlEndPoint = this.urlapicf + '/delete/sellers';

    /* ESTRUCTURA PARA EL ENVIO DE DATOS*/
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((response: any) => {
        this.updateDATA();
        this.spinner.hide();
        if (response.ok) {
          $('#' + idPf).remove();
          this.mensaje.success('Exito...!', response.response);
          $('#mdlBorrSo').modal('hide');
        } else {
          this.mensaje.error('Oops', response.response);
        }
      });
  }

  valPerm(perm: any) {
    return this.func.hasAccess(perm, this.permission);
  }

  toggleActiveFinancia(isactive: any) {
    this.isActiveConfigFinancia = isactive;
  }

  mdlPass(idUser: any) {
    this.useidactual = idUser;
    console.log(this.useidactual,'user');
    $('#rpassName').html($('#name' + idUser).html());
    $('#mdlPass').modal('show');
  }
  changePass(idUser: any){
    console.log(idUser);
    let userIdEnc = this.func.crypt(idUser, 'changePassAdmin');
    this.spinner.show();

    const arrData = {
      type: 'changePassAdmin',
      use_id: userIdEnc,
    };
    this.jsonData = JSON.stringify(arrData);
    console.log(this.jsonData, 'json');
    this.urlEndPoint = this.urlapicf + '/erase/user/pass';
      /* ESTRUCTURA PARA EL ENVIO DE DATOS */
      this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((response: any) => {
        console.log(response, 'response admin');
        this.spinner.hide();
        if (response.ok) {
          console.log(response,'respose');
          this.mensaje.success('Exito...!', response.response);
          $('#mdlPass').modal('hide');
        } else {
          this.mensaje.error('Oops', response.response);
        }
      });
    }

  updateDATA() {
    var type = 'findUserAD';
    this.proname = this.func.readLocalStorage('user_proName');
    this.com_id = this.func.readLocalStorage('data_userCompaniaid');
    this.user_id = this.func.readLocalStorage('user_id');

    var rap: string;
    if (this.proname == 'Administrator') {
      rap = this.func.crypt('0', type); // 1 para poder ver todos
    } else {
      rap = this.func.crypt('1', type); // 0 para poder ver por compañia
    }

    var companiaIdEnc = this.func.crypt(this.com_id, type);

    this.spinner.show();
    this.jsonData = JSON.stringify({
      type: type,
      comp_id: companiaIdEnc,
      apply: rap,
    });
    this.urlEndPoint = this.urlapicf + '/search/users/admin';

    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((response: any) => {
        this.spinner.hide();
        $('#tabadmin').DataTable().destroy(); //reiniciamos las tabla
        if (response.ok) {
          var data2 = JSON.parse(this.func.decrypt(response.response, type));
          this.allUsers = data2;
          this.dtTrigger.next(0); //iniciamos los componentes
        } else {
          this.allUsers = [];
          this.dtTrigger.next(0); //iniciamos los componentes
          this.mensaje.error('Oops', response.response);
        }
      });
  }
}

