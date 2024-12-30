import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,firstValueFrom} from 'rxjs';
import { SpinnerService } from '../spinner/spinner.service';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http:HttpClient,private spinner: SpinnerService) { }

  consulta(url:string, jsonData:any): Observable<void>{
    this.spinner.show();
    return this.http.post<void>(url, jsonData)
      .pipe(
        finalize(() => this.spinner.hide())
      );
  };

  async consultaasync(url: string, jsonData: any, type: any) {
    this.spinner.show();
    try {
      if (type === "get") {
        return await firstValueFrom(this.http.get(url, jsonData));
      } else {
        return await firstValueFrom(this.http.post(url, jsonData));
      }
    } finally {
      this.spinner.hide();
    }
  };
}