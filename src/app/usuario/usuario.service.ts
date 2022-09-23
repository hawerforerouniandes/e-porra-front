import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private backUrl: string = environment.baseUrl

    constructor(private http: HttpClient) { }

    userLogIn(usuario: string, contrasena: string): Observable<any> {
        return this.http.post<any>(`${this.backUrl}/login`, { "usuario": usuario, "contrasena": contrasena });
    }

    userSignUp(data: any): Observable<any> {
      return this.http.post<any>(`${this.backUrl}/signin`, data)
    }

    getApostador(idApostador: number, token: string): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
      return this.http.get<any>(`${this.backUrl}/apostador/${idApostador}`, { headers: headers })
    }

    getApostadores(token: string): Observable<any> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
      return this.http.get<any>(`${this.backUrl}/apostadores`, { headers: headers })
    }

}
