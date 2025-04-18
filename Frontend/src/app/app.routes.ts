import { Routes } from '@angular/router'
//import { HomeComponent } from './home/home.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TripNote } from './trip-note.model';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'travelapp', component: HomeComponent },
  { path: '**', redirectTo: '' }
];