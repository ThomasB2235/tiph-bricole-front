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
  title = 'tiph-bricole-front';

  bijoux: Bijou[] = [];
  imagePleineEcran: string | null = null;

  constructor(private bijouService: BijouService) {}

  ngOnInit(): void {
    // Appel pour récupérer les bijoux
    this.bijouService.getBijoux().subscribe(bijoux => {
      this.bijoux = bijoux.filter(bijou => bijou.stock > 0);
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
}
