import { GridcolsDirective } from './gridcols.directive';

fdescribe('GridcolsDirective', () => {
  let directive: GridcolsDirective;
  const matGridListSpy = jasmine.createSpyObj('MatGridList', ['cols']);
  const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', [
    'observe',
  ]);

  beforeEach(() => {
    directive = new GridcolsDirective(matGridListSpy, breakpointObserverSpy);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      directive.ngOnInit();
    });
    it('should call ngOnIit function', () => {
      const result = directive.ngOnInit();
      expect(result).toBeDefined();
    });
  });
});
