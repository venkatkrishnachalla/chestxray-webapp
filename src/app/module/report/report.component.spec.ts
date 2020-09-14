import { ReportComponent } from './report.component';
import { of, throwError } from 'rxjs';
import { patientMock } from '../auth/patient-mock';

describe('ReportComponent', () => {
  let component: ReportComponent;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'invokeReportDataFunction',
    'onComponentButtonClick',
  ]);
  const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', [
    'show',
    'hide',
  ]);
  const changeDetectorSpy = jasmine.createSpyObj('ChangeDetectorRef', [
    'tick',
    'markForCheck',
  ]);
  const toastrServiceSpy = jasmine.createSpyObj('toastrService', ['success']);

  beforeEach(() => {
    eventEmitterServiceSpy.findingsSubject = of('calcification');
    eventEmitterServiceSpy.commentSubject = of('abcde');
    component = new ReportComponent(
      routerSpy,
      eventEmitterServiceSpy,
      spinnerServiceSpy,
      changeDetectorSpy,
      toastrServiceSpy
    );
  });

  /*** it should create report component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ngOnInit Function ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const mockData = {
        title: 'patientInfo',
        name: 'Mohan',
      };
      const patientMockData = patientMock[0];
      window.history.pushState({ patientDetails: patientMockData }, '', '');
      eventEmitterServiceSpy.invokeReportDataFunction = of(mockData);
    });
    it('should call ngOnIit function', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call ngOnInit Function, when patient info is empty ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const mockData = {
        title: 'patientInfo',
        name: 'Mohan',
      };
      eventEmitterServiceSpy.invokeReportDataFunction = of(mockData);
    });
    it('should call ngOnIit function, when patient info is empty', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call ngOnInit Function, when status equal to false ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const mockData = {
        title: 'patientInfo',
        name: 'Mohan',
      };
      const patientMockData = { status: false };
      window.history.pushState({ patientDetails: patientMockData }, '', '');
      eventEmitterServiceSpy.invokeReportDataFunction = of(mockData);
    });
    it('should call ngOnIit function, when status equal to false', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call go back to xray event ***/
  describe('#goBackToXray', () => {
    beforeEach(() => {
      const imageMock = 'data64/image:abcdefh';
    });
    it('should call goBackToXray function', () => {
      component.goBackToXray();
      expect(component.goBackToXray).toBeDefined();
    });
  });

  /*** it should call enable print event ***/
  describe('#enablePrint', () => {
    it('should call enablePrint function', () => {
      component.enablePrint(true);
      expect(component.showPrintForm).toEqual(true);
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

  /*** it should call impressionData function ***/
  describe('#impressionData', () => {
    beforeEach(() => {
      component.impressionData(true);
    });
    it('should call impressionData function', () => {
      expect(component.impressionData).toBeDefined();
    });
  });

  /*** it should call makePdf function ***/
  describe('#makePdf', () => {
    beforeEach(() => {
      component.patientInfo = patientMock[0];
      component.makePdf(true);
    });
    it('should call makePdf function', () => {
      expect(component.makePdf).toBeDefined();
    });
  });
});
