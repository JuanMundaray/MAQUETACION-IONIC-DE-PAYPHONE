import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchesService {
  private selectedStoreConfigSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor() { }
  

  selectStore(variable: string) {
    this.selectedStoreConfigSubject.next(variable);
  }

  getSelectedStoreConfigObservable(): Observable<any> {
    return this.selectedStoreConfigSubject.asObservable();
  }
}
