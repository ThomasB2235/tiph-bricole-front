import { Component } from '@angular/core';
import { Bijou } from '../models/bijou.model';
import { BijouService } from '../bijou.service';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  bijoux: Bijou[] = [];
  imagePleineEcran: string | null = null;
  imagePleineEcranASupprimer: string | null = null;
  idBijouSupprimer: number | undefined;

  constructor(private bijouService: BijouService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.bijouService.getBijoux().subscribe((bijoux) => {
      this.bijoux = bijoux;
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

  supprimer(id: number) {
    console.log('supprimer le bijou', id);
  }

  annulerSuppprimer() {
    this.idBijouSupprimer = undefined;
  }

  goToAjouter() {
    this.router.navigate(['/ajouter']);
  }
}
