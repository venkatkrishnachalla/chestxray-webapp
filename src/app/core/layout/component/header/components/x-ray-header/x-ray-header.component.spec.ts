import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XRayHeaderComponent } from './x-ray-header.component';

describe('XRayHeaderComponent', () => {
  let component: XRayHeaderComponent;
  const mockPatientDetail = {
    age: 32,
    birthDate: "1988-05-06T00:00:00",
    hospitalPatientId: "1010",
    id: "1966e694-bad90686-516f99cd-f432800f-dca39290",
    lastUpdate: "2020-06-29T14:08:59",
    name: "^Pallavi",
    referringPhysicianName: "mohan",
    sex: "F",
    status: false,
    studies: ["9cb6a32f-93a4cee8-ee9f0ef3-3cc29b03-f6a0bfe8"]
  }
  beforeEach(() => {
    component = new XRayHeaderComponent;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  describe('#ngOnInit', () => {
    let store = {};
    const mockSessionStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
    beforeEach(() => {
      spyOn(sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
      component.patientID = mockPatientDetail.hospitalPatientId;
      component.ngOnInit();
    });
    it('should call ngOnInit function', () => {
      expect(component.ngOnInit).toBeDefined();
      expect(component.patientID).toEqual( mockPatientDetail.hospitalPatientId);
    });
  });
});
