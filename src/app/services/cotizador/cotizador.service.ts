import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FunctionsService } from '../functions/functions.service';
import { HttpServiceService } from '../httpServices/http-service.service';
import { Observable, catchError, forkJoin, map, mergeMap, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CotizadorService {
public clientMora: number;
public totalVentasSuc: number;
public  porcMora: number;
public porcIncEng: number;
public urlapicf: string = environment.url_api_cf;
public userSuc = this.func.readLocalStorage('data_userSucursalid')
  incrementoImpago: number;
  porcMoraAviso: number;
  porcentajeImpagosModelo: number;
  incrementoImpagoMarca: number;
  porcentajeImpagosMarca: number;

constructor(
  private func: FunctionsService,
  private httpServ: HttpServiceService,) { 
  }

async calcIncreEng(): Promise<number> {
  return new Promise((resolve, reject) => {
    // ... (tu lógica actual)
    let x = this.porcMora / 100;  // Convertir el porcentaje a decimal
    let y1 = -0.30;  // Límite inferior para el enganche
    let y2 = 1;  // Límite superior para el enganche
    let x1 = 0;  // Valor de clientes en atraso inferior
    let x2 = 0.5;  // Valor de clientes en atraso superior
    if (this.porcMora >= 8) {
      let resultado = (y1 + (((x - x1) * (y2 - y1)) / (x2 - x1))) ;
      this.porcIncEng = Number(resultado.toFixed(4));
      resolve(this.porcIncEng); // Resolvemos la promesa con el valor de porcIncEng
    } else {
      this.porcIncEng = 0
      resolve(0); // Resolvemos la promesa con 0 si porcMora es menor a 8%
    } 
  });
}

getTotalSales(branchId?: any): Observable<number> {
  let type = 'getSales';
  let bof_id = branchId || this.func.readLocalStorage('data_userSucursalid');
  let url = this.urlapicf + '/get/totalSales/bof';
  let encBofid = this.func.crypt(bof_id, type);
  let payload = {
    type,
    bof_id: encBofid
  };
  let jpay = JSON.stringify(payload);
  return this.httpServ.consulta(url, jpay, false).pipe(
    map((res: any) => {
      if (res.ok) {
        try {
          let response = JSON.parse(res.response);
          this.totalVentasSuc = Number(response[0].count);
          return this.totalVentasSuc;
        } catch (error) {
          console.error(error, res.response);
          throw new Error('Error al analizar la respuesta JSON');
        }
      } else {
        console.log('Error al intentar obtener todas las ventas de la sucursal');
        throw new Error('Error en la consulta HTTP');
      }
    }),
    catchError((error: any) => {
      console.error(error);
      return throwError('Error en la consulta HTTP');
    })
  );
}

async getTotalSalesByID(bofId: any): Promise<any> {
  try {
    let type = 'getSales';
    let bof_id = bofId;
    let url = this.urlapicf + '/get/totalSales/bof';
    let encBofid = this.func.crypt(bof_id, type);
    let payload = {
      type,
      bof_id: encBofid
    };
    let jpay = JSON.stringify(payload);

    const response: any = await this.httpServ.consulta(url, jpay, false).toPromise();

    if (response.ok) {
      let responseData = JSON.parse(response.response);
      let totalSales = [{ ventas_totales: responseData[0].count, id_sucursal: (bofId)}];
      return totalSales;
    } else {
      console.log('Error al intentar obtener todas las ventas de la sucursal');
      throw new Error('Error en la consulta HTTP');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener total de ventas');
  }
}

  
  getClientesMora(branchId?: any): Observable<number> {
    let type = 'clientMora';
    let bof_id = branchId || this.func.readLocalStorage('data_userSucursalid');
    let url = this.urlapicf + '/get/clientMora/bof';
    let encBofid = this.func.crypt(bof_id, type);
    let payload = {
      type,
      bof_id: encBofid
    };
    let jpay = JSON.stringify(payload);
    return this.httpServ.consulta(url, jpay, false).pipe(
      map((res: any) => {
        if (res.ok) {
          try {
            let response = JSON.parse(res.response);
            this.clientMora = Number(response[0].count);
            return this.clientMora;
          } catch (error) {
            console.error(error, res.response);
            throw new Error('Error al analizar la respuesta JSON');
          }
        } else {
          throw new Error('Error al obtener los clientes en mora');
        }
      }),
      catchError((error: any) => {
        console.error(error);
        return throwError('Error en la consulta HTTP');
      })
    );
  }

  async getClientesMoraById(bofId: any): Promise<any> {
    try {
      const type = 'clientMora';
      const bof_id = bofId
      const url = this.urlapicf + '/get/clientMora/bof';
      const encBofid = this.func.crypt(bof_id, type);
      const payload = {
        type,
        bof_id: encBofid
      };
      const jpay = JSON.stringify(payload);
  
      const response: any = await this.httpServ.consulta(url, jpay, false).toPromise();
  
      if (response.ok) {
        try {
          const responseData = JSON.parse(response.response);
          const clientMora = {clientes_mora: Number(responseData[0].count), id_sucursal: bofId};
          return clientMora;
        } catch (error) {
          console.error(error, response.response);
          throw new Error('Error al analizar la respuesta JSON');
        }
      } else {
        throw new Error('Error al obtener los clientes en mora');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error en la consulta HTTP');
    }
  }
  

 async calcPorcMora(branchID?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      let observable1$: Observable<Number> = this.getTotalSales(branchID);
      let observable2$: Observable<Number>  = this.getClientesMora(branchID);
      forkJoin([observable1$, observable2$]).subscribe(
        ([totalVentasSuc, clientMora]: Array<any>) => {
          this.porcMora = Math.round(Number(((clientMora / totalVentasSuc) * 100).toFixed(4)));
          this.porcMoraAviso = this.porcMora;
          if (this.totalVentasSuc < 6) {
            this.porcMora = 0
            this.porcIncEng = 0;
          }
          resolve(); // Resolvemos la promesa cuando se obtienen los valores
        },
        error => {
          this.porcIncEng = 0;
          console.error('Error en uno de los Observables:', error);
          reject(error); // Rechazamos la promesa en caso de error
        }
      );
    });
  }
  
  interpolacionImpagos(porcentaje: any): number {
    this.porcentajeImpagosModelo = Number(porcentaje)
    let x = this.porcentajeImpagosModelo / 100;  // Convertir el porcentaje a decimal
    let y1 = -0.30;  // Límite inferior para el enganche
    let y2 = 1;  // Límite superior para el enganche
    let x1 = 0;  // Valor de clientes en atraso inferior
    let x2 = 0.5;
    this.incrementoImpago  = ((y1 + (((x - x1) * (y2 - y1)) / (x2 - x1)))) + 1;
    return this.incrementoImpago;
  }
  
  InterpolacionImpagosMarca(porcentaje: any) {
    let numPorcentaje: any = Number(porcentaje)
    let x = numPorcentaje / 100;  // Convertir el porcentaje a decimal
    let y1 = -0.70;  // Límite inferior para el enganche
    let y2 = 1;  // Límite superior para el enganche
    let x1 = 0;  // Valor de clientes en atraso inferior
    let x2 = 0.5;
    this.incrementoImpagoMarca  = ((y1 + (((x - x1) * (y2 - y1)) / (x2 - x1)))) + 1;
    return this.incrementoImpagoMarca;
  }
}