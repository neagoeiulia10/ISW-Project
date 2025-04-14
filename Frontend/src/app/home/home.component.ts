import { Component, Inject, signal, SimpleChanges, ViewChild, WritableSignal } from '@angular/core';
import { TripNoteService } from '../trip-note.service';
import { TripNote } from '../trip-note.model';
import { TripNoteComponent } from "../trip-note/trip-note.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewTripDialogComponent } from '../new-trip-dialog/new-trip-dialog.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';
import { debounceTime } from 'rxjs';
import { Toast, ToastrModule, ToastrService } from 'ngx-toastr';
import { ToastService } from '../toast.service';
import { ToastComponent } from "../toast/toast.component";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TripNoteComponent,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatCheckboxModule,
    MatDatepickerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSortModule,
    ToastrModule,
    ToastComponent
],
  template: `
  <mat-toolbar color="primary">
    <p>Travel App</p>
    <div class="spacer">
    <mat-form-field>
    <mat-label>Sort</mat-label>
    <mat-select (selectionChange)="onSortChange($event.value)">
      <mat-option value="dateAsc">Date Ascending</mat-option>
      <mat-option value="dateDesc">Date Descending</mat-option>
      <mat-option value="place">Alphabetically by Place</mat-option>
    </mat-select>
  </mat-form-field>
    <button mat-fab (click)="openNewTripDialog()"><mat-icon>add</mat-icon></button>
    <button mat-fab (click)="toggleFilterPanel()"><mat-icon>filter_alt</mat-icon></button></div>
  </mat-toolbar>
  <mat-sidenav-container class="sidenav-container">
    <mat-sidenav #sidenav mode="side" position="end">
      <mat-toolbar>
        <span>Filter</span>
        <button mat-button (click)="clearAllFilters()"><mat-icon>clear_all</mat-icon></button>
      </mat-toolbar>
      <mat-divider></mat-divider>
      <div class="filter-section">
        <h3>Rating Filters</h3>
        <form [formGroup]="filterForm">
          <mat-form-field>
            <mat-label>Rating</mat-label>
            <mat-select formControlName="rating">
              <mat-option *ngFor="let rating of [1, 2, 3, 4, 5]" [value]="rating">
                {{ rating }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <mat-divider></mat-divider>
          <div class="filter-section">
            <h3>Date Range Filters</h3>
            <mat-form-field>
              <mat-label>From Date</mat-label>
              <input matInput [matDatepicker]="picker1" formControlName="dateFrom">
              <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
              <mat-datepicker #picker1></mat-datepicker>
            </mat-form-field>
            <br>
            <mat-form-field>
              <mat-label>To Date</mat-label>
              <input matInput [matDatepicker]="picker2" formControlName="dateTo">
              <mat-datepicker-toggle matSuffix [for]="picker2"></mat-datepicker-toggle>
              <mat-datepicker #picker2></mat-datepicker>
            </mat-form-field>
          </div>
        </form>
      </div>
      <button class="filters " mat-button (click)="applyFilters()">Apply Filters</button>
      <button class="filters" mat-button (click)="closeFilters()">Close Filter</button>
    </mat-sidenav>
    <form [formGroup]="searchForm">
      <mat-form-field>
        <input matInput formControlName="description"  placeholder="Search...">
      </mat-form-field>
    </form>
    <app-trip-note 
      [tripNotes]="service.tripNotes()"
      (editedNote)="editNote($event)"
      (deletedNote)="deleteNote($event)"
    ></app-trip-note>
    <div *ngIf="service.tripNotes() && service.tripNotes().length === 0">
  <p>No trip notes available.</p>
</div>
  </mat-sidenav-container>
  <app-toast></app-toast>
  `,
  styleUrls: ['./home.component.scss'],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }
  ],
})
export class HomeComponent {
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  isFilterPanelOpen: boolean = false;
  default: TripNote = {
    id: 3,
    place: "",
    dateFrom: new Date(),
    dateTo: new Date(),
    description: "",
    imageUrl: "",
    rating: 1,
    isEditing: false
  };
  tripNotes = signal([this.default]);

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    private toastService : ToastService,
    readonly service: TripNoteService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewTripDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TripNote
  ) {
    this.filterForm = this.fb.group({
      rating: [null],
      dateFrom: [null],
      dateTo: [null],

    });

    this.searchForm = this.fb.group({
      description: [null],
      place: [null]
    });
    this.tripNotes.set(service.tripNotes());
  }

  logTripNotes(): void {
    console.log(this.service.getTripNotes());
  }
  ngOnInit(): void {
    // Setăm tripNotes să urmărească serviciul
    this.tripNotes.set(this.service.tripNotes());

    this.searchForm.get('description')!.valueChanges
      .pipe(debounceTime(300))
      .subscribe(searchValue => {
        this.tripNotes.set(this.service.getTripNotes(searchValue));
      });
  }

  openNewTripDialog() {
    const dialogRef = this.dialog.open(NewTripDialogComponent, {
      width: '400px',
      data: {
        id: 3,
        place: '',
        dateFrom: null, // No predefined date
        dateTo: null,   // No predefined date
        description: '',
        imageUrl: '',
        rating: 1,
        isEditing: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.service.addNote(result);
        this.tripNotes.set(this.service.tripNotes());
        this.toastService.showToast('Note added successfully', 'add');
      }
    });
  }

  editNote(note: TripNote): void {
    this.service.updateNote(note);
    this.tripNotes.set(this.service.tripNotes());
    this.toastService.showToast('Note edited successfully','edit');

  }

  deleteNote(id: number): void {
    this.service.deleteNote(id);
    this.tripNotes.set(this.service.tripNotes());
    this.toastService.showToast('Note deleted successfully','delete');

  }

  toggleFilterPanel(): void {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
    if (this.isFilterPanelOpen) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
  }

  clearAllFilters(): void {
    this.filterForm.reset();
    this.service.clearAllFilters();
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    const ratings = filters.rating ? [filters.rating] : [];
    const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;
    this.tripNotes.set(this.service.applyFilters(ratings, dateTo, dateFrom));
  }

  closeFilters(): void {
    this.tripNotes.set(this.service.getTripNotes());
    this.filterForm.reset();
    this.sidenav.close();
  }
  onSortChange(sortOption: string): void {
    let sortedNotes = [...this.tripNotes()];
    switch (sortOption) {
      case 'dateAsc':
        sortedNotes.sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime());
        break;
      case 'dateDesc':
        sortedNotes.sort((a, b) => new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime());
        break;
      case 'place':
        sortedNotes.sort((a, b) => a.place.localeCompare(b.place));
        break;
    }
    this.tripNotes.set(sortedNotes);
  }

  onSearch(): void {
    const searchValue = this.searchForm.value;
    this.tripNotes.set(this.service.getTripNotes(searchValue));
  }
}