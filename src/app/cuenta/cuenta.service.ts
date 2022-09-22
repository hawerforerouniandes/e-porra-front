import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuenta } from './cuenta';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  private backUrl: string = environment.baseUrl

  constructor(private http: HttpClient) { }


  depositarDinero(idUsuario: number, token: string, cuenta: Cuenta): Observable<Cuenta> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Cuenta>(`${this.backUrl}/movimiento/${idUsuario}`, cuenta, { headers: headers })
  }


  getMovimientos(idUsuario: number, token: string): Observable<Cuenta[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Cuenta[]>(`${this.backUrl}/consulta/${idUsuario}`, { headers: headers })
  }





}
