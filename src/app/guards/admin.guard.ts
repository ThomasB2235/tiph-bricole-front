import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  // Injection du service Router pour rediriger si l'utilisateur n'est pas admin
  const router = inject(Router);

  // Récupération du rôle de l'utilisateur depuis localStorage
  const userRole = localStorage.getItem('role');

  // Si l'utilisateur n'a pas de rôle ou n'est pas admin, on le redirige vers la page de login
  if (userRole !== 'admin') {
    router.navigate(['/']);  // Redirection vers la page de login ou une autre page
    return false;
  }

  return true;  // Si le rôle est admin, on permet l'accès à la route protégée
};
