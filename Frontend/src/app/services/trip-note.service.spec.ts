import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TripNoteService } from './trip-note.service';
import { TripNote } from '../models/trip-note.model';

describe('TripNoteService', () => {
  let service: TripNoteService;
  let httpMock: HttpTestingController;

  const mockTripNotes: TripNote[] = [
    {
      id: '1',
      place: 'Paris',
      dateFrom: new Date('2024-01-01'),
      dateTo: new Date('2024-01-07'),
      description: 'Beautiful city',
      imageUrl: 'paris.jpg',
      rating: 5
    },
    {
      id: '2',
      place: 'London',
      dateFrom: new Date('2024-02-01'),
      dateTo: new Date('2024-02-07'),
      description: 'Amazing experience',
      imageUrl: 'london.jpg',
      rating: 4
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TripNoteService]
    });
    service = TestBed.inject(TripNoteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Singleton Pattern Test
  it('should be created as a singleton', () => {
    const service2 = TestBed.inject(TripNoteService);
    expect(service).toBeTruthy();
    expect(service).toBe(service2);
  });

  // Observer Pattern Tests
  describe('Observer Pattern', () => {
    it('should emit trip notes when updated', (done) => {
      service.tripNotes$.subscribe(notes => {
        expect(notes).toEqual([]);
        done();
      });
    });

    it('should emit sorted notes when sort strategy changes', (done) => {
      service['tripNotesSubject'].next(mockTripNotes);
      
      service.setSortStrategy('rating');
      
      service.tripNotes$.subscribe(notes => {
        expect(notes[0].rating).toBe(5);
        expect(notes[1].rating).toBe(4);
        done();
      });
    });
  });

  // Strategy Pattern Tests
  describe('Strategy Pattern', () => {
    it('should sort by date correctly', () => {
      service['tripNotesSubject'].next(mockTripNotes);
      service.setSortStrategy('date');
      
      service.tripNotes$.subscribe(notes => {
        expect(notes[0].dateFrom).toEqual(new Date('2024-02-01'));
        expect(notes[1].dateFrom).toEqual(new Date('2024-01-01'));
      });
    });

    it('should sort by rating correctly', () => {
      service['tripNotesSubject'].next(mockTripNotes);
      service.setSortStrategy('rating');
      
      service.tripNotes$.subscribe(notes => {
        expect(notes[0].rating).toBe(5);
        expect(notes[1].rating).toBe(4);
      });
    });
  });

  // Factory Pattern Tests
  describe('Factory Pattern', () => {
    it('should create new trip note', () => {
      const newNote: Partial<TripNote> = {
        place: 'Rome',
        dateFrom: new Date('2024-03-01'),
        dateTo: new Date('2024-03-07'),
        description: 'Historic city',
        imageUrl: 'rome.jpg',
        rating: 5
      };

      service.createTripNote(newNote).subscribe(createdNote => {
        expect(createdNote.place).toBe('Rome');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/tripnotes');
      expect(req.request.method).toBe('POST');
      req.flush({ ...newNote, id: '3' });
    });
  });

  // Command Pattern Tests
  describe('Command Pattern', () => {
    it('should update trip note', () => {
      const updatedNote: Partial<TripNote> = {
        place: 'Updated Paris',
        rating: 4
      };

      service.updateNote('1', updatedNote).subscribe(note => {
        expect(note.place).toBe('Updated Paris');
      });

      const req = httpMock.expectOne('http://localhost:8080/api/tripnotes/1');
      expect(req.request.method).toBe('PUT');
      req.flush({ ...mockTripNotes[0], ...updatedNote });
    });

    it('should delete trip note', () => {
      service.deleteNote('1').subscribe(() => {
        service.tripNotes$.subscribe(notes => {
          expect(notes.length).toBe(0);
        });
      });

      const req = httpMock.expectOne('http://localhost:8080/api/tripnotes/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  // Facade Pattern Tests
  describe('Facade Pattern', () => {
    it('should provide simple interface for sorting', () => {
      service['tripNotesSubject'].next(mockTripNotes);
      
      // Test date sorting
      service.setSortStrategy('date');
      service.tripNotes$.subscribe(notes => {
        expect(notes[0].dateFrom).toEqual(new Date('2024-02-01'));
      });

      // Test rating sorting
      service.setSortStrategy('rating');
      service.tripNotes$.subscribe(notes => {
        expect(notes[0].rating).toBe(5);
      });
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    it('should handle HTTP errors when loading trip notes', () => {
      const consoleSpy = spyOn(console, 'error');
      
      service['loadTripNotes']();
      
      const req = httpMock.expectOne('http://localhost:8080/api/tripnotes');
      req.error(new ErrorEvent('Network error'));
      
      expect(consoleSpy).toHaveBeenCalled();
      service.tripNotes$.subscribe(notes => {
        expect(notes).toEqual([]);
      });
    });

    it('should handle HTTP errors when creating trip note', (done) => {
      service.createTripNote({} as Partial<TripNote>).subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          done();
        }
      });

      const req = httpMock.expectOne('http://localhost:8080/api/tripnotes');
      req.error(new ErrorEvent('Network error'));
    });
  });
}); 