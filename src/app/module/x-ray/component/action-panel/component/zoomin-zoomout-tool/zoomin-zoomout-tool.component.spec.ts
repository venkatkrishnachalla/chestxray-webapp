import { ZoominZoomoutToolComponent } from './zoomin-zoomout-tool.component';

describe('ZoominZoomoutToolComponent', () => {
  let component: ZoominZoomoutToolComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
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
});
