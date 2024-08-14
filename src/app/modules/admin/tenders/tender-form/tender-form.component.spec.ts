import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTenderFormComponent } from './tender-form.component';

describe('AddTenderFormComponent', () => {
  let component: AddTenderFormComponent;
  let fixture: ComponentFixture<AddTenderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTenderFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTenderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
