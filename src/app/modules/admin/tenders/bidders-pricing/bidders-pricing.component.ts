/* eslint-disable @typescript-eslint/naming-convention */
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApiService } from 'app/api.service';
import { Bid, GenericApiResponse, Tender } from 'app/models';
import { MaterialModule } from 'app/modules/material/material.module';
import { TableFiltersComponent } from 'app/shared/components/filters/filters.component';
import { TableFilterConfig, WhereData } from 'app/shared/components/generic-table/models';
import { ReplaceUnderscorePipe } from 'app/shared/pipes/replace-underscore.pipe';
import { ExportService } from 'app/shared/services/export.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';

interface ErrorRow {
  title: string;
  message: string;
}

type BidTableRow = Bid | ErrorRow;

@Component({
  selector: 'bidder-pricing',
  templateUrl: './bidders-pricing.component.html',
  styleUrls: ['./bidders-pricing.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReplaceUnderscorePipe,
		TableFiltersComponent, ReactiveFormsModule
	]
})
export class BiddersPricingComponent implements OnInit {
	tenderId: number;
	tender: Tender;
	dataSource: BidTableRow[] = [];
	selectedRow: Bid | null = null;
	displayedColumns: string[] = [];

	loading = false;
	dataError = false;

	limit = 10;
	page = 1;
	pageSizeOptions = [10, 15, 20, 25];
	totalRecords = 0;

	toggleRangeFilter = false;
	rangeFilterOptions: TableFilterConfig = {
		options: ['In Range', 'Out Of Range'],
		whereCol: 'status',
		selectedFilterValue: null
	};
	apiWhere: WhereData | null = null;

	toggleStageFilter = false;
	stageFilterOptions: TableFilterConfig = {
		options: ['Technical Meeting', 'Site Visit', 'Shortlisted'],
		whereCol: 'stage',
		selectedFilterValue: null
	};

	searchFC = new FormControl();

	constructor(private apiService: ApiService,
				private toastr: ToastrService,
				private route: ActivatedRoute,
				private router: Router,
				private cdr: ChangeDetectorRef,
				private confirmationService: FuseConfirmationService,
				private exportService: ExportService)
	{
		this.displayedColumns = ['company', 'duration', 'price', 'stage', 'isVerifiedOnBinaa', 'status', 'dummy_column_take_space'];
		this.tenderId = +this.route.snapshot.paramMap.get('tenderId');
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	showError = () => this.dataError;

	ngOnInit(): void {
		this.getTenderDetails();
		this.loadData();

		this.searchFC.valueChanges
			.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe(val => this.searchData(val));
	}

	searchData(value: string): void {
		if (value === '' || value == null) {
			this.loadData();
			return;
		}

		const queryStr = `company=${value}`;
		this.loadData(queryStr);
	}

	loadData(search: string | null = null): void {
		this.loading = true;
		let queryString = `?page=${this.page}&limit=${this.limit}`;

		if (this.apiWhere) {
			const whereQueryStr = this.handleWhere();
			queryString += `&${whereQueryStr}`;
		}

		if (search) {
			queryString += `&${search}`;
		}

		const slug = `tenders/${this.tenderId}/bids${queryString}`;

		this.apiService.get(slug).subscribe({
			next: (resp: GenericApiResponse) => this.onHandleAPIResponse(resp),
			error: (error: any) => this.onHandleError(error)
		});
	}

	getTenderDetails(): void {
		this.apiService.get(`tenders/${this.tenderId}`).subscribe({
			next: (resp: GenericApiResponse) => this.tender = resp.data.tender,
			error: (error: any) => this.toastr.error(error)
		});
	}

	onAwardTender(): void {
		const dialog = this.confirmationService.open({
			title: 'Award Tender',
			message: `Are you sure, you want to Award Tender #${this.tender.tenderNumber}?`
		});

		dialog.afterClosed().subscribe((resp: 'confirmed' | 'cancelled') => {
			if (resp === 'confirmed') {
				const { user } = this.selectedRow;

				const payload = {
					awardedTo: user.userId,
					company: user.company.name
				};

				this.apiService.patch(`tenders/${this.tenderId}/awardTender`, payload).subscribe({
					next: () => {
						this.toastr.success('Tender awarded successfully');
						this.router.navigateByUrl('/tenders');
					},
					error: (error: any) => this.toastr.error(error)
				});
			}
		});
	}

	onRowClick(row: any): void {
		if (row === this.selectedRow) {
			this.selectedRow = null;
			return;
		}

		this.selectedRow = row;
	}

	exportToExcel(): void {
		const simplifiedData = this.dataSource.map((element: Bid) => ({
			'Company': element.user?.company?.name || '',
			'Duration': element.durationInNumbers || '',
			'Price': element.priceInNumbers || '',
			'Binaa Verified': element.user?.company?.isVerifiedOnBinaa ? 'Yes' : 'No',
			'Stage': element.stage,
			'Status': this.formatStatus(element.status)
		}));

		this.exportService.exportAsExcelFile(simplifiedData, 'Bids');
	}

	formatStatus(status: string): string {
		if (!status) {
			return '';
		};

		return status
			.toLowerCase()
			.split('_')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	onStageChange(bid: Bid, stage: string | null): void {
		const payload = { stage };

		this.apiService.patch(`bids/${bid.biddingId}/stage`, payload).subscribe({
			next: () => {
				bid.stage = stage;
				this.toastr.success('Stage updated successfully');
			},
			error: (error: any) => {
				this.toastr.error(error);
			}
		});
	}

	onPageChange(ev: PageEvent): void {
		this.limit = ev.pageSize;
		this.page = ev.pageIndex + 1;
		this.loadData();
	}

	onFilter(ev: any, type: 'range' | 'stage' = 'range'): void {
		const search = ev.value ? ev.value[0] : '';

		if (type === 'range') {
			this.toggleRangeFilter = false;
			this.rangeFilterOptions.selectedFilterValue = search;
		}
		else {
			this.toggleStageFilter = false;
			this.stageFilterOptions.selectedFilterValue = search;
		}

		this.apiWhere = {
			column: type === 'range'
				? this.rangeFilterOptions.whereCol
				: this.stageFilterOptions.whereCol,
			op: 'eq',
			search
		};

		this.loadData();
	}

	private onHandleAPIResponse(resp: GenericApiResponse): void {
		const { count, rows } = resp.data.bids;

		this.totalRecords = count;
		this.loading = false;

		if (count === 0) {
			this.dataError = true;
			this.dataSource = [
				{ title: 'No Record Found', message: '' } as ErrorRow
			];
		} else {
			this.dataError = false;
			this.dataSource = rows;
		}

		this.cdr.detectChanges();
	}

	private onHandleError(error): void {
		this.toastr.error(error);
		this.loading = false;
	}

	private handleWhere(): string {
		const { column, search, op } = this.apiWhere as WhereData;

		let queryString = `${column}[${op}]=${search}`;

		switch(this?.apiWhere?.op) {
			case 'eq':
				queryString = `${column}=${search}`;
				break;

			case 'ne':
				queryString = `${column}[ne]=${search}`;

		}

		return queryString;
	}
}
