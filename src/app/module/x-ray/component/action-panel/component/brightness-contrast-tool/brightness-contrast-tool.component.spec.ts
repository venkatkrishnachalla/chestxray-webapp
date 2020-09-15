import { BrightnessContrastToolComponent } from './brightness-contrast-tool.component';
import { of } from 'rxjs';

describe('BrightnessContrastToolComponent', () => {
  let component: BrightnessContrastToolComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'onBrightnessChange',
    'onContrastChange',
    'defaultRange',
  ]);

  beforeEach(() => {
    component = new BrightnessContrastToolComponent(eventEmitterServiceSpy);
  });

  /*** it should create report component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call BrightnessContrastToolComponent class ngOnInit ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      eventEmitterServiceSpy.defaultRange = of(undefined);
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call setBrightnessSlidervalue function***/
  describe('#setBrightnessSlidervalue', () => {
    beforeEach(() => {
      const point = 60;
      component.setBrightnessSlidervalue(point);
    });
    it('it should call getBrightness function', () => {
      expect(component.setBrightnessSlidervalue).toBeDefined();
    });
  });
});
