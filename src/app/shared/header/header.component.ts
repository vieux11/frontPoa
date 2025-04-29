import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgIf, RouterLink, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
  }

  logout() {
    this.authService.logout().subscribe({
      next: ({message, status}) => {
        this.authService.isConnected.set(false);
        this.authService.token.set(null);
        this.authService.nom.set('');
        this.authService.role.set('');
        localStorage.clear();
        console.log(`Déconnexion réussie : ${message} avec un status ${status}`);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur de déconnexion :', err);
      }
    });
    this.router.navigate(['/login']);
  }

  // Naviguer vers une autre page en fonction du rôle
  navigateToAdminEvents() {
    this.router.navigate(['/admin/events']);
  }

  navigateToClientEvents() {
    this.router.navigate(['/client/events']);
  }

  navigateToReservations() {
    if (this.authService.getRole() === 'admin') {
      this.router.navigate(['/admin/reservations']);
    } else if (this.authService.getRole()=== 'client') {
      this.router.navigate(['/client/reservations']);
    }
  }
}
