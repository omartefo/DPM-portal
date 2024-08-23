import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/modules/material/material.module';
import { DownloadCenterComponent } from './downloads/downloads.component';
import { UploadDocumentComponent } from './upload-doc/upload-doc.component';
import { GenericTableModule } from 'app/shared/components/generic-table/module';

const routes: Route[] = [
    {
        path     : '',
        component: DownloadCenterComponent
    }
];

@NgModule({
  declarations: [
    DownloadCenterComponent,
	UploadDocumentComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

    GenericTableModule,
    MaterialModule
  ]
})
export class DownloadCenterModule { }
