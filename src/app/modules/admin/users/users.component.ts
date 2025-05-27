import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { TableConfig, TableAction, TableSignal } from 'app/shared/components/generic-table/models';
import { UserAddFormComponent } from './user-add-form/user-add-form.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApiService } from 'app/api.service';
import { UserTypes } from 'app/shared/constants/constants';
import { User } from 'app/models';


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
		this.initConfig();
	}

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

	getUserGroupTypes(): string[] {
		return [UserTypes.client, UserTypes.consultant, UserTypes.contractor, UserTypes.supplier];
	}

	private initConfig(): void {
		this.tableConfig = {
			title: 'Users',
			slug: 'users',
			primaryKey: 'userId',

			showAdd: true,
			showSearch: true,

			searchColumn: 'mobileNumber',

			/*
				Generic table level permissions
				--------------------------------
				1. Admin can edit record but can not perform delete operation
				2. Employee can only view data but can not perform edit/delete operations
			*/
			rowActions: [
				{ name: 'edit', title: 'Edit', action: 'OnEdit' },
				{ name: 'delete', title: 'Delete', action: 'OnDelete', class: 'delete-fg' },
				{ name: 'approve', title: 'Approve', action: 'OnApprove', condition: this.checkApproveBtnCondition },
				{ name: 'disApprove', title: 'Disapprove', action: 'OnDisapprove', condition: this.checkDisApproveBtnCondition, class: 'delete-fg' }
			],

			where: { column: 'type', op: 'ne', search: [UserTypes.superAdmin, UserTypes.admin, UserTypes.employee] },

			columns: [
				{ name: 'name', title: 'Name' },
				{ name: 'email', title: 'Email' },
				{ name: 'mobileNumber', title: 'Mobile Number' },
				{ name: 'isAccountActive', title: 'Is Account Active', format: 'boolean' },
				{
					name: 'type', title: 'Group Type', filter: true,
					filterConfig: {
						options: this.getUserGroupTypes(),
						whereCol: 'type'
					}
				},
				{ name: 'company.name', title: 'Company' },
				{ name: 'createdAt', title: 'Date Created', format: 'datetime' },
			]
		};
	}

	private checkApproveBtnCondition = (user: User): boolean => !user.isAccountActive;
	private checkDisApproveBtnCondition = (user: User): boolean => user.isAccountActive;

	private onHandleUser(user: User = null): void {
		const dialog = this.dialog.open(UserAddFormComponent, {
			width: '40%',
			maxHeight: '90%',
			height: '90%'
		});

		if (user) {
			dialog.componentInstance.userId = user.userId;
		}

		dialog.afterClosed().subscribe((resp: boolean) => {
			if (resp) {
				this.actions.next({ type: 'reload'});
			}
		});
	}

	private onApproveDisapproveUser(action: 'approve' | 'disapprove', user: any): void {
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
