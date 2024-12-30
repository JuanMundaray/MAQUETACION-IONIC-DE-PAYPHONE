import { Injectable } from '@angular/core';
import * as moment from 'moment';

declare var $: any;
declare var jQuery: any;

@Injectable({
  providedIn: 'root'
})
export class CountdownService {

  constructor() { }

  /**
   * 
   * @param minutes = minutos que va durar cuenta regresiva 
   * @param el id donde se mostrara el contador
   */
  start(minutes:number,output:string): void{
    let timeset: string;
    let min: number = minutes;
    let sec: number = 0;
    
    let contador = setInterval(() => {

      if (min == minutes) {
        min--;
        sec = 59;
      }
      else {
        if (min == 0) {
          if (sec != 0) {
            sec--;
          } else{
            clearInterval(contador);
          }
        } else {
          if (sec == 0) {
            min--;
            sec = 59;
          } else {
            sec--;
          }
        }
      }

      timeset = moment(`${min}:${sec}`, 'mm:ss').format('mm:ss');
      //// console.log(`output:${output} tiempo:${timeset}`)
      $(output).html(timeset);
    },1000);

  }

  stop(contador:any) {
    clearInterval(contador)
  }

}
