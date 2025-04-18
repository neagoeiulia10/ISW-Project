import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { TripNote } from '../models/trip-note.model';

// Strategy Pattern - Different sorting strategies
interface SortStrategy {
  sort(notes: TripNote[]): TripNote[];
}

class DateSortStrategy implements SortStrategy {
  sort(notes: TripNote[]): TripNote[] {
    return [...notes].sort((a, b) => new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime());
  }
}

class RatingSortStrategy implements SortStrategy {
  sort(notes: TripNote[]): TripNote[] {
    return [...notes].sort((a, b) => b.rating - a.rating);
  }
}

// Observer Pattern - For state management
@Injectable({
  providedIn: 'root' // Singleton Pattern - Single instance throughout the app
})
export class TripNoteService {
  private apiUrl = 'http://localhost:8080/api/tripnotes';
  
  // Observer Pattern - BehaviorSubject for state management
  private tripNotesSubject = new BehaviorSubject<TripNote[]>([]);
  private sortStrategySubject = new BehaviorSubject<SortStrategy>(new DateSortStrategy());
  
  // Facade Pattern - Simplifying complex operations
  private sortStrategies = {
    date: new DateSortStrategy(),
    rating: new RatingSortStrategy()
  };

  constructor(private http: HttpClient) {
    this.loadTripNotes();
  }

  // Observer Pattern - Public observables
  public tripNotes$ = this.tripNotesSubject.asObservable();
  public sortStrategy$ = this.sortStrategySubject.asObservable();

  // Command Pattern - Encapsulating operations
  private async loadTripNotes(): Promise<void> {
    try {
      const notes = await this.http.get<TripNote[]>(this.apiUrl).toPromise();
      this.updateTripNotes(notes || []);
    } catch (error) {
      console.error('Error loading trip notes:', error);
      this.updateTripNotes([]);
    }
  }

  // Decorator Pattern - Adding functionality without changing structure
  private updateTripNotes(notes: TripNote[]): void {
    const sortedNotes = this.sortStrategySubject.value.sort(notes);
    this.tripNotesSubject.next(sortedNotes);
  }

  // Strategy Pattern - Changing sort strategy
  public setSortStrategy(strategyType: 'date' | 'rating'): void {
    const strategy = this.sortStrategies[strategyType];
    this.sortStrategySubject.next(strategy);
    this.updateTripNotes(this.tripNotesSubject.value);
  }

  // Factory Pattern - Creating new trip notes
  public createTripNote(noteData: Partial<TripNote>): Observable<TripNote> {
    return new Observable(observer => {
      this.http.post<TripNote>(this.apiUrl, noteData).subscribe({
        next: (newNote) => {
          const currentNotes = this.tripNotesSubject.value;
          this.updateTripNotes([...currentNotes, newNote]);
          observer.next(newNote);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  // Command Pattern - Update operation
  public updateNote(id: string, noteData: Partial<TripNote>): Observable<TripNote> {
    return new Observable(observer => {
      this.http.put<TripNote>(`${this.apiUrl}/${id}`, noteData).subscribe({
        next: (updatedNote) => {
          const currentNotes = this.tripNotesSubject.value;
          const updatedNotes = currentNotes.map(note => 
            note.id === id ? updatedNote : note
          );
          this.updateTripNotes(updatedNotes);
          observer.next(updatedNote);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  // Command Pattern - Delete operation
  public deleteNote(id: string): Observable<void> {
    return new Observable(observer => {
      this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          const currentNotes = this.tripNotesSubject.value;
          const updatedNotes = currentNotes.filter(note => note.id !== id);
          this.updateTripNotes(updatedNotes);
          observer.next();
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  private validateNoteData(noteData: Partial<TripNote>): Partial<TripNote> {
    if (noteData.rating !== undefined && (noteData.rating < 1 || noteData.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }
    if (noteData.dateFrom && noteData.dateTo && new Date(noteData.dateFrom) > new Date(noteData.dateTo)) {
      throw new Error('Start date cannot be after end date');
    }
    return noteData;
  }
} 