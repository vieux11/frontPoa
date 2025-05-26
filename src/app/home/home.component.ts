import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../core/services/event.service';
import { EventType } from '../models/event';
import { NgFor } from '@angular/common';
import { EventComponent } from '../core/event/event.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [NgFor, EventComponent, RouterLink, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  latestEvents: EventType[] = [];
  constructor(public authService: AuthService, private router: Router, public eventservice:EventService) {}
  ngOnInit(): void {
    this.eventservice.getAllEvents().subscribe((events) => {
      this.latestEvents = events
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        .slice(0, 6);
    });
  }

  handleCreateEvent() {
    const isAuth = this.authService.isAuthenticated();
    const role = this.authService.getRole();

    if (!isAuth) {
      this.router.navigate(['/login']);
      return;
    } else if (role === 'admin') {
      this.router.navigate(['/creer-event']);
    }
    else {
      // rôle inconnu ou comportement par défaut
      this.router.navigate(['/login']);
    }
  }

  handleBookEvent() {
    const isAuth = this.authService.isAuthenticated();
    const role = this.authService.getRole();

    if (!isAuth) {
      this.router.navigate(['/login'], {
        state: { from: { pathname: '/client/events' } },
      });
    } else if (role === 'client') {
      this.router.navigate(['/client/events']);
    }
  }

  goToClientEvents() {
    this.router.navigate(['/client/events']);
  }

}
