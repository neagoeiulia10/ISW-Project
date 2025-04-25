import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TripNote } from './trip-note.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripNoteService {
  private apiUrl = 'http://localhost:5001/api/Travelapp';
  private allNotes: TripNote[] = [];
  filteredTrip: TripNote[] = [];
  // isEditing: any;

  public tripNotes: WritableSignal<TripNote[]> = signal([]);

  constructor(private http: HttpClient) {
    this.loadTripNotes();
  }

  loadTripNotes() {
    this.http.get<TripNote[]>(this.apiUrl).subscribe({
      next: (notes) => {
        this.allNotes = [...notes];
        this.tripNotes.set([...notes]);
        console.log('Notes loaded:', notes);
      },
      error: (error) => {
        console.error('Error loading notes:', error);
      }
    });
  }

  deleteNote(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      // Update both arrays
      this.allNotes = this.allNotes.filter(note => note.id !== id);
      const updatedNotes = this.tripNotes().filter(note => note.id !== id);
      this.tripNotes.set([...updatedNotes]);
    });
  }

  getTripNotes(searchTerm?: string): TripNote[] {
    if (!searchTerm) {
      return [...this.allNotes];
    }
    
    const searchLower = searchTerm.toLowerCase();
    return this.allNotes.filter(note => 
      note.description.toLowerCase().includes(searchLower) ||
      note.place.toLowerCase().includes(searchLower)
    );
  }

  updateNote(updatedNote: Partial<TripNote>): void {
    if (!updatedNote.id) return;

    this.http.put(`${this.apiUrl}/${updatedNote.id}`, updatedNote)
      .subscribe(() => {
        // Update in allNotes
        const allNotesIndex = this.allNotes.findIndex(note => note.id === updatedNote.id);
        if (allNotesIndex !== -1) {
          this.allNotes[allNotesIndex] = {
            ...this.allNotes[allNotesIndex],
            ...updatedNote
          };
        }

        // Update in tripNotes
        const currentNotes = this.tripNotes();
        const noteIndex = currentNotes.findIndex(note => note.id === updatedNote.id);
        if (noteIndex !== -1) {
          currentNotes[noteIndex] = {
            ...currentNotes[noteIndex],
            ...updatedNote
          };
          this.tripNotes.set([...currentNotes]);
        }
      });
  }

  addNote(tripNote: TripNote): void {
    this.http.post<TripNote>(this.apiUrl, tripNote)
      .subscribe(newNote => {
        // Add to both arrays
        this.allNotes.push(newNote);
        this.tripNotes.set([...this.tripNotes(), newNote]);
      });
  }

  applyFilters(ratings: number[], dateTo: Date | null, dateFrom: Date | null): TripNote[] {
    // Always filter from allNotes to ensure we have all data
    this.filteredTrip = this.allNotes.filter(note => {
      const matchesRating = ratings.length === 0 || ratings.includes(note.rating);
      const matchesDateFrom = !dateFrom || new Date(note.dateFrom) >= new Date(dateFrom);
      const matchesDateTo = !dateTo || new Date(note.dateTo) <= new Date(dateTo);
      return matchesRating && matchesDateFrom && matchesDateTo;
    });
    
    return [...this.filteredTrip];
  }

  clearAllFilters(): void {
    this.filteredTrip = [...this.allNotes];
    this.tripNotes.set([...this.allNotes]);
  }
}

//ngrX state management

