import { Component } from '@angular/core';
import { Bijou } from '../models/bijou.model';
import { BijouService } from '../bijou.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  currentPage = 1;
  itemsPerPage = 4;
  totalItems = 0;
  bijoux: Bijou[] = [];
  imagePleineEcran: string | null = null;
  imagePleineEcranASupprimer: string | null = null;
  idBijouSupprimer: number | undefined;

  constructor(private bijouService: BijouService,
              private authService: AuthService,
              private router: Router,
              private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBijoux();
  }

  loadBijoux() {
    this.bijouService.getBijoux(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        this.bijoux = data.bijoux;
        this.totalItems = data.total;
      }
    });
  }

  displayBijouImage(name: string): string {
    return environment.imagesDirectory + name;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ouvrirImage(img: string) {
    this.imagePleineEcran = img;
  }

  fermerImage() {
    this.imagePleineEcran = null;
  }

  ouvrirValiderSupprimer(id: number, img: string) {
    this.idBijouSupprimer = id;
    this.imagePleineEcranASupprimer = img;
  }


  supprimer(bijouId: number) {
    const token = localStorage.getItem("token");
    this.idBijouSupprimer = undefined;
    if (!token) {
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(`http://localhost:8000/bijoux/${bijouId}`, { headers }).subscribe({
      next: () => {
        this.loadBijoux();
      },
      error: (error) => {
      }
    });
  }

  annulerSuppprimer() {
    this.idBijouSupprimer = undefined;
  }

  goToAjouter() {
    this.router.navigate(['/ajouter']);
  }


  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBijoux();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.loadBijoux();
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
