import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = 'http://localhost:3000/api/getUserIdByEmail';
  constructor(private http: HttpClient) { }

  // Funcție pentru a obține ID-ul utilizatorului pe baza email-ului
  getUserIdByEmail(email: string): Observable<{ id: number }> {
    const params = new HttpParams().set('email', email);
    return this.http.get<{ id: number }>(this.apiUrl, { params });
  }
}
