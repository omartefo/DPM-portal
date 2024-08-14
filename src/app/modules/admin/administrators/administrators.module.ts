import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';

import { MaterialModule } from 'app/modules/material/material.module';
import { GenericTableModule } from 'app/shared/generic-table/module';

import { AdminUsersComponent } from './main/main.component';
import { AdminAddFormComponent } from './admin-form/admin-form.component';

const routes: Route[] = [
    {
        path     : '',
        component: AdminUsersComponent
    }
];

@NgModule({
	declarations: [
		AdminUsersComponent,
		AdminAddFormComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),

		GenericTableModule,
		MaterialModule
	]
})
export class AdministratorsModule { }
