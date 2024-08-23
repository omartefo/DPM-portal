import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { TableConfig, TableAction, TableSignal } from 'app/shared/components/generic-table/models';
import { UserAddFormComponent } from './user-add-form/user-add-form.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApiService } from 'app/api.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
	tableConfig: TableConfig;
	actions = new Subject<TableAction>();

	constructor(private dialog: MatDialog,
				private apiService: ApiService,
				private toastr: ToastrService,
				private confirmationService: FuseConfirmationService)
	{
		this.tableConfig = {
			title: 'Users',
			slug: 'users',
			primaryKey: 'userId',

			showAdd: true,
			showSearch: true,

			searchColumn: 'mobileNumber',

			rowActions: [
				{ name: 'edit', title: 'Edit', action: 'OnEdit' },
				{ name: 'delete', title: 'Delete', action: 'OnDelete' },
				{ name: 'approve', title: 'Approve', action: 'OnApprove', condition: this.checkApproveBtnCondition },
				{ name: 'disApprove', title: 'Disapprove', action: 'OnDisapprove', condition: this.checkDisApproveBtnCondition }
			],

			where: { column: 'type', op: 'ne', search: ['Super_Admin', 'Admin', 'Employee'] },

			columns: [
				{ name: 'name', title: 'Name' },
				{ name: 'email', title: 'Email' },
				{ name: 'mobileNumber', title: 'Mobile Number' },
				{ name: 'isAccountActive', title: 'Is Account Active', format: 'boolean' },
				{ name: 'type', title: 'Group Type' },
				{ name: 'company.name', title: 'Company' },
				{ name: 'createdAt', title: 'Date Created', format: 'datetime' },
			]
		};
	}

	checkApproveBtnCondition = (row: any, action: string): boolean => !row.isAccountActive;
	checkDisApproveBtnCondition = (row: any, action: string): boolean => row.isAccountActive;

	onTableSignal(ev: TableSignal): void {
		switch(ev.type) {
			case 'OpenForm':
				this.onHandleUser();
				break;

			case 'OnEdit':
				this.onHandleUser(ev.row);
				break;

			case 'OnApprove':
				this.onApproveDisapproveUser('approve', ev.row);
				break;

			case 'OnDisapprove':
				this.onApproveDisapproveUser('disapprove', ev.row);
				break;
		}
	}

	onHandleUser(row = null): void {
		const dialog = this.dialog.open(UserAddFormComponent, {
			width: '40%',
			maxHeight: '90%',
			height: '90%'
		});

		if (row) {
			dialog.componentInstance.userId = row.userId;
		}

		dialog.afterClosed().subscribe((resp: boolean) => {
			if (resp) {
				this.actions.next({ type: 'reload'});
			}
		});
	}

	onApproveDisapproveUser(action: 'approve' | 'disapprove', user: any): void {
		const payload = { isAccountActive: false };
		if (action === 'approve') {
			payload.isAccountActive = true;
		}

		const dialog = this.confirmationService.open({
			title: `Are you sure, you want to ${action} user account`
		});

		dialog.afterClosed().subscribe((resp: 'confirmed' | 'cancelled') => {
			if (resp === 'confirmed') {
				this.apiService.patch(`users/${user.userId}`, payload).subscribe({
					next: () => this.actions.next({ type: 'reload'}),
					error: (error: any) => this.toastr.error(error)
				});
			}
		});
	}
}
