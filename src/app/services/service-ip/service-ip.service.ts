import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceIpService {
private apiUrl = 'https://api.ipify.org?format=json'
  constructor(private http: HttpClient) { }

  getIpAdress(): Observable<{ip: string}> {
    return this.http.get<{ip: string}>(this.apiUrl)
  }
}
