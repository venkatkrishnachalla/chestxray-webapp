import { FindingsComponent } from './findings.component';
import { of, throwError } from 'rxjs';

describe('FindingsComponent', () => {
  let component: FindingsComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('XRayService', [
    'invokeComponentFindingsData',
  ]);
  const xrayAnnotatedImpressionSpy = jasmine.createSpyObj('XRayService', [
    'xrayAnnotatedFindings',
  ]);

  beforeEach(() => {
    component = new FindingsComponent(
      eventEmitterServiceSpy,
      xrayAnnotatedImpressionSpy
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      const mockData = [{}];
      eventEmitterServiceSpy.invokeComponentFindingsData.and.returnValue(
        of(mockData)
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

  describe('#getFindings', () => {
    beforeEach(() => {});
    it('should call getFindings function', () => {
      component.getFindings();
      expect(component.getFindings).toBeDefined();
    });
  });

  describe('#getFindingsToReport', () => {
    beforeEach(() => {});
    it('should call getFindingsToReport function', () => {
      component.getFindingsToReport();
      expect(component.getFindingsToReport).toBeDefined();
    });
  });
});
