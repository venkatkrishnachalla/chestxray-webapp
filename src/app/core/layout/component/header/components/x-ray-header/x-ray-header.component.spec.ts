import { XRayHeaderComponent } from './x-ray-header.component';
import { of } from 'rxjs';
import { patientMock } from 'src/app/module/auth/patient-mock';

describe('XRayHeaderComponent', () => {
  let component: XRayHeaderComponent;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['userSubject']);
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'onPrevNextButtonClick',
  ]);
  const dbServiceSpy = jasmine.createSpyObj('NgxIndexedDBService', [
    'clear',
  ]);
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
    isAnnotated: true,
    xRayList: [
      {
        xRayId: 68,
        lastUpdate: '2020-10-16T12:39:06.222349',
        isAnnotated: true,
        assignedTo: 'mohan',
      },
    ],
  };
  beforeEach(() => {
    component = new XRayHeaderComponent(
      routerSpy,
      authServiceSpy,
      eventEmitterServiceSpy,
      dbServiceSpy
    );
  });

  /*** expects xray header component to be truthy ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** ngOnInit function test case ****/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const mockInResponse = {
        username: 'mohan',
        userroles: ['hospitalradiologist'],
        isAnnotated: true,
      };
      authServiceSpy.userSubject = of(mockInResponse);
      eventEmitterServiceSpy.onStatusChangeFunction = of(true);
      window.history.pushState({ patientDetails: mockPatientDetail }, '', '');
      spyOn(sessionStorage, 'getItem').and.callFake(() => {
        return JSON.stringify(mockPatientDetail);
      });
      spyOn(component, 'prevNextFunction');
      component.patientRows = patientMock as any;
      component.ngOnInit();
    });
    it('should call ngOnInit function', () => {
      expect(component.patientID).toEqual('1010');
      expect(component.ngOnInit).toBeDefined();
      expect(component.prevNextFunction).toHaveBeenCalled();
    });
  });

  /*** ngOnInit function test case, when patient info is empty ****/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const mockInResponse = {
        username: 'mohan',
        userroles: ['hospitalradiologist'],
        isAnnotated: true,
      };
      authServiceSpy.userSubject = of(mockInResponse);
      eventEmitterServiceSpy.onStatusChangeFunction = of(true);
      window.history.pushState({ patientDetails: mockPatientDetail }, '', '');
      spyOn(sessionStorage, 'getItem').and.callFake(() => {
        return JSON.stringify(patientMock);
      });
      component.patientRows = patientMock as any;
      component.patientID = '1011';
      spyOn(component, 'prevNextFunction');
      component.ngOnInit();
    });
    it('should call ngOnInit function, when patient info is empty', () => {
      expect(component.ngOnInit).toBeDefined();
      expect(component.prevNextFunction).toHaveBeenCalled();
    });
  });

  /*** prevNextFunction function test case ****/
  describe('#prevNextFunction', () => {
    beforeEach(() => {
      spyOn(sessionStorage, 'getItem').and.callFake(() => {
        return JSON.stringify(patientMock);
      });
      component.patientID = '1011';
      component.prevNextFunction();
    });
    it('should call prevNextFunction function', () => {
      expect(component.prevNextFunction).toBeDefined();
    });
  });

  /*** next click functionality ****/
  describe('#nextPatient', () => {
    it('it should call nextPatient', () => {
      spyOn(sessionStorage, 'getItem').and.callFake(() => {
        return JSON.stringify(patientMock);
      });
      component.patientRows = patientMock as any;
      component.currentIndex = 0;
      const imageSpy = { base64Image: 'test', filename: 'abcd' };
      dbServiceSpy.clear.and.returnValue(of(imageSpy));
      component.nextPatient();
      expect(component.nextPatient).toBeDefined();
    });
  });

  /*** previous click functionality ****/
  describe('#previousPatient', () => {
    it('it should call previousPatient', () => {
      spyOn(sessionStorage, 'getItem').and.callFake(() => {
        return JSON.stringify(patientMock);
      });
      component.patientRows = patientMock as any;
      component.currentIndex = 1;
      const imageSpy = { base64Image: 'test', filename: 'abcd' };
      dbServiceSpy.clear.and.returnValue(of(imageSpy));
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
