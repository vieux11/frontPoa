import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { EventType } from '../../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseUrl = 'https://poaevent-back.onrender.com' //  backend
 


  constructor(private http: HttpClient) {}

  // Créer un événement (admin uniquement)
  createEvent(data: Event): Observable<EventType> {
  const  tokenBearer = localStorage.getItem('token') || null;
    return this.http.post<EventType>(`${this.baseUrl}/createEvent`, data, 
      {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': `Bearer ${tokenBearer}`
        }
      }
    )
  }

  // Obtenir tous les événements
  getAllEvents(): Observable<EventType[]> {
    return this.http.get<EventType[]>(`${this.baseUrl}/events`,
      {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      }
    )
  }

  // Obtenir les événements du user connecté (admin uniquement)
  getMyEvents(): Observable<EventType[]> {
  const  tokenBearer = localStorage.getItem('token') || null;
   return this.http.get<EventType[]>(`${this.baseUrl}/getMyEvents`, 
    {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${tokenBearer}`
      }
    }
   )
  }

  // Récupérer les places restantes + réservations d’un événement
  getStats(eventId?: number): Observable<{ remainingSeats: number, totalReservations: number }> {
    return this.http.get<{ remainingSeats: number, totalReservations: number }>(
      `${this.baseUrl}/event/${eventId}/remainingSeats`,
      {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      }
    );
  }
}
