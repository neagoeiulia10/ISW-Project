import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaitingComponent } from './raiting.component';

describe('RaitingComponent', () => {
  let component: RaitingComponent;
  let fixture: ComponentFixture<RaitingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaitingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
