import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PatientInfoComponent } from './patient-info.component';

describe('PatientInfoComponent', () => {
  let component: PatientInfoComponent;

  beforeEach(() => {
    component = new PatientInfoComponent();
  });

  /*** it should create component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ngOnInit function ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.patientInfo = of();
      // authServiceSpy.userSubject = of(mockInResponse);
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
});
