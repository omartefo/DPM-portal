import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'app/api.service';
import Validation from 'app/shared/validators';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
	userId: number;
	theForm: FormGroup;
	disableSaveBtn = false;
	submitBtnText: string;

	constructor(private apiService: ApiService,
				private fb: FormBuilder,
				private dialogRef: MatDialogRef<ResetPasswordComponent>,
				private toastr: ToastrService)
	{
		this.theForm = fb.group({
			newPassword: [null, [Validators.required]],
			confirmNewPassword: [null, [Validators.required]],
		}, { validators: [Validation.match('newPassword', 'confirmNewPassword')]});
	}

	onResetPassword(): void {
		const payload = this.theForm.value;
		payload.confirmNewPassword = undefined;

		this.disableSaveBtn = true;

		this.apiService.patch(`users/${this.userId}/resetPassword`, payload).subscribe({
			next: () => {
				this.toastr.success('Password reset successfully', 'Password Reset');
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
