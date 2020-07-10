import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetailsComponent } from './patient-details.component';

describe('PatientDetailsComponent', () => {
  let component: PatientDetailsComponent;

  beforeEach(() => {
    component = new PatientDetailsComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('#ngOnInit', () => {
  //   beforeEach(() => {
  //     const patient = {
  //       name: 'abcde',
  //       age: 25,
  //       referringPhysicianName: 'mohan',
  //       sex: 'M',
  //       lastUpdate: '13/23/1234',
  //       lastUlastUpdatepdate: '13/23/1234',
  //       hospitalPatientId: '1004'
  //     };
  //     component.ngOnInit();
  //   });
  //   it('should call ngOnInit', () => {
  //     expect(component.PatientName).toEqual('mohan');
  //   });
  // });
});
