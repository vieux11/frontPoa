import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string; // Le rôle requis depuis la route

  // Vérifie si l'utilisateur est authentifié et si son rôle correspond au rôle requis
  if (authService.isAuthenticated() && authService.getRole() === requiredRole) {
    return true;
  } else {
    // Sinon, rediriger vers la page de login
    router.navigate(['/login']);
    return false;
  }
};
