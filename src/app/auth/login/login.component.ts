import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl} from '@angular/forms';


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

  constructor(private authService: AuthService, private router: Router, private fb:FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  handleSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    ).subscribe({
      next: (res) => {
        this.showSuccessToast = true;
        this.authService.loginSuccess(res);
        
        setTimeout(() => {
          const role = this.authService.getRole();
          role === 'admin' 
            ? this.router.navigate(['/admin']) 
            : this.router.navigate(['/client']);
        }, 1500);
      },
      error: (err) => {
        this.apiError = err.error?.message || 'Email ou mot de passe incorrect';
        this.submitted = true;
      }
    });
  }

  closeError() {
    this.submitted = false;
  }
}
