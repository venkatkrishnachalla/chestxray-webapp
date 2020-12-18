import { PathologyToolComponent } from './pathology-tool.component';

describe('PathologyToolComponent', () => {
  let component: PathologyToolComponent;
  const eventEmitterServiceSpy = jasmine.createSpyObj('EventEmitterService', [
    'onComponentButtonClick',
  ]);

  beforeEach(() => {
    component = new PathologyToolComponent(eventEmitterServiceSpy);
  });

  /*** it should create pathology tool component ***/
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
