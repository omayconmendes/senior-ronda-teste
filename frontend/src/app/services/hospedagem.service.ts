import { NzNotificationService } from "ng-zorro-antd/notification";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { Guest } from "../models/guest.model";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class HospedagemService {
  baseUrl = "http://localhost:3001/guests";

  constructor(
    private http: HttpClient,
    private notification: NzNotificationService
  ) {}

  create(request: Guest): Observable<Guest> {
    return this.http.post<Guest>(this.baseUrl, request).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler('Erro de conexão com o servidor. Tente novamente em alguns minutos.'))
    )
  }

  read(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.baseUrl).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler('Erro de conexão com o servidor. Tente novamente em alguns minutos.'))
    )
  }

  readById(id: String): Observable<Guest> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Guest>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler('Erro de conexão com o servidor. Tente novamente em alguns minutos.'))
    )
  }

  update(guest: Guest): Observable<Guest> {
    const url = `${this.baseUrl}/${guest.id}`;
    return this.http.put<Guest>(url, guest).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler('Erro de conexão com o servidor. Tente novamente em alguns minutos.'))
    )
  }

  delete(product: Guest): Observable<Guest> {
    const url = `${this.baseUrl}/${product.id}`;
    return this.http.delete<Guest>(url).pipe(
      map(obj => obj),
      catchError(e => this.errorHandler('Erro de conexão com o servidor. Tente novamente em alguns minutos.'))
    )
  }

  /*
      ========== Mensagens de erro ==========
  */

  errorHandler(e: any): Observable<any> {
    this.notification.error("Ocorreu um erro de conexão.", e);
    return EMPTY;
  }
}
