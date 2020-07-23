import { FindingsComponent } from './findings.component';
import { of, throwError } from 'rxjs';

describe('FindingsComponent', () => {
  let component: FindingsComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('XRayService', [
    'invokeComponentFindingsData',
    'invokeFindingsDataFunction'
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
    it('should call ngOnIit function', () => {
      spyOn(component, 'getFindings');
      component.ngOnInit();
      expect(component.getFindings).toHaveBeenCalled();
    });
  });

  describe('#getFindings', () => {
    beforeEach(() => {
      const mockData = { name: 'Bulla', index: 0 };
      const findingsmock = [{ name: 'Bulla', index: 0 }];
      component.findings = [];
      eventEmitterServiceSpy.invokeComponentFindingsData = of(mockData);
      eventEmitterServiceSpy.invokeFindingsDataFunction = of(findingsmock);
    });
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
