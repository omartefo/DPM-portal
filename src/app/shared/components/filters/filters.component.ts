import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TableFilterConfig } from '../generic-table/models';


@Component({
  selector: 'table-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class TableFiltersComponent implements OnInit {
	@Output() signal = new EventEmitter();
	@Input() config: TableFilterConfig;

	selectedOption = new FormControl();

    constructor() {
	}

	ngOnInit(): void {
		if (this.config?.selectedFilterValue) {
			this.selectedOption.setValue([this.config.selectedFilterValue]); // ✅ Wrap in an array
		}
	}

	onSelect(): void {
		this.signal.emit({ type: 'Select', value: this.selectedOption.value });
	}

	onCancel(): void {
		this.signal.emit({ type: 'Cancel', value: null });
		this.selectedOption.setValue(null);
	}
}
