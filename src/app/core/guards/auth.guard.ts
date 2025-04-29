import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si l'utilisateur est authentifié, autoriser l'accès
  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Sinon, rediriger vers la page de login
    router.navigate(['/login']);
    return false;
  }
};
