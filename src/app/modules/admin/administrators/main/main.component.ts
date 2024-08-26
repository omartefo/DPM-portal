import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApiService } from 'app/api.service';
import { TableAction, TableConfig, TableSignal } from 'app/shared/components/generic-table/models';
import { Subject } from 'rxjs';
import { AdminAddFormComponent } from './../admin-form/admin-form.component';
import { UserTypes } from 'app/shared/constants';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class AdminUsersComponent {
	tableConfig: TableConfig;
	actions = new Subject<TableAction>();

	constructor(private dialog: MatDialog,
				private apiService: ApiService,
				private toastr: ToastrService,
				private confirmationService: FuseConfirmationService)
	{
		this.tableConfig = {
			title: 'Admin Users',
			slug: 'users',
			primaryKey: 'userId',

			showAdd: true,
			showSearch: true,

			searchColumn: 'name',

			rowActions: [
				{ name: 'edit', title: 'Edit', action: 'OnEdit' },
				{ name: 'delete', title: 'Delete', action: 'OnDelete' },
				{ name: 'approve', title: 'Approve', action: 'OnApprove', condition: this.checkApproveBtnCondition },
				{ name: 'disApprove', title: 'Disapprove', action: 'OnDisapprove', condition: this.checkDisApproveBtnCondition, class: 'delete-fg' }
			],

			where: { column: 'type', op: 'eq', search: [UserTypes.superAdmin, UserTypes.admin, UserTypes.employee]},

			columns: [
				{ name: 'name', title: 'Name' },
				{ name: 'email', title: 'Email' },
				{ name: 'mobileNumber', title: 'Mobile Number' },
				{ name: 'type', title: 'Group Type' },
				{ name: 'isAccountActive', title: 'Is Account Active', format: 'boolean' },
				{ name: 'createdAt', title: 'Date Created', format: 'datetime' },
			]
		};
	}

	checkApproveBtnCondition = (row: any): boolean => !row.isAccountActive;
	checkDisApproveBtnCondition = (row: any): boolean => row.isAccountActive;

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
		const dialog = this.dialog.open(AdminAddFormComponent, {
			width: '40%',
			maxHeight: '90%',
			height: '90%'
		});

		if (row) {
			dialog.componentInstance.id = row.userId;
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
