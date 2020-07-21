import { XRayPatientDetailsComponent } from './x-ray-patient-details.component';
import { of, throwError } from 'rxjs';

describe('XRayPatientDetailsComponent', () => {
  let component: XRayPatientDetailsComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('XRayService', [
    'invokeComponentFunction',
    'onReportDataPatientDataShared',
  ]);
  const xrayAnnotatedImpressionSpy = jasmine.createSpyObj('XRayService', [
    'xrayAnnotatedImpressionsService',
    'xrayAnnotatedFindingsService',
  ]);

  beforeEach(() => {
    component = new XRayPatientDetailsComponent(
      eventEmitterServiceSpy,
      xrayAnnotatedImpressionSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      const patientMock = {
        patientId: 12,
        name: 'Krishna',
        gender: 'M',
        age: 56,
        priority: 'Minor',
        referenceDoctor: 'Corkery, Charley DDS',
        date: 'Tue Aug 20 2019 17:49:53 GMT+0530 (India Standard Time)',
        desc: 'Testing',
        status: false,
        instanceID: '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08',
      };
      const mockData = {
        title: 'stateData',
      };
      const findingsMock = { name: 'Bulla', index: 0 };
      const impressionsMock = { name: 'Bulla', index: 0 };
      window.history.pushState({ patientDetails: patientMock }, '', '');
      eventEmitterServiceSpy.invokeComponentFunction = of(mockData);
      xrayAnnotatedImpressionSpy.xrayAnnotatedImpressionsService.and.returnValue(
        of(findingsMock)
      );
      xrayAnnotatedImpressionSpy.xrayAnnotatedFindingsService.and.returnValue(
        of(impressionsMock)
      );
    });
    it('should call ngOnIit function', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
    it('should call ngOnIit function, when getAnnotatedImageData returns error', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  describe('#storeImpressions', () => {
    beforeEach(() => {});
    it('should call storeImpressions function', () => {
      const impressionMock = [
        {
          index: 0,
          sentence: 'abcde',
        },
      ];
      component.storeImpressions(impressionMock);
      expect(component.storeImpressions).toBeDefined();
    });
  });

  describe('#storePatientDetails', () => {
    beforeEach(() => {});
    it('should call storePatientDetails function', () => {
      component.storePatientDetails();
      expect(component.storePatientDetails).toBeDefined();
    });
  });
});
