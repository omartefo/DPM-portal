import { Component, Input } from '@angular/core';
import { UserCompany } from './../../../../models';


@Component({
  selector: 'add-tender-form',
  templateUrl: './tender-form.component.html',
  styleUrls: ['./tender-form.component.scss'],
})
export class CompanyDetailComponent
{
	@Input() company: UserCompany;

	constructor() { }
}
