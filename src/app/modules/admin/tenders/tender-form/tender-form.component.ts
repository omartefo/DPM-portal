import { MaterialModule } from 'app/modules/material/material.module';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'app/api.service';
import { CommonModule } from '@angular/common';
import { GenericApiResponse } from 'app/models';
import { Project } from '../../../../models';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import Validation from 'app/shared/validators';


@Component({
  selector: 'add-tender-form',
  templateUrl: './tender-form.component.html',
  styleUrls: ['./tender-form.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, NgxMatTimepickerModule]
})
export class AddTenderFormComponent implements OnInit
{
	@ViewChild('uploadFilesField') uploadFilesField: ElementRef<HTMLInputElement>;
	files: File[] = [];

	projectLocations: string[] = ['Doha', 'Al Rayyan', 'Umm Salal',
		'Al Khor & Al Thakira', 'Al Wakrah', 'Al Daayen', 'Al Shamal, and Al Shahaniya'];

	tenderId: number;
	projectId: number;
	theForm: FormGroup;
	disableSaveBtn = false;
	projects: Project[] = [];

	currentDate = new Date();
	openingTime = moment(new Date()).format('hh:mm A');
	closingTime = moment(new Date()).format('hh:mm A');
	allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.docx'];

	constructor(private apiService: ApiService,
				private fb: FormBuilder,
				private toastr: ToastrService,
				private dialogRef: MatDialogRef<AddTenderFormComponent>)
	{
		this.theForm = fb.group({
			tenderNumber: ['', Validators.required],
			type: ['', Validators.required],
			openingDate: [this.currentDate, Validators.required],
			closingDate: [this.currentDate, Validators.required],
			minimumPrice: [, [Validators.required, Validators.min(1)]],
			maximumPrice: [, Validators.required],
			location: ['', Validators.required],
			description: ['', Validators.required],
			projectId: ['', Validators.required],
			documents: ['']
		},  { validator: Validation.priceRangeValidator('minimumPrice', 'maximumPrice') });
	}

	ngOnInit(): void {
		if (this.projectId) {
			this.theForm.get('projectId').setValue(this.projectId);
		}
		else {
			this.getAllProjects();
		}

		// Update Case of Tender
		if (this.tenderId) {
			this.getTender();
		}
	}

	getAllProjects(): void {
		this.apiService.get('projects?isApproved=true').subscribe({
			next: (resp: GenericApiResponse) => this.projects = resp.data['projects'].rows,
			error: (error: any) => this.toastr.error(error)
		});
	}

	getTender(): void {
		this.apiService.get(`tenders/${this.tenderId}`).subscribe({
			next: (resp: GenericApiResponse) => {
				this.theForm.patchValue(resp.data['tender']);
				this.openingTime = moment(this.theForm.get('openingDate').value).format('hh:mm A');
				this.closingTime = moment(this.theForm.get('closingDate').value).format('hh:mm A');
				this.getAllProjects();
			},
			error: (error: any) => this.toastr.error(error)
		});
	}

	onOpeningDateChange(ev: any): void {
		this.theForm.get('closingDate').setValue(ev.value);
	}

	onSetOpeningTime(time: string): void {
		this.theForm.get('openingDate').markAsDirty();
		this.openingTime = time;
	}

	onSetClosingTime(time: string): void {
		this.theForm.get('closingDate').markAsDirty();
		this.closingTime = time;
	}

	setDateTime(date, time: any): any {
		const t = time.split(':');
		const hour = +t[0];
		const other = t[1].split(' ');
		const minutes = +other[0];
		const ampm = other[1];

		date = date.set('hours', hour);
		date = date.set('minutes', minutes);

		let v = date.format('MM-DD-YYYY hh:mm');
        v = v + ' ' + ampm;
        date = new Date(v);

		return date;
	}

	makePayload(payload: any): FormData {
		const formData: any = new FormData();

		// eslint-disable-next-line guard-for-in
		for (const key in payload) {
			if (key === 'documents' && this.files.length > 0) {
				for (const file of this.files) {
					formData.append(key, file);
				}
				continue;
			}

			formData.append(key, payload[key]);
		}

		return formData;
	}

	onSave(): void {
		let payload = this.theForm.value;

		const openingDateTime = moment(payload['openingDate']).seconds(0);
		payload.openingDate = this.setDateTime(openingDateTime, this.openingTime);

		const closingDateTime = moment(payload['closingDate']).seconds(0);
		payload.closingDate = this.setDateTime(closingDateTime, this.closingTime);

		const currentDateTime = moment().seconds(0);

		if (openingDateTime.isBefore(currentDateTime)) {
			this.toastr.error('Opening time must be greater then current time', 'Time Validation Error');
			return;
		}
		if (openingDateTime >= closingDateTime) {
			this.toastr.error('Closing time must be greater than opening time', 'Time Validation Error');
			return;
		}

		this.disableSaveBtn = true;

		if (this.files.length > 0) {
			payload = this.makePayload(payload);
		}

		if (this.tenderId) {
			this.apiService.patch(`tenders/${this.tenderId}`, payload).subscribe({
				next: () => {
					this.disableSaveBtn = false;
					this.dialogRef.close(true);
				},
				error: (error: any) => {
					this.disableSaveBtn = false;
					this.toastr.error(error);
				}
			});
		}
		else {
			this.apiService.post('tenders', payload).subscribe({
				next: () => {
					this.disableSaveBtn = false;
					this.dialogRef.close(true);
				},
				error: (error: any) => {
					this.disableSaveBtn = false;
					this.toastr.error(error);
				}
			});
		}
	}

	onFileChange(): void {
		this.files = [];
		const allFiles = this.uploadFilesField.nativeElement.files;

		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i=0; i<allFiles.length; i++) {
			const file = allFiles.item(i);
			this.files.push(file);
		}
	}
}
