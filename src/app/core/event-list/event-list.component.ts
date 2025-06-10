import { Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { EventType } from '../../models/event';
import { EventService } from '../services/event.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { EventComponent } from '../event/event.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-event-list',
  imports: [NgFor, EventComponent, FormsModule, NgClass, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent {
  events: EventType[] = [];
  searchTerm: string = '';
   // pagination
  currentPage = 1;
  itemsPerPage = 6;


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
  // événements à afficher sur la page courante
  get paginatedEvents(): EventType[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEvents.slice(start, start + this.itemsPerPage);
  }
   get data():boolean{
    return this.paginatedEvents.length>0;
   }

  // nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.filteredEvents.length / this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
