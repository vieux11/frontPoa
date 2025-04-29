import { Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { EventType } from '../../models/event';
import { EventService } from '../services/event.service';
import { NgFor } from '@angular/common';
import { EventComponent } from '../event/event.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-event-list',
  imports: [NgFor, EventComponent, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent {
  events: EventType[] = [];
  searchTerm: string = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe((data) => {
      this.events = data;
    });
  }

  get filteredEvents(): EventType[] {
    if (!this.searchTerm.trim()) return this.events;
    return this.events.filter(event =>
      event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}
