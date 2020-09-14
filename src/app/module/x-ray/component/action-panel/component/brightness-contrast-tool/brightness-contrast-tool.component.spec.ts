import { BrightnessContrastToolComponent } from './brightness-contrast-tool.component';

describe('BrightnessContrastToolComponent', () => {
  let component: BrightnessContrastToolComponent;

  beforeEach(() => {
    component = new BrightnessContrastToolComponent();
  });

  /*** it should create report component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call BrightnessContrastToolComponent class ngOnInit ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
});
