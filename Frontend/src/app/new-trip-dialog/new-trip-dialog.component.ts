import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TripNote } from '../trip-note.model';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-new-trip-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <div class="dialog-container">
      <mat-toolbar>
        <span>Add New Trip</span>
        <span class="spacer"></span>
        <button mat-icon-button (click)="onClose()">
          <mat-icon>close</mat-icon>
        </button>
      </mat-toolbar>
      
      <div class="dialog-content">
        <mat-form-field>
          <mat-label>Place</mat-label>
          <input matInput [(ngModel)]="newTrip.place" placeholder="Enter place name">
        </mat-form-field>
        
        <mat-form-field>
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="newTrip.description" placeholder="Enter trip description"></textarea>
        </mat-form-field>
        
        <mat-form-field>
          <mat-label>Start Date</mat-label>
          <input matInput [matDatepicker]="picker1" [(ngModel)]="newTrip.dateFrom">
          <mat-datepicker-toggle matIconSuffix [for]="picker1"></mat-datepicker-toggle>
          <mat-datepicker #picker1></mat-datepicker>
        </mat-form-field>
        
        <mat-form-field>
          <mat-label>End Date</mat-label>
          <input matInput [matDatepicker]="picker2" [(ngModel)]="newTrip.dateTo">
          <mat-datepicker-toggle matIconSuffix [for]="picker2"></mat-datepicker-toggle>
          <mat-datepicker #picker2></mat-datepicker>
        </mat-form-field>
        
        <mat-form-field>
          <mat-label>Image URL</mat-label>
          <input matInput [(ngModel)]="newTrip.imageUrl" placeholder="Enter image URL">
        </mat-form-field>
        
        <div class="rating">
          <h3>Rating</h3>
          <div class="stars">
            <mat-icon (click)="setRating(1)" [class.selected]="newTrip.rating >= 1">star</mat-icon>
            <mat-icon (click)="setRating(2)" [class.selected]="newTrip.rating >= 2">star</mat-icon>
            <mat-icon (click)="setRating(3)" [class.selected]="newTrip.rating >= 3">star</mat-icon>
            <mat-icon (click)="setRating(4)" [class.selected]="newTrip.rating >= 4">star</mat-icon>
            <mat-icon (click)="setRating(5)" [class.selected]="newTrip.rating >= 5">star</mat-icon>
          </div>
        </div>
      </div>
      
      <div class="dialog-actions">
        <button mat-button (click)="onClose()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSave()">Save</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      padding: 0;
    }
    
    .dialog-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .dialog-actions {
      padding: 16px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    
    .rating {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .stars {
      display: flex;
      gap: 4px;
    }
    
    .stars mat-icon {
      cursor: pointer;
      color: #ccc;
    }
    
    .stars mat-icon.selected {
      color: #ffd700;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class NewTripDialogComponent {
  newTrip: TripNote = {
    id: 0,
    place: '',
    description: '',
    dateFrom: new Date(),
    dateTo: new Date(),
    imageUrl: '',
    rating: 0,
    isEditing: false
  };
  
  @Output() save = new EventEmitter<TripNote>();
  
  constructor(private dialogRef: MatDialogRef<NewTripDialogComponent>) {}
  
  setRating(value: number): void {
    this.newTrip.rating = value;
  }
  
  onSave(): void {
    this.save.emit(this.newTrip);
    this.dialogRef.close(this.newTrip);
  }
  
  onClose(): void {
    this.dialogRef.close();
  }
}