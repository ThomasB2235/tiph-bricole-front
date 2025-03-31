import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { adminGuard } from './guards/admin.guard';
import { AjouterComponent } from './ajouter/ajouter.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'ajouter', component: AjouterComponent, canActivate: [adminGuard] }
];

export const appRouterProviders = provideRouter(routes);
