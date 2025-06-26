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
  selectedFile: File | null = null;
  imageError: string | null = null;
  fileName: string = ''; // Nouvelle propriété pour stocker le nom du fichier

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    // Réinitialise les erreurs
    this.imageError = null;
    
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name; // Stocke le nom du fichier
      
      // Validation du fichier
      const ext = this.selectedFile.name.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
        this.imageError = 'Formats acceptés: JPG, JPEG, PNG, WEBP';
        this.selectedFile = null;
        this.fileName = '';
      } else if (this.selectedFile.size > 5 * 1024 * 1024) {
        this.imageError = 'Fichier trop volumineux (max 5MB)';
        this.selectedFile = null;
        this.fileName = '';
      }
    } else {
      this.selectedFile = null;
      this.fileName = '';
    }
  }

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
      image: ['']
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
  this.eventForm.markAllAsTouched();
  
  // Vérification uniquement sur les champs non-fichiers
  if (this.eventForm.invalid) {
    console.log('Erreurs dans le formulaire:', this.eventForm.errors);
    return;
  }

  if (!this.selectedFile) {
    this.imageError = 'Veuillez sélectionner une image';
    return;
  }

  const formValues = this.eventForm.value;
  // Crée une date en UTC pour éviter le décalage
  const dateStr = `${formValues.eventDate}T${formValues.heure}:00Z`;
  const dateObj = new Date(dateStr);
  const fullDatetime = dateObj.toISOString().replace('.000Z', '');

  const formData = new FormData();
  formData.append('image', this.selectedFile);
  formData.append('title', formValues.title);
  formData.append('description', formValues.description);
  formData.append('location', formValues.location);
  formData.append('eventDate', formValues.eventDate);
  formData.append('heure', fullDatetime);
  formData.append('maxParticipants', formValues.maxParticipants.toString());

  console.log('Envoi des données:', {
    title: formValues.title,
    description: formValues.description,
    location: formValues.location,
    eventDate: formValues.eventDate,
    heure: fullDatetime,
    maxParticipants: formValues.maxParticipants,
    file: this.selectedFile.name
  });
  console.log('Heure originale:', formValues.heure);
  console.log('DateTime complète:', fullDatetime);
  this.eventService.createEvent(formData).subscribe({
    next: () => {
      this.router.navigate(['/admin']);
    },
    error: (err) => {
      console.error('Erreur API:', err);
      this.apiError = err.error?.message || 'Erreur lors de la création';
      this.submitted = true;
    }
  });
}
  closeError() {
    this.apiError = '';
    this.submitted = false;
  }
}
