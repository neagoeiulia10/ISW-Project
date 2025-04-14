import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripNoteComponent } from './trip-note.component';

describe('TripNoteComponent', () => {
  let component: TripNoteComponent;
  let fixture: ComponentFixture<TripNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripNoteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
