import { Routes } from '@angular/router'
//import { HomeComponent } from './home/home.component';
import { HomeComponent } from './home/home.component';
import { TripNote } from './trip-note.model';
export const routes: Routes = [{ path: '', component: HomeComponent }, { path: '**', component: HomeComponent }];