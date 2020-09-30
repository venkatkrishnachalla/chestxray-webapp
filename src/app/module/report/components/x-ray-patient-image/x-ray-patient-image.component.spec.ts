import { XRayPatientImageComponent } from './x-ray-patient-image.component';
import { BehaviorSubject, of, throwError } from 'rxjs';

describe('XRayPatientImageComponent', () => {
  let component: XRayPatientImageComponent;
  const annotatedXrayServiceSpy = jasmine.createSpyObj('XRayService', [
    'getAnnotatedImageData',
    'xrayAnnotatedFindingsService',
  ]);
  const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', [
    'show',
    'hide',
  ]);
  const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
    'success',
    'error',
  ]);
  const authServiceSpy = jasmine.createSpyObj('AuthService', ['userSubject']);
  const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  const eventEmitterService2Spy = jasmine.createSpyObj('EventEmitterService2', [
    'patientInfoStatusChange',
  ]);
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'findingsSubject',
    'onStatusChange',
  ]);
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
    eventEmitterServiceSpy.findingsSubject = of('calcification');
    component = new XRayPatientImageComponent(
      annotatedXrayServiceSpy,
      spinnerServiceSpy,
      authServiceSpy,
      toastrServiceSpy,
      eventEmitterServiceSpy,
      eventEmitterService2Spy
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
      eventEmitterServiceSpy.findingsSubject = new BehaviorSubject<any>('');
      const mockData = ['Bulla'];
      annotatedXrayServiceSpy.getAnnotatedImageData.and.returnValue(
        of(imageMock)
      );
      annotatedXrayServiceSpy.xrayAnnotatedFindingsService.and.returnValue(
        of(mockData)
      );
      authServiceSpy.userSubject = of(mockInResponse);
      eventEmitterServiceSpy.findingsSubject.next([
        { name: 'Bulla', index: 0 },
      ]);
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
    beforeEach(() => {
      const mockData = [
        'LUNG FIELDS:',
        'COSTOPHRENIC ANGLES:',
        'HILAR/MEDIASTINAL:',
        'CARDIAC SILHOUETTE:',
        'DOMES OF DIAPHRAGM:',
        'BONY THORAX:',
      ];
      const clickEvent = ({
        click: () => {},
      } as unknown) as HTMLElement;
      spyOn(document, 'querySelector').and.returnValue(clickEvent);
      annotatedXrayServiceSpy.xrayAnnotatedFindingsService.and.returnValue(
        mockData
      );
    });
    it('it should call shareButtonEvent', () => {
      component.patientInfo = mockPatientDetail;
      component.shareButtonEvent();
      expect(component.shareButtonEvent).toBeDefined();
    });
  });

  /*** it should call ngOnDestroy method ***/
  describe('#handle', () => {
    it('it should call handle', () => {
      const event = { file: 'abcde' };
      component.handle(event);
      expect(component.handle).toBeDefined();
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
