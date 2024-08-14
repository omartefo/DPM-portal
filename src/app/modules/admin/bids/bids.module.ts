import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { GenericTableModule } from 'app/shared/generic-table/module';
import { BidsComponent } from './bids/bids.component';

const routes: Route[] = [
    {
        path     : '',
        component: BidsComponent
    }
];

@NgModule({
  declarations: [
    BidsComponent
  ],
  imports: [
    CommonModule,
	RouterModule.forChild(routes),

	GenericTableModule,
  ]
})
export class BidsModule { }
