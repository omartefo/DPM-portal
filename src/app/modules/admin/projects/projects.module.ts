import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects/projects.component';
import { Route, RouterModule } from '@angular/router';
import { GenericTableModule } from 'app/shared/generic-table/module';
import { AddProjectFormComponent } from './project-form/project-form.component';
import { MaterialModule } from 'app/modules/material/material.module';

const routes: Route[] = [
    {
        path     : '',
        component: ProjectsComponent
    }
];

@NgModule({
  declarations: [
    ProjectsComponent,
	AddProjectFormComponent
  ],
  imports: [
    CommonModule,
	ReactiveFormsModule,
	RouterModule.forChild(routes),

	GenericTableModule,
	MaterialModule
  ]
})
export class ProjectsModule { }
