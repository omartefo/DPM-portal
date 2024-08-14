import { UserType } from 'app/models';

export interface User
{
    userId: number;
    name: string;
    email: string;
	type: UserType;

	avatar?: string;
	status?: string;
}
