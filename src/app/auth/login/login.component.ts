import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  Submitted = false;

  constructor(private authService: AuthService, private router: Router, private fb:FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.email, Validators.required]]
    });
  }

  handleSubmit() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (res) => {
        this.authService.loginSuccess(res);
        const role = this.authService.getRole();
        if (role === 'admin') this.router.navigate(['/admin']);
        else this.router.navigate(['/client']);
      },
      error: (err) => {
        console.error('Erreur de connexion :', err);
        alert("Email ou mot de passe incorrect !");
        this.Submitted = true;
      }
    });
  }

close() {
  this.Submitted = false
}
}
