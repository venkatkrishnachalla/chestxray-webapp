import { FindingsComponent } from './findings.component';
import { of, throwError } from 'rxjs';

describe('FindingsComponent', () => {
  let component: FindingsComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('XRayService', [
    'invokeComponentFindingsData',
    'invokeFindingsDataFunction',
    'invokePrevNextButtonDataFunction',
  ]);
  const xrayAnnotatedImpressionSpy = jasmine.createSpyObj('XRayService', [
    'xrayAnnotatedFindings',
  ]);

  beforeEach(() => {
    const mockData = 'LUNG FIELDS: Visualised lung fields are clear.';
    const patientIdMock = '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08';
    eventEmitterServiceSpy.invokePrevNextButtonDataFunction = of(patientIdMock);
    eventEmitterServiceSpy.invokeComponentFindingsData = of(mockData);
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
    beforeEach(() => {
      const mockData = 'LUNG FIELDS: Visualised lung fields are clear.';
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
    it('should call ngOnIit function', () => {
      spyOn(component, 'getFindings');
      component.ngOnInit();
      expect(component.getFindings).toHaveBeenCalled();
    });
  });

  /*** it should call getFindings function ***/
  describe('#getFindings', () => {
    beforeEach(() => {
      const mockData = 'LUNG FIELDS: Visualised lung fields are clear.';
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
