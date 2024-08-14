import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    {path: '', pathMatch : 'full', redirectTo: 'admin_users'},

    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'users'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
		component: LayoutComponent,
        children   : [
			{
				path: 'admin_users', loadChildren: () =>
				import('app/modules/admin/administrators/administrators.module').then(m => m.AdministratorsModule)
			},
			{
				path: 'users', loadChildren: () =>
				import('app/modules/admin/users/users.module').then(m => m.UsersModule)
			},
			{
				path: 'projects', loadChildren: () =>
				import('app/modules/admin/projects/projects.module').then(m => m.ProjectsModule)
			},
			{
				path: 'tenders', loadChildren: () =>
				import('app/modules/admin/tenders/tenders.module').then(m => m.TendersModule)
			},
			{
				path: 'bids', loadChildren: () =>
				import('app/modules/admin/bids/bids.module').then(m => m.BidsModule)
			},
			{
				path: 'downloads', loadChildren: () =>
				import('app/modules/admin/downloadCenter/downloadCenter.module').then(m => m.DownloadCenterModule)
			}
        ]
    }
];
