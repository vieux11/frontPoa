import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client'
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket;
  private eventRooms = new Set<number>();

  constructor() { 
    console.log('🔄 Initialisation WebSocketService...');
    this.socket = io(environment.socketServerUrl, {
      transports: ['websocket', 'polling']
    });
    this.setupListeners();
  }
  private setupListeners() {
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      // Rejoindre toutes les rooms précédentes après reconnexion
      this.eventRooms.forEach(eventId =>{
        this.joinEventRoom(eventId);
      })
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });
    // Écouter TOUS les événements pour debug
    this.socket.onAny((eventName, data) => {
      console.log('📨 Événement reçu:', eventName, data);
    });
  }
  // Écouter les événements de réservation créée
  onReservationCreated(callback: (data: any) => void) {
    this.socket.on('reservation-created', callback);
  }
  // Rejoindre une room spécifique
  joinEventRoom(eventId: number) {
    if (!this.eventRooms.has(eventId)) {
      this.socket.emit('join-event-room', eventId);
      this.eventRooms.add(eventId);
    }
  }

  // Quitter une room
  leaveEventRoom(eventId: number) {
    if (this.eventRooms.has(eventId)) {
      this.socket.emit('leave-event-room', eventId);
      this.eventRooms.delete(eventId);
    }
  }
  // Se déconnecter proprement
  disconnect() {
    this.socket.disconnect();
  }
}
