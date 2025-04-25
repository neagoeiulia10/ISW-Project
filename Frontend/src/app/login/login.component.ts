import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface LoginResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="login-container">
  <div class="login-card">
    <h2>Welcome Back</h2>

    <form (ngSubmit)="login()" class="login-form" #loginForm="ngForm">
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

      <button type="submit" class="login-button" [disabled]="!loginForm.form.valid || isLoading">
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>

      <div class="register-link">
        Don't have an account? <a routerLink="/register">Register here</a>
      </div>
    </form>
  </div>
</div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    // Reset error message
    this.errorMessage = '';
    
    // Validate inputs
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    
    console.log('Attempting login for user:', this.username);
    
    this.http.post<LoginResponse>('http://localhost:5001/api/auth/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Server response:', response);
        this.isLoading = false;
        
        // Strict check for success flag
        if (response && response.success === true) {
          console.log('Login successful, navigating to travel app');
          this.router.navigate(['/travelapp']);
        } else {
          console.log('Login failed:', response?.message);
          this.errorMessage = response?.message || 'Username or password incorrect';
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Login error:', error);
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Username or password incorrect';
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Invalid input';
        } else {
          this.errorMessage = 'Server error. Please try again.';
        }
      }
    });
  }
}
