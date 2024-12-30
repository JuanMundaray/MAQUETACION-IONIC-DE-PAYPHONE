import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { buttonsConfig } from '../utils/optionConfig';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { AlertMessageService } from 'src/app/services/alert/alert-message.service';
import { Option } from '../utils/configAdmin';

@Component({
  selector: 'app-dashboard',
  standalone:false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent  implements OnInit {
  public ppal: boolean = true;
  public addSocio: boolean = false;
  public regUserBo: boolean = false;
  public opc: boolean = false;
  public permisos: boolean = false;
  public roles: boolean = false;
  public perrol: boolean = false;
  public userrol: boolean = false;
  public userbo: boolean = false;
  public cdc: boolean = false;
  public titulo: string = '';
  public companies: boolean = false;
  public sesion: boolean = false;
  public permission: any;
  public perwrite:any;
  public perread:any;
  public peradm:any;
  public admins: boolean = false;
  public contries: boolean = false;
  public financiamiento: boolean = false;
  public asesor: boolean = false;
  sucursales!: boolean;
  public OptionesSelect = Option //contiene todos los nombres de los modulos a los que se puede ingresar
  public optionMenu = buttonsConfig;
  currentView!: string;

  constructor(public router: Router, private mensaje: AlertMessageService) { }

  ngOnInit() {}
  //funciones agregadas:
  // view


  //esta función verifica los permisos del usuario, si los tiene muestra el modulo al que quiere ingresar
  view(nombOpc: Option, haccess: any) {
    console.log(nombOpc, haccess)
    this.ppal = false;
    this.opc = true;
    this.currentView = nombOpc;
    console.log(this.currentView)
    console.log(haccess)
    if (haccess) {
      this.perwrite = haccess.PER_WRITE == 1 ? true : false;
      this.perread = haccess.PER_READ == 1 ? true : false;
      this.peradm = haccess.PER_ADMINISTRAR == 1 ? true : false;
  
      const optionMap = {
        [Option.Permisos]: () => {
          this.titulo = 'PERMISOS';
          this.permisos = true;
        },
        [Option.Roles]: () => {
          this.titulo = 'ROLES';
          this.roles = true;
        },
        [Option.PermisosRoles]: () => {
          this.titulo = 'ASIGNACION PERMISOS ROLES';
          this.perrol = true;
        },
        [Option.UsuariosRoles]: () => {
          this.titulo = 'ASIGNACION ROLES USUARIOS';
          this.userrol = true;
        },
        [Option.UsuariosBackoffice]: () => {
          this.titulo = 'USUARIOS BACKOFFICE';
          this.userbo = true;
        },
        [Option.UsuariosSocios]: () => {
          this.titulo = 'USUARIOS SOCIOS';
          this.addSocio = true;
        },
        [Option.Companies]: () => {
          this.titulo = 'EMPRESAS';
          this.companies = true;
        },
        [Option.Admins]: () => {
          this.titulo = 'ADMINS';
          this.admins = true;
        },
        [Option.Contries]: () => {
          this.titulo = 'PAISES';
          this.contries = true;
        },
        [Option.Sesiones]: () => {
          this.titulo = 'SESIONES ACTIVAS';
          this.sesion = true;
        },
        [Option.Financiamiento]: () => {
          this.titulo = 'CONFIGURACION DE SEMANAS';
          this.financiamiento = true;
        },
        [Option.Sucursales]: () => {
          this.titulo = 'CONFIGURACION DE SUCURSALES';
          this.sucursales = true;
        },
        [Option.UsuariosAsesor]: () => {
          this.titulo = 'USUARIOS ASESOR';
          this.asesor = true;
        }
      };
  
      const action = optionMap[nombOpc];

      if (action) {
        action();
      }
    } 
    
    else {
      this.mensaje.error(
        'Oops...!',
        'Permisos insuficientes para ingresar.'
      );
    }
    
    console.log(this.currentView)
    console.log(this.perwrite)
    console.log(this.perread)
    console.log(this.peradm)
    console.log(this.permission)
  }
  
  back() {
    this.ppal = true;
    this.opc = false;
    this.permisos = false;
    this.roles = false;
    this.perrol = false;
    this.userrol = false;
    this.addSocio = false;
    this.regUserBo = false;
    this.userbo = false;
    this.companies = false;
    this.sesion = false;
    this.admins = false;
    this.contries = false;
    this.financiamiento = false;
  }

}
