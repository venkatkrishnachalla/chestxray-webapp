import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XRayPatientDetailsComponent } from './x-ray-patient-details.component';

describe('XRayPatientDetailsComponent', () => {
  let component: XRayPatientDetailsComponent;
  let fixture: ComponentFixture<XRayPatientDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XRayPatientDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XRayPatientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
