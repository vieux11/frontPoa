import { EventService } from './../services/event.service';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, signal, effect, inject } from '@angular/core';
import { EventType } from '../../models/event';
import { Router } from '@angular/router';
import { DatePipe, NgIf } from '@angular/common';
import { ReservationService } from '../services/reservation.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-event',
  imports: [DatePipe, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  @Input() event!: EventType;
  loading = false;
  remainingSeats = signal<number>(0);
  public eventservice = inject(EventService);

  constructor(
    private router: Router, 
    private reservationService: ReservationService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
      // Écouter les mises à jour en temps réel
    effect(() => {
      const update = this.eventservice.remainingSeatsUpdated();
      if (update && update.eventId === this.event.id) {
        this.remainingSeats.set(update.seats);
      }
    });
  }

  ngOnInit(): void {
    console.log('EventComponent initialized with event:', this.event);
    if (this.event?.id) {
      // Rejoindre la room WebSocket
      this.eventservice.joinEventRoom(this.event.id);
      // Charger les stats initiales
      this.loadInitialStats();
    
    }
  }
  private loadInitialStats() {
    this.eventservice.getStats(this.event.id).subscribe({
      next: (stats) => {
        this.remainingSeats.set(stats.remainingSeats);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des stats :', err);
      }
    });
  }

  handleReservation(): void {
    if (!this.event || !this.event.id) return;

    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isAuthenticated()) {
      this.toastService.warning('Vous devez être connecté pour réserver un événement');
      this.router.navigate(['/login']);
      return;
    }

    // Vérifier si l'utilisateur est un client
    if (this.authService.getRole() !== 'client') {
      this.toastService.error('Seuls les clients peuvent réserver des événements');
      return;
    }

    this.loading = true;

    this.reservationService.createReservation(this.event.id).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastService.success('Réservation réussie ! Redirection vers votre tableau de bord...');
        setTimeout(() => {
          this.router.navigate(['/client']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 400) {
          this.toastService.error(err.error.message || 'Impossible de réserver cet événement');
        } else if (err.status === 401) {
          this.toastService.error('Session expirée. Veuillez vous reconnecter');
          this.router.navigate(['/login']);
        } else {
          console.error(err);
          this.toastService.error('Erreur lors de la réservation. Veuillez réessayer');
        }
      },
    });
  }
  ngOnDestroy(): void {
    if (this.event?.id) {
      this.eventservice.leaveEventRoom(this.event.id);
    }
  }
}
