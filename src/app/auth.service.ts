import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

const backEnd = environment.backEnd;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = backEnd + '/token';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getCurrentUser() {
    const user = localStorage.getItem('username');
    return user ? JSON.parse(user) : null;
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return token !== null && role === 'admin';
  }

}
