import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ApiService } from 'app/api.service';
import { Helpers } from 'app/shared/helpers';
import Validation from 'app/shared/validators';
import { GenericApiResponse } from './../../../../models';


@Component({
  selector: 'app-user-add-form',
  templateUrl: './user-add-form.component.html',
  styleUrls: ['./user-add-form.component.scss']
})
export class UserAddFormComponent implements OnInit {
	clientTypes: string[] = ['Client', 'Supplier', 'Contractor', 'Consultant'];
	id: string;
	theForm: FormGroup;
	disableSaveBtn = false;

	constructor(private apiService: ApiService,
				private fb: FormBuilder,
				private toastr: ToastrService,
				private dialogRef: MatDialogRef<UserAddFormComponent>)
	{
		this.theForm = fb.group({
			name: [null, [Validators.required]],
			mobileNumber: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
			email: [null, [Validators.required, Validators.email]],
			password: [null, [Validators.required]],
			confirmPassword: [null, [Validators.required]],
			type: ['Client', [Validators.required]]
		}, { validators: [Validation.match('password', 'confirmPassword')]});
	}

	ngOnInit(): void {
		if (this.id) {
			this.theForm.removeControl('password');
			this.theForm.removeControl('confirmPassword');
			this.getUser();
		}
	}

	getUser(): void {
		this.apiService.get(`users/${this.id}`).subscribe({
			next: (resp: GenericApiResponse) => {
				if (resp.data['user'].type !== 'Client') {
					this.onUserTypeChange({ value: resp.data['user'].type, source: null } );
				}

				this.theForm.patchValue(resp.data['user']);
			},
			error: (error: any) => this.toastr.error(error)
		});
	}

	numericOnly(ev: KeyboardEvent): boolean {
		return Helpers.numericOnly(ev);
	}

	onUserTypeChange(ev: MatSelectChange ): void {
		if (ev.value !== 'Client') {
			this.theForm.addControl('companyName', new FormControl('', Validators.required));
			this.theForm.addControl('commercialRegNumber', new FormControl('', Validators.required));
			this.theForm.addControl('address', new FormControl('', Validators.required));
			this.theForm.addControl('totalEmployees', new FormControl('', Validators.required));
			this.theForm.addControl('documents', new FormControl(''));
		}
		else {
			this.theForm.removeControl('companyName');
			this.theForm.removeControl('commercialRegNumber');
			this.theForm.removeControl('address');
			this.theForm.removeControl('totalEmployees');
			this.theForm.removeControl('documents');
		}
	}

	onSave(): void {
		const payload = this.theForm.value;
		payload.fromAdmin = true;
		payload.confirmPassword = undefined;
		this.disableSaveBtn = true;

		if (this.id) {
			this.apiService.patch(`users/${this.id}`, payload).subscribe({
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
			this.apiService.post('users', payload).subscribe({
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
