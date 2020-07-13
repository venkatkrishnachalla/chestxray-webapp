import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailsComponent } from './patient-details.component';

describe('PatientDetailsComponent', () => {
  let component: PatientDetailsComponent;
  const sessionStorageSpy = jasmine.createSpyObj('sessionStorage', ['getItem']);

  beforeEach(() => {
    component = new PatientDetailsComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('#ngOnInit', () => {
  //   beforeEach(() => {
  //     const patient = {"name":"abcde","age":25,"referringPhysicianName":"mohan","sex":"M","lastUpdate":"13/23/1234","hospitalPatientId":"1004"};
  //     const mock = JSON.parse(patient);
  //     sessionStorageSpy.getItem.and.returnValue(mock);
  //     component.ngOnInit();
  //   });
  //   it('should call ngOnInit', () => {
  //     expect(component.PatientName).toEqual('mohan');
  //   });
  // });
});
