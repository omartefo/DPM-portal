import { ToastrService } from 'ngx-toastr';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'app/api.service';
import { GenericApiResponse } from '../../../../models';


@Component({
  selector: 'upload-document',
  templateUrl: './upload-doc.component.html',
  styleUrls: ['./upload-doc.component.scss']
})
export class UploadDocumentComponent implements OnInit {
	id: number;
	theForm: FormGroup;
	allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.docx'];
	// eslint-disable-next-line @typescript-eslint/member-ordering
	@ViewChild('uploadFilesField') uploadFilesField: ElementRef<HTMLInputElement>;
	files: File[] = [];

	disableSaveBtn = false;

	constructor(private apiService: ApiService,
				private fb: FormBuilder,
				private toastr: ToastrService,
				private dialogRef: MatDialogRef<UploadDocumentComponent>)
	{
		this.theForm = fb.group({
			description: ['', Validators.required],
			documents: ['', Validators.required]
		});
	}

	ngOnInit(): void {
		if (this.id) {
			this.getDownloadItem();
		}
	}

	getDownloadItem(): void {
		this.apiService.get(`downloads/${this.id}`).subscribe({
			next: (resp: GenericApiResponse) => this.theForm.patchValue(resp.data['downloadItem']),
			error: (error: any) => this.toastr.error(error)
		});
	}

	onFileChange(): void {
		this.files = [];
		const allFiles = this.uploadFilesField.nativeElement.files;

		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i=0; i<allFiles.length; i++) {
			const file = allFiles.item(i);
			this.files.push(file);
		}

		this.theForm.get('documents').setValue(this.files);
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

		if (this.files.length > 0) {
			payload = this.makePayload(payload);
		}

		this.disableSaveBtn = true;

		if (this.id) {
			this.apiService.patch(`downloads/${this.id}`, payload).subscribe({
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
			this.apiService.post('downloads', payload).subscribe({
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
}
