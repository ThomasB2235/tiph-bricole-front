import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getBijoux(): Observable<Bijou[]> {
    return this.http.get<Bijou[]>(this.apiUrl);
  }

  createBijou(bijou: any): Observable<any> {
    return this.http.post(this.apiUrl, bijou);
  }
}
