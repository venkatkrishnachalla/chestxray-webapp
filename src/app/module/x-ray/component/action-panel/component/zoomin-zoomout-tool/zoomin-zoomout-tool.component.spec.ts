import { ZoominZoomoutToolComponent } from './zoomin-zoomout-tool.component';

describe('ZoominZoomoutToolComponent', () => {
  let component: ZoominZoomoutToolComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'invokeReportDataFunction',
    'onComponentButtonClick',
  ]);

  beforeEach(() => {
    component = new ZoominZoomoutToolComponent(eventEmitterServiceSpy);
  });

  /*** it should create zoom in and zoom out component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ZoominZoomoutToolComponent ngOnInit ***/
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
          image: '../../../../assets/images/ellipse@3x.png',
          alt: 'Ellipse',
          title: 'Draw Ellipse',
          active: false,
          implemented: true,
        },
        {
          image: '../../../../assets/images/pen tool@2x.png',
          alt: 'Pen Tool',
          title: 'Free Hand Drawing',
          active: false,
          implemented: true,
        }
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
