import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, ViewChild, ElementRef} from '@angular/core';
import { Reservation } from '../../models/reservation';
import { DatePipe } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

@Component({
  selector: 'app-reservation',
  imports: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
  providers: [DatePipe]
})
export class ReservationComponent {
  @Input() reservation!: Reservation; 
  @ViewChild('ticket') ticketElement!: ElementRef;
  constructor(private datePipe: DatePipe) {}
   async generateTicket() {
    const doc = new jsPDF();

    // Données de la réservation
    const { clientName, eventTitle, eventDate, eventTime, eventLocation, coupon, createdAt } = this.reservation;

    // Formatage des dates et heures
    const formattedDate = this.datePipe.transform(eventDate, 'dd/MM/yyyy') ?? '';
    const formattedTime = this.datePipe.transform(eventTime, 'HH:mm') ?? '';
    const formattedCreatedAt = this.datePipe.transform(createdAt, 'dd/MM/yyyy à HH:mm') ?? '';

    // Générer le contenu du QR code
    const qrContent = `Nom: ${clientName}\nÉvénement: ${eventTitle}\nDate: ${formattedDate} ${formattedTime}\nLieu: ${eventLocation}\nCoupon: ${coupon}`;
    const qrCodeUrl = await QRCode.toDataURL(qrContent);

    // Mise en page
    doc.setFont('helvetica');
    doc.setTextColor('#A03473');
    doc.setFontSize(18);
    doc.text('poaEvent - Billet de Réservation', 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(`Client: ${clientName}`, 20, 40);
    doc.text(`Événement: ${eventTitle}`, 20, 50);
    doc.text(`Date: ${formattedDate}`, 20, 60);
    doc.text(`Heure: ${formattedTime}`, 20, 70);
    doc.text(`Lieu: ${eventLocation}`, 20, 80);
    doc.text(`Coupon: ${coupon}`, 20, 90);
    doc.text(`Réservé le: ${formattedCreatedAt}`, 20, 100);

    // Ajouter le QR code
    doc.addImage(qrCodeUrl, 'PNG', 20, 110, 60, 60);

    // Sauvegarde du fichier
    doc.save(`Billet_${clientName}.pdf`);
  }
}
