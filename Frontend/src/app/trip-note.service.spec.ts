import { TestBed } from '@angular/core/testing';

import { TripNoteService } from './trip-note.service';
import { TripNote } from './trip-note.model';

describe('TripNoteService', () => {
  let service: TripNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripNoteService);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should add a new trip note', () =>{
    let newNote:TripNote={
      id:0,
      place:"Milano,Italy",
      dateFrom:new Date('2023-07-10'),
      dateTo:new Date('2025-01-01'),
      description:"Live in Milano",
      imageUrl:"./assets/roma.jpg",
      rating:2
    };
    
    const current_length = service.tripNotes().length;
    service.addNote(newNote);
    const notes=service.tripNotes();
    expect(notes.length).toBe(current_length+1);
    expect(newNote).toBe(notes[notes.length-1]);// cauta metoda acre sa returneze utimul element
  });

it('should delete a trip note by id', () => {
const current_length = service.tripNotes().length;
service.deleteNote(1);
const notes = service.tripNotes();
expect(notes.length).toBe(current_length-1);
const note = notes.find(n => n.id === 1);
expect(note).toBeUndefined();
});
it('should update a trip note',()=>{
service.updateNote({id:1, place:"Paris,France Update"});
const note =service.tripNotes().find(n=> n.id ===1);
expect(note?.place).toBe("Paris,France Update")
});
it('should apply filters correctely', ()=>{
  const filtredNotes = service.applyFilters([3], new Date(),new Date());
  expect(filtredNotes.length).toBe(0);
})
it('should clear all filter', ()=>{
   service.clearAllFilters();
  const notes=service.tripNotes();
  expect(notes.length).toBe(6);
})

});

