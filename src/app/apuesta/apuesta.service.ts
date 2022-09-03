import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apuesta } from './apuesta';

@Injectable({
  providedIn: 'root'
})
export class ApuestaService {

  private backUrl: string = "https://e-porra-backend-grupo38.herokuapp.com"

  constructor(private http: HttpClient) { }

  getApuestas(token: string): Observable<Apuesta[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Apuesta[]>(`${this.backUrl}/apuestas`, { headers: headers })
  }

  getApuestasApostador(token: string, apostadorId: number): Observable<Apuesta[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Apuesta[]>(`${this.backUrl}/apuestas/${apostadorId}`, { headers: headers })
  }

  crearApuesta(apuesta: Apuesta, token: string): Observable<Apuesta> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Apuesta>(`${this.backUrl}/apuestas`, apuesta, { headers: headers })
  }

  getApuesta(apuestaId: number, token: string): Observable<Apuesta> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Apuesta>(`${this.backUrl}/apuesta/${apuestaId}`, { headers: headers })
  }

  editarApuesta(apuesta: Apuesta, apuestaId: number, token: string): Observable<Apuesta> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.put<Apuesta>(`${this.backUrl}/apuesta/${apuestaId}`, apuesta, { headers: headers })
  }

  eliminarApuesta(apuestaId: number, token: string): Observable<Apuesta> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.delete<Apuesta>(`${this.backUrl}/apuesta/${apuestaId}`, { headers: headers })
  }

}
