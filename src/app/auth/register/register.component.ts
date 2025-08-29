import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserLogin } from '../../models/user';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  showSuccessToast = false;
  registerForm: FormGroup;
  user! : UserLogin;
  submitted = false;
  apiError = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
      ]],
      role: ['', Validators.required]
    });
  }

  handleSubmit() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.submitted = false;
    this.apiError = '';

    this.authService.register(
      this.registerForm.value.nom.trim(),
      this.registerForm.value.email,
      this.registerForm.value.password,
      this.registerForm.value.role
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccessToast = true;
        this.toastService.success('Compte créé avec succès ! Redirection vers la page de connexion...', 2000);
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.submitted = true;
        
        // Messages d'erreur plus détaillés et conviviaux
        let errorMessage = 'Une erreur est survenue lors de l\'inscription';
        
        if (err.status === 409) {
          errorMessage = 'Un compte avec cet email existe déjà. Veuillez utiliser un autre email ou vous connecter.';
        } else if (err.status === 400) {
          errorMessage = 'Données invalides. Veuillez vérifier les informations saisies.';
        } else if (err.status === 0 || err.status >= 500) {
          errorMessage = 'Problème de connexion au serveur. Veuillez réessayer plus tard.';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        
        this.apiError = errorMessage;
        this.toastService.error(errorMessage);
      }
    });
  }

  close() {
    this.registerForm.reset();
    this.submitted = false;
    this.apiError = '';
  }
}
