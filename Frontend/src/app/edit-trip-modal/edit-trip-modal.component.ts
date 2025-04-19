import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TripNote } from '../trip-note.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { TripNoteComponent } from '../trip-note/trip-note.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-edit-trip-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatToolbarModule
  ],
  providers: [provideNativeDateAdapter(), MatDatepickerModule],
  template: `
  <mat-card>
  <mat-toolbar>
  <span>Edit Trip</span>
  </mat-toolbar>
    <form  class="form" [formGroup]="tripForm" (ngSubmit)="save()">
      <mat-form-field>
        <mat-label>Place</mat-label>
        <input matInput formControlName="place" (ngModelChange)="enableSaveButton()">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Description</mat-label>
        <input matInput formControlName="description" (ngModelChange)="enableSaveButton()">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Start date</mat-label>
        <input matInput formControlName="dateFrom" [matDatepicker]="picker1" (ngModelChange)="enableSaveButton()">
        <mat-datepicker-toggle matIconSuffix [for]="picker1"></mat-datepicker-toggle>
        <mat-datepicker #picker1></mat-datepicker>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Finish date</mat-label>
        <input matInput formControlName="dateTo" [matDatepicker]="picker2" (ngModelChange)="enableSaveButton()">
        <mat-datepicker-toggle matIconSuffix [for]="picker2"></mat-datepicker-toggle>
        <mat-datepicker #picker2></mat-datepicker>
      </mat-form-field>
      <mat-error *ngIf="tripForm.hasError('dateRange')">
        From Date should be earlier than To Date
      </mat-error>
      <mat-form-field>
        <mat-label>Image URL</mat-label>
        <input matInput formControlName="imageUrl" (ngModelChange)="enableSaveButton()">
        <mat-error *ngIf="tripForm.get('imageUrl')?.hasError('required')">
          Image URL is required
        </mat-error>
      </mat-form-field>
      <mat-form-field>
      <mat-label>Rating</mat-label>
      <mat-select formControlName="rating" (ngModelChange)="enableSaveButton()">
        <mat-option *ngFor="let rating of [1, 2, 3, 4, 5]" [value]="rating">
          {{ rating }}
        </mat-option>
      </mat-select>
      <mat-error *ngIf="tripForm.get('rating')?.hasError('required')">
        Rating is required
      </mat-error>
      <mat-error *ngIf="tripForm.get('rating')?.hasError('1') || tripForm.get('rating')?.hasError('5')">
        Rating should be between 1 and 5
      </mat-error>
    </mat-form-field>
    <br>
      <button  class="cancel-button" mat-fab type="button" (click)="cancel()"><mat-icon>cancel</mat-icon></button>
      <button  class="save-button" mat-fab type="submit" [disabled]="!isSaveEnabled || tripForm.invalid"><mat-icon>save</mat-icon></button>
    </form>
  </mat-card>`,
  styleUrls: ['./edit-trip-modal.component.scss']
})
export class EditTripModalComponent {
  isSaveEnabled = false;
  tripForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditTripModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TripNote,
    private fb: FormBuilder
  ) {
    this.tripForm = this.fb.group({
      place: [data.place, Validators.required],
      description: [data.description, Validators.required],
      dateFrom: [data.dateFrom, [Validators.required, this.dateValidator]],
      dateTo: [data.dateTo, Validators.required],
      imageUrl: [data.imageUrl, Validators.required],
      rating: [data.rating, [Validators.required, Validators.min(1), Validators.max(5)]]
    }, { validators: this.rangeValidator }
    );
  }

  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const isValidDate = control.value && !isNaN(Date.parse(control.value));
    return isValidDate ? null : { 'invalidDate': { value: control.value } };
  }

  rangeValidator(group: FormGroup): { [key: string]: any } | null {
    const dateFrom = group.get('dateFrom')?.value;
    const dateTo = group.get('dateTo')?.value;
    return dateFrom && dateTo && new Date(dateFrom) <= new Date(dateTo) ? null : { 'dateRange': true };
  }

  enableSaveButton() {
    this.isSaveEnabled = true;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.tripForm.valid) {
      this.dialogRef.close({ ...this.tripForm.value, id: this.data.id });
    }
  }
}
