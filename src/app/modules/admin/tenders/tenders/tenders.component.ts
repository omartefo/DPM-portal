import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Tender } from 'app/models';
import { TableConfig, TableAction, TableSignal } from 'app/shared/components/generic-table/models';
import { AddTenderFormComponent } from 'app/modules/admin/tenders/tender-form/tender-form.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApiService } from './../../../../api.service';
import { CompanyDetailComponent } from './../company-info/tender-form.component';
import { TenderStatuses } from 'app/shared/constants/constants';


@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent {
	tableConfig: TableConfig;
	actions = new Subject<TableAction>();

	constructor(private dialog: MatDialog,
				private apiService: ApiService,
				private toastr: ToastrService,
				private router: Router,
				private confirmationService: FuseConfirmationService)
	{
		this.tableConfig = {
			title: 'Tenders',
			slug: 'tenders',
			primaryKey: 'tenderId',

			showAdd: true,
			showSearch: true,

			searchColumn: 'tenderNumber',

			rowActions: [
				{ name: 'awardTender', title: 'Award Tender', action: 'OnAwardTender', condition: this.isTenderUnderEvalualtion },
				{ name: 'unAwardTender', title: 'Un-Award Tender', action: 'OnUnAwardTender', condition: this.checkUnAwardTenderCondition },
				{ name: 'edit', title: 'Edit', action: 'OnEdit', condition: this.canEditTender },
				{ name: 'delete', title: 'Delete', action: 'OnDelete', class: 'delete-fg' },
			],

			columns: [
				{ name: 'tenderNumber', title: 'Tender Number' },
				{ name: 'type', title: 'Type' },
				{ name: 'project.name', title: 'Project' },
				{ name: 'openingDate', title: 'Opening Date', format: 'datetime' },
				{ name: 'closingDate', title: 'Closing Date', format: 'datetime' },
				{ name: 'minimumPrice', title: 'Minimum Price', format: 'number' },
				{ name: 'maximumPrice', title: 'Maximum Price', format: 'number' },
				{ name: 'location', title: 'Location' },
				{ name: 'status', title: 'Status', applyStatusClass: true, width: '9rem' },
				{ name: 'user.company.name', title: 'Company', format: 'url' },
			]
		};
	}

	isTenderUnderEvalualtion = (tender: Tender): boolean => tender.status === TenderStatuses.underEvaluation;
	checkUnAwardTenderCondition = (tender: Tender): boolean => ![TenderStatuses.open, TenderStatuses.underEvaluation].includes(tender.status);
	canEditTender = (tender: Tender): boolean => tender.status !== TenderStatuses.underEvaluation;

	onTableSignal(ev: TableSignal): void {
		switch(ev.type) {
			case 'OpenForm':
				this.onAddUpdateTender();
				break;

			case 'OnEdit':
				this.onAddUpdateTender(ev.row);
				break;

			case 'OnAwardTender':
				this.router.navigate([`/tenders/award/${ev.row.tenderId}`]);
				break;

			case 'OnUnAwardTender':
				this.onUnAwardTender(ev.row);
				break;

			case 'CellAction':
				this.onCompanyCellClick(ev.row);
				break;
		}
	}

	onAddUpdateTender(tender: Tender = null): void {
		const dialog = this.dialog.open(AddTenderFormComponent, {
			width: '40%',
			maxHeight: '90%',
			height: '90%'
		});

		if (tender) {
			dialog.componentInstance.tenderId = tender.tenderId;
		}

		dialog.afterClosed().subscribe((resp: boolean) => {
			if (resp) {
				this.actions.next({ type: 'reload'});
			}
		});
	}

	onUnAwardTender(tender: Tender): void {
		const dialog = this.confirmationService.open({
			title: 'Un Award Tender',
			message: `Are you sure, you want to Un Award Tender #${tender.tenderNumber}?`
		});

		dialog.afterClosed().subscribe((resp: 'confirmed' | 'cancelled') => {
			if (resp === 'confirmed') {
				this.apiService.patch(`tenders/${tender.tenderId}/unAwardTender`, {}).subscribe({
					next: () => this.actions.next({ type: 'reload'}),
					error: (error: any) => this.toastr.error(error)
				});
			}
		});
	}

	onCompanyCellClick(tender: Tender): void {
		const dialog = this.dialog.open(CompanyDetailComponent, {
			width: '35%',
			maxHeight: '65%',
			height: '65%'
		});

		dialog.componentInstance.company = tender.user.company;
	}
}
