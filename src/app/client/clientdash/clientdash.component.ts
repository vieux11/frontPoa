import { Component } from '@angular/core';
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation } from '../../models/reservation';
import { ReservationComponent } from '../reservation/reservation.component';
import { NgFor, NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-clientdash',
  imports: [ReservationComponent, NgFor, NgIf, NgClass],
  templateUrl: './clientdash.component.html',
  styleUrl: './clientdash.component.css'
})
export class ClientdashComponent {
  reservations: Reservation[] = [];
  loading = true;
  
  // Propriétés de pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  paginatedReservations: Reservation[] = [];

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.reservationService.getMyReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        console.log('Réservations chargées', this.reservations);
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement des réservations', err);
        this.loading = false;
      },
    });
  }

  handleDownload(reservationId: number) {
    console.log('Téléchargement du billet ID', reservationId);
    // TODO: implémentation du téléchargement
  }

  // Méthodes de pagination
  updatePagination() {
    this.totalPages = Math.ceil(this.reservations.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    this.updatePaginatedReservations();
  }

  updatePaginatedReservations() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedReservations = this.reservations.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedReservations();
    }
  }
}
