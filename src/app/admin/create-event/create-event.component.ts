import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-event',
  imports: [ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  eventForm: FormGroup;
  submitted = false;
  apiError = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      location: ['', Validators.required],
      eventDate: ['', [Validators.required, this.futureDateValidator]],
      heure: ['', Validators.required],
      maxParticipants: [0, [Validators.required, Validators.min(1)]],
      image: ['', Validators.required]
    });
  }

  // Validateur custom : Date future
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    return selectedDate < today ? { pastDate: true } : null;
  }

  // Validateur custom : URL optionnelle mais valide si renseignée
  handleSubmit() {
    this.eventForm.markAllAsTouched(); // Force l'affichage des erreurs
    if (this.eventForm.invalid) return;

    const formValues = this.eventForm.value;
    const fullDatetime = `${formValues.eventDate} ${formValues.heure}:00`;

    this.eventService.createEvent({ ...formValues, heure: fullDatetime }).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.apiError = err.message || 'Erreur lors de la création';
        this.submitted = true;
      }
    });
  }

  closeError() {
    this.apiError = '';
    this.submitted = false;
  }
}
