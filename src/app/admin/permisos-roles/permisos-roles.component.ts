import { Component, OnInit, Input} from '@angular/core';
import { AlertMessageService } from 'src/app/services/alert/alert-message.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { environment } from 'src/environments/environment';
import { HttpServiceService } from 'src/app/services/httpServices/http-service.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
declare var $: any;

@Component({
  selector: 'app-permisos-roles',
  templateUrl: './permisos-roles.component.html',
  styleUrls: ['./permisos-roles.component.scss'],
  standalone:false
})
export class PermisosRolesComponent  implements OnInit {
  @Input() perwrite: boolean = true;
  @Input() perread: boolean = true;
  @Input() peradm: boolean = true;

  allRol: any = [];
  allRol2: any = [];
  permisos: any = [];
  public urlapicf: string = environment.url_api_cf;
  private jsonData: any;
  private urlEndPoint!: string;
  public proname!: string;
  public com_id!: string;
  public user_id!: string;
  public scrollX!:boolean;

  constructor(
    private mensaje: AlertMessageService,
    private spinner: SpinnerService,
    public func: FunctionsService,
    private httpServ: HttpServiceService
  ) {}

  ngOnInit(): void {
    this.proname = this.func.readLocalStorage('user_proName');
    this.com_id = this.func.readLocalStorage('data_userCompaniaid');
    this.user_id = this.func.readLocalStorage('user_id');

    //aqui va un request para cargar todos los permisos
    if (this.perread) {
      this.spinner.show(); //inicio de la animacion, va al inicio del metodo
      var type = 'getrols';
      var rap: string;
      if (this.proname == 'Administrator' || this.proname == 'Administrador') {
        rap = this.func.crypt('1', type); // 1 para poder ver todos
      } else {
        rap = this.func.crypt('0', type); // 0 para poder ver por compañia
      }

      var rci = this.func.crypt(this.com_id, type);

      const arrData2 = {
        type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
        rol_com_id: rci, //el valor debe ir encriptado
        rol_apply: rap, //el valor debe ir encriptado
      };

      this.jsonData = JSON.stringify(arrData2); //se crea el json
      this.urlEndPoint = this.urlapicf + '/get/allroles';

      /* ESTRUCTURA PARA EL ENVIO DE DATOS */
      this.httpServ
        .consulta(this.urlEndPoint, this.jsonData, true)
        .subscribe((data: any) => {
          this.spinner.hide();

          if (data.ok == true) {
            var data2 = JSON.parse(this.func.decrypt(data.response, type));
            if (data2.length > 0) {
              var uniqueRoles = data2.filter(
                (role: any, index: any, self: any) => {
                  return (
                    index ===
                    self.findIndex((r: any) => r.ROL_ID === role.ROL_ID)
                  );
                }
              );

              this.allRol = uniqueRoles;
              this.allRol2 = data2;

              // Asignar los permisos correspondientes a cada rol
              this.allRol.forEach((rol: any, index: number) => {
                const clonedRol = { ...rol }; // Crear una copia superficial de rol
                const rolId = clonedRol.ROL_ID;
                clonedRol.permisos = this.allRol2.filter(
                  (permiso: any) =>
                    permiso.ROL_ID === rolId && permiso.ROL_PER_PER_ID
                );
                this.allRol[index] = clonedRol; // Reemplazar el elemento original con la copia modificada

              });
              //console.log("🚀 ~ file: permisos-roles.component.ts:92 ~ PermisosRolesComponent ~ this.allRol.forEach ~ allRol:", this.allRol)
              var type2 = 'getperm';
              var tipo;
              if (this.proname == 'Administrator') {
                tipo = this.func.crypt('0', type2); // 1 para poder ver todos
              } else {
                tipo = this.func.crypt('1', type2); // 0 para poder ver por compañia
              }

              const arrData = {
                type: type2, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
                per_apply: tipo, //el valor debe ir encriptado
              };
              this.jsonData = JSON.stringify(arrData); //se crea el json
              this.urlEndPoint = this.urlapicf + '/get/allpermissions';

              /* ESTRUCTURA PARA EL ENVIO DE DATOS */
              this.httpServ
                .consulta(this.urlEndPoint, this.jsonData, true)
                .subscribe((data3: any) => {
                  //// console.log("🚀 ~ file: reporte-ventas.component.ts:126 ~ ReporteVentasComponent ~ .subscribe ~ data", data)
                  $('#tabper').DataTable().destroy(); //reiniciamos las tabla
                  this.spinner.hide(); //fin de la animacion, va al terminar el proceso
                  if (data3.ok == true) {
                    var data3 = JSON.parse(
                      this.func.decrypt(data3.response, type2)
                    );

                    if (data3.length > 0) {
                      this.permisos = data3; //ngresamos la data
                    } else {
                      this.permisos = [];
                      //en caso de haber un error
                      this.mensaje.error('Oops', data3.response);
                    }
                  } else {
                    this.permisos = [];
                    //en caso de haber un error
                    this.mensaje.error('Oops', data3.errorMessage); //alert que aparece en la esquina superior derecha
                  }
                });
            } else {
              this.allRol = [];
              this.mensaje.error('Oops', data.response);
            }
          } else {

            if (data.ok == false) {
              this.allRol = [];
              this.mensaje.error('Oops', data.response+" disponibles, porfavor crea uno en la seccion roles");
            }else{
              this.allRol = [];
              this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
            }
          }
        });
    }
  }

  isPermisoPresente2(permisosRol: any[], permiso: any): boolean {
    return permisosRol.some((p: any) => p.PER_NAME === permiso);
  }

  isPermisoPresente(
    permisosRol: any[],
    permiso: any,
    tipoPermiso: string
  ): boolean {
    return permisosRol.some((p: any) => {
      if (tipoPermiso === 'LECTURA' && p.PER_NAME === permiso) {
        return p.ROL_PER_PER_READ == 1;
      } else if (tipoPermiso === 'ESCRITURA' && p.PER_NAME === permiso) {
        return p.ROL_PER_PER_WRITE == 1;
      } else if (tipoPermiso === 'ADMINISTRACION' && p.PER_NAME === permiso) {
        return p.ROL_PER_PER_ADMINISTRACION == 1;
      }
      return false;
    });
  }

  borrarPermisos(rolid: any, permisoid: any, pername: any): void {
    const $permisoCheckbox = $('#permrolper' + rolid + 'p' + permisoid);
    const $lecturaCheckbox = $('#permroller' + rolid + 'p' + permisoid);
    const $escrituraCheckbox = $('#permrolesr' + rolid + 'p' + permisoid);
    const $adminisCheckbox = $('#permroladr' + rolid + 'p' + permisoid);

    if (!$permisoCheckbox.prop('checked')) {
      //borrar
      // Desactivar checkboxes secundarios de la misma línea
      $lecturaCheckbox.prop('checked', false);
      $escrituraCheckbox.prop('checked', false);
      $adminisCheckbox.prop('checked', false);

      const foundPermiso = this.allRol
        .flatMap((rol: any) => rol.permisos)
        .find(
          (permiso: any) =>
            permiso.ROL_PER_PER_ID === permisoid && permiso.ROL_ID === rolid
        );

      //console.log("🚀 ~ file: permisos-roles.component.ts:187 ~ PermisosRolesComponent ~ borrarPermisos ~ permiso:", foundPermiso)
      if (foundPermiso) {
        // Obtener el índice del registro en el arreglo original
        const rolIndex = this.allRol.findIndex((rol: any) =>
          rol.permisos.includes(foundPermiso)
        );

        // Obtener el índice del permiso dentro del arreglo de permisos del rol encontrado
        const permisoIndex = this.allRol[rolIndex].permisos.findIndex(
          (permiso: any) => permiso.ROL_PER_PER_ID === permisoid
        );

        // Eliminar el registro del arreglo original
        if (rolIndex !== -1 && permisoIndex !== -1) {
          this.allRol[rolIndex].permisos.splice(permisoIndex, 1);

          //console.log("Registro eliminado:", foundPermiso);
        }

        //  console.log("🚀 ~ file: permisos-roles.component.ts:201 ~ PermisosRolesComponent ~ borrarPermisos ~ allRol:", this.allRol)
      }
    } else {
      //agregar
      const rolEncontrado = this.allRol.find(
        (rol: any) => rol.ROL_ID === rolid
      );

      $lecturaCheckbox.prop('checked', false);
      $escrituraCheckbox.prop('checked', false);
      $adminisCheckbox.prop('checked', false);

      const nuevoPermiso = {
        ROL_ID: rolid,
        PER_NAME: pername,
        ROL_PER_PER_ID: permisoid,
        ROL_PER_PER_WRITE: 0,
        ROL_PER_PER_READ: 0,
        ROL_PER_PER_ADMINISTRACION: 0,
      };

      if (rolEncontrado) {
        rolEncontrado.permisos.push(nuevoPermiso);
        // console.log("Nuevo permiso agregado:", nuevoPermiso);
      }

      // console.log("🚀 ~ file: permisos-roles.component.ts:201 ~ PermisosRolesComponent ~ borrarPermisos ~ allRol:", this.allRol)
    }
  }

  updatevalperm(rolid: any, permisoid: any) {
    const $lecturaCheckbox = $('#permroller' + rolid + 'p' + permisoid);
    var valorrea = $lecturaCheckbox.prop('checked') ? 1 : 0;
    const $escrituraCheckbox = $('#permrolesr' + rolid + 'p' + permisoid);
    var valorwri = $escrituraCheckbox.prop('checked') ? 1 : 0;
    const $adminisCheckbox = $('#permroladr' + rolid + 'p' + permisoid);
    var valoradm = $adminisCheckbox.prop('checked') ? 1 : 0;

    const foundRol = this.allRol.find((rol: any) => rol.ROL_ID === rolid);

    if (foundRol) {
      const foundPermiso = foundRol.permisos.find(
        (permiso: any) => permiso.ROL_PER_PER_ID === permisoid
      );

      if (foundPermiso) {
        // Realizar las ediciones necesarias en el permiso encontrado
        foundPermiso.ROL_PER_PER_WRITE = valorwri;
        //console.log("🚀 ~ file: permisos-roles.component.ts:237 ~ PermisosRolesComponent ~ updatevalperm ~ valorwri:", valorwri)
        foundPermiso.ROL_PER_PER_READ = valorrea;
        //console.log("🚀 ~ file: permisos-roles.component.ts:239 ~ PermisosRolesComponent ~ updatevalperm ~ valorrea:", valorrea)
        foundPermiso.ROL_PER_PER_ADMINISTRACION = valoradm;
        //console.log("🚀 ~ file: permisos-roles.component.ts:241 ~ PermisosRolesComponent ~ updatevalperm ~ valoradm:", valoradm)

        // Mostrar el permiso editado
        //console.log("Permiso editado:", foundPermiso);
      } else {
        // console.log("Permiso no encontrado");
      }
    } else {
      // console.log("Rol no encontrado");
    }

    // console.log("🚀 ~ file: permisos-roles.component.ts:201 ~ PermisosRolesComponent ~ borrarPermisos ~ allRol:", this.allRol)
  }

  toggleDesplegable(id: any) {
    $('#desplegar' + id).toggle();
  }

  saveRol(rolid: any) {
    const foundRol = this.allRol.find((rol: any) => rol.ROL_ID === rolid);
    // console.log("🚀 ~ file: permisos-roles.component.ts:264 ~ PermisosRolesComponent ~ saveRol ~ foundRol:", foundRol.permisos)
    // console.log("🚀 ~ file: permisos-roles.component.ts:44 ~ PermisosRolesComponent ~ saveRol ~ rolid:", rolid)

    this.spinner.show(); //inicio de la animacion, va al inicio del metodo
    var type = 'updateperrol';
    var fuseid = this.func.crypt(this.user_id, type);
    var frolid = this.func.crypt(rolid, type);
    var fper = this.func.crypt(JSON.stringify(foundRol.permisos), type);

    const arrData = {
      type: type,
      per_uid: fuseid,
      rol_id: frolid,
      permisos: fper,
    };
    this.jsonData = JSON.stringify(arrData); //se crea el json
    this.urlEndPoint = this.urlapicf + '/update/roles/permissions';

    /* ESTRUCTURA PARA EL ENVIO DE DATOS */
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((data: any) => {
        $('#desplegar' + rolid).toggle();
        this.spinner.hide(); //fin de la animacion, va al terminar el proceso
        if (data.ok == true) {
          this.mensaje.success('Exito', data.response);
        } else {
          this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
        }
      });
  }
}
