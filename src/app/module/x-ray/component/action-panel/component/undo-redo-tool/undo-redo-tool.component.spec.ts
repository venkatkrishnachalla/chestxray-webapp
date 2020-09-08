import { UndoRedoToolComponent } from './undo-redo-tool.component';

describe('UndoRedoToolComponent', () => {
  let component: UndoRedoToolComponent;

  beforeEach(() => {
    component = new UndoRedoToolComponent();
  });

  /*** it should create undo and redo tool component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call UndoRedoToolComponent ngOnInit ***/
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
      expect(component.iconAction).toBeDefined();
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
