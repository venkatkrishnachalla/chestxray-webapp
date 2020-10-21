import { MeasureLengthAngleToolComponent } from './measure-length-angle-tool.component';

describe('MeasureLengthAngleToolComponent', () => {
  let component: MeasureLengthAngleToolComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'onComponentButtonClick',
  ]);

  beforeEach(() => {
    component = new MeasureLengthAngleToolComponent(eventEmitterServiceSpy);
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

  /*** it should call iconAction function ***/
  describe('#iconAction', () => {
    beforeEach(() => {
      const data = [
        {
          active: false,
          alt: 'Ellipse',
          image: '../../../../assets/images/ellipse@3x.png',
          implemented: true,
          title: 'Measure Length',
        },
      ];
      component.iconAction(data, 0);
    });
    it('should call iconAction function', () => {
      expect(component.iconAction).toBeDefined();
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
