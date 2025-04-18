import { Component } from '@angular/core';
import { HeaderComponent } from './../header/header.component';
import { BijouService } from './../bijou.service';
import { Bijou } from './../models/bijou.model';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title = 'tiph-bricole';
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  bijoux: Bijou[] = [];
  imagePleineEcran: string | null = null;

  constructor(private bijouService: BijouService) {}

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

  displayBijouImage(name: string) : string {
    return environment.imagesDirectory + name;
  }

  ouvrirImage(img: string) {
    this.imagePleineEcran = img;
  }

  fermerImage() {
    this.imagePleineEcran = null;
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
