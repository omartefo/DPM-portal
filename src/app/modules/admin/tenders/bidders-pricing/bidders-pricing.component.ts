import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ApiService } from 'app/api.service';
import { GenericApiResponse, Tender } from 'app/models';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'bidder-pricing',
  templateUrl: './bidders-pricing.component.html',
  styleUrls: ['./bidders-pricing.component.scss']
})
export class BiddersPricingComponent implements OnInit {
	tenderId: number;
	tender: Tender;
	dataSource: any;
	selectedRow: any;
	displayedColumns: string[] = [];

	loading = false;
	dataError = false;

	constructor(private apiService: ApiService,
				private toastr: ToastrService,
				private route: ActivatedRoute,
				private router: Router,
				private cdr: ChangeDetectorRef,
				private confirmationService: FuseConfirmationService)
	{
		this.displayedColumns = ['company', 'duration', 'price', 'status'];
		this.tenderId = +route.snapshot.paramMap.get('tenderId');
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	showError = () => this.dataError;

	ngOnInit(): void {
		this.getTenderDetails();
		this.getAllBids();
	}

	getAllBids(): void {
		this.loading = true;
		this.apiService.get(`tenders/${this.tenderId}/bids`).subscribe({
			next: (resp: GenericApiResponse) => {
				this.dataSource = resp.data.bids;
				this.loading = false;

				if (resp.data.bids.length === 0)
				{
					this.dataError = true;
					const r = {
						title: 'No Record Found',
						message: ''
					};

					this.dataSource = [r];
				}

				this.cdr.detectChanges();
			},
			error: (error: any) => {
				this.toastr.error(error);
				this.loading = false;
			}
		});
	}

	getTenderDetails(): void {
		this.apiService.get(`tenders/${this.tenderId}`).subscribe({
			next: (resp: GenericApiResponse) => this.tender = resp.data.tender,
			error: (error: any) => this.toastr.error(error)
		});
	}

	onAwardTender(): void {
		console.log('Tender =', this.tender, this.selectedRow);

		const dialog = this.confirmationService.open({
			title: 'Award Tender',
			message: `Are you sure, you want to Award Tender #${this.tender.tenderNumber}?`
		});

		dialog.afterClosed().subscribe((resp: 'confirmed' | 'cancelled') => {
			if (resp === 'confirmed') {
				const payload = {
					awardedTo: this.selectedRow.userId,
					company: this.selectedRow.user.company.name
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
}
