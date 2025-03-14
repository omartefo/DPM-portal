export type TableFormat = 'number' | 'image' | 'boolean' | 'date' | 'datetime' | 'url' | 'downloadable';

export interface TableConfig {
    title: string;
    slug: string;
	primaryKey: string;

	addBtnText?: string;
	showAdd: boolean;
	showSearch: boolean;

	searchColumn?: string;
	where?: WhereData;

    rowActions: TableRowAction[];
    columns: TableColumn[];
}

export interface TableColumn {
    name: string;
    title: string;
    sortable?: boolean;
    visible?: boolean;
    format?: TableFormat;
	isArray?: boolean;
	columnName?: string;
	applyStatusClass?: boolean;
	width?: string;

	filter?: boolean;
	toggleFilter?: boolean;
	filterConfig?: TableFilterConfig;
}

export interface WhereData {
	column: string;
	search: string[];

	op: 'eq' | 'lt' | 'lte' | 'gt' | 'gte' | 'ne';
}

export interface TableRowAction {
    name: string;
    title: string;
	action: string;
	class?: string;

	condition?: (row: any, action: string) => boolean;
}

export interface TableSignal {
	type: string;
	row: any;
}

export interface TableAction {
	type: 'reload';
}

export interface TableFilterConfig {
	options: string[];
	whereCol: string;
	selectedFilterValue?: string;
}
