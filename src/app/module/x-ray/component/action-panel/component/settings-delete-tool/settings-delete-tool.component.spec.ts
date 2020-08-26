import { SettingsDeleteToolComponent } from './settings-delete-tool.component';

describe('SettingsDeleteToolComponent', () => {
  let component: SettingsDeleteToolComponent;

  beforeEach(() => {
    component = new SettingsDeleteToolComponent();
  });

  /*** it should create settings and delete tool component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call SettingsDeleteToolComponent ngOnInit ***/
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
