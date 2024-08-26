import { ToastrService } from 'ngx-toastr';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApiService } from 'app/api.service';
import { TableAction, TableConfig, TableSignal } from 'app/shared/components/generic-table/models';
import { Subject, Subscription } from 'rxjs';
import { AdminAddFormComponent } from './../admin-form/admin-form.component';
import { UserTypes } from 'app/shared/constants';
import { User } from 'app/models';
import { UserService } from 'app/core/user/user.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class AdminUsersComponent implements OnInit, OnDestroy {
	tableConfig: TableConfig;
	actions = new Subject<TableAction>();
	userSubscription: Subscription;
	loggedInUser: User;

	constructor(private dialog: MatDialog,
				private apiService: ApiService,
				private toastr: ToastrService,
				private userService: UserService,
				private confirmationService: FuseConfirmationService)
	{
		this.initConfig();
	}

	ngOnInit(): void {
		this.getLoggedInUser();
	}

	ngOnDestroy(): void {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
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

	private initConfig(): void {
		this.tableConfig = {
			title: 'Admin Users',
			slug: 'users',
			primaryKey: 'userId',

			showAdd: true,
			showSearch: true,

			searchColumn: 'name',

			/*
				Generic table level permissions
				--------------------------------
				1. Admin can edit record but can not perform delete operation
				2. Employee can only view data but can not perform edit/delete operations
			*/

			rowActions: [
				// Only "Super Admin" can edit his/her record.
				{ name: 'edit', title: 'Edit', action: 'OnEdit', condition: this.checkIfCanEdit },
				// Only "Super Admin" can reset passwords
				{ name: 'resetPassword', title: 'Reset Password', action: 'OnResetPassword', condition: this.isSuperAdmin },
				// Logged In user can delete his/her own account; Also only Super Admin can delete records
				{ name: 'delete', title: 'Delete', action: 'OnDelete', condition: this.isNotLoggedInUser },
				{ name: 'approve', title: 'Approve', action: 'OnApprove', condition: this.checkApproveBtnCondition },
				// Logged In user can not disapprove his/her own account; Also Super Admin can not be changed.
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

	private checkApproveBtnCondition = (user: User): boolean => !user.isAccountActive;
	private checkDisApproveBtnCondition = (user: User): boolean => {
		if (user.type === UserTypes.superAdmin) {
			return false;
		}
		return user.isAccountActive && this.isNotLoggedInUser(user);
	};
	private isNotLoggedInUser = (user: User): boolean => user.userId !== this.loggedInUser.userId;
	private isSuperAdmin = (): boolean => this.loggedInUser.type === UserTypes.superAdmin;
	private checkIfCanEdit = (user: User): boolean => {
		if (this.loggedInUser.type !== UserTypes.superAdmin && user.type === UserTypes.superAdmin) {
			return false;
		}

		return true;
	};

	private getLoggedInUser(): void {
		this.userSubscription = this.userService.user$.subscribe((user) => {
			if (user) {
				this.loggedInUser = user;
			}
		});
	}

	private onHandleUser(user: User = null): void {
		const dialog = this.dialog.open(AdminAddFormComponent, {
			width: '40%',
			maxHeight: '90%',
			height: '90%'
		});

		if (user) {
			dialog.componentInstance.id = user.userId;
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
