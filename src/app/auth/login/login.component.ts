import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl} from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  showSuccessToast = false;
  apiError = '';
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  handleSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.submitted = false;
    this.apiError = '';

    this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    ).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showSuccessToast = true;
        this.authService.loginSuccess(res);
        
        this.toastService.success('Connexion réussie ! Redirection en cours...', 1500);
        
        setTimeout(() => {
          const role = this.authService.getRole();
          role === 'admin' 
            ? this.router.navigate(['/admin']) 
            : this.router.navigate(['/client']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.submitted = true;
        
        // Messages d'erreur plus détaillés et conviviaux
        let errorMessage = 'Une erreur est survenue lors de la connexion';
        
        if (err.status === 401) {
          errorMessage = 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.';
        } else if (err.status === 404) {
          errorMessage = 'Compte non trouvé. Vérifiez votre email ou créez un nouveau compte.';
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

  closeError() {
    this.submitted = false;
    this.apiError = '';
    this.loginForm.get('password')?.reset();
    this.loginForm.get('email')?.reset();
  }
}
