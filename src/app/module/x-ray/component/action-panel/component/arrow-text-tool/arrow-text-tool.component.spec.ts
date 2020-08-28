import { ArrowTextToolComponent } from './arrow-text-tool.component';

describe('ArrowTextToolComponent', () => {
  let component: ArrowTextToolComponent;

  beforeEach(() => {
    component = new ArrowTextToolComponent();
  });

  /*** it should create arrow tool component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call ArrowTextToolComponent ngOnInit function ***/
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
});
