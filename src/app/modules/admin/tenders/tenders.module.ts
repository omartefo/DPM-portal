import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TendersComponent } from './tenders/tenders.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/modules/material/material.module';
import { CompanyDetailComponent } from './company-info/tender-form.component';
import { BiddersPricingComponent } from './bidders-pricing/bidders-pricing.component';
import { GenericTableModule } from 'app/shared/components/generic-table/module';

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
	BiddersPricingComponent
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
