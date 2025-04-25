import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface RegisterResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="register-container">
  <div class="register-card">
    <h2>Create Account</h2>

    <form (ngSubmit)="register()" class="register-form" #registerForm="ngForm">
      <div class="form-group">
        <input 
          type="text" 
          id="username" 
          [(ngModel)]="username" 
          name="username" 
          required 
          placeholder="Username">
      </div>
      
      <div class="form-group">
        <input 
          type="password" 
          id="password" 
          [(ngModel)]="password" 
          name="password" 
          required 
          placeholder="Password">
      </div>

      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <button type="submit" class="register-button" [disabled]="!registerForm.form.valid || isLoading">
        {{ isLoading ? 'Creating Account...' : 'Register' }}
      </button>

      <div class="login-link">
        Already have an account? <a routerLink="/">Login here</a>
      </div>
    </form>
  </div>
</div>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  register() {
    // Reset error message
    this.errorMessage = '';
    
    // Validate inputs
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    
    console.log('Attempting to register user:', this.username);
    
    this.http.post<RegisterResponse>('http://localhost:5001/api/auth/register', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Server response:', response);
        this.isLoading = false;
        
        if (response && response.success === true) {
          console.log('Registration successful, redirecting to login');
          this.router.navigate(['/']);
        } else {
          console.log('Registration failed:', response?.message);
          this.errorMessage = response?.message || 'Registration failed';
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Registration error:', error);
        this.isLoading = false;
        
        if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Invalid input';
        } else {
          this.errorMessage = 'Server error. Please try again.';
        }
      }
    });
  }
} 