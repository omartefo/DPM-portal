import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/modules/material/material.module';
import { GenericTableModule } from 'app/shared/components/generic-table/module';
import { BiddersPricingComponent } from './bidders-pricing/bidders-pricing.component';
import { CompanyDetailComponent } from './company-info/tender-form.component';
import { TendersComponent } from './tenders/tenders.component';

const routes: Route[] = [
  {
    path     : '',
    component: TendersComponent
  },
	{
    path     : 'award/:tenderId',
    component: BiddersPricingComponent
  }
];

@NgModule({
  declarations: [
    TendersComponent,
    CompanyDetailComponent,
  ],
  imports: [
    CommonModule,
    GenericTableModule,
    MaterialModule,
    ReactiveFormsModule,

    RouterModule.forChild(routes),
  ]
})
export class TendersModule { }
