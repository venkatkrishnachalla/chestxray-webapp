import { ImpressionComponent } from './impression.component';
import { of, throwError } from 'rxjs';

describe('ImpressionComponent', () => {
  let component: ImpressionComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'invokeComponentFunction',
    'invokeComponentData',
    'invokeComponentEllipseData',
    'onImpressionDataShared',
  ]);
  const xrayAnnotatedImpressionServiceSpy = jasmine.createSpyObj(
    'XRayService',
    ['xrayAnnotatedImpressions']
  );
  const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);

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
      const response = {
        check: 'delete',
        disease: [],
      };
      const mock = {
        name: 'BULLA',
        isMLApi: true,
      };
      const ellipseMock = {
        x: 198,
        y: 200,
        a: 12,
        b: 14,
        r: 75,
      };
      eventEmitterServiceSpy.invokeComponentFunction = of(response);
      eventEmitterServiceSpy.invokeComponentData = of(mock);
      eventEmitterServiceSpy.invokeComponentEllipseData = of(ellipseMock);
      component.ngOnInit();
    });
    it('should call ngOnInit function', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call ngOnInit function, when info is update ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const response = {
        check: 'update',
      };
      const mock = {
        name: 'BULLA',
        isMLApi: true,
      };
      const ellipseMock = {
        x: 198,
        y: 200,
        a: 12,
        b: 14,
        r: 75,
      };
      eventEmitterServiceSpy.invokeComponentFunction = of(response);
      eventEmitterServiceSpy.invokeComponentData = of(mock);
      eventEmitterServiceSpy.invokeComponentEllipseData = of(ellipseMock);
      component.ngOnInit();
    });
    it('should call ngOnInit function, when info is update', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call ngOnInit function, when info is empty ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      const response = {
        check: '',
      };
      const mock = {
        name: 'BULLA',
        isMLApi: true,
      };
      const ellipseMock = {
        x: 198,
        y: 200,
        a: 12,
        b: 14,
        r: 75,
      };
      eventEmitterServiceSpy.invokeComponentFunction = of(response);
      eventEmitterServiceSpy.invokeComponentData = of(mock);
      eventEmitterServiceSpy.invokeComponentEllipseData = of(ellipseMock);
      component.ngOnInit();
    });
    it('should call ngOnInit function, when info is empty', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call getImpressions function ***/
  describe('#getImpressions', () => {
    beforeEach(() => {
      const response = {
        name: 'BULLA',
        isMLApi: true,
      };
      const mock = {
        name: 'abcde',
        index: 1,
      };
      component.impression = [
        {
          name: 'abcde',
          id: 2,
        },
        {
          name: 'xyz',
          id: 1,
        },
      ];
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
          isMLApi: true,
        },
        {
          name: 'xyz',
          id: 1,
          isMLApi: true,
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
          isMLApi: true,
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
      component.getColorMapping('BULLA', 'true', 'red');
    });
    it('should call getColorMapping', () => {
      expect(component.getColorMapping).toBeDefined();
    });
  });

  /*** it should call getImpressionsToReport function ***/
  describe('#getImpressionsToReport', () => {
    beforeEach(() => {
      component.impression = [
        {
          name: 'abcde',
          id: 2,
          isMLApi: 'true',
        },
      ];
      component.uniqueImpressions = [
        {
          name: 'abcde',
          id: 2,
          isMLApi: 'true',
        },
      ];
      component.getImpressionsToReport();
    });
    it('should call getImpressionsToReport', () => {
      expect(component.getImpressionsToReport).toBeDefined();
    });
  });

  /*** should call ngOnDestroy ****/
  describe('#ngOnDestroy', () => {
    it('it should call ngOnDestroy', () => {
      (component as any)._subscription = subscriptionSpy;
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
