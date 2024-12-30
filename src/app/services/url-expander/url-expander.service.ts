import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UrlExpanderService {
  constructor(private http: HttpClient) {}

  expandUrl(shortUrl: string): Observable<string> {
    const expandedUrl = `https://unshorten.me/json/${encodeURIComponent(
      shortUrl
    )}`;
    return this.http.get<any>(expandedUrl).pipe(
      map((response) => {
        return response.resolved_url;
      })
    );
  }
}
