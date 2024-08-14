import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadCenterComponent } from './downloads.component';

describe('DownloadCenterComponent', () => {
  let component: DownloadCenterComponent;
  let fixture: ComponentFixture<DownloadCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
