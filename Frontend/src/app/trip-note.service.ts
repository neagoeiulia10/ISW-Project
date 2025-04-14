import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TripNote } from './trip-note.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripNoteService {
  private apiUrl = 'http://localhost:5001/api/Travelapp';
  filteredTrip: TripNote[] = [];
  // isEditing: any;

  public tripNotes: WritableSignal<TripNote[]> = signal([]);

  constructor(private http: HttpClient) {
    this.loadTripNotes();
  }

  private loadTripNotes() {
    this.http.get<TripNote[]>(this.apiUrl).subscribe(
      (notes) => {
        console.log('Notes received from server:', notes);
        this.tripNotes.set(notes);
      },
      (error) => {
        console.error('Error loading notes:', error);
      }
    );
  }

  deleteNote(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      const updatedNotes = this.tripNotes().filter((tripNote: TripNote) => tripNote.id !== id);
      this.tripNotes.set([...updatedNotes]);
    });
  }

  getTripNotes(descriptionFilter?: string, placeFilter?: string): TripNote[] {
    let notes = this.tripNotes();
    
    if (descriptionFilter) {
      notes = notes.filter(note => 
        note.description.toLowerCase().includes(descriptionFilter.toLowerCase())
      );
    }

    if (placeFilter) {
      notes = notes.filter(note => 
        note.place.toLowerCase().includes(placeFilter.toLowerCase())
      );
    }

    return notes;
  }

  updateNote(updatedNote: Partial<TripNote>): void {
    if (!updatedNote.id) return;

    this.http.put(`${this.apiUrl}/${updatedNote.id}`, updatedNote)
      .subscribe(() => {
        const currentNotes = this.tripNotes();
        const noteIndex = currentNotes.findIndex((tripNote) => tripNote.id === updatedNote.id);
        if (noteIndex !== -1) {
          currentNotes[noteIndex] = { ...currentNotes[noteIndex], ...updatedNote };
          this.tripNotes.set([...currentNotes]);
        }
      });
  }

  addNote(tripNote: TripNote): void {
    this.http.post<TripNote>(this.apiUrl, tripNote)
      .subscribe(newNote => {
        this.tripNotes.set([...this.tripNotes(), newNote]);
      });
  }

  applyFilters(ratings: number[], dateTo: Date | null, dateFrom: Date | null): TripNote[] {
    this.filteredTrip = this.tripNotes().filter(note => {
      const matchesRating = ratings.length === 0 || ratings.includes(note.rating);
      const matchesDateFrom = !dateFrom || new Date(note.dateFrom) >= new Date(dateFrom);
      const matchesDateTo = !dateTo || new Date(note.dateTo) <= new Date(dateTo);
      return matchesRating && matchesDateFrom && matchesDateTo;
    });
    return this.filteredTrip.length === 0 ? [] : this.filteredTrip;
  }

  clearAllFilters(): void {
    this.filteredTrip = this.tripNotes();
  }
}

//ngrX state management

