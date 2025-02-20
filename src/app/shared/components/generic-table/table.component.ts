import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import JSZip from 'jszip';
import { FileSaverService } from 'ngx-filesaver';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApiService } from 'app/api.service';
import { UserService } from 'app/core/user/user.service';
import { GenericApiResponse, User } from 'app/models';
import { TableAction, TableConfig, TableRowAction, TableSignal, WhereData } from './models';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
	@Input() config: TableConfig;
	@Input() actions = new Subject<TableAction>();

	@Output() signal = new EventEmitter<TableSignal>();
	@ViewChild(MatSort) sort: MatSort;

	selectedRow: any = null;
	dataSource: any;
	loading = false;
	displayedColumns: string[] = [];
	pageSizeOptions = [10, 15, 20, 25];
	totalRecords = 0;
	limit: number = 10;
	page: number = 1;
	dataError = false;

	searchFC = new FormControl();

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	showError = () => this.dataError;

	// eslint-disable-next-line @typescript-eslint/member-ordering
	constructor(private apiService: ApiService,
				private userService: UserService,
				private confirmationService: FuseConfirmationService,
				private fileSaverService: FileSaverService,
				private toastr: ToastrService,
				private cdr: ChangeDetectorRef)
	{
		this.dataSource = new MatTableDataSource();
	}

	ngOnInit(): void {
		this.checkRolePermissions();

		this.actions.subscribe((ac: TableAction) => {
			if (ac.type === 'reload') {
				this.selectedRow = null;
				this.loadData();
			}
		});

		this.searchFC.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe(val => this.searchData(val));

		if (this.config) {
			for (const col of this.config.columns) {
				if (col.visible === false) {
					continue;
				};

				this.displayedColumns.push(col.name);
			}

			this.loadData();
		}
	}

	checkRolePermissions(): void {
		this.userService.user$.subscribe((user: User) => {
			switch(user.type) {
				case 'Admin':
					const idx = this.config.rowActions.findIndex(action => action.action === 'OnDelete');
					this.config.rowActions.splice(idx, 1);
					break;

				case 'Employee':
					const deleteActionIdx = this.config.rowActions.findIndex(action => action.action === 'OnDelete');
					const editActionIdx = this.config.rowActions.findIndex(action => action.action === 'OnEdit');

					this.config.rowActions.splice(deleteActionIdx, 1);
					this.config.rowActions.splice(editActionIdx, 1);
					break;
			}
		});
	}

	loadData(search: string | null = null): void {
		let queryString = `?page=${this.page}&limit=${this.limit}`;

		if (this.config.where) {
			const whereQueryStr = this.handleWhere();
			queryString += `&${whereQueryStr}`;
		}

		if (search) {
			queryString += `&${search}`;
		}

		const slug = this.config.slug + queryString;

		this.apiService.get(slug).subscribe({
			next: (resp: GenericApiResponse) => this.onAPIResponse(resp),
			error: (error: any) => this.handleError(error)
		});
	}

	onAPIResponse(resp: GenericApiResponse): void {
		this.loading = false;
		this.dataError = false;
		this.dataSource = resp.data[this.config.slug].rows;
		this.totalRecords = resp.data[this.config.slug].count;

		if (this.totalRecords === 0)
		{
			this.dataError = true;
			const r = {
				title: 'No Record Found',
				message: ''
			};

			this.dataSource = [r];
		}

		this.cdr.detectChanges();
	}

	handleError(error: string): void {
		this.loading = false;
		this.dataError = true;

		const r = {
			title: 'Error loading data',
			message: error
		};

		this.dataSource = [r];
		this.cdr.detectChanges();
	}

	searchData(value: string): void {
		if (value === '' || value == null) {
			this.loadData();
			return;
		}

		const searchCol = this.config.searchColumn;

		if (searchCol) {
			const queryStr = `${searchCol}=${value}`;
			this.loadData(queryStr);
		}
	}

	handleWhere(): string {
		const { column, search, op } = this.config.where as WhereData;

		let queryString = `${column}[${op}]=${search}`;

		switch(this.config?.where?.op) {
			case 'eq':
				queryString = `${column}=${search}`;
				break;

			case 'ne':
				queryString = `${column}[ne]=${search}`;

		}

		return queryString;
	}

	onAdd(): void {
		this.selectedRow = null;

		const signal: TableSignal = {
			type: 'OpenForm',
			row: null
		};

		this.signal.emit(signal);
	}

	onRefreshData(): void {
		this.selectedRow = null;
		this.searchData(this.searchFC.value);
	}

	onCellClick(event: Event, row: any): void {
		event.stopPropagation();

		const signal = {
			type: 'CellAction',
			row
		};

		this.signal.emit(signal);
	}

	onRowAction(ac: TableRowAction): void {
		const signal = {
			type: ac.action,
			row: this.selectedRow
		};

		this.signal.emit(signal);

		if (ac.action === 'OnPlay') {
			const audioObj = this.selectedRow.audioWav ? this.selectedRow.audioWav : this.selectedRow.audioMp3;
			const audio = new Audio(audioObj.url);
			audio.play();
		}

		if (ac.action === 'OnDelete') {
			const dialog = this.confirmationService.open({
				title: 'Are you sure, you want to delete the record?'
			});

			dialog.afterClosed().subscribe((action: 'confirmed' | 'cancelled') => {
				if (action === 'confirmed') {
					const slug = `${this.config.slug}/${this.selectedRow[this.config.primaryKey]}`;
					this.apiService.delete(slug).subscribe({
						next: () => this.loadData(),
						error: error => this.toastr.error(error)
					});

					this.selectedRow = null;
				}
			});
		}
	}

	onSortChange(ev: any): void {
		console.log('Table sort change =', ev);
	}

	onRowClick(row: any): void {
		if (row === this.selectedRow) {
			this.selectedRow = null;
			return;
		}

		this.selectedRow = row;
	}

	getFileName(path: string): string {
		return path.substring(path.lastIndexOf('/')+1);
	}

	onDownload(event: Event, urls: string[]): void {
		event.stopPropagation();

		const zip = new JSZip();
		const folder = zip.folder('files');

		urls.forEach((url)=> {
			const blobPromise = fetch(url).then((r: any) => {
				if (r.status === 200) {
					return r.blob();
				}
				return Promise.reject(new Error(r.statusText));
			});

			const name = url.substring(url.lastIndexOf('/'));
			folder?.file(name, blobPromise);
		});

		zip.generateAsync({ type: 'blob' }).then((content: any) => {
			this.fileSaverService.save(content, 'files.zip');
		});
	}

	onPageChange(ev: PageEvent): void {
		this.limit = ev.pageSize;
		this.page = ev.pageIndex + 1;
		this.loadData();
	}

	normalizeClass(value: string): string {
		if (!value) {
			return '';
		}

		return value
			.toLowerCase()
			.replace(/[\s_]+/g, '-');  // Replace spaces and underscores with hyphens
	}
}
