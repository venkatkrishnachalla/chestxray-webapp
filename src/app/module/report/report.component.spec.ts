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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  describe('#goBackToXray', () => {
    beforeEach(() => {
      const imageMock = 'data64/image:abcdefh';
    });
    it('should call goBackToXray function', () => {
      component.goBackToXray();
      expect(component.goBackToXray).toBeDefined();
    });
  });
});
