import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'app/api.service';
import { GenericApiResponse, User } from 'app/models';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'add-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class AddProjectFormComponent implements OnInit {
	projectTypes: string[] = ['Villa', 'Commercial Building', 'Industrial Project'];
	clients: User[] = [];
	id: number;
	theForm: FormGroup;
	disableSaveBtn = false;

	constructor(private apiService: ApiService,
				private fb: FormBuilder,
				private toastr: ToastrService,
				private dialogRef: MatDialogRef<AddProjectFormComponent>)
	{
		this.theForm = this.fb.group({
			name: ['', Validators.required],
			location: ['', Validators.required],
			type: ['', Validators.required],
			description: ['', Validators.required],
			clientId: ['', Validators.required]
		});
	}

	ngOnInit(): void {
		this.getAllClients();

		if (this.id) {
			this.getProject();
		}
	}

	onSave(): void {
		const payload = this.theForm.value;
		this.disableSaveBtn = true;

		if (this.id) {
			this.apiService.patch(`projects/${this.id}`, payload).subscribe({
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
			this.apiService.post('projects', payload).subscribe({
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

	private getAllClients(): void {
		this.apiService.get('users?type=Client&limit=all').subscribe({
			next: (resp: GenericApiResponse) => this.clients = resp.data['users'].rows,
			error: (error: any) => this.toastr.error(error)
		});
	}

	private getProject(): void {
		this.apiService.get(`projects/${this.id}`).subscribe({
			next: (resp: GenericApiResponse) => {
				this.theForm.patchValue(resp.data['project']);
			},
			error: (error: any) => this.toastr.error(error)
		});
	}
}
