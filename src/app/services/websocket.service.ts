import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  public subject!: WebSocketSubject<any>;
  private messages$: Subject<any> = new Subject<any>();
  public connectionId!: string;

  constructor() {
    this.connect();
  }

  // Conectar al WebSocket
  private connect(): void {
    if (!this.subject || this.subject.closed) {
      this.subject = webSocket(environment.url_ws);
      this.subject.pipe(
        tap({
          next: (msg) => this.messages$.next(msg), // Emitir los mensajes entrantes
          error: (err) => console.error('WebSocket error:', err), // Manejar errores
        }),
        catchError((err) => {
          console.error('WebSocket reconnection error:', err);
          return []; // En caso de error, evitar que rompa la conexión
        })
      ).subscribe();
    }
  }

  // Obtener los mensajes recibidos
  getMessages(): Observable<any> {
    return this.messages$.asObservable();
  }

  // Enviar un mensaje al WebSocket
  sendMessage(message: any): void {
    if (this.subject && !this.subject.closed) {
      this.subject.next(message);
    } else {
      console.warn('WebSocket is closed. Message not sent.');
    }
  }

  // Cerrar la conexión WebSocket
  closeConnection(): void {
    if (this.subject) {
      this.subject.complete(); // Cierra la conexión WebSocket
    }
  }
}
