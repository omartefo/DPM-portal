import { Navigation } from 'app/core/navigation/navigation.types';


export class DPMAppNavigation
{
    // main navigation
    public static navigation: Navigation = {
		default: [
			{
				type: 'basic',
				icon: 'manage_accounts',
				link: 'admin_users',
				title: 'Admin Users',
				id: 'admins',
			},
			{
				type: 'basic',
				icon: 'people',
				link: 'users',
				title: 'Users',
				id: 'users',
			},
			{
				type: 'basic',
				icon: 'engineering',
				link: 'projects',
				title: 'Projects',
				id: 'projects',
			},
			{
				type: 'basic',
				icon: 'campaign',
				link: 'tenders',
				title: 'Tenders',
				id: 'tenders',
			},
			{
				type: 'basic',
				icon: 'request_quote',
				link: 'bids',
				title: 'Bids',
				id: 'bids',
			},
			{
				type: 'basic',
				icon: 'download',
				link: 'downloads',
				title: 'Download Center',
				id: 'download_center',
			}
		],
		horizontal: [
			{
				type: 'basic',
				icon: 'manage_accounts',
				link: 'admin_users',
				title: 'Admin Users',
				id: 'admins',
			},
			{
				type: 'basic',
				icon: 'people',
				link: 'users',
				title: 'Users',
				id: 'users',
			},
			{
				type: 'basic',
				icon: 'engineering',
				link: 'projects',
				title: 'Projects',
				id: 'projects',
			},
			{
				type: 'basic',
				icon: 'campaign',
				link: 'tenders',
				title: 'Tenders',
				id: 'tenders',
			},
			{
				type: 'basic',
				icon: 'request_quote',
				link: 'bids',
				title: 'Bids',
				id: 'bids',
			},
			{
				type: 'basic',
				icon: 'download',
				link: 'downloads',
				title: 'Download Center',
				id: 'download_center',
			}
		]
	};
}
