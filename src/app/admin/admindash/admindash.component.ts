import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventService } from '../../core/services/event.service';
import { DatePipe, NgFor, SlicePipe, NgClass } from '@angular/common';


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
  imports: [RouterLink, DatePipe, NgClass],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admindash.component.html',
  styleUrl: './admindash.component.css'
})
export class AdmindashComponent {
  eventsWithStats: EventWithStats[] = [];
  isLoading = true;
  hasError = false;
  
  // Propriétés de pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  paginatedEvents: EventWithStats[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.fetchMyEventsWithStats();
  }

  fetchMyEventsWithStats() {
    this.isLoading = true;
    this.hasError = false;
    
    this.eventService.getMyEvents().subscribe({
      next: (events) => {
        if (events.length === 0) {
          this.isLoading = false;
          return;
        }

        let processedEvents = 0;
        events.forEach((event) => {
          this.eventService.getStats(event.id).subscribe({
            next: (stats) => {
              this.eventsWithStats.push({
                ...event,
                remainingSeats: stats.remainingSeats,
                totalReservations: stats.totalReservations
              });
              
              processedEvents++;
              if (processedEvents === events.length) {
                this.updatePagination();
                this.isLoading = false;
              }
            },
            error: () => this.handleError()
          });
        });
      },
      error: () => this.handleError()
    });
  }

  private handleError() {
    this.isLoading = false;
    this.hasError = true;
  }

  // Méthodes de pagination
  updatePagination() {
    this.totalPages = Math.ceil(this.eventsWithStats.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.updatePaginatedEvents();
  }

  updatePaginatedEvents() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.eventsWithStats.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedEvents();
    }
  }

}
