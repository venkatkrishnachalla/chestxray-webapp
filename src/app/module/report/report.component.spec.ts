import { ReportComponent } from './report.component';
import { of, throwError } from 'rxjs';

describe('ReportComponent', () => {
  let component: ReportComponent;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'invokeReportDataFunction',
    'onComponentButtonClick',
  ]);

  beforeEach(() => {
    component = new ReportComponent(routerSpy, eventEmitterServiceSpy);
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
      eventEmitterServiceSpy.invokeReportDataFunction = of(mockData);
    });
    it('should call ngOnIit function', () => {
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
});
