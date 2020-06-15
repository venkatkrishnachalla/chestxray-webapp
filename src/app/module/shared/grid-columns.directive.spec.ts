import { GridColumnsDirective } from './grid-columns.directive';

fdescribe('GridColumnsDirective', () => {
  let directive: GridColumnsDirective;
  const matGridListSpy = jasmine.createSpyObj('MatGridList', ['cols']);
  const breakpointObserverSpy = jasmine.createSpyObj('BreakpointObserver', [
    'observe',
  ]);
  it('should create an instance', () => {
    directive = new GridColumnsDirective(matGridListSpy, breakpointObserverSpy);
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
