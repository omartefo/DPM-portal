import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ApiService } from 'app/api.service';
import { UserConfig, UserTypes } from 'app/shared/constants/constants';
import { Helpers } from 'app/shared/helpers';
import Validation from 'app/shared/validators';
import { ToastrService } from 'ngx-toastr';
import { GenericApiResponse, User } from './../../../../models';


@Component({
  selector: 'app-user-add-form',
  templateUrl: './user-add-form.component.html',
  styleUrls: ['./user-add-form.component.scss']
})
export class UserAddFormComponent implements OnInit {
	clientTypes: string[] = ['Client', 'Supplier', 'Contractor', 'Consultant'];
	userId: number;
	user: User;
	theForm: FormGroup;
	disableSaveBtn = false;
	disableCanParticipateInTendersBtn = false;
	mobileNumberLength: number = UserConfig.mobileNumberLength;

	constructor(private apiService: ApiService,
				fb: FormBuilder,
				private toastr: ToastrService,
				private dialogRef: MatDialogRef<UserAddFormComponent>)
	{
		this.theForm = fb.group({
			name: [null, [Validators.required]],
			mobileNumber: [null, [
				Validators.required,
				Validators.minLength(this.mobileNumberLength),
				Validators.maxLength(this.mobileNumberLength)
			]],
			email: [null, [Validators.required, Validators.email]],
			password: [null, [Validators.required]],
			confirmPassword: [null, [Validators.required]],
			type: [UserTypes.client, [Validators.required]],
			companyId: [null]
		}, { validators: [Validation.match('password', 'confirmPassword')]});
	}

	ngOnInit(): void {
		if (this.userId) {
			this.theForm.removeControl('password');
			this.theForm.removeControl('confirmPassword');
			this.getUser();
		}
	}

	getUser(): void {
		this.apiService.get(`users/${this.userId}`).subscribe({
			next: (resp: GenericApiResponse) => this.handleGetUserResp(resp.data['user']),
			error: (error: any) => this.toastr.error(error)
		});
	}

	handleGetUserResp(user: User): void {
		let usersData = user;

		if (user.type !== UserTypes.client) {
			this.onUserTypeChange({ value: user.type, source: null } );
			usersData = { ...user, ...user.company };
			usersData.name = user.name;
			this.theForm.get('companyName').patchValue(user.company.name);
		}

		this.theForm.patchValue(usersData);
		this.user = user;
	}

	numericOnly(ev: KeyboardEvent): boolean {
		return Helpers.numericOnly(ev);
	}

	onUserTypeChange(ev: MatSelectChange): void {
		if (ev.value !== UserTypes.client) {
			this.theForm.addControl('companyName', new FormControl('', Validators.required));
			this.theForm.addControl('commercialRegNumber', new FormControl('', Validators.required));
			this.theForm.addControl('address', new FormControl('', Validators.required));
			this.theForm.addControl('totalEmployees', new FormControl('', Validators.required));
			this.theForm.addControl('documents', new FormControl(''));

			if (this.user) {
				this.theForm.patchValue(this.user.company);
				this.theForm.get('companyName').patchValue(this.user.company.name);
				this.theForm.get('name').patchValue(this.user.name);
			}
		}
		else {
			this.theForm.removeControl('companyName');
			this.theForm.removeControl('commercialRegNumber');
			this.theForm.removeControl('address');
			this.theForm.removeControl('totalEmployees');
			this.theForm.removeControl('documents');
		}
	}

	toggleTenderParticipation(): void {
		this.disableCanParticipateInTendersBtn = true;
		const payload = {
			canParticipateInTenders: !this.user.canParticipateInTenders
		};

		this.apiService.patch(`users/${this.userId}/toggleTenderParticipation`, payload).subscribe({
			next: (resp: GenericApiResponse) => {
				this.disableCanParticipateInTendersBtn = false;
				this.user.canParticipateInTenders = resp.data.canParticipateInTenders;
				const message = resp.data.canParticipateInTenders ? 'Participation ENABLED' : 'Participation DISABLED';
				this.toastr.success(message, 'Contractor Tender Participation');
			},
			error: (error: any) => {
				this.disableCanParticipateInTendersBtn = false;
				this.toastr.error(error);
			}
		});

		console.log(this.user.canParticipateInTenders);
	}

	onSave(): void {
		const payload = this.theForm.value;
		payload.fromAdmin = true;
		payload.confirmPassword = undefined;
		this.disableSaveBtn = true;

		if (this.userId && payload.type === UserTypes.client) {
			payload.companyId = null;
		}
		else {
			delete payload.companyId;
		}

		if (this.userId) {
			this.apiService.patch(`users/${this.userId}`, payload).subscribe({
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
