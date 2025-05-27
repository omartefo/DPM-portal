import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';

const modules: any[] = [
	MatFormFieldModule,
	MatInputModule,
	MatButtonModule,
	MatIconModule,
	MatDialogModule,
	MatCardModule,
	MatStepperModule,
	MatCheckboxModule,
	MatTableModule,
	MatPaginatorModule,
	MatFormFieldModule,
	MatCardModule,
	MatInputModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatSelectModule,
	MatButtonModule,
	MatProgressBarModule,
	MatSlideToggleModule,
	MatProgressSpinnerModule,
	MatDividerModule,
	MatChipsModule,
	MatListModule
];

@NgModule({
  declarations: [],
  imports: [ ...modules ],
  exports: [ ...modules ]
})
export class MaterialModule { }
