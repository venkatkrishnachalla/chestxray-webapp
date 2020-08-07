import { FindingsComponent } from './findings.component';
import { of, throwError } from 'rxjs';

describe('FindingsComponent', () => {
  let component: FindingsComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('XRayService', [
    'invokeComponentFindingsData',
    'invokeFindingsDataFunction',
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

  /*** it should create findings component ****/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ngOnInit function ***/
  describe('#ngOnInit', () => {
    it('should call ngOnIit function', () => {
      spyOn(component, 'getFindings');
      component.ngOnInit();
      expect(component.getFindings).toHaveBeenCalled();
    });
  });

  /*** it should call getFindings function ***/
  xdescribe('#getFindings', () => {
    beforeEach(() => {
      const mockData = { name: 'Bulla', index: 0 };
      const findingsmock = [
        {
          color: 'rgb(230,25,75)',
          id: 0,
          isMLApi: true,
          name: 'bronchitis',
          title: 'impression',
        },
      ];
      eventEmitterServiceSpy.invokeComponentFindingsData = of(mockData);
      eventEmitterServiceSpy.invokeFindingsDataFunction = of(findingsmock);
    });
    it('should call getFindings function', () => {
      component.findings = ['LUNG FIELDS: bronchitis'];
      component.getFindings();
      expect(component.getFindings).toBeDefined();
    });
  });

  /*** it should call getFindingsToReport event ***/
  describe('#getFindingsToReport', () => {
    beforeEach(() => {});
    it('should call getFindingsToReport function', () => {
      component.getFindingsToReport();
      expect(component.getFindingsToReport).toBeDefined();
    });
  });
});
