import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventType, EventTypeSend } from '../../models/event';
import { WebsocketService } from './websocket.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseUrl = environment.apiUrl //  backend
  // Map pour stocker les places restantes par eventId
  private remainingSeatsMap = new Map<number, number>();
 // Signal pour notifier les changements
  public remainingSeatsUpdated = signal<{eventId: number, seats: number} | null>(null);


  constructor(private http: HttpClient, private webSocketService: WebsocketService) {
    this.setupWebSocketListeners();
  }
  private setupWebSocketListeners() {
    // Écouter les mises à jour de réservation
    this.webSocketService.onReservationCreated((data) => {
      console.log('Reservation created:', data);
      if (data.eventId && data.remainingSeats !== undefined) {
        this.remainingSeatsMap.set(data.eventId, data.remainingSeats);
        this.remainingSeatsUpdated.set({eventId: data.eventId, seats: data.remainingSeats});
      }
    });
  }
   
  // Rejoindre la room WebSocket pour un événement
  joinEventRoom(eventId: number) {
    this.webSocketService.joinEventRoom(eventId);
  }

  // Quitter la room WebSocket
  leaveEventRoom(eventId: number) {
    this.webSocketService.leaveEventRoom(eventId);
  }

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
  // Getter pour les places restantes
  getRemainingSeats(eventId: number): number | undefined {
    return this.remainingSeatsMap.get(eventId);
  }
}
