import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/modules/material/material.module';

import { FormatDisplayValue } from 'app/shared/pipes/format-display-value.pipe';
import { FormatDataPipe } from '../../pipes/format.pipe';
import { TableComponent } from '../generic-table/table.component';
import { NestedValuePipe } from './nestedValue.pipe';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule
	],
	declarations: [
		TableComponent,

        FormatDataPipe,
		NestedValuePipe,
		FormatDisplayValue
	],
	exports: [
		TableComponent,
	],
	providers: [
		DatePipe,
		DecimalPipe
	]
})
export class GenericTableModule { }
