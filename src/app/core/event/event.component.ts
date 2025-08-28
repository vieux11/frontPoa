import { EventService } from './../services/event.service';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, signal, effect, inject } from '@angular/core';
import { EventType } from '../../models/event';
import { Router } from '@angular/router';
import { DatePipe, NgIf } from '@angular/common';
import { ReservationService } from '../services/reservation.service';

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

  constructor(private router: Router, private reservationService: ReservationService) {
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

    this.loading = true;

    this.reservationService.createReservation(this.event.id).subscribe({
      next: (res) => {
        this.loading = false;
        alert('Réservation réussie !');
        this.router.navigate(['/client']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 400) {
          alert(err.error.message || 'Impossible de réserver.');
        } else {
          console.error(err);
          alert(err.error.message);
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
