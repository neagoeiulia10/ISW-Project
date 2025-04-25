import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
///beforeEach- first block inside the container(describe)
//beforeEach-only block that runs before any other block (it)
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent,MatDialogModule,BrowserAnimationsModule], // the main component we want to test
      providers:[ 
        { provide: MatDialogRef,useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: {} }]
    })
    .compileComponents();//The -compileComponents- object is called to compile your component’s resources like the template, styles,
    
  });
  
  it('should create', () => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();//to see if the instance of the class is truly created or not using 
  });
});
