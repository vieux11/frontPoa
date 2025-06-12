import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserLogin } from '../../models/user';

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
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
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

    this.authService.register(
      this.registerForm.value.nom.trim(),
      this.registerForm.value.email,
      this.registerForm.value.password,
      this.registerForm.value.role
    ).subscribe({
      next: () => {
        this.showSuccessToast = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Redirection après 2 secondes
      },
      error: (err) => {
        this.apiError = 'Erreur lors de l’inscription';
        this.submitted = true;
      }
    });
  }

  close() {
    this.registerForm.reset();
    this.submitted = false;
  }

}
