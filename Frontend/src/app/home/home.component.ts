import { Component, Inject, signal, SimpleChanges, ViewChild, WritableSignal, effect } from '@angular/core';
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
import { debounceTime } from 'rxjs/operators';
import { Toast, ToastrModule, ToastrService } from 'ngx-toastr';
import { ToastService } from '../toast.service';
import { ToastComponent } from "../toast/toast.component";
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
    ToastComponent,
    MatButtonToggleModule
],
  template: `
    <mat-toolbar color="primary">
      <p>Travel App</p>
    </mat-toolbar>

    <div class="controls-container">
      <div class="search-container">
        <form [formGroup]="searchForm">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput 
                   formControlName="searchTerm" 
                   placeholder="Search by place or description..."
                   autocomplete="off">
            @if (searchForm.get('searchTerm')?.value) {
              <button class="clear-button" 
                      type="button" 
                      matSuffix 
                      (click)="clearSearch()" 
                      aria-label="Clear search">
                <mat-icon>close</mat-icon>
              </button>
            }
          </mat-form-field>
        </form>
      </div>

      <div class="actions-container">
        <mat-form-field appearance="outline">
          <mat-icon matPrefix>sort</mat-icon>
          <mat-label>Sort by</mat-label>
          <mat-select (selectionChange)="onSortChange($event.value)">
            <mat-option value="dateAsc">Date Ascending</mat-option>
            <mat-option value="dateDesc">Date Descending</mat-option>
            <mat-option value="place">Alphabetically by Place</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-button class="action-button" (click)="openNewTripDialog()">
          <mat-icon>add</mat-icon>
          <span>Add Trip</span>
        </button>
        <button mat-button class="action-button" (click)="toggleFilterPanel()">
          <mat-icon>filter_alt</mat-icon>
          <span>Filter</span>
        </button>
      </div>
    </div>

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
        <button class="filters" mat-button (click)="applyFilters()">Apply Filters</button>
        <button class="filters" mat-button (click)="closeFilters()">Close Filter</button>
      </mat-sidenav>

      @if (service.tripNotes().length > 0) {
        <app-trip-note 
          [tripNotes]="service.tripNotes()"
          (editedNote)="editNote($event)"
          (deletedNote)="deleteNote($event)"
        ></app-trip-note>
      } @else {
        <div class="no-notes">
          <p>No trip notes available.</p>
        </div>
      }
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
      searchTerm: ['']
    });

    // Setup search subscription
    this.searchForm.get('searchTerm')?.valueChanges
      .pipe(debounceTime(300))
      .subscribe(searchTerm => {
        if (searchTerm === null || searchTerm === '') {
          // Reset to show all notes
          const allNotes = this.service.getTripNotes();
          this.service.tripNotes.set(allNotes);
        } else {
          // Filter notes based on search term
          const filteredNotes = this.service.getTripNotes(searchTerm);
          this.service.tripNotes.set(filteredNotes);
        }
      });
  }

  get tripNotes() {
    return this.service.tripNotes;
  }

  logTripNotes(): void {
    console.log(this.service.getTripNotes());
  }

  openNewTripDialog() {
    const dialogRef = this.dialog.open(NewTripDialogComponent, {
      width: '400px',
      data: {
        id: 3,
        place: '',
        dateFrom: null,
        dateTo: null,
        description: '',
        imageUrl: '',
        rating: 1,
        isEditing: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.service.addNote(result);
        this.toastService.showToast('Note added successfully', 'add');
      }
    });
  }

  editNote(note: TripNote): void {
    this.service.updateNote(note);
    this.toastService.showToast('Note edited successfully','edit');
  }

  deleteNote(id: number): void {
    this.service.deleteNote(id);
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

  applyFilters(): void {
    const filters = this.filterForm.value;
    
    // If no filters are set, reload all notes
    if (!filters.rating && !filters.dateFrom && !filters.dateTo) {
      this.service.loadTripNotes();
      this.sidenav.close();
      return;
    }
    
    const ratings = filters.rating ? [filters.rating] : [];
    const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;
    
    const filteredNotes = this.service.applyFilters(ratings, dateTo, dateFrom);
    this.service.tripNotes.set(filteredNotes);
    
    // Close the filter panel after applying
    this.sidenav.close();
    
    // Show feedback toast
    if (filteredNotes.length === 0) {
      this.toastService.showToast('No trips match the selected filters', 'info');
    } else {
      this.toastService.showToast(`Found ${filteredNotes.length} trips`, 'info');
    }
  }

  clearAllFilters(): void {
    // Reset the form
    this.filterForm.reset();
    
    // Reset search as well
    this.searchForm.get('searchTerm')?.setValue('');
    
    // Reload all notes and update the view
    this.service.loadTripNotes();
    
    // Close the filter panel
    this.sidenav.close();
    
    // Show feedback
    this.toastService.showToast('All filters cleared', 'info');
  }

  closeFilters(): void {
    // Reset filters and reload all notes
    this.filterForm.reset();
    this.service.loadTripNotes();
    this.sidenav.close();
    this.toastService.showToast('Filters cleared', 'info');
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
    this.service.tripNotes.set(sortedNotes);
  }

  clearSearch(): void {
    this.searchForm.get('searchTerm')?.setValue('');
    this.service.tripNotes.set(this.service.getTripNotes());
  }
}