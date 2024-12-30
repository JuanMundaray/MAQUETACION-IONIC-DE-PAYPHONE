import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  
  setItem(key:string, data:any){
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      // console.log("Error: ",err);
    }
  }

  getItem(key:any){
    try {
      return JSON.parse(localStorage.getItem(key)!);
    } catch (err) {
      // console.log("Error: ",err);
    }
  }

  removeItem(key:any){
    try {
      localStorage.removeItem(key);
    } catch (err) {
      // console.log("Error: ",err);
    }
  }
}
