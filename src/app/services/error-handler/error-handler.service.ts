import { Injectable } from '@angular/core';
import { AlertMessageService } from "src/app/services/alert/alert-message.service"

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private mensaje: AlertMessageService) { }

  handleError(error: any): void {
    let errorMessage = 'Ocurrió un error desconocido';
    let errorMessageLog = 'Ocurrió un error desconocido';

    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {

      switch (error.statusCode) {
        case 400:
          errorMessage = 'Solicitud incorrecta. Verifique los datos enviados.';
          break;
        case 401:
          errorMessage = 'No autorizado. Por favor, inicie sesión.';
          break;
        case 403:
          errorMessage = 'Prohibido. No tiene permisos para acceder a este recurso.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        default:
          errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      }
      errorMessageLog = `Error ${error.statusCode}: ${error.message}, data: ${error.data || 'Sin datos de retorno'}`;

    } else if (error.statusCode && error.statusCode === 500) {

      errorMessageLog = `Error ${error.statusCode}: ${error.errorMessage}`;
      if (error.errorDetails) {
        errorMessageLog += `\nDetalles: ${error.errorDetails.message}`;
        errorMessageLog += `\nStackTrace: ${error.errorDetails.stackTrace}`;
      }

    } else {
      // Otros códigos de error o estructuras inesperadas
      errorMessageLog = `Error ${error.statusCode}: ${error.message}`;
    }

    this.mensaje.error(`Oops...! \nError ${error.statusCode}:`, errorMessage);
    throw new Error(errorMessageLog);
  }
}
