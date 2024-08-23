import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { TableConfig, TableAction, TableSignal } from 'app/shared/components/generic-table/models';
import { UploadDocumentComponent } from '../upload-doc/upload-doc.component';


@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadCenterComponent {
	tableConfig: TableConfig;
	actions = new Subject<TableAction>();

	constructor(private dialog: MatDialog)
	{
		this.tableConfig = {
			title: 'Download Center',
			slug: 'downloads',
			primaryKey: 'downloadId',

			showAdd: true,
			showSearch: false,

			rowActions: [
				{ name: 'edit', title: 'Edit', action: 'OnEdit' },
				{ name: 'delete', title: 'Delete', action: 'OnDelete' }
			],

			columns: [
				{ name: 'documents', title: 'Documents', format: 'downloadable' },
				{ name: 'description', title: 'Description' },
				{ name: 'user.name', title: 'Uploaded By' },
				{ name: 'createdAt', title: 'Date Created', format: 'datetime' },
			]
		};
	}

	onTableSignal(ev: TableSignal): void {
		switch(ev.type) {
			case 'OpenForm':
				this.onUploadDocument();
				break;

			case 'OnEdit':
				this.onUploadDocument(ev.row);
				break;
		}
	}

	onUploadDocument(item = null): void {
		const dialog = this.dialog.open(UploadDocumentComponent, {
			width: '40%',
			maxHeight: '90%',
			height: '90%'
		});

		if (item) {
			dialog.componentInstance.id = item.downloadId;
		}

		dialog.afterClosed().subscribe((resp: boolean) => {
			if (resp) {
				this.actions.next({ type: 'reload'});
			}
		});
	}
}
