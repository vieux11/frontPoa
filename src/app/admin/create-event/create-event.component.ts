import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { EventService } from '../../core/services/event.service';
import { Router } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';

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
  fileName: string = '';
  isLoading = false;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    // Réinitialise les erreurs
    this.imageError = null;
    
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
      
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
    private router: Router,
    private toastService: ToastService
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

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate < today ? { pastDate: true } : null;
  }

  handleSubmit() {
    this.eventForm.markAllAsTouched();
    
    // Vérification uniquement sur les champs non-fichiers
    if (this.eventForm.invalid) {
      console.log('Erreurs dans le formulaire:', this.eventForm.errors);
      return;
    }

    if (!this.selectedFile) {
      this.imageError = 'Veuillez sélectionner une image';
      this.toastService.warning('Veuillez sélectionner une image pour votre événement');
      return;
    }

    this.isLoading = true;
    this.submitted = false;
    this.apiError = '';

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
        this.isLoading = false;
        this.toastService.success('Événement créé avec succès ! Redirection vers le tableau de bord...', 2000);
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur API:', err);
        
        let errorMessage = 'Erreur lors de la création de l\'événement';
        
        if (err.status === 400) {
          errorMessage = 'Données invalides. Veuillez vérifier les informations saisies.';
        } else if (err.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          errorMessage = 'Vous n\'avez pas les permissions pour créer un événement.';
        } else if (err.status === 0 || err.status >= 500) {
          errorMessage = 'Problème de connexion au serveur. Veuillez réessayer plus tard.';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        
        this.apiError = errorMessage;
        this.submitted = true;
        this.toastService.error(errorMessage);
      }
    });
  }

  closeError() {
    this.apiError = '';
    this.submitted = false;
  }
}
