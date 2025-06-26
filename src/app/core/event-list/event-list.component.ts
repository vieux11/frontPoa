import { Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { EventType } from '../../models/event';
import { EventService } from '../services/event.service';
import { NgClass} from '@angular/common';
import { EventComponent } from '../event/event.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-event-list',
  imports: [EventComponent, FormsModule, NgClass],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent {
  events: EventType[] = [];
  private _searchTerm: string = '';
   // pagination
  currentPage = 1;
  itemsPerPage = 6;
  isLoading = true;
  hasError = false;


  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }
  
  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.currentPage = 1; // Réinitialise à la première page lors d'une nouvelle recherche
  }
  loadEvents() {
    this.isLoading = true;
    this.hasError = false;
    
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
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
