import { FlipToolComponent } from './flip-tool.component';

describe('FlipToolComponent', () => {
  let component: FlipToolComponent;

  beforeEach(() => {
    component = new FlipToolComponent();
  });

  /*** it should create flip tool component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call FlipToolComponent ngOnInit ***/
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
