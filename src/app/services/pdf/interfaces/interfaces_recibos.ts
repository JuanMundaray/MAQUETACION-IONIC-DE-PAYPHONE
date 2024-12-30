export interface ReciboPago {
  nombCliente: string;
  clientPhone: string;
  clientCurp: string;
  sucursal: string;
  formFech: string | Date;
  nombreUsuario: string;
  ref: string;
  nombClient: string;
  deviceId: string;
  pamountF: string;
  parcialCanc: string;
  parcialPend: string;
  fechVenc: string | Date;
}
export interface ReciboCompra {
  nombClient: string;
  curp: string | number;
  phone10: string | number;
  ordTag: string | number;
  imeiPhone: string | number;
  model: string;
  enganchef: string | number;
  parcialidadF: string | number;
  temporalidad: string | number;
  sucursal: string;
  vendedor: string;
  arrDates: string[];
}
