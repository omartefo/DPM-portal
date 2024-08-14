import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddFormComponent } from './admin-form.component';

describe('AdminAddFormComponent', () => {
  let component: AdminAddFormComponent;
  let fixture: ComponentFixture<AdminAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAddFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
