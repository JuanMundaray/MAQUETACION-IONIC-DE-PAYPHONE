import { Injectable } from '@angular/core';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private spinner: NgxSpinnerService) {}
  startTime = 0; // Variable para almacenar el tiempo de inicio
  timer = 60

  show() {
    this.timer = 60;
    this.spinner.show();

    // Obtener el tiempo de inicio
    this.startTime = Date.now();

    // Función para actualizar el temporizador
    const updateTimer = () => {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - this.startTime) / 1000);
      this.timer = Math.max(0, 60 - elapsedSeconds); // Asegurarse de que no sea negativo
    };

    // Actualizar el temporizador cada segundo
    const timerInterval = setInterval(updateTimer, 1000);

    // Ocultar el spinner después de 60 segundos
    setTimeout(() => {
      this.spinner.hide();
      clearInterval(timerInterval); // Detener el intervalo cuando termine
    }, 60000);

    // Llamar a updateTimer inmediatamente para mostrar el valor inicial
    updateTimer();
}
  hide() {
    this.spinner.hide()
    this.timer = 60;
  }
}
