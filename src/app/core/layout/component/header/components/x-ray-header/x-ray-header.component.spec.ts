import { XRayHeaderComponent } from './x-ray-header.component';
import { of } from 'rxjs';

describe('XRayHeaderComponent', () => {
  let component: XRayHeaderComponent;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['userSubject']);
  const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  const mockPatientDetail = {
    age: 32,
    birthDate: '1988-05-06T00:00:00',
    hospitalPatientId: '1010',
    id: '1004',
    lastUpdate: '2020-06-29T14:08:59',
    name: '^Pallavi',
    referringPhysicianName: 'mohan',
    sex: 'F',
    status: false,
    studies: ['9cb6a32f-93a4cee8-ee9f0ef3-3cc29b03-f6a0bfe8'],
  };
  beforeEach(() => {
    component = new XRayHeaderComponent(routerSpy, authServiceSpy);
  });

  /*** expects xray header component to be truthy ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** ngOnInit function test case ****/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const samplePatient = [
        {
          patientId: 12,
          name: 'Krishna',
          gender: 'M',
          age: 56,
          priority: 'Minor',
          referenceDoctor: 'Corkery, Charley DDS',
          date: 'Tue Aug 20 2019 17:49:53 GMT+0530 (India Standard Time)',
          desc: 'Testing',
          status: 'in-process',
          instanceID: '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08',
        },
      ];
      const mockInResponse = {
        username: 'mohan',
        userroles: ['hospitalradiologist'],
      };
      authServiceSpy.userSubject = of(mockInResponse);
      window.history.pushState({ patientDetails: mockPatientDetail }, '', '');
      spyOn(sessionStorage, 'getItem').and.callFake(() => {
        return JSON.stringify(samplePatient);
      });
      component.ngOnInit();
    });
    it('should call ngOnInit function', () => {
      expect(component.patientID).toEqual('1010');
    });
  });

  /*** next click functionality ****/
  describe('#nextPatient', () => {
    it('it should call nextPatient', () => {
      const samplePatient = [
        {
          patientId: 12,
          name: 'Krishna',
          gender: 'M',
          age: 56,
          priority: 'Minor',
          referenceDoctor: 'Corkery, Charley DDS',
          date: 'Tue Aug 20 2019 17:49:53 GMT+0530 (India Standard Time)',
          desc: 'Testing',
          status: 'in-process',
          instanceID: '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08',
          index: 2
        },
      ];
      component.patientRows = samplePatient as any;
      component.currentIndex = 1;
      component.nextPatient();
      expect(component.nextPatient).toBeDefined();
    });
  });

  /*** previous click functionality ****/
  describe('#previousPatient', () => {
    it('it should call previousPatient', () => {
      const samplePatient = [
        {
          patientId: 12,
          name: 'Krishna',
          gender: 'M',
          age: 56,
          priority: 'Minor',
          referenceDoctor: 'Corkery, Charley DDS',
          date: 'Tue Aug 20 2019 17:49:53 GMT+0530 (India Standard Time)',
          desc: 'Testing',
          status: 'in-process',
          instanceID: '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08',
          index: 0
        },
      ];
      component.patientRows = samplePatient as any;
      component.currentIndex = 1;
      component.previousPatient();
      expect(component.previousPatient).toBeDefined();
    });
  });

  /*** should call ngOnDestroy ****/
  describe('#ngOnDestroy', () => {
    it('it should call ngOnDestroy', () => {
      (component as any).userSubscription = subscriptionSpy;
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
