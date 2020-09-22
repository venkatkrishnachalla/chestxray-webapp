import { SelectFitscreenToolComponent } from './select-fitscreen-tool.component';

describe('SelectFitscreenToolComponent', () => {
  let component: SelectFitscreenToolComponent;

  beforeEach(() => {
    component = new SelectFitscreenToolComponent();
  });

  /*** it should create select fit to screen tool component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call SelectFitscreenToolComponent ngOnInit ***/
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
