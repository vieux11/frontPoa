import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-create-event',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  eventForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      eventDate: ['', Validators.required],
      heure: ['', Validators.required],
      maxParticipants: [0, [Validators.required, Validators.min(1)]],
      image: ['']
    });
  }

  handleSubmit() {
    if (this.eventForm.invalid) return;
    const formValues = this.eventForm.value;

  // Concaténer la date et l’heure
  const eventDate = formValues.eventDate; // ex: "2025-04-25"
  const heure = formValues.heure;         // ex: "20:00"

  const fullDatetime = `${eventDate} ${heure}:00`; // ex: "2025-04-25 20:00:00"

  const eventData = {
    ...formValues,
    heure: fullDatetime // On envoie le champ heure au bon format pour MySQL
  };

    this.eventService.createEvent(eventData).subscribe({
      next: () => {
        console.log('Événement créé avec succès');
        this.router.navigate(['/admin']); // ou autre page après création
      },
      error: (err) => {
        console.error('Erreur création événement :', err);
        this.submitted = true;
      }
    });
  }

  close() {
    this.submitted = false;
  }
}
