import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { BijouService } from './bijou.service';
import { Bijou } from './models/bijou.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tiph-bricole-front';

  bijoux: Bijou[] = [];

  constructor() {}
}
