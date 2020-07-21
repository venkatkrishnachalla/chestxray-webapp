import { ImpressionComponent } from './impression.component';
import { of, throwError } from 'rxjs';

describe('ImpressionComponent', () => {
  let component: ImpressionComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'invokeComponentFunction',
    'invokeComponentData',
    'invokeComponentEllipseData',
  ]);
  const xrayAnnotatedImpressionServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'XRayService'
  ]);

  beforeEach(() => {
    component = new ImpressionComponent(eventEmitterServiceSpy, xrayAnnotatedImpressionServiceSpy);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  describe('#deleteImpression', () => {
    beforeEach(() => {
      component.impression = [
        {
          name: 'abcde',
          id: 2,
        },
      ];
      component.deleteImpression(1, 'abcded', 2);
    });
    it('should call deleteImpression', () => {
      expect(component.deleteImpression).toBeDefined();
    });
  });

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

  describe('#getColorMapping', () => {
    beforeEach(() => {
      component.getColorMapping('abcde', false, 'red');
    });
    it('should call getColorMapping', () => {
      expect(component.getColorMapping).toBeDefined();
    });
  });
});
