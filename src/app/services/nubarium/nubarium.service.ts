import { Injectable } from '@angular/core';
import { FunctionsService } from '../functions/functions.service';
import { environment } from 'src/environments/environment';
import {configurationsId, configurationsFace} from './nubarium.config'

// declare const IdCapture: any;
// declare const FaceCapture: any;

@Injectable({
  providedIn: 'root'
})
export class NubariumService {

  public idCaptureInstance: any; // Variable para almacenar la instancia de IdCapture
  public faceCaptureInstance: any; // Variable para almacenar la instancia de FaceCapture
  //token
  public responseToken : any;
  public token: any = null;
  //config
  public configCaptureID : any = configurationsId
  public configCaptureFace : any = configurationsFace
  
  constructor(
    private aux : FunctionsService
  ) { }

  //INIT DE TODO PARA CARGAR EL SDK
  async loadSDK(){
    console.log("🚀 CARGANDO SDK...")
    try {
      await this.cargarScriptAsync(
        'https://cdn.nubarium.com/nubSdk/nubSdk@latest/nubSdk-third.min.js'
      );
      await this.cargarScriptAsync(
        'https://cdn.nubarium.com/nubSdk/nubSdk@latest/nubSdk-biometrics.js'
      );
    } catch (error) {
      this.aux.alert.error('Error', 'Error al cargar SDK.' + error)
      console.log("Error al cargar el SDK NUBRM");
    }
  }

  //capturamos el token de nubarium para iniciar el proceso por sdk
  async loadTokenAPi() {
    console.log("🚀 CONFIGURANDO PERMISOS NECESARIOS...")
    try {
      this.responseToken = await this.aux.httpR(
        `${environment.url_api_cf}/get/nuba/token`,
        JSON.stringify({
          token: this.aux.crypt('DragonBall', 'validationimei'),
          type: 'validationimei',
        })
      );
      if("bearer_token" in this.responseToken)this.token = this.responseToken.bearer_token;
    } catch (error) {
      console.log("🚀 ~ NubariumService ~ loadTokenAPi ~ error:", error)
      throw error;
    }
  }

  


  //LIMPIAR LAS INSTANCIAS DE LOS ELEMENTOS
  clearInstance() {
    console.log("Limpiando instancias...")
    if (this.idCaptureInstance) {
      console.log('Instancia de idcapture run, reset ok.');
      this.idCaptureInstance.clear();
      this.idCaptureInstance = '';
    }
    if (this.faceCaptureInstance) {
      console.log('Instancia de facecapture run, reset ok.');
      this.faceCaptureInstance.clear();
      this.faceCaptureInstance = '';
    }
  }

  //para cargar js
  cargarScriptAsync(url: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        resolve();
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.body.appendChild(script);
    });
  }

  //VALIDAMOS DEL TOKEN
  validateToken() {
    console.log('token: ' + this.token);
    if (this.token == null || this.token == '') {
      this.aux.alert.error('Ups!', 'El token es invalido, por favor vuelve a intentarlo');
      return true;
    } else {
      return false;
    }
  }
  //CANCELAR TODO EL PROCESO 'LIMPIAR-CLEAN'
  CancelFlow() {
    this.token = '';
    this.clearInstance();
    window.close();
  }
}
