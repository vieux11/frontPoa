import { Component } from '@angular/core';
import { ReservationService } from '../../core/services/reservation.service';
import { Reservation } from '../../models/reservation';
import { ReservationComponent } from '../reservation/reservation.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-clientdash',
  imports: [ReservationComponent, NgFor, NgIf],
  templateUrl: './clientdash.component.html',
  styleUrl: './clientdash.component.css'
})
export class ClientdashComponent {
  reservations: Reservation[] = [];
  loading = true;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.reservationService.getMyReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        console.log('Réservations chargées', this.reservations);
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
}
