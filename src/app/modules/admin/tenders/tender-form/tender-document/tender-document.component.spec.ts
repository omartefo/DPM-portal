import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderDocumentComponent } from './tender-document.component';

describe('TenderDocumentComponent', () => {
  let component: TenderDocumentComponent;
  let fixture: ComponentFixture<TenderDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenderDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenderDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
