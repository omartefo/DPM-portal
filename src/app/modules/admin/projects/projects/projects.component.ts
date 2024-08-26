import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { TableConfig, TableAction, TableSignal } from 'app/shared/components/generic-table/models';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApiService } from 'app/api.service';
import { GenericApiResponse } from 'app/models';
import { AddProjectFormComponent } from '../project-form/project-form.component';
import { AddTenderFormComponent } from '../../tenders/tender-form/tender-form.component';
import { Project } from './../../../../models';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
	tableConfig: TableConfig;
	actions = new Subject<TableAction>();

	constructor(private dialog: MatDialog,
				private apiService: ApiService,
				private toastr: ToastrService,
				private confirmationService: FuseConfirmationService)
	{
		this.tableConfig = {
			title: 'Projects',
			slug: 'projects',
			primaryKey: 'projectId',

			showAdd: true,
			showSearch: true,

			searchColumn: 'name',

			rowActions: [
				{ name: 'edit', title: 'Edit', action: 'OnEdit' },
				{ name: 'delete', title: 'Delete', action: 'OnDelete', class: 'delete-fg' },
				{ name: 'addTender', title: 'Add Tender', action: 'OnAddTender', condition: this.checkAddTenderBtnCondition },
				{ name: 'approve', title: 'Approve', action: 'OnApprove', condition: this.checkApproveBtnCondition },
				{ name: 'disApprove', title: 'Disapprove', action: 'OnDisapprove', condition: this.checkDisApproveBtnCondition, class: 'delete-fg' }
			],

			columns: [
				{ name: 'name', title: 'Project Name' },
				{ name: 'user.name', title: 'Client' },
				{ name: 'user.mobileNumber', title: 'Mobile Number' },
				{ name: 'tenders', title: 'Associated Tender', isArray: true, columnName: 'tenderNumber' },
				{ name: 'location', title: 'Location' },
				{ name: 'type', title: 'Project Type' },
				{ name: 'description', title: 'Description' },
				{ name: 'isApproved', title: 'Is Approved', format: 'boolean' },
				{ name: 'createdAt', title: 'Date Created', format: 'datetime' },
			]
		};
	}

	checkAddTenderBtnCondition = (project: any, action: string): boolean => project.isApproved;
	checkApproveBtnCondition = (project: any, action: string): boolean => !project.isApproved;
	checkDisApproveBtnCondition = (project: any, action: string): boolean => project.isApproved;

	onTableSignal(ev: TableSignal): void {
		switch(ev.type) {
			case 'OpenForm':
				this.onAddUpdateProject();
				break;

			case 'OnEdit':
				this.onAddUpdateProject(ev.row);
				break;

			case 'OnApprove':
				this.onApproveProject(ev.row);
				break;

			case 'OnAddTender':
				this.onAddTender(ev.row);
				break;
		}
	}

	onAddUpdateProject(project: Project = null): void {
		const dialog = this.dialog.open(AddProjectFormComponent, {
			width: '40%',
			maxHeight: '90%',
			height: '90%'
		});

		if (project) {
			dialog.componentInstance.id = project.projectId;
		}

		dialog.afterClosed().subscribe((resp: boolean) => {
			if (resp) {
				this.actions.next({ type: 'reload'});
			}
		});
	}

	onAddTender(project: any): void {
		const dialog = this.dialog.open(AddTenderFormComponent, {
			width: '40%',
			maxHeight: '90%',
			height: '90%'
		});

		dialog.componentInstance.projectId = project.projectId;

		dialog.afterClosed().subscribe((resp: boolean) => {
			if (resp) {
				this.actions.next({ type: 'reload'});
			}
		});
	}

	onApproveProject(project: any): void {
		const dialog = this.confirmationService.open({
			title: 'Approve Project?'
		});

		dialog.afterClosed().subscribe((action: 'confirmed' | 'cancelled') => {
			if (action === 'confirmed') {
				this.apiService.patch(`projects/approve/${project.projectId}`, {}).subscribe({
					next: (resp: GenericApiResponse) => {
						this.actions.next({ type: 'reload' });
					},
					error: (error: any) => this.toastr.error(error)
				});
			}
		});
	}
}
