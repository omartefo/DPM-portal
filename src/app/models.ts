import { TenderStatuses } from './shared/constants/constants';

export type UserType = 'Client' | 'Supplier' | 'Contractor' | 'Consultant' | 'Super_Admin' | 'Admin' | 'Employee';

export interface GenericApiResponse {
	status: 'success' | 'failed';
	data: any;
	totalRecords?: number;
};

export interface User {
	userId: number;
	name: string;
	email: string;
	type: UserType;
	mobileNumber?: string;
	company?: UserCompany;
	avatar?: string;
	isAccountActive?: boolean;
	canParticipateInTenders?: boolean;
}

export interface UserCompany {
	companyId: number;
	name: string;
	commercialRegNumber: string;
	address: string;
	totalEmployees: number;
}

export interface Project {
	projectId: number;
	name: string;
	location: string;
	description: string;
	type: string;
	image: string;
	isApproved: boolean;
}

export interface Tender {
	tenderId: number;
	tenderNumber: string;
	type: string;
	openingDate: Date;
	closingDate: Date;
	minimumPrice: number;
	maximumPrice: number;
	location: string;
	description: string;
	status: TenderStatuses;
	projectId: number;

	// Project for which this tender is made, remember client -> project -> tender;
	project: Project;
	// Client who created project with whome this tender is associated, remember client -> project -> tender;
	user: User;
	// User to which this tender is awarded
	awardedTo: User;
}

export interface TenderDocumentSignal {
	type: 'ResetDocument' | 'UploadDocument';
	value: File;
	key: 'document1' | 'document2' | 'document3';
}
