import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuenta } from './cuenta';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  private backUrl: string = "http://127.0.0.1:5000"

  constructor(private http: HttpClient) { }


  depositarDinero(idUsuario: number, token: string, cuenta: Cuenta): Observable<Cuenta> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Cuenta>(`${this.backUrl}/movimiento/${idUsuario}`, cuenta, { headers: headers })
  }


}
