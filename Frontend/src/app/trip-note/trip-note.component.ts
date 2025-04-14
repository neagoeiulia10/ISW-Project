import { Component, EventEmitter, Input, input, Output, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TripNote } from '../trip-note.model';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { TripNoteService } from '../trip-note.service';
import { BehaviorSubject, retry } from 'rxjs'; // RxJS BehaviorSubject
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from "../capitalize.pipe";
import { MatDialog } from '@angular/material/dialog';
import { EditTripModalComponent } from '../edit-trip-modal/edit-trip-modal.component';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-trip-note',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule, MatDatepickerModule, FormsModule, MatNativeDateModule,
    CapitalizePipe,
    MatToolbarModule],
  providers: [provideNativeDateAdapter(), MatDatepickerModule,],
  template: `
<div class="card-container">
  <div *ngFor="let tripNote of tripNotes(); let i = index" class="card-wrapper">
    <mat-card>
      <mat-card-header>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        
        <img mat-card-image [src]="tripNote.imageUrl" alt="{{ tripNote.place|capitalize }}">
        <!-- <mat-card-title *ngIf="!tripNote.isEditing">{{ tripNote.place }}</mat-card-title>
        <input *ngIf="tripNote.isEditing" [(ngModel)]="tripNote.place" placeholder="Place"> -->
        <mat-card-subtitle *ngIf="!tripNote.isEditing">{{ tripNote.description }}</mat-card-subtitle>
        <input *ngIf="tripNote.isEditing" [(ngModel)]="tripNote.description" placeholder="Description">
      </mat-card-header>
      <mat-card-content>
        <mat-form-field>
          <mat-label>Start date</mat-label>
          <input matInput [matDatepicker]="picker1" [(ngModel)]="tripNote.dateFrom"  readonly>
          <mat-hint>MM/DD/YYYY</mat-hint>
          <mat-datepicker-toggle matIconSuffix [for]="picker1"></mat-datepicker-toggle>
          <mat-datepicker #picker1 disabled="true"></mat-datepicker>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Finish date</mat-label>
          <input matInput [matDatepicker]="picker2" [(ngModel)]="tripNote.dateTo" readonly>
          <mat-datepicker-toggle matIconSuffix [for]="picker2"></mat-datepicker-toggle>
          <mat-datepicker #picker2 disabled="true"></mat-datepicker>
        </mat-form-field>
        <div class="rating">
          <h2>Rating:</h2>
          <div class="stars">
            <mat-icon (click)="setRating(tripNote.rating)" [class.selected]="tripNote.rating >= 1">star</mat-icon>
            <mat-icon (click)="setRating(tripNote.rating)" [class.selected]="tripNote.rating >= 2">star</mat-icon>
            <mat-icon (click)="setRating(tripNote.rating)" [class.selected]="tripNote.rating >= 3">star</mat-icon>
            <mat-icon (click)="setRating(tripNote.rating)" [class.selected]="tripNote.rating >= 4">star</mat-icon>
            <mat-icon (click)="setRating(tripNote.rating)" [class.selected]="tripNote.rating >= 5">star</mat-icon>
          </div>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button mat-fab id="edit" (click)="editTrip(tripNote)"> <mat-icon>{{ tripNote.isEditing ? 'save' : 'edit' }}</mat-icon></button>
        <button mat-fab id="delete" (click)="deleteTrip(tripNote.id)"><mat-icon>delete</mat-icon></button>
      </mat-card-actions>
    </mat-card>
  </div>
</div>`,
  styleUrl: './trip-note.component.scss',
})
export class TripNoteComponent {
  toastMessage: string | undefined;
  @Output() editedNote = new EventEmitter<TripNote>();
  @Output() deletedNote = new EventEmitter<number>();
  tripNotes = input.required<TripNote[]>();
  selectedDate: Date | undefined;
  rating: number = 0;
  constructor(private dialog: MatDialog) {
  }
  setRating(value: number) {
    this.rating = value
  }
  deleteTrip(id: number): void {
    const confirmDelete = window.confirm('Are you sure you want to delete this card?');
    if (confirmDelete) {
      this.deletedNote.emit(id);
    }
  }
  editTrip(tripNote: TripNote): void {
    const dialogRef = this.dialog.open(EditTripModalComponent, {
      width: '300px',
      data: { ...tripNote }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.editedNote.emit(result);
      }
    });
  }
}
///onsave-events
