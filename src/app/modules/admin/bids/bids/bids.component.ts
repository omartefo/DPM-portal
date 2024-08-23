import { Component } from '@angular/core';
import { TableConfig, TableAction, TableSignal } from 'app/shared/components/generic-table/models';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-bids',
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.scss']
})
export class BidsComponent {
	tableConfig: TableConfig;
	actions = new Subject<TableAction>();

	constructor()
	{
		this.tableConfig = {
			title: 'All Bids',
			slug: 'bids',
			primaryKey: 'biddingId',

			showAdd: false,
			showSearch: true,

			searchColumn: 'tenderNumber',

			rowActions: [
				{ name: 'delete', title: 'Delete', action: 'OnDelete' },
			],

			columns: [
				{ name: 'tender.tenderNumber', title: 'Tender Number' },
				{ name: 'user.name', title: 'User Name' },
				{ name: 'user.mobileNumber', title: 'User Mobile number' },
				{ name: 'user.company.name', title: 'Company' },
				{ name: 'durationInLetters', title: 'Duration In Letters' },
				{ name: 'durationInNumbers', title: 'Duration In Numbers' },
				{ name: 'priceInLetters', title: 'Price In Letters' },
				{ name: 'priceInNumbers', title: 'Price In Numbers' },
				{ name: 'status', title: 'Status' },

				{ name: 'createdAt', title: 'Date Created', format: 'datetime' },
			]
		};
	}

	onTableSignal(ev: TableSignal): void {
		console.log(ev);
	}
}
