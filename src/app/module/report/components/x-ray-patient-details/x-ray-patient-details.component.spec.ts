import { XRayPatientDetailsComponent } from './x-ray-patient-details.component';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { patientMock } from 'src/app/module/auth/patient-mock';

describe('XRayPatientDetailsComponent', () => {
  let component: XRayPatientDetailsComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'invokeComponentFunction',
    'onReportDataPatientDataShared',
    'findingsSubject',
    'commentSubject',
  ]);
  const xrayAnnotatedImpressionSpy = jasmine.createSpyObj('XRayService', [
    'xrayAnnotatedImpressionsService',
    'xrayAnnotatedFindingsService',
  ]);
  const changeDetectorSpy = jasmine.createSpyObj('ChangeDetectorRef', [
    'tick',
    'markForCheck',
  ]);

  beforeEach(() => {
    eventEmitterServiceSpy.findingsSubject = of('calcification');
    eventEmitterServiceSpy.commentSubject = of('abcde');
    component = new XRayPatientDetailsComponent(
      eventEmitterServiceSpy,
      xrayAnnotatedImpressionSpy,
      changeDetectorSpy
    );
  });

  /*** it should create xray patient details component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ngOnInit function ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const patientMockData = patientMock[0];
      const mockData = {
        title: 'stateData',
      };
      const findingsMock = [{ name: 'Bulla', index: 0 }];
      const impressionsMock = [{ name: 'Bulla', index: 0 }];
      eventEmitterServiceSpy.commentSubject = of('abcde');
      window.history.pushState({ patientDetails: patientMockData }, '', '');
      eventEmitterServiceSpy.invokeComponentFunction = of(mockData);
      xrayAnnotatedImpressionSpy.xrayAnnotatedImpressionsService.and.returnValue(
        of(findingsMock)
      );
      xrayAnnotatedImpressionSpy.xrayAnnotatedFindingsService.and.returnValue(
        of(impressionsMock)
      );

      eventEmitterServiceSpy.commentSubject = new BehaviorSubject<any>('');
      const value = '';
      eventEmitterServiceSpy.commentSubject
        .pipe(filter((res) => !!res))
        .subscribe((res) => expect(res).toEqual(value));
      eventEmitterServiceSpy.commentSubject.next('');

      eventEmitterServiceSpy.findingsSubject = new BehaviorSubject<any>('');
      const fvalue = [{ name: 'Bulla', index: 0 }];
      eventEmitterServiceSpy.findingsSubject
        .pipe(filter((res) => !!res))
        .subscribe((res) => expect(res).toEqual(fvalue));
      eventEmitterServiceSpy.findingsSubject.next([
        { name: 'Bulla', index: 0 },
      ]);
    });
    it('should call ngOnIit function', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call storeImpressions function ***/
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

  /*** it should call storePatientDetails function ***/
  describe('#storePatientDetails', () => {
    beforeEach(() => {});
    it('should call storePatientDetails function', () => {
      component.storePatientDetails();
      expect(
        eventEmitterServiceSpy.onReportDataPatientDataShared
      ).toHaveBeenCalled();
      expect(component.storePatientDetails).toBeDefined();
    });
  });

  /*** it should call commentsChange function ***/
  describe('#commentsChange', () => {
    it('should call commentsChange function', () => {
      eventEmitterServiceSpy.commentSubject = new BehaviorSubject<any>('');
      const value = '';
      eventEmitterServiceSpy.commentSubject
        .pipe(filter((res) => !!res))
        .subscribe((res) => expect(res).toEqual('abcde'));
      eventEmitterServiceSpy.commentSubject.next('abcde');
      component.commentsChange('abcde');
      expect(component.commentsChange).toBeDefined();
    });
  });

  /*** it should call updateFindings function ***/
  describe('#updateFindings', () => {
    it('should call updateFindings function', () => {
      component.annotatedFindings = [{ name: 'Bulla', index: 0 }];
      const event = {
        target: {
          textContent: 'Bulla',
        },
      };
      eventEmitterServiceSpy.findingsSubject = new BehaviorSubject<any>('');
      const fvalue = [{ name: 'Bulla', index: 0 }];
      eventEmitterServiceSpy.findingsSubject
        .pipe(filter((res) => !!res))
        .subscribe((res) => expect(component.updateFindings).toBeDefined());
      eventEmitterServiceSpy.findingsSubject.next([
        { name: 'Bulla', index: 0 },
      ]);
      component.updateFindings(event, 1);
    });
  });

  /*** it should call setCanvasDimension function ***/
  describe('#setCanvasDimension', () => {
    beforeEach(() => {
      component.setCanvasDimension();
    });
    it('should call setCanvasDimension function', () => {
      expect(component.setCanvasDimension).toBeDefined();
    });
  });

  /*** it should call generateCanvas function ***/
  describe('#generateCanvas', () => {
    beforeEach(() => {
      component.canvasDynamicWidth = 893;
      component.canvasDynamicHeight = 549;
      component.xRayImage = {
        width: 2000,
        height: 1650,
        set: () => {},
      };
      component.generateCanvas();
    });
    it('should call generateCanvas function', () => {
      expect(component.generateCanvas).toBeDefined();
    });
  });

  /*** it should call setCanvasBackground function ***/
  describe('#setCanvasBackground', () => {
    beforeEach(() => {
      component.canvasDynamicWidth = 893;
      component.canvasDynamicHeight = 549;
      component.xRayImage = {
        width: 2000,
        height: 1650,
        set: () => {},
      };
      component.setCanvasBackground();
    });
    it('should call setCanvasBackground function', () => {
      expect(component.setCanvasBackground).toBeDefined();
    });
  });

  /*** it should call setCanvasBackground function, when height first ***/
  describe('#setCanvasBackground', () => {
    beforeEach(() => {
      component.canvasDynamicWidth = 893;
      component.canvasDynamicHeight = 968;
      component.xRayImage = {
        width: 2000,
        height: 1650,
        set: () => {},
      };
      component.setCanvasBackground();
    });
    it('should call setCanvasBackground function, when height first', () => {
      expect(component.setCanvasBackground).toBeDefined();
    });
  });
});
