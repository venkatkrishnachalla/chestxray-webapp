import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHeaderComponent } from './report-header.component';

describe('ReportHeaderComponent', () => {
  let component: ReportHeaderComponent;
  let fixture: ComponentFixture<ReportHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    /*** should create report header component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
