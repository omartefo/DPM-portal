import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiddersPricingComponent } from './bidders-pricing.component';

describe('BiddersPricingComponent', () => {
  let component: BiddersPricingComponent;
  let fixture: ComponentFixture<BiddersPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiddersPricingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BiddersPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
