import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../../models/reservation';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ReservationSummary } from '../../models/event';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'https://poaevent-back.onrender.com'; // à adapter si besoin

  constructor(private http: HttpClient, private auth:AuthService) {}

  getMyReservations(): Observable<Reservation[]> {
    const tokenBearer=localStorage.getItem('token');
    return this.http.get<Reservation[]>(`${this.apiUrl}/getMyReservations`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${tokenBearer}`
      }
  });
  }

  createReservation(eventId: number): Observable<any> {
    const tokenBearer=localStorage.getItem('token');
    const id = this.auth.getUserId();
    return this.http.post(`${this.apiUrl}/createReservation`, { "clientId" : id, "eventId": eventId }, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${tokenBearer}`
      }
  });
  }
  getReservationSummaries(eventId: number): Observable<ReservationSummary> {
    const tokenBearer=localStorage.getItem('token')|| null;
    return this.http.get<ReservationSummary>(`${this.apiUrl}/events/${eventId}/reservations-dashboard`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${tokenBearer}`
      }
  });
  }
}
