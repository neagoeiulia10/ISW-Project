import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTripDialogComponent } from './new-trip-dialog.component';

describe('NewTripDialogComponent', () => {
  let component: NewTripDialogComponent;
  let fixture: ComponentFixture<NewTripDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTripDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewTripDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
