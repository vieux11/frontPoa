import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventType, EventTypeSend } from '../../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseUrl = 'http://127.0.0.1:3333' //  backend
 


  constructor(private http: HttpClient) {}

  // Créer un événement (admin uniquement)
  createEvent(data: FormData | EventTypeSend): Observable<EventTypeSend> {
  const tokenBearer = localStorage.getItem('token') || '';
  
  let headers = new HttpHeaders({
    'Authorization': `Bearer ${tokenBearer}`
  });

  // Si c'est FormData, ne pas mettre Content-Type (le navigateur l'ajoutera automatiquement)
  if (!(data instanceof FormData)) {
    headers = headers.set('Content-Type', 'application/json');
  }

  return this.http.post<EventTypeSend>(`${this.baseUrl}/createEvent`, data, { headers })
    .pipe(
      catchError(error => {
        console.error('Erreur détaillée:', error);
        return throwError(() => error);
      })
    );
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
