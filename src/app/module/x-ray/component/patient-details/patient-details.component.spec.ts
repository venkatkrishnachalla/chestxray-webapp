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
});
