import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

declare var $: any;
declare var jQuery: any;

declare var OnBoarding: any;
declare var window: any;

@Injectable({
  providedIn: 'root',
})
export class IncodeService {
  public keypublic: string = environment.incode_apikey;
  public urlapi: string = environment.incode_apiurl;
  private clietID: string = environment.incode_clientid;
  public flow_sale: string = environment.incode_flowSaleId;
  public pago_anticipado: string = environment.incode_pagoAnticipado
  public token: any;
  public countryCode: string = 'MX';
  public language: string = 'es';
  public languageApi: string = 'es-ES';
  public incode: any;
  public session: any;
  public configurationId?: string | null;
  public interviewId?: string | null;
  public externalId?: string | null;
  public container: any | null = null;
  public ocrData: any;
  public score: any;
  public matchResult: any;
  public imgs: any;
  public sesionStatus: any;

  /***
   * Menejo de docuemntos
   */
  public documentName: string;
  public documentType: string = 'contract';
  public documentB64send: any;
  public documentContractResp: any;

  //sdk
  public onBoarding: any;

  constructor() {}

  /**
   * To initialize the SDK, you need to provide your client API Key and the API URL and run the following code
   */
  async instanceIncodeSDK() {
    // console.log('Creando instancia... 🤖');
    try {
      this.incode = await window.OnBoarding.create({
        //clientId: this.clietID,
        //apiKey: this.keypublic,
        apiURL: `${this.urlapi}/0`,
        lang: this.language,
      });
    } catch (error) {
      // console.log('🚀 ~ file: incode.service.ts:57 ~ IncodeService ~ instanceIncodeSDK ~ error',  error);
    }
  }

  async instanceIncodeSDK2() {
    console.log('Creando instancia... 🤖');
    try {
      this.incode = await window.OnBoarding.create({
        //clientId: this.clietID,
        apiKey: this.keypublic,
        apiURL: this.urlapi,
        lang: this.language,
      });
    } catch (error) {
      console.log('🚀 ~ file: incode.service.ts:57 ~ IncodeService ~ instanceIncodeSDK ~ error',  error);
    }
  }

  /**
   * @Initializes new onboarding session.
   */
  async createSessionSDK() {
    // console.log('Creando sesión... 🚀');
    try {
      this.session = await this.incode.createSession(
        this.countryCode,
        this.externalId,
        {
          configurationId: this.configurationId,
          interviewId: this.interviewId,
        }
      );
    } catch (error) {
      // console.log(  '🚀 ~ file: incode.service.ts:69 ~ IncodeService ~ createSessionSDK ~ error',  error);
    }
  }

  async warmup() {
    try {
      await this.incode.warmup();
    } catch (error) {
      // console.log(  '🚀 ~ file: incode.service.ts:90 ~ IncodeService ~ warmup ~ error',  error);
    }
  }

  /**
   * @metodo para obtener la data ocr de la captura ID, debe estar render la img Frontal y trasera
   */
  async getOcr() {
    console.log('Capturando data Ocr... 💻');
    try {
      this.ocrData = await this.incode.ocrData({
        token: this.token,
      });
    } catch (error) {
      // console.log(   '🚀 ~ file: incode.service.ts:103 ~ IncodeService ~ getOcr ~ error',   error );
    }
  }

  /**
   * @metodo que responde los valores de cada una de los metodos
   */
  async getScore() {
    console.log('Capturando data Score... 💻');
    try {
      this.score = await this.incode.getScore({
        token: this.token,
      });
    } catch (error) {
    }
  }

  /**
   * @Metodo para comparar la foto de la ID frontal con el selfie
   */
  async matchFace() {
    // console.log('Capturando data Score... 💻');
    try {
      this.matchResult = await this.incode.processFace({
        token: this.session.token,
      });
    } catch (error) {
    }
  }

  /**
   *
   * @container para mostrar mensajes
   */
  containerMsj(text: string) {
    // console.log('Mostrando mensaje de información... 🔥');
    this.container.innerHTML = `<div class="container"><div class="d-flex flex-column justify-content-center align-items-center w-100 vh-100">
    <img src="../../../assets/images/logo.png" class="img-fluid mt-1" alt="Logo ${environment.COMPANY_NAME}" />
      <div class="spinner-grow text-secondary mt-4" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-center fs-4 mt-5">
        ${text}
      </p>
    </div></div>`;
  }

  async getImgs() {
    // console.log('Capturando data imgs... 💻');
    try {
      this.imgs = await this.incode.getImages({
        token: this.token,
        body: {
          images: ['croppedFrontID', 'croppedBackID', 'selfie', 'signature'],
        },
      });
    } catch (error) {
    }
  }

  /**
   * @agregando documento del proceso (autorizacion o contrato)
   */
  async AddDocument() {
    // console.log('Agregando documento... 💾');
    // console.log("🚀 ~ file: incode.service.ts:208 ~ IncodeService ~ AddDocument ~ console:", {   token: this.token,   type: this.documentType,   image: this.documentB64send, })
    try {
      this.documentContractResp = await this.incode.addDocument({
        token: this.token,
        type: this.documentType,
        image: this.documentB64send,
      });
    } catch (error) {
      // console.log(   '🚀 ~ file: incode.service.ts:176 ~ IncodeService ~ AddDocument ~ error',   error );
    }
  }

  /**
   * @firmando documento (autorizacion o contrato) para luego se entregado con el nom151
   */
  async AttachSignatureToPdfDocument(
    code: string,
    x: any,
    y: any,
    h: any,
    page: any
  ) {
    // console.log('Agregando documento... 💚'+code+" "+x+" "+y+" "+h+" "+page);

    let payload = `{"includeSignedDocumentInResponse":true,"includeNom151SignatureInResponse":true,"includeSignedDocumentWithNom151InResponse":true,"includeCertificateDetailsInResponse":true,"signaturePositionsOnContracts":{"${code}":[{"x":${x},"y":${y},"height":${h},"pageNumber":${page},"orientation":"ORIENTATION_NORMAL"}]}}`;

    try {
      await $.ajax({
        url: `${this.urlapi}/omni/attach-signature-to-pdf/v2`,
        type: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-version': '1.0',
          'x-api-key': this.keypublic,
          'X-Incode-Hardware-Id': this.token,
        },
        data: payload,
      }).done(function (response: any) {
        // console.log(response);
        //agregamos el file b64 a un input seleccionado desde la clase
        $('#getFileB64Nom151').val(
          response.additionalInformation.signedDocumentWithNomSignatureBase64
        );
      });
    } catch (error) {
      // console.log(  '🚀 ~ file: incode.service.ts:236 ~ IncodeService ~ error',  error);
    }
  }

  /**fetchOnboardingStatus
    ID_VALIDATION_FINISHED - User finished with capturing of ID,
    POST_PROCESSING_FINISHED - ID postprocessing finished on server,
    FACE_VALIDATION_FINISHED - User finished with selfie capture,
    ONBOARDING_FINISHED - User finished onboarding process,
    MANUAL_REVIEW_APPROVED - Session that was in Needs Review state, manually approved by Executive,
    MANUAL_REVIEW_REJECTED - Session that was in Needs Review state, manually rejected by Executive,
    UNKNOWN - Unable to determine status of onboarding session - user still didn't start onboarding or user is still in the process of capturing ID.
   */
  async fetchOnboardingStatus() {
    // console.log('Capturando status de sesion... 🔥');
    var resp: any;
    try {
      await $.ajax({
        url: `${this.urlapi}/omni/get/onboarding/status`,
        type: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api-version': '1.0',
          'x-api-key': this.keypublic,
          'X-Incode-Hardware-Id': this.token,
        },
        //data: payload,
      }).done(function (response: any) {
        // console.log(response);
        resp = response;
      });
      if (typeof resp.onboardingStatus != undefined) {
        this.sesionStatus = resp.onboardingStatus;
      }
      // console.log(this.sesionStatus);
      return this.sesionStatus;
    } catch (error) {
      // console.log(  '🚀 ~ file: incode.service.ts:280 ~ IncodeService ~ fetchOnboardingStatus ~ error:',  error);
    }
  }

  /**
   * @metodo para cerrar la sesion exitosa
   */
  async finishSession() {
    // console.log('Cerrando sesión... 🖤');
    try {
      await this.incode.getFinishStatus(this.configurationId, {
        token: this.token,
      });
    } catch (error) {
      // console.log(  '🚀 ~ file: incode.service.ts:245 ~ IncodeService ~ finishSession ~ error',  error);
    }
  }
}
