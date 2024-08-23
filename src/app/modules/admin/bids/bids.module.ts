import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { BidsComponent } from './bids/bids.component';
import { GenericTableModule } from 'app/shared/components/generic-table/module';

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
