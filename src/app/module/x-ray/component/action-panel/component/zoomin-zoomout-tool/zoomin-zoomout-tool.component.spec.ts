import { ZoominZoomoutToolComponent } from './zoomin-zoomout-tool.component';

describe('ZoominZoomoutToolComponent', () => {
  let component: ZoominZoomoutToolComponent;

  beforeEach(() => {
    component = new ZoominZoomoutToolComponent();
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
