import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XRayPatientImageComponent } from './x-ray-patient-image.component';

describe('XRayPatientImageComponent', () => {
  let component: XRayPatientImageComponent;
  let fixture: ComponentFixture<XRayPatientImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XRayPatientImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XRayPatientImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
