import { Injectable } from '@angular/core';
import * as jqSignature from 'jq-signature';

declare var SignaturePad: any;
@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  private signaturePad: any;

  constructor() { }

  initSignaturePad(canvasElement: HTMLCanvasElement) {
    this.signaturePad = new jqSignature(canvasElement);
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  getSignatureDataURL() {
    return this.signaturePad.toDataURL();
  }

  isEmpty(){
    return this.signaturePad.isEmpty();
  }
}
