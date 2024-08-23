import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/modules/material/material.module';
import { UsersComponent } from './users.component';
import { UserAddFormComponent } from './user-add-form/user-add-form.component';
import { GenericTableModule } from 'app/shared/components/generic-table/module';

const routes: Route[] = [
    {
        path     : '',
        component: UsersComponent
    }
];

@NgModule({
  declarations: [
    UsersComponent,
    UserAddFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

    GenericTableModule,
    MaterialModule
  ]
})
export class UsersModule { }
