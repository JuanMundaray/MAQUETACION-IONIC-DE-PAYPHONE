import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { EncriptarDesencriptarService } from 'src/app/services/enc-des/encriptar-desencriptar.service';
import { LocalStorageService } from 'src/app/services/localStorage/local-storage.service';
import { Router, UrlTree } from '@angular/router';
import { environment } from 'src/environments/environment';

const subject = webSocket(environment.url_ws);

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  sessionID: any;

  constructor(
    private encriptarDesencriptar: EncriptarDesencriptarService,
    private localStorage: LocalStorageService,
    private router: Router
  ) {}

  messages = ['hola'];
  connectionId: any;
  receiveMessage() {
    subject.subscribe(
      (msg: any) => {
        //// console.log('message received: ' + JSON.stringify(msg));
        this.messages.push('message received>>>> ' + msg);
        this.connectionId = msg.connectionId; // aqui esta el id que necesitamos

        this.sessionID = this.encriptarDesencriptar.atRL(
          btoa(this.connectionId),
          'celuCreditLocalStorage'
        );

        this.localStorage.setItem('connectionId', this.sessionID);
        // console.log('connectionId: ', this.connectionId);

        if (msg.ok === 1) {
          this.destroy();
          this.router.navigateByUrl('home/vendedores');
        }
      },
      (err) => {
        // console.log(err);
        this.messages.push('err>>>> ' + err);
      },
      () => {
        //// console.log('complete');
        this.messages.push('complete>>>> ' + 'complete');
      }
    );
    this.sendMessage('');
  }

  sendMessage(message: any) {
    subject.next({ message: message });
    //// console.log('message sended: ' + message);
    this.messages.push('message sended>>>> ' + message);
  }

  destroy() {
    subject.complete();
  }
}
