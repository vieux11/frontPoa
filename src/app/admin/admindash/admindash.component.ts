import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { DatePipe, NgFor, SlicePipe } from '@angular/common';


interface EventWithStats {
    id?: number
    title: string
    description: string
    location: string
    eventDate: string
    heure?: string
    maxParticipants: number
    image: string
    adminId?: number
    adminFullName?: string
    createdAt?: string
    updatedAt?: string
  remainingSeats: number;
  totalReservations: number;
}

@Component({
  selector: 'app-admindash',
  imports: [RouterLink, NgFor, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admindash.component.html',
  styleUrl: './admindash.component.css'
})
export class AdmindashComponent {
  eventsWithStats: EventWithStats[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.fetchMyEventsWithStats();
  }

  fetchMyEventsWithStats() {
    this.eventService.getMyEvents().subscribe({
      next: (events) => {
        // Pour chaque événement, on récupère les stats et on fusionne les données
        console.log("lles events, vous ressemblez à quoi:", events)

        events.forEach((event) => {
         
          this.eventService.getStats(event.id).subscribe({
            next: (stats) => {
              console.log("montre moi les stats ", stats)
              const enrichedEvent: EventWithStats = {
                ...event,
                remainingSeats: stats.remainingSeats,
                totalReservations: stats.totalReservations
              };
              this.eventsWithStats.push(enrichedEvent);
            },
            error: (err) => console.error('Erreur stats event', err)
          });
        });
        console.log('Events with stats:', this.eventsWithStats);
      },
      error: (err) => console.error('Erreur récupération événements', err)
    });
  }

}
