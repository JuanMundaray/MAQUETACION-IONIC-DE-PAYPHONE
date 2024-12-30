import { Injectable } from '@angular/core';
import { FunctionsService } from 'src/app/services/functions/functions.service';
import { HttpServiceService } from 'src/app/services/httpServices/http-service.service';
import { environment } from 'src/environments/environment';
import { INTERPOLACIONES_API } from './interpolatios_API';
@Injectable({
  providedIn: 'root'
})
export class InterpolationsService {
  public urlapicf: string = environment.url_api_cf;
  sale_type !: string;
  use_id: any;
  bof_id: any;
  comp_id: any;
  constructor(private func: FunctionsService,private httpServ: HttpServiceService) { }

  getInterpolation(user_type: number,user_id: any, sale_type: any) {
    /* compañia: 1, socios: 2, sucursal: 3 */
    this.generarEstructuraGet(user_type, user_id)
    let type = 'getData'
    sale_type = this.func.crypt(sale_type, type)
    let jsonData = {
      type,
      comp_id: this.func.crypt(this.comp_id,type),
      bof_id: this.func.crypt(this.bof_id,type),
      use_id: this.func.crypt(this.use_id,type),
      sale_type
    }
    return this.httpServ.consulta(INTERPOLACIONES_API.GET,jsonData,true)
    }

  updateInterpolations(payload: any) {
    return this.httpServ.consulta(INTERPOLACIONES_API.UPDATE,payload,true)
  }

  createInterpolation(payload:any) {
    return this.httpServ.consulta(INTERPOLACIONES_API.STORE,payload,true)
  }

    generarEstructuraGet(user_type: number, user_id: any) {
      if (user_type == 1) {
        this.comp_id = user_id
        this.bof_id = -1
        this.use_id = -1
      } else if (user_type == 2) {
        this.comp_id = -1
        this.bof_id = -1
        this.use_id = user_id
      } else {
        this.comp_id = -1
        this.bof_id = user_id
        this.use_id = -1
      }
    }

useConfDef(user_type: number) {
  let id_user;
  if (user_type == 2) {
    id_user = this.func.readLocalStorage('data_userCompaniaid')
  } else {
    id_user = this.func.readLocalStorage('data_userSocioId')
  }
 return this.getInterpolation(user_type - 1,id_user,1)
}
}
