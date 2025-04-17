import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  if (!token || !userRole || userRole !== 'admin') {
    router.navigate(['/']);
    return false;
  } else {
    return true;
  }
};
