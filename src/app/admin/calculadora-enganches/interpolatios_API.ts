import { environment } from "src/environments/environment";

export let INTERPOLACIONES_API = {
    // listSelfQuotedClients
/* API OBTENCION DE LAS INTERPOLACIONES */
    GET: `${environment.url_api_cf}/interpolations/get`,
    // storeAutocotizacion
/* API GUARDADO INTERPOLACIONES */
    STORE: `${environment.url_api_cf}/interpolations/create`,
    // updateAutocotizacion
/* API ACTUALIZACION INTERPOLACIONES */
    UPDATE: `${environment.url_api_cf}/interpolations/update`
}