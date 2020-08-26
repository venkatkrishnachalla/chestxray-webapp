import { DrawEllipseFreehandDrawingComponent } from './draw-ellipse-freehand-drawing.component';

describe('DrawEllipseFreehandDrawingComponent', () => {
  let component: DrawEllipseFreehandDrawingComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'onComponentButtonClick',
  ]);

  beforeEach(() => {
    component = new DrawEllipseFreehandDrawingComponent(eventEmitterServiceSpy);
  });

  /*** it should create draw ellipse and freehand drawing tool component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call DrawEllipseFreehandDrawingComponent class ngOnInit ***/
  describe('#ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      expect(component.ngOnInit).toBeDefined();
    });
  });

  /*** it should call iconAction function ***/
  describe('#iconAction', () => {
    beforeEach(() => {
      const data = [{
        active: false,
        alt: 'Ellipse',
        image: '../../../../assets/images/ellipse@3x.png',
        implemented: true,
        title: 'Draw Ellipse',
      }];
      component.iconAction(data, 0);
    });
    it('should call iconAction function', () => {
      expect(component.iconAction).toBeDefined();
    });
  });
});
