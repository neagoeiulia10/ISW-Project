import { Component, EventEmitter, Input, input, Output, WritableSignal, AfterViewInit, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TripNote } from '../trip-note.model';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { TripNoteService } from '../trip-note.service';
import { BehaviorSubject, retry } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from "../capitalize.pipe";
import { MatDialog } from '@angular/material/dialog';
import { EditTripModalComponent } from '../edit-trip-modal/edit-trip-modal.component';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Map, map, tileLayer, marker, LatLng } from 'leaflet';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-trip-note',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule, 
    MatDatepickerModule, 
    FormsModule, 
    MatNativeDateModule,
    CapitalizePipe,
    MatToolbarModule,
    MatButtonToggleModule
  ],
  providers: [provideNativeDateAdapter(), MatDatepickerModule],
  template: `
    <div class="card-container">
      <div *ngFor="let tripNote of tripNotes(); let i = index" class="card-wrapper">
        <mat-card>
          <mat-card-header>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            
            <div class="view-toggle">
              <button mat-icon-button 
                      [class.active]="!showMap[tripNote.id]" 
                      (click)="toggleView(tripNote.id, false)" 
                      matTooltip="Show Image">
                <mat-icon>image</mat-icon>
              </button>
              <button mat-icon-button 
                      [class.active]="showMap[tripNote.id]" 
                      (click)="toggleView(tripNote.id, true)" 
                      matTooltip="Show Map">
                <mat-icon>map</mat-icon>
              </button>
            </div>

            <div class="media-container" [class.fade]="isTransitioning[tripNote.id]">
              <img *ngIf="!showMap[tripNote.id]" 
                   mat-card-image 
                   [src]="tripNote.imageUrl" 
                   alt="{{ tripNote.place|capitalize }}"
                   class="media-item">
              <div *ngIf="showMap[tripNote.id]" 
                   [id]="'map-' + tripNote.id" 
                   class="mini-map media-item"></div>
            </div>

            <mat-card-subtitle *ngIf="!tripNote.isEditing">{{ tripNote.description }}</mat-card-subtitle>
            <input *ngIf="tripNote.isEditing" [(ngModel)]="tripNote.description" placeholder="Description">
          </mat-card-header>
          <mat-card-content>
            <mat-form-field>
              <mat-label>Start date</mat-label>
              <input matInput [matDatepicker]="picker1" [(ngModel)]="tripNote.dateFrom" readonly>
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
            <button mat-fab id="edit" (click)="editTrip(tripNote)">
              <mat-icon>{{ tripNote.isEditing ? 'save' : 'edit' }}</mat-icon>
            </button>
            <button mat-fab id="delete" (click)="deleteTrip(tripNote.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styleUrl: './trip-note.component.scss',
})
export class TripNoteComponent implements AfterViewInit {
  @Output() editedNote = new EventEmitter<TripNote>();
  @Output() deletedNote = new EventEmitter<number>();
  tripNotes = input.required<TripNote[]>();
  rating: number = 0;
  private maps: { [key: string]: Map } = {};
  showMap: { [key: number]: boolean } = {};
  isTransitioning: { [key: number]: boolean } = {};

  constructor(private dialog: MatDialog) {
    // Initialize all notes to show images by default
    effect(() => {
      const notes = this.tripNotes();
      notes.forEach((note: TripNote) => {
        if (this.showMap[note.id] === undefined) {
          this.showMap[note.id] = false;
        }
      });
    });

    // Watch for changes in tripNotes
    effect(() => {
      const notes = this.tripNotes();
      if (notes.length > 0) {
        setTimeout(() => {
          notes.forEach((note: TripNote) => {
            if (this.showMap[note.id] && !this.maps[`map-${note.id}`]) {
              this.initializeMap(note);
            }
          });
        }, 100);
      }
    });
  }

  toggleView(noteId: number, showMap: boolean) {
    // Prevent rapid toggling
    if (this.isTransitioning[noteId]) return;

    this.isTransitioning[noteId] = true;
    this.showMap[noteId] = showMap;

    // Initialize map if needed
    if (showMap) {
      const note = this.tripNotes().find(n => n.id === noteId);
      if (note && !this.maps[`map-${noteId}`]) {
        setTimeout(() => {
          this.initializeMap(note);
          this.isTransitioning[noteId] = false;
        }, 100);
      } else {
        setTimeout(() => {
          this.isTransitioning[noteId] = false;
        }, 300); // Match transition duration
      }
    } else {
      setTimeout(() => {
        this.isTransitioning[noteId] = false;
      }, 300); // Match transition duration
    }
  }

  ngAfterViewInit() {
    // Initial map initialization for any notes that should show maps
    const notes = this.tripNotes();
    if (notes.length > 0) {
      setTimeout(() => {
        notes.forEach((note: TripNote) => {
          if (this.showMap[note.id]) {
            this.initializeMap(note);
          }
        });
      }, 100);
    }
  }

  private async initializeMap(note: TripNote) {
    const mapId = 'map-' + note.id;
    const container = document.getElementById(mapId);
    
    if (!container) return;

    try {
      const mapInstance = map(mapId, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        attributionControl: false // Remove attribution for cleaner look
      }).setView([0, 0], 13);

      // Add OpenStreetMap tiles with a slightly custom style
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(note.place)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        
        // Set view with a closer zoom level for better context
        mapInstance.setView([lat, lon], 11);
      }

      this.maps[mapId] = mapInstance;
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  setRating(value: number) {
    this.rating = value;
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
      if (result) {
        this.editedNote.emit(result);
      }
    });
  }

  ngOnDestroy() {
    Object.values(this.maps).forEach(map => map.remove());
  }
}
///onsave-events
