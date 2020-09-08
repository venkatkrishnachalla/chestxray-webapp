import { XRayPatientImageComponent } from './x-ray-patient-image.component';
import { of, throwError } from 'rxjs';

describe('XRayPatientImageComponent', () => {
  let component: XRayPatientImageComponent;
  const annotatedXrayServiceSpy = jasmine.createSpyObj('XRayService', [
    'getAnnotatedImageData',
  ]);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['userSubject']);
  const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);

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
    component = new XRayPatientImageComponent(
      annotatedXrayServiceSpy,
      authServiceSpy
    );
  });

  /*** it should create xray patient image component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ngOnInit function ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const imageMock = 'data64/image:abcdefh';
      const mockInResponse = {
        username: 'mohan',
        userroles: ['hospitalradiologist'],
      };
      annotatedXrayServiceSpy.getAnnotatedImageData.and.returnValue(
        of(imageMock)
      );
      authServiceSpy.userSubject = of(mockInResponse);
    });
    it('should call ngOnIit function', () => {
      window.history.pushState({ patientDetails: mockPatientDetail }, '', '');
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
    it('should call ngOnIit function, when getAnnotatedImageData returns error', () => {
      window.history.pushState({ patientDetails: mockPatientDetail }, '', '');
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
    it('should call ngOnIit function, when patient info empty', () => {
      window.history.pushState({ patientDetails: undefined }, '', '');
      spyOn(sessionStorage, 'getItem').and.callFake(() => {
        return JSON.stringify(mockPatientDetail);
      });
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call print click event ***/
  describe('#printClick', () => {
    it('should call printClick function', () => {
      component.printClick();
      expect(component.printClick).toBeDefined();
    });
  });

  /*** it should call ngOnDestroy method ***/
  describe('#shareButtonEvent', () => {
    it('it should call shareButtonEvent', () => {
      component.patientInfo = mockPatientDetail;
      component.shareButtonEvent();
      expect(component.shareButtonEvent).toBeDefined();
    });
  });

  /*** it should call ngOnDestroy method ***/
  describe('#ngOnDestroy', () => {
    it('it should call ngOnDestroy', () => {
      (component as any).userSubscription = subscriptionSpy;
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
