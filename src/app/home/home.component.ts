import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../core/services/event.service';
import { EventType } from '../models/event';
import { NgFor } from '@angular/common';
import { EventComponent } from '../core/event/event.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-home',
  imports: [EventComponent, RouterLink, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  latestEvents: EventType[] = [];
  isLoading = true;
  hasError = false;
  
  constructor(
    public authService: AuthService, 
    private router: Router, 
    public eventservice: EventService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading = true;
    this.hasError = false;
    
    this.eventservice.getAllEvents().subscribe({
      next: (events) => {
        this.latestEvents = events
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
          .slice(0, 6);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  handleCreateEvent() {
    const isAuth = this.authService.isAuthenticated();
    const role = this.authService.getRole();

    if (!isAuth) {
      this.toastService.warning('Vous devez être connecté pour créer un événement');
      this.router.navigate(['/login']);
      return;
    } else if (role === 'admin') {
      this.router.navigate(['/creer-event']);
    }
    else {
      this.toastService.error('Seuls les administrateurs peuvent créer des événements');
      this.router.navigate(['/login']);
    }
  }

  handleBookEvent() {
    const isAuth = this.authService.isAuthenticated();
    const role = this.authService.getRole();

    if (!isAuth) {
      this.toastService.warning('Vous devez être connecté pour réserver des événements');
      this.router.navigate(['/login'], {
        state: { from: { pathname: '/client/events' } },
      });
    } else if (role === 'client') {
      this.router.navigate(['/client/events']);
    } else {
      this.toastService.error('Seuls les clients peuvent réserver des événements');
    }
  }

  goToClientEvents() {
    this.router.navigate(['/client/events']);
  }
}
