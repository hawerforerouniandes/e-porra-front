import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuenta } from './cuenta';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  private backUrl: string = "https://e-porra-backend-grupo38.herokuapp.com"

  constructor(private http: HttpClient) { }


  depositarDinero(idUsuario: number, token: string, cuenta: Cuenta): Observable<Cuenta> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Cuenta>(`${this.backUrl}/movimiento/${idUsuario}`, cuenta, { headers: headers })
  }


}
