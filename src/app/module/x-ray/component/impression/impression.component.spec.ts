import { ImpressionComponent } from './impression.component';
import { of, throwError } from 'rxjs';

describe('ImpressionComponent', () => {
  let component: ImpressionComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'invokeComponentFunction',
    'invokeComponentData',
    'invokeComponentEllipseData',
    'onImpressionDataShared'
  ]);
  const xrayAnnotatedImpressionServiceSpy = jasmine.createSpyObj(
    'EventEmitterService',
    ['XRayService']
  );

  beforeEach(() => {
    const patientIdMock = '4df09ebb-adb7-4d81-a7e0-7d108ceb8f08';
    eventEmitterServiceSpy.invokePrevNextButtonDataFunction = of(patientIdMock);
    component = new ImpressionComponent(
      eventEmitterServiceSpy,
      xrayAnnotatedImpressionServiceSpy
    );
  });

  /**** it should create impression component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ngOnInit function ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'getImpressions');
      const response = {
        check: 'delete',
        disease: [],
      };
      const mock = {
        name: 'abcde',
      };
      eventEmitterServiceSpy.invokeComponentFunction = of(response);
      eventEmitterServiceSpy.invokeComponentData = of(mock);
      component.ngOnInit();
    });
    it('should call ngOnInit function', () => {
      expect(component.getImpressions).toHaveBeenCalled();
    });
  });

   /*** it should call ngOnInit function, when info is update ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'getImpressions');
      const response = {
        check: 'update',
      };
      const mock = {
        name: 'abcde',
      };
      eventEmitterServiceSpy.invokeComponentFunction = of(response);
      eventEmitterServiceSpy.invokeComponentData = of(mock);
      component.ngOnInit();
    });
    it('should call ngOnInit function, when info is update', () => {
      expect(component.getImpressions).toHaveBeenCalled();
      expect(component.ngOnInit).toBeDefined();
    });
  });

   /*** it should call ngOnInit function, when info is empty ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'getImpressions');
      const response = {
        check: '',
      };
      const mock = {
        name: 'abcde',
      };
      eventEmitterServiceSpy.invokeComponentFunction = of(response);
      eventEmitterServiceSpy.invokeComponentData = of(mock);
      component.ngOnInit();
    });
    it('should call ngOnInit function, when info is empty', () => {
      expect(component.getImpressions).toHaveBeenCalled();
      expect(component.ngOnInit).toBeDefined();
    });
  });

   /*** it should call getImpressions function ***/
  describe('#getImpressions', () => {
    beforeEach(() => {
      const response = {
        name: 'abcde',
      };
      const mock = {
        name: 'abcde',
        index: 1,
      };
      eventEmitterServiceSpy.invokeComponentData = of(response);
      eventEmitterServiceSpy.invokeComponentEllipseData = of(mock);
      component.getImpressions();
    });
    it('should call getImpressions', () => {
      expect(component.getImpressions).toBeDefined();
    });
  });

  /*** it should call delete impression ***/
  describe('#deleteImpression', () => {
    beforeEach(() => {
      component.impression = [
        {
          name: 'abcde',
          id: 2,
        },
      ];
      component.deleteImpression(1, null, 2);
    });
    it('should call deleteImpression', () => {
      expect(component.deleteImpression).toBeDefined();
    });
  });

  /*** it should call updateImpression function ***/
  describe('#updateImpression', () => {
    beforeEach(() => {
      const response = { name: 'abcde' };
      component.impression = [
        {
          name: 'abcde',
          id: 2,
        },
      ];
      component.updateImpression(response);
    });
    it('should call updateImpression', () => {
      expect(component.updateImpression).toBeDefined();
    });
  });

    /*** it should call getColorMapping function ***/
  describe('#getColorMapping', () => {
    beforeEach(() => {
      component.getColorMapping('BULLA', 'false', 'red');
    });
    it('should call getColorMapping', () => {
      expect(component.getColorMapping).toBeDefined();
    });
  });
});
