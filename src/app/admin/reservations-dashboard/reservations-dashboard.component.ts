import { ReservationService } from './../../core/services/reservation.service';
import { Component } from '@angular/core';
import { EventType } from '../../models/event';
import { ReservationSummary } from '../../models/event';
import { EventService } from '../../core/services/event.service';
import { DecimalPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-reservations-dashboard',
  imports: [NgIf, FormsModule, NgFor, DecimalPipe, NgClass],
  templateUrl: './reservations-dashboard.component.html',
  styleUrl: './reservations-dashboard.component.css'
})
export class ReservationsDashboardComponent {
  events: EventType[] = [];
  selectedEventId!: number;
  dashboardData!: ReservationSummary;
  currentPage = 1;
  itemsPerPage = 10;
  constructor(private eventService: EventService, private reservationService:ReservationService) {}
  ngOnInit() {
    this.eventService.getMyEvents().subscribe(events => this.events = events);
  }

  onSelectEvent() {
    if (this.selectedEventId) {
      this.reservationService.getReservationSummaries(this.selectedEventId).subscribe(data => {
        this.dashboardData = data;
        console.log('Dashboard data:', this.dashboardData);
      });
    }
  }
  exportPDF() {
    console.log('Exporting PDF for event ID:', this.selectedEventId);
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Réservations (${this.dashboardData.eventTitle})`, 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['Client', 'Coupon']],
      body: this.dashboardData.reservationList.map(r => [r.clientName, r.coupon]),
    });

    doc.save(`Reservations_${this.dashboardData.eventTitle}.pdf`);
  }
  exportCSV() {
    console.log('Exporting Excel for event ID:', this.selectedEventId);
    const rows = [
      ['Client', 'Coupon'],
      ...this.dashboardData.reservationList.map(r => [r.clientName, r.coupon])
    ];
    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reservations_${this.dashboardData.eventTitle}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  getPercentage(): number {
  if (!this.dashboardData || this.dashboardData.totalPlaces === 0) return 0;
  return (this.dashboardData.reservedCount / this.dashboardData.totalPlaces) * 100;
  }
  get paginatedReservations() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.dashboardData.reservationList.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.dashboardData.reservationList.length / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}
