import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailsComponent } from './patient-details.component';
import { of } from 'rxjs';

describe('PatientDetailsComponent', () => {
  let component: PatientDetailsComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', ['invokePrevNextButtonDataFunction']);
  const mockPatientDetail = {
    age: 32,
    birthDate: '1988-05-06T00:00:00',
    hospitalPatientId: '1010',
    id: '1004',
    lastUpdate: '2020-06-29T14:08:59',
    name: 'Pallavi',
    referringPhysicianName: 'mohan',
    sex: 'F',
    status: false,
    studies: ['9cb6a32f-93a4cee8-ee9f0ef3-3cc29b03-f6a0bfe8'],
  };

  beforeEach(() => {
    const patientIdMock = '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08';
    eventEmitterServiceSpy.invokePrevNextButtonDataFunction = of(patientIdMock);
    component = new PatientDetailsComponent(eventEmitterServiceSpy);
  });

/*** it should create patient details component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ngOnInit function */
  describe('#ngOnInit', () => {
    beforeEach(() => {
      window.history.pushState({ patientDetails: mockPatientDetail }, '', '');
      component.ngOnInit();
    });
    it('should call ngOnInit function', () => {
      expect(component.PatientName).toEqual('Pallavi');
    });
  });
});
