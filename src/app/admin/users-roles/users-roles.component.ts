import { Component, OnInit, Input} from '@angular/core';
import { Subject } from 'rxjs';
import { AlertMessageService } from 'src/app/services/alert/alert-message.service';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { environment } from 'src/environments/environment';
import { HttpServiceService } from 'src/app/services/httpServices/http-service.service';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { ModalController } from '@ionic/angular';
declare var $: any;

@Component({
  selector: 'app-users-roles',
  templateUrl: './users-roles.component.html',
  styleUrls: ['./users-roles.component.scss'],
  standalone:false
})
export class UsersRolesComponent  implements OnInit {
  @Input() perwrite: boolean = true;
  @Input() perread: boolean = true;
  @Input() peradm: boolean = true;

  public isuseractive = false;
  public useractual: any;
  public users: any;
  public roles: any;
  public urlapicf: string = environment.url_api_cf;
  private jsonData: any;
  private urlEndPoint!: string;
  public proname!: string;
  public com_id!: string;
  public user_id!: string;
  public rol_name!: string;
  public permisos!: string[];
  public rolesParaRender: any;
  filterText: any; // Valor para filtrar a través del input de busqueda
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Cantidad de usuarios por página
  filteredUsers: any[] = []; // Usuarios filtrados para la paginación
  scrollX!:boolean;
  public showModalPermisosRolUsuario:boolean=false;

  constructor(
    private mensaje: AlertMessageService,
    private spinner: SpinnerService,
    public func: FunctionsService,
    private httpServ: HttpServiceService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.proname = this.func.readLocalStorage('user_proName');
    this.com_id = this.func.readLocalStorage('data_userCompaniaid');
    this.user_id = this.func.readLocalStorage('user_id');
    if (this.perread) {
      this.spinner.show();
      this.getUsers(); //obtener todos los usuarios con los roles que trae este ws podemos llenar por defecto cuales ya tiene
      this.getRoles(); //obtener todos los roles
    }
  }

  capitalizeName(name: string): string {
    if (!name) return '';

    const words = name.split(' ');
    const capitalizedWords = words.map((word) => {
      const firstLetter = word.charAt(0).toUpperCase();
      const restOfWord = word.slice(1).toLowerCase();
      return firstLetter + restOfWord;
    });

    return capitalizedWords.join(' ');
  }

  onDragOver(event: Event) { 
    const dragEvent = event as DragEvent
    dragEvent.preventDefault(); // Esto evita el comportamiento predeterminado del navegador. 
  }

  onDragStart(event: Event, role: any, name: any, company: any) {
    const dragEvent = event as DragEvent
    //this.users.forEach(user => user.isSelected = false);
    $('#arearol' + this.useractual).addClass('dropzone');
    if (!$('#payuda' + this.useractual).length) {
      $('#arearol' + this.useractual).append(
        '<p id="payuda' +
          this.useractual +
          '" style="color:#0C7E53;font-weight:bold;" class="text-center align-middle mt-3">Arrastrar aqui los roles <i class="bi bi-upload"></i></p>'
      );
    }

    dragEvent.dataTransfer?.setData(
      'text/plain',
      JSON.stringify({ rol_id: role, name: name, company: company })
    );
  }

  selectuser(id: any) {
    this.users.forEach((user: { id: any; isselected: boolean }) => {
      if (user.id === id) {
        user.isselected = true;
      } else {
        user.isselected = false;
      }
    });
    this.isuseractive = true;
    this.useractual = id;

    // prev
    /* selectuser(id: any) {
    this.users.forEach(
      (user: { isSelected: boolean }) => (user.isSelected = false)
    );
    var index = this.users.findIndex((r: { id: any }) => r.id == id);
    this.users[index].isSelected = true;

    // comentado
    /*if(this.useractual!=id){
      //this.users[index].roles=[];
      //$('#arearol' + id).html('');
    }*/
    //this.roles = this.getRoles();
  }

  onDrop(event: Event, user: any) {
    const dragEvent = event as DragEvent
    event.preventDefault();
    const data = dragEvent.dataTransfer?.getData('text/plain');
    // // console.log("🚀 ~ file: users-roles.component.ts:48 ~ UsersRolesComponent ~ onDrop ~ data:", data)
    const role = JSON.parse(data!);
    // console.log("🚀 ~ file: users-roles.component.ts:71 ~ UsersRolesComponent ~ onDrop ~ role:", role)
    //const index = this.roles.findIndex((r: { id: any; }) => r.id === role.id);
    // //console.log("🚀 ~ file: users-roles.component.ts:73 ~ UsersRolesComponent ~ onDrop ~ index:", index)
    //this.roles.splice(index, 1);
    var inx = user.roles.findIndex((r2: any) => r2.rol_id === role.rol_id);
    // console.log("🚀 ~ file: users-roles.component.ts:61 ~ UsersRolesComponent ~ onDrop ~ inx:", inx)
    if (inx == -1) {
      // si el rol no existe
      user.roles.push(role);
      //$('#arearol' + user.id).append('<div class="card m-1 text-center" style="height:40px;"><div class="card-header">'+role.name+'</div></div>');
    }
    $('#arearol' + user.id).removeClass('dropzone');
    if ($('#payuda' + user.id).length) {
      $('#payuda' + user.id).remove();
    }
  }

  getRoles() {
    //request para obtener los tdos los roles
    var type = 'getrols';
    var rap: string;
    var def: string;
    var rci = this.func.crypt(this.com_id, type);

    var arrData: any = {
      type: type, //se agrega la llave de encriptado, esta no se encripta y es alusiva a los datos a enviar
      rol_com_id: rci,
    };

    if (this.proname == 'Administrator') {
      rap = this.func.crypt('1', type); // 1 para poder ver todos
      arrData.rol_apply = rap;
    } else {
      rap = this.func.crypt('0', type); // 0 para poder ver por compañia
      def = this.func.crypt('1', type);
      arrData.rol_apply = rap;
      arrData.default = def;
    }

    this.jsonData = JSON.stringify(arrData); //se crea el json
    this.urlEndPoint = this.urlapicf + '/get/allroles';

    /* ESTRUCTURA PARA EL ENVIO DE DATOS */
    this.httpServ
      .consulta(this.urlEndPoint, this.jsonData, true)
      .subscribe((data: any) => {
        if (data.ok == true) {
          var data2 = JSON.parse(this.func.decrypt(data.response, type));
          this.rolesParaRender = data2;
          if (data2.length > 0) {
            var uniqueRoles = data2.filter(
              (role: any, index: any, self: any) => {
                return (
                  index === self.findIndex((r: any) => r.ROL_ID === role.ROL_ID)
                );
              }
            );

            this.roles = uniqueRoles;
          } else {
            this.roles = [];
            this.mensaje.error('Oops', data.response);
          }
        } else {
          this.roles = [];
          this.mensaje.error('Oops', data.errorMessage); //alert que aparece en la esquina superior derecha
        }
      });
  }

  getUsers() {
    //request para obtener todos los usuarios
    var type = 'getusers';
    var rap: string;
    let endPoint = this.urlapicf + '/get/config/cf/companies/users';
    var companiaIdEnc = this.func.crypt(this.com_id, type);
    if (this.proname == 'Administrator') {
      rap = this.func.crypt('0', type); // 1 para poder ver todos
    } else {
      rap = this.func.crypt('1', type); // 0 para poder ver por compañia
    }
    let jsonData = JSON.stringify({
      type: type,
      comp_id: companiaIdEnc,
      apply: rap,
    });

    this.httpServ.consulta(endPoint, jsonData, true).subscribe((data: any) => {
      // Manejo de la respuesta si todo está ok
      if (data.ok == true) {
        var response = JSON.parse(this.func.decrypt(data.response, type));
        // console.log("🚀 ~ file: users-roles.component.ts:209 ~ this.httpServ.consulta ~ response:", response)
        this.users = response;
        this.filteredUsers = response;
      }
      // manejo del error
      else {
        //  console.log(data.error);
      }

      this.spinner.hide();
    });
  }

  toggleDesplegable(id: any) {
    //aqui va un request para cargar los roles del usuario
    $('#desplegar' + id).toggle();
  }

  saveUserRol(userID: any) {
    // Muestra el spinner de carga
    this.spinner.show();
    // Encuentra al usuario correspondiente al userID
    const user: any = this.users.find(
      (user: any) => user.id_usuario === userID
    );
    // Definición de variables y parámetros necesarios para la solicitud HTTP
    var type = 'updateroles';
    let id_user = this.func.crypt(this.user_id, type);
    let id_perfil = this.func.crypt(user.id_perfil, type);
    let roles = JSON.stringify(user.roles);
    var url = this.urlapicf + '/update/roles/user';
    var jsonData = {
      type: type,
      id_perfil: id_perfil,
      id_user: id_user,
      roles: this.func.crypt(roles, type),
    };
    let payload = JSON.stringify(jsonData);
    // Realiza la solicitud HTTP
    if (user) {
      this.httpServ.consulta(url, payload, true).subscribe((data: any) => {
        // Respuesta éxitosa
        if (data.ok == true) {
          var response = data.response;
          this.mensaje.success(
            'Éxito',
            'Los permisos se han actualizado exitosamente'
          );
        }
        // Error en respuesta
        else {
          //console.log('Error', data);
          this.mensaje.error(
            'Oops',
            'No se han podido actualizar los permisos'
          );
        }
        // Oculta el spinner de carga
        this.spinner.hide();
      });
      //  console.log('Usuario:', user);

      // Aquí puedes realizar las operaciones que necesites con el usuario encontrado
      // Por ejemplo, puedes hacer una llamada a una API para guardar los roles del usuario

      // Después de realizar la operación, si necesitas reiniciar los roles del usuario, puedes hacer lo siguiente:
      // user.roles = [];
    } else {
      // console.log('Usuario no encontrado');
    }
    var index = this.users.findIndex((r: { id: any }) => r.id === userID);
    //console.log('Usuarios:', this.users[index]);

    //aqui va request para guardar el user roles cuando responda ok podemo usar lo siguiente para reiniciar:
    //this.users[index].roles=[];
  }

  isRoleAssigned(roleId: number): boolean {
    return Object.values(this.users.roles).some((roles: any) =>
      roles.some((role: any) => role.id === roleId)
    );
  }

  deleterol(id: any, user: any) {
    //console.log(user);
    //console.log('id', id);
    // console.log("🚀 ~ file: users-roles.component.ts:104 ~ UsersRolesComponent ~ deleterol ~ id:", id)
    var index = user.roles.findIndex((r: { id: any }) => r.id === id);
    // console.log('index', index);
    // console.log("🚀 ~ file: users-roles.component.ts:105 ~ UsersRolesComponent ~ deleterol ~ index:", index)
    if (index != -1) {
      user.roles.splice(index, 1);
    }
  }
  // Renderiza el modal con los permisos para cada rol
  getPermissionsPerRole(rolID: number): string[] {
    this.permisos = [];
    this.rolesParaRender.forEach((item: any) => {
      if (item.ROL_ID === rolID) {
        this.permisos.push(item.PER_NAME);
        this.rol_name = item.ROL_NAME;
      }
    });
    return this.permisos;
  }

  filtrarUsuarios(texto: string) {
    // Filtrar usuarios según el texto de búsqueda
    const usuariosFiltrados = this.users.filter((user: any) => {
      const nombre = user.usuario.toLowerCase();
      const telefono = user.numero;

      // Verificar si el nombre o el número de teléfono contienen el texto de búsqueda
      return (
        nombre.includes(texto.trim().toLowerCase()) ||
        telefono.includes(texto.trim())
      );
    });

    // Actualizar usuarios filtrados y reiniciar la página actual
    this.filteredUsers = usuariosFiltrados;
    this.currentPage = 1;
  }

  // Obtiene la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  // Obtiene la siguiente página.
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  // obtiene directamente los usuarios paginados sin llamar al método()
  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }
  // obtiene directamente las páginas sin llamar al método()
  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
