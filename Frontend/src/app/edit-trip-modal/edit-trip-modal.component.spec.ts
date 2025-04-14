import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTripModalComponent } from './edit-trip-modal.component';

describe('EditTripModalComponent', () => {
  let component: EditTripModalComponent;
  let fixture: ComponentFixture<EditTripModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTripModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTripModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
