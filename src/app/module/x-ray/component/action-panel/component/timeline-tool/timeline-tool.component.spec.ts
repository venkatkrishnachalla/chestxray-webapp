import { TimelineToolComponent } from './timeline-tool.component';

describe('TimelineToolComponent', () => {
  let component: TimelineToolComponent;
  
  beforeEach(() => {
    component = new TimelineToolComponent();
  });

  /*** it should create timeline tool component ***/
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*** it should call TimelineToolComponent ngOnInit ***/
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
