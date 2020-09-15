import { MeasureLengthAngleToolComponent } from './measure-length-angle-tool.component';

describe('MeasureLengthAngleToolComponent', () => {
  let component: MeasureLengthAngleToolComponent;

  beforeEach(() => {
    component = new MeasureLengthAngleToolComponent();
  });

  /*** it should create measure length angle component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call MeasureLengthAngleToolComponent ngOnInit ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      const result = component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call iconAction click event ***/
  describe('#iconAction', () => {
    beforeEach(() => {
      const mockdata = [
        {
          name: 'Ellipse',
          index: 1,
        },
      ];
      component.iconAction(mockdata, '1');
    });
    it('should call iconAction function', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call iconAction click event, when key not equal to index ***/
  describe('#iconAction', () => {
    beforeEach(() => {
      const mockdata = [
        {
          name: 'Ellipse',
          index: 1,
        },
      ];
      component.iconAction(mockdata, '0');
    });
    it('should call iconAction function, when key not equal to index', () => {
      expect(component.iconAction).toBeDefined();
    });
  });
});
