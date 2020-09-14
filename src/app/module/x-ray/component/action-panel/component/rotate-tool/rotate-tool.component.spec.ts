import { RotateToolComponent } from './rotate-tool.component';

describe('RotateToolComponent', () => {
  let component: RotateToolComponent;

  beforeEach(() => {
    component = new RotateToolComponent();
  });

  /*** it should create rotate tool component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call PathologyToolComponent ngOnInit ***/
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
