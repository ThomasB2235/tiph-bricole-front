import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bijou } from './models/bijou.model';
import { environment } from '../environments/environment';

const backEnd = environment.backEnd;

@Injectable({
  providedIn: 'root',
})
export class BijouService {
  // Utilisation de l'URL du backend depuis le fichier d'environnement
  private apiUrl = backEnd + '/bijoux';  // Adresse du backend

  constructor(private http: HttpClient) {}

  getBijoux(page: number, limit: number): Observable<{ bijoux: Bijou[], total: number }> {
    const headers = new HttpHeaders({
      'Accept-Encoding': 'gzip, compress, br'
    });
    return this.http.get<{ bijoux: Bijou[], total: number }>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  createBijou(bijou: any): Observable<any> {
    return this.http.post(this.apiUrl, bijou);
  }
}
