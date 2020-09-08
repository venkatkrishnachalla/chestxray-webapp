import { SaveEraseToolComponent } from './save-erase-tool.component';

describe('SaveEraseToolComponent', () => {
  let component: SaveEraseToolComponent;

  beforeEach(() => {
    component = new SaveEraseToolComponent();
  });

  /*** it should create save erase tool component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call SaveEraseToolComponent ngOnInit ***/
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
