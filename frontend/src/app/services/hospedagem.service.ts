import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guest } from '../models/guest.model';
import { map, catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class HospedagemService {

  baseUrl = 'http://localhost:3001/guests'

  constructor(private http: HttpClient, private notification: NzNotificationService) { }

  create(request: Guest): Observable<Guest>{
    return this.http.post<Guest>(this.baseUrl, request)
  };

  read(): Observable<Guest[]>{
    return this.http.get<Guest[]>(this.baseUrl)
  };

  readById(id: String): Observable<Guest>{
    const url = `${this.baseUrl}/${id}`
    return this.http.get<Guest>(url)
  };

  update(guest: Guest): Observable<Guest>{
    const url = `${this.baseUrl}/${guest.id}`;
    return this.http.put<Guest>(url, guest)
  };

  delete(product: Guest): Observable<Guest>{
    const url = `${this.baseUrl}/${product.id}`;
    return this.http.delete<Guest>(url)
  };

  
}
