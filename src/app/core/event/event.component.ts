import { EventService } from './../services/event.service';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, signal } from '@angular/core';
import { EventType } from '../../models/event';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event',
  imports: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  @Input() event!: EventType;
  remainingSeats = signal<number>(0);

  constructor(private router: Router, public eventservice : EventService) {}

  ngOnInit(): void {
    console.log('EventComponent initialized with event:', this.event);
    if (this.event?.id) {
      this.eventservice.getStats(this.event.id).subscribe({
        next: (stats) => {
          this.remainingSeats.update(value=>value = stats.remainingSeats) ;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des stats :', err);
        }
      });
    }
  }
  goToDetails(): void {
    this.router.navigate(['/client/events', this.event.id]);
  }

}
