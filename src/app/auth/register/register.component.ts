import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { UserLogin } from '../../models/user';

@Component({
  selector: 'app-register',
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  user! : UserLogin;
  submitted = false;
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role:['', Validators.required]
    });
  }

  handleSubmit() {
    this.authService.register(
      this.registerForm.value.nom,
      this.registerForm.value.email,
      this.registerForm.value.password,
      this.registerForm.value.role
    ).subscribe({
      next: () => {
        // Enregistrement réussi → rediriger vers login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur d’inscription :', err);
        this.submitted = true;
      }
    });
  }

  close() {
    this.submitted = false;
  }

}
